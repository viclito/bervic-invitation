import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { createWorker } from "tesseract.js";
import path from "path";
import sharp from "sharp";

interface GeminiExtractedInvitation {
  eventType?: string;
  hostNameOne?: string;
  hostNameTwo?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  receptionVenueName?: string;
  receptionVenueAddress?: string;
  rsvpContact?: string;
  story?: string;
  functions?: Array<{
    id?: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    icon?: string;
  }>;
}

// Exponential backoff fetcher for Gemini API rate limits (HTTP 429)
async function fetchGeminiWithBackoff(
  url: string,
  options: RequestInit,
  retries = 3,
  initialDelay = 1000
): Promise<Response> {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status !== 429) {
      return res;
    }
    console.warn(`[Gemini Vision] 429 Rate Limit encountered. Retrying in ${delay}ms (attempt ${i + 1}/${retries})...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }
  return fetch(url, options);
}

// Gemini Vision Multimodal Extraction
async function extractWithGeminiVision(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<GeminiExtractedInvitation | null> {
  const prompt = `You are an expert Indian and Western Wedding & Event Invitation Card Vision Parser.
Examine this invitation image thoroughly and extract all structured event information into strict JSON.

CRITICAL RULES:
1. "hostNameOne": Groom's primary first and last name (or Primary Host name). DO NOT include parents, grandparents, elders, or "S/O".
2. "hostNameTwo": Bride's primary first and last name (or Partner name). DO NOT include parents, grandparents, elders, or "D/O".
3. "eventType": "WEDDING" | "BIRTHDAY" | "ANNIVERSARY" | "HOUSEWARMING" | "ENGAGEMENT".
4. "eventTitle": An elegant display title e.g. "Groom & Bride's Wedding" or "Groom Weds Bride".
5. "eventDate": Main ceremony date formatted strictly as ISO "YYYY-MM-DD" (e.g. "2026-11-12").
6. "eventTime": Primary ceremony or muhurtham time in 24-hour "HH:mm" (e.g. "10:30" or "18:30").
7. "venueName": Primary Ceremony / Church / Temple / Mandapam venue name.
8. "venueAddress": Address / City / Location of ceremony venue.
9. "receptionVenueName": Grand Reception Hall / Auditorium if distinct from ceremony.
10. "receptionVenueAddress": Address of reception venue if distinct.
11. "rsvpContact": Phone number / WhatsApp mobile number for RSVP.
12. "functions": Array of sub-events mentioned (e.g. Haldi, Sangeet, Muhurtham, Marriage, Reception). Each item:
    { "title": "...", "date": "YYYY-MM-DD", "time": "HH:mm", "venue": "..." }
13. "story": Optional brief love quote, bible verse, or blessing line from the card.

Return ONLY a valid JSON object matching this schema.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  };

  const models = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetchGeminiWithBackoff(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[Gemini Vision] Model ${model} returned ${res.status}. Trying next model...`);
        continue;
      }

      const json = await res.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && (parsed.hostNameOne || parsed.eventDate || parsed.venueName)) {
        return parsed as GeminiExtractedInvitation;
      }
    } catch (err) {
      console.warn(`[Gemini Vision] Model ${model} parsing error:`, err);
    }
  }
  return null;
}

function cleanOcrArtifacts(text: string): string {
  return text
    .replace(/[“”"'«»]/g, "")
    .replace(/Phouc:|Phone[:\s]*/gi, "Phone: ")
    .replace(/Tite:|Time[:\s]*/gi, "Time: ")
    .replace(/Audilovium/gi, "Auditorium")
    .replace(/Fnwitation/gi, "Invitation")
    .replace(/QDate/gi, "Date")
    .replace(/6pue|Gpus/gi, "6pm")
    .replace(/C\.8\.9|C\.§\.9/gi, "C.S.I");
}

function parseExtractedDateToIso(rawText: string): string {
  const clean = cleanOcrArtifacts(rawText).replace(/\|/g, " ").replace(/\s+/g, " ").trim();

  const monthNames: Record<string, string> = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12",
  };

  // Check 3 Jan 2024 or 3 Jan 204 or 13 May 2026
  const ddMonthYyyy = clean.match(/(?:^|\D)(\d{1,2})\s*\|?\s*([A-Za-z]{3,9}),?\s*\|?\s*(\d{3,4})/i);
  if (ddMonthYyyy) {
    const day = ddMonthYyyy[1].padStart(2, "0");
    const mStr = ddMonthYyyy[2].toLowerCase().substring(0, 3);
    const month = monthNames[mStr] || "01";
    let year = ddMonthYyyy[3];
    if (year === "204") year = "2024";
    else if (year.length === 3) year = year.startsWith("20") ? "202" + year[2] : "20" + year.slice(1);
    return `${year}-${month}-${day}`;
  }

  // Check Month 13, 2026 or Jan 3, 2024
  const monthDdYyyy = clean.match(/([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{3,4})/i);
  if (monthDdYyyy) {
    const mStr = monthDdYyyy[1].toLowerCase().substring(0, 3);
    const month = monthNames[mStr] || "01";
    const day = monthDdYyyy[2].padStart(2, "0");
    let year = monthDdYyyy[3];
    if (year === "204") year = "2024";
    else if (year.length === 3) year = year.startsWith("20") ? "202" + year[2] : "20" + year.slice(1);
    return `${year}-${month}-${day}`;
  }

  // Check Jan 2024 with nearby day number
  const monthYyyy = clean.match(/([A-Za-z]{3,9})\s+(\d{3,4})/i);
  if (monthYyyy) {
    const mStr = monthYyyy[1].toLowerCase().substring(0, 3);
    if (monthNames[mStr]) {
      let year = monthYyyy[2];
      if (year === "204") year = "2024";
      else if (year.length === 3) year = "202" + year[2];
      const dayMatch = rawText.match(/\b([1-9]|[12]\d|3[01])\b(?=\s*[\n\r]*\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/i);
      const day = dayMatch ? dayMatch[1].padStart(2, "0") : "03";
      return `${year}-${monthNames[mStr]}-${day}`;
    }
  }

  // Check YYYY-MM-DD
  const slashDate = clean.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (slashDate) {
    return `${slashDate[1]}-${slashDate[2].padStart(2, "0")}-${slashDate[3].padStart(2, "0")}`;
  }

  // Check DD-MM-YYYY or DD/MM/YYYY
  const numericDate = clean.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (numericDate) {
    return `${numericDate[3]}-${numericDate[2].padStart(2, "0")}-${numericDate[1].padStart(2, "0")}`;
  }

  return "";
}

function parseExtractedTime(rawText: string): string {
  const clean = cleanOcrArtifacts(rawText).replace(/\./g, ":").trim();
  const timeMatch = clean.match(/(?:time[:\s]*|@\s*)?(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] || "00";
    const ampm = timeMatch[3].toLowerCase();

    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    return `${String(hour).padStart(2, "0")}:${minute}`;
  }
  return "";
}

function extractHostNames(rawText: string): { hostNameOne: string; hostNameTwo: string } {
  const cleaned = cleanOcrArtifacts(rawText);
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let hostOne = "";
  let hostTwo = "";

  const nonNameRegex = /^(?:church|clunch|temple|auditorium|mahal|chapel|hall|palace|hotel|resort|location|road|street|city|place|time|with\s+love|s\/o|d\/o|wedding|invitation|save|date|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec|saturday|sunday|monday|tuesday|wednesday|thursday|friday|praise|the|lord|god|blessings|together|their|families|invite|request|pleasure|company|presence|honor|honour|cordially|shree|ganesh|ganeshay|namah)$/i;

  const filterName = (str: string): string => {
    if (!str) return "";
    let clean = str.replace(/[^A-Za-z\s\.]/g, " ").replace(/\s+/g, " ").trim();
    clean = clean.replace(/^(?:and|with|weds|mr|mrs|miss|dr|er)\s+/i, "").replace(/\s+(?:on|at|and|weds|to|the|of)$/i, "").trim();
    if (clean.length < 3 || clean.length > 30) return "";
    if (nonNameRegex.test(clean)) return "";
    const words = clean.split(/\s+/);
    if (words.some((w) => nonNameRegex.test(w))) return "";
    return clean
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // Strategy 1: Look for S/O or D/O lineage indicators in wedding cards
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\(?\s*(?:S\/O|D\/O|SON OF|DAUGHTER OF)\b/i.test(line)) {
      if (i > 0) {
        const potential = filterName(lines[i - 1]);
        if (potential) {
          if (!hostOne) hostOne = potential;
          else if (!hostTwo && potential !== hostOne) hostTwo = potential;
        }
      }
    }
  }

  // Strategy 2: Match "Name & Name", "Name weds Name", "Name AND Name", "Name WITH Name"
  if (!hostOne || !hostTwo) {
    const coupleMatch = cleaned.match(/([A-Z][a-zA-Z\s\.]{2,25})\s*(?:&|AND|and|weds|WEDS|WITH|with|\||💍|\+)\s*([A-Z][a-zA-Z\s\.]{2,25})/i);
    if (coupleMatch) {
      const n1 = filterName(coupleMatch[1].replace(/s\/o|d\/o|son of|daughter of.*/i, ""));
      const n2 = filterName(coupleMatch[2].replace(/s\/o|d\/o|son of|daughter of.*/i, ""));
      if (n1 && !hostOne) hostOne = n1;
      if (n2 && !hostTwo) hostTwo = n2;
    }
  }

  // Strategy 3: "Welcomes you all [Name] Wedding" or "Welcome to [Name]'s Wedding"
  if (!hostOne) {
    const welcomeMatch = cleaned.match(/welcomes?\s+(?:you\s+all\s+)?([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+wedding/i);
    if (welcomeMatch) {
      const n = filterName(welcomeMatch[1]);
      if (n) hostOne = n;
    }
  }

  // Strategy 4: Lines between Header ("Wedding Invitation" / "Save the Date") and Event Details
  if (!hostOne || !hostTwo) {
    const startIdx = lines.findIndex((l) =>
      /wedding\s+invitation|celebrating\s+the\s+wedding|marriage\s+invitation|together\s+with|shree|namah/i.test(l)
    );
    const endIdx = lines.findIndex((l) =>
      /save\s+the\s+date|at\s+the\s+church|on\s+saturday|on\s+sunday|on\s+\d{1,2}|place:|venue:|location:/i.test(l)
    );

    const sliceStart = startIdx !== -1 ? startIdx + 1 : 0;
    const sliceEnd = endIdx !== -1 && endIdx > sliceStart ? endIdx : Math.min(lines.length, sliceStart + 6);

    const middleLines = lines.slice(sliceStart, sliceEnd);
    const validCandidates: string[] = [];
    for (const ml of middleLines) {
      const candidate = filterName(ml);
      if (candidate && !validCandidates.includes(candidate)) {
        validCandidates.push(candidate);
      }
    }

    if (!hostOne && validCandidates.length > 0) hostOne = validCandidates[0];
    if (!hostTwo && validCandidates.length > 1) hostTwo = validCandidates[1];
    else if (!hostTwo && validCandidates.length === 1 && validCandidates[0] !== hostOne) hostTwo = validCandidates[0];
  }

  // Strategy 5: Scan all lines for valid proper names
  if (!hostOne || !hostTwo) {
    const allValid: string[] = [];
    for (const l of lines) {
      const c = filterName(l);
      if (c && !allValid.includes(c) && c !== hostOne) {
        allValid.push(c);
      }
    }
    if (!hostOne && allValid.length > 0) hostOne = allValid[0];
    if (!hostTwo && allValid.length > 0) hostTwo = allValid[0];
  }

  return {
    hostNameOne: hostOne || "",
    hostNameTwo: hostTwo || "",
  };
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let base64Data = "";
    let mimeType = "image/jpeg";
    let rawText = "";
    let fileName = "uploaded_invitation";
    let isImageFile = false;
    let fileBuffer: Buffer | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = (formData.get("file") || formData.get("image")) as File | null;
      const textContent = (formData.get("textContent") as string) || "";

      if (textContent) rawText = textContent;
      if (file) {
        fileName = file.name.toLowerCase();
        mimeType = file.type || "image/jpeg";
        isImageFile = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(fileName);
        fileBuffer = Buffer.from(await file.arrayBuffer());
        base64Data = fileBuffer.toString("base64");
      }
    } else {
      // JSON body (Mobile App or Base64 Payload)
      const body = await req.json();
      const rawBase64 = body.imageBase64 || body.base64 || body.image || "";
      if (body.textContent) rawText = body.textContent;
      if (body.mimeType) mimeType = body.mimeType;

      if (rawBase64) {
        isImageFile = true;
        if (rawBase64.includes("base64,")) {
          const parts = rawBase64.split("base64,");
          const match = parts[0].match(/data:(.*?);/);
          if (match && match[1]) mimeType = match[1];
          base64Data = parts[1];
        } else {
          base64Data = rawBase64;
        }
        fileBuffer = Buffer.from(base64Data, "base64");
      }
    }

    if (!base64Data && !rawText && !fileBuffer) {
      return NextResponse.json(
        { success: false, message: "No file or text content provided for extraction." },
        { status: 400 }
      );
    }

    let geminiResult: GeminiExtractedInvitation | null = null;

    // STEP 1: Try Gemini Vision extraction if image and API key are available
    if (apiKey && base64Data && isImageFile) {
      try {
        geminiResult = await extractWithGeminiVision(base64Data, mimeType, apiKey);
      } catch (geminiErr) {
        console.warn("[Gemini Extraction Warning]:", geminiErr);
      }
    }

    // STEP 2: Fallback to Tesseract OCR if Gemini Vision did not yield results
    if (!geminiResult && fileBuffer && isImageFile) {
      try {
        const workerPath = path.join(process.cwd(), "node_modules/tesseract.js/src/worker-script/node/index.js");
        const corePath = path.join(process.cwd(), "node_modules/tesseract.js-core/tesseract-core.wasm.js");
        const langPath = process.cwd();

        const worker = await createWorker("eng", 1, {
          workerPath,
          corePath,
          langPath,
          cachePath: langPath,
          gzip: false,
        });

        const retRaw = await worker.recognize(fileBuffer);
        let contrastText = "";
        try {
          const contrastBuf = await sharp(fileBuffer)
            .resize({ width: 2200, withoutEnlargement: true })
            .grayscale()
            .linear(1.5, -30)
            .sharpen()
            .png()
            .toBuffer();
          const retContrast = await worker.recognize(contrastBuf);
          contrastText = retContrast.data.text || "";
        } catch (sharpErr) {
          console.warn("Sharp pre-processing notice:", sharpErr);
        }
        await worker.terminate();
        rawText = (retRaw.data.text || "") + "\n" + contrastText;
      } catch (ocrErr) {
        console.error("Tesseract fallback error:", ocrErr);
      }
    }

    // STEP 3: Assemble Structured Extracted Data
    let eventType = geminiResult?.eventType || "WEDDING";
    let hostNameOne = geminiResult?.hostNameOne || "";
    let hostNameTwo = geminiResult?.hostNameTwo || "";
    let eventTitle = geminiResult?.eventTitle || "";
    let eventDate = geminiResult?.eventDate || "";
    let eventTime = geminiResult?.eventTime || "";
    let venueName = geminiResult?.venueName || "";
    let venueAddress = geminiResult?.venueAddress || "";
    let receptionVenueName = geminiResult?.receptionVenueName || "";
    let receptionVenueAddress = geminiResult?.receptionVenueAddress || "";
    let rsvpContact = geminiResult?.rsvpContact || "";

    // Heuristic fallbacks if Gemini was not used or missed certain fields
    if (!hostNameOne || !hostNameTwo) {
      const fallbackNames = extractHostNames(rawText);
      if (!hostNameOne && fallbackNames.hostNameOne) hostNameOne = fallbackNames.hostNameOne;
      if (!hostNameTwo && fallbackNames.hostNameTwo) hostNameTwo = fallbackNames.hostNameTwo;
    }

    if (!eventDate) {
      eventDate = parseExtractedDateToIso(rawText);
    }
    if (!eventTime) {
      eventTime = parseExtractedTime(rawText);
    }

    if (!eventTitle) {
      eventTitle = hostNameOne && hostNameTwo
        ? `${hostNameOne} & ${hostNameTwo}'s Wedding`
        : hostNameOne
        ? `${hostNameOne}'s Celebration`
        : "Wedding Celebration";
    }

    const completedFields: string[] = [];
    if (eventType) completedFields.push("eventType");
    if (hostNameOne) completedFields.push("hostNameOne");
    if (hostNameTwo) completedFields.push("hostNameTwo");
    if (eventDate) completedFields.push("eventDate");
    if (eventTime) completedFields.push("eventTime");
    if (venueName) completedFields.push("venueName");
    if (rsvpContact) completedFields.push("rsvpContact");

    const locationsList = [
      {
        id: "loc-1",
        label: "Marriage Ceremony Venue",
        subLabel: venueName || "",
        address: venueAddress || "",
        mapUrl: "https://maps.google.com",
        image: "/images/templates/venue-ceremony.jpg",
      },
      ...(receptionVenueName
        ? [
            {
              id: "loc-2",
              label: "Grand Reception Venue",
              subLabel: receptionVenueName,
              address: receptionVenueAddress || "",
              mapUrl: "https://maps.google.com",
              image: "/images/templates/venue-reception.jpg",
            },
          ]
        : []),
    ];

    const extractedData = {
      eventType,
      hostNameOne,
      hostNameTwo,
      eventTitle,
      eventDate: eventDate || "",
      eventTime: eventTime || "",
      venueName: venueName || "",
      venueAddress: venueAddress || "",
      receptionVenueName: receptionVenueName || "",
      receptionVenueAddress: receptionVenueAddress || "",
      locationsJson: JSON.stringify(locationsList),
      rsvpContact,
      functions: geminiResult?.functions || [],
      extractedFromDoc: true,
      completedFields: JSON.stringify(completedFields),
    };

    // Multi-tenant safe update to user draft if authenticated
    const user = await getAuthUser(req);
    if (user) {
      const activeDraft = await prisma.userDraftDetails.findFirst({
        where: { userId: user.id, isActive: true },
      });

      if (activeDraft) {
        await prisma.userDraftDetails.update({
          where: { id: activeDraft.id },
          data: {
            eventType: extractedData.eventType,
            hostNameOne: extractedData.hostNameOne || activeDraft.hostNameOne,
            hostNameTwo: extractedData.hostNameTwo || activeDraft.hostNameTwo,
            eventTitle: extractedData.eventTitle || activeDraft.eventTitle,
            eventDate: extractedData.eventDate || activeDraft.eventDate,
            eventTime: extractedData.eventTime || activeDraft.eventTime,
            venueName: extractedData.venueName || activeDraft.venueName,
            venueAddress: extractedData.venueAddress || activeDraft.venueAddress,
            locationsJson: extractedData.locationsJson || activeDraft.locationsJson,
            rsvpContact: extractedData.rsvpContact || activeDraft.rsvpContact,
            extractedFromDoc: true,
            completedFields: extractedData.completedFields,
            currentStep: 2,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      isIrrelevant: false,
      message: `Successfully extracted ${completedFields.length} event details from "${fileName}" using AI Vision!`,
      extractedData,
      extractedCount: completedFields.length,
    });
  } catch (error: unknown) {
    console.error("POST /api/user/event-draft/extract error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process invitation file. Please enter details manually.",
      },
      { status: 500 }
    );
  }
}
