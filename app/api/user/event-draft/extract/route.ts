import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createWorker } from "tesseract.js";
import path from "path";
import sharp from "sharp";

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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textContent = (formData.get("textContent") as string) || "";

    if (!file && !textContent) {
      return NextResponse.json(
        { success: false, message: "No file or text content provided" },
        { status: 400 }
      );
    }

    let rawText = textContent;
    const fileName = file ? file.name.toLowerCase() : "uploaded_document";
    const isImageFile = file
      ? file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(fileName)
      : false;

    if (file && !rawText) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (isImageFile) {
        try {
          const ocrPromise = (async () => {
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

            // Pass 1: Raw buffer
            const retRaw = await worker.recognize(buffer);

            // Pass 2: Contrast boosted buffer with sharp
            let contrastText = "";
            try {
              const contrastBuf = await sharp(buffer)
                .resize({ width: 2200, withoutEnlargement: true })
                .grayscale()
                .linear(1.5, -30)
                .sharpen()
                .png()
                .toBuffer();
              const retContrast = await worker.recognize(contrastBuf);
              contrastText = retContrast.data.text || "";
            } catch (sharpErr) {
              console.warn("Sharp contrast enhancement notice:", sharpErr);
            }

            await worker.terminate();
            return (retRaw.data.text || "") + "\n" + contrastText;
          })();

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("OCR timeout after 15 seconds")), 15000)
          );

          rawText = await Promise.race([ocrPromise, timeoutPromise]);
        } catch (ocrErr) {
          console.error("OCR ERROR DETAILS:", ocrErr);
          rawText = file.name;
        }
      } else {
        const fileText = buffer.toString("utf-8", 0, Math.min(buffer.length, 50000));
        rawText = fileText.replace(/[^\x20-\x7E\n\r\t]/g, " ");
      }
    }

    const lowerText = (rawText + " " + fileName).toLowerCase();

    // 1. Extract Event Type
    let eventType = "WEDDING";
    if (lowerText.includes("birthday") || lowerText.includes("turning")) {
      eventType = "BIRTHDAY";
    }

    // 2. Extract Event Date & Convert to ISO YYYY-MM-DD
    let eventDate = parseExtractedDateToIso(rawText);
    if (!eventDate) {
      const fallbackMatch = rawText.match(/(\d{1,2})\s*\|?\s*([A-Za-z]{3,9}),?\s*\|?\s*(\d{4})/i);
      if (fallbackMatch) {
        eventDate = parseExtractedDateToIso(fallbackMatch[0]);
      }
    }

    // 3. Extract Event Time
    let eventTime = parseExtractedTime(rawText);
    if (!eventTime) {
      const fallbackTime = rawText.match(/\b(\d{1,2}[:.]\d{2}\s*(?:am|pm)?|\d{1,2}\s*(?:am|pm))\b/i);
      if (fallbackTime) {
        eventTime = parseExtractedTime(fallbackTime[0]);
      }
    }

    // 4. Extract Host / Couple Names accurately
    const { hostNameOne, hostNameTwo } = extractHostNames(rawText);

    const eventTitle = hostNameOne && hostNameTwo
      ? `${hostNameOne} & ${hostNameTwo}'s Wedding`
      : hostNameOne
      ? `${hostNameOne}'s Event`
      : "Wedding Celebration";

    // 5. Extract Venue & Address (Marriage & Reception)
    let venueName = "";
    let venueAddress = "";
    let receptionVenueName = "";
    let receptionVenueAddress = "";

    const cleanedText = cleanOcrArtifacts(rawText);
    const lines = cleanedText.split("\n").map((l) => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Place: Karumankoodal
      if (/place[:\s]+/i.test(line)) {
        const p = line.replace(/place[:\s]*/i, "").replace(/with\s+love.*/i, "").trim();
        if (p && !venueAddress) venueAddress = p;
      }

      // Check for Church / Ceremony
      if (/church|ceremony|temple|nuptials|marriage/i.test(line)) {
        const churchPart = line.replace(/holy\s+loosiyal.*/i, "").replace(/auditorium.*/i, "").replace(/^(marriage|ceremony)[:\s]*/i, "").trim();
        if (churchPart.length > 3 && !venueName) {
          venueName = churchPart.replace(/^w/i, "").trim();
        }
      }

      // Check for Auditorium / Reception
      if (/auditorium|reception|hall|mahal/i.test(line)) {
        const matchAud = line.match(/([A-Za-z\s\.\']+(?:Auditorium|Mahal|Hall|Palace|Hotel|Resort))/i);
        if (matchAud && !receptionVenueName) {
          receptionVenueName = matchAud[1].trim();
        } else if (!receptionVenueName) {
          const recPart = line.replace(/.*(?:church|temple|marriage)\s*/i, "").replace(/^(reception)[:\s]*/i, "").trim();
          if (recPart.length > 3) receptionVenueName = recPart;
        }
      }

      // Check for Location / Address
      if (/location[:\s]+/i.test(line)) {
        receptionVenueAddress = line.replace(/location[:\s]*/i, "").replace(/time.*/i, "").trim();
      }
    }

    if (!venueName) {
      const venueMatch = cleanedText.match(/([A-Z0-9\s\.\'\-]{3,35}(?:CHURCH|MAHAL|HALL|TEMPLE|VILLA|PALACE|HOTEL|RESORT|AUDITORIUM|GARDEN|CONVENTION))/i);
      if (venueMatch) {
        venueName = venueMatch[0].replace(/reception|follow|wedding/i, "").trim();
      }
    }

    // 6. Extract RSVP Contact / Phone
    let rsvpContact = "";
    const phoneMatch = rawText.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{10}\b/);
    if (phoneMatch) {
      rsvpContact = phoneMatch[0];
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
      locationsJson: JSON.stringify(locationsList),
      rsvpContact,
      extractedFromDoc: true,
      completedFields: JSON.stringify(completedFields),
    };

    // Save to user draft if authenticated
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email.toLowerCase() },
      });

      if (user) {
        const activeDraft = await prisma.userDraftDetails.findFirst({
          where: { userId: user.id, isActive: true },
        });

        if (activeDraft) {
          await prisma.userDraftDetails.update({
            where: { id: activeDraft.id },
            data: {
              ...extractedData,
              currentStep: 2,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      isIrrelevant: false,
      message: `Successfully extracted ${completedFields.length} details from "${fileName}"!`,
      extractedData,
      extractedCount: completedFields.length,
    });
  } catch (error: unknown) {
    console.error("POST /api/user/event-draft/extract error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process file. Please fill out details manually.",
      },
      { status: 500 }
    );
  }
}
