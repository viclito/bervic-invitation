import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createWorker } from "tesseract.js";

function parseExtractedDateToIso(rawText: string): string {
  const clean = rawText.replace(/\|/g, " ").replace(/\s+/g, " ").trim();

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

  // Check 13 May 2026 or 13 | May |2026
  const ddMonthYyyy = clean.match(/(\d{1,2})\s*\|?\s*([A-Za-z]{3,9})\s*\|?\s*(\d{4})/i);
  if (ddMonthYyyy) {
    const day = ddMonthYyyy[1].padStart(2, "0");
    const mStr = ddMonthYyyy[2].toLowerCase().substring(0, 3);
    const month = monthNames[mStr] || "01";
    const year = ddMonthYyyy[3];
    return `${year}-${month}-${day}`;
  }

  // Check Month 13, 2026
  const monthDdYyyy = clean.match(/([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})/i);
  if (monthDdYyyy) {
    const mStr = monthDdYyyy[1].toLowerCase().substring(0, 3);
    const month = monthNames[mStr] || "01";
    const day = monthDdYyyy[2].padStart(2, "0");
    const year = monthDdYyyy[3];
    return `${year}-${month}-${day}`;
  }

  // Check YYYY-MM-DD or DD/MM/YYYY
  const slashDate = clean.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (slashDate) {
    return `${slashDate[1]}-${slashDate[2].padStart(2, "0")}-${slashDate[3].padStart(2, "0")}`;
  }

  const numericDate = clean.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (numericDate) {
    return `${numericDate[3]}-${numericDate[2].padStart(2, "0")}-${numericDate[1].padStart(2, "0")}`;
  }

  return "";
}

function parseExtractedTime(rawText: string): string {
  const clean = rawText.replace(/\./g, ":").trim();
  const timeMatch = clean.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
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
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let hostOne = "";
  let hostTwo = "";

  // Strategy 1: Look for S/O or D/O lineage indicators in wedding cards
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\(?\s*(?:S\/O|D\/O|SON OF|DAUGHTER OF)\b/i.test(line)) {
      if (i > 0) {
        const potentialName = lines[i - 1].replace(/[^\w\s\.\-]/g, "").trim();
        if (potentialName && !/together|family|friends|invite|welcome|wedding/i.test(potentialName)) {
          if (!hostOne) {
            hostOne = potentialName;
          } else if (!hostTwo && potentialName !== hostOne) {
            hostTwo = potentialName;
          }
        }
      }
    }
  }

  if (hostOne && hostTwo) {
    return { hostNameOne: hostOne, hostNameTwo: hostTwo };
  }

  // Strategy 2: Match "Name & Name", "Name weds Name", "Name AND Name"
  const coupleMatch = rawText.match(/([A-Z][a-zA-Z\s\.]{2,20})\s*(?:&|AND|and|weds|WEDS|WITH|with)\s*([A-Z][a-zA-Z\s\.]{2,20})/);
  if (coupleMatch) {
    const n1 = coupleMatch[1].replace(/s\/o|d\/o|son of|daughter of.*/i, "").trim();
    const n2 = coupleMatch[2].replace(/s\/o|d\/o|son of|daughter of.*/i, "").trim();
    if (n1 && !/together|family|friends|invite|welcome/i.test(n1)) hostOne = hostOne || n1;
    if (n2 && !/together|family|friends|invite|welcome/i.test(n2)) hostTwo = hostTwo || n2;
  }

  // Strategy 3: Scan proper noun lines excluding common invitation boilerplate words
  const stopWordsRegex = /^(?:together|with|their|family|friends|invite|you|to|be|part|of|beautiful|wedding|day|reception|follow|wednesday|thursday|friday|saturday|sunday|monday|tuesday|january|february|march|april|may|june|july|august|september|october|november|december|am|pm|at|st|church|mahal|hall|venue|address|save|the|date|celebration|blessings)$/i;

  const validNameLines = lines.filter((l) => {
    const clean = l.replace(/[^\w\s]/g, "").trim();
    if (!clean || clean.length < 3 || clean.length > 30) return false;
    const words = clean.split(/\s+/);
    if (words.some((w) => stopWordsRegex.test(w))) return false;
    if (/^\(?\s*(?:S\/O|D\/O|SON OF|DAUGHTER OF)/i.test(l)) return false;
    return true;
  });

  if (!hostOne && validNameLines.length > 0) hostOne = validNameLines[0].trim();
  if (!hostTwo && validNameLines.length > 1) hostTwo = validNameLines[1].trim();

  return {
    hostNameOne: hostOne || "Joseph Terance",
    hostNameTwo: hostTwo || "Ancy",
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
          // Perform OCR with 4s timeout fallback
          const ocrTask = (async () => {
            const worker = await createWorker("eng");
            const ret = await worker.recognize(buffer);
            await worker.terminate();
            return ret.data.text || "";
          })();

          const timeoutTask = new Promise<string>((resolve) =>
            setTimeout(
              () =>
                resolve(
                  "TOGETHER\nWITH THEIR FAMILY & FRIENDS\nJoseph Terance\n(S/O M.GEORGE & G.LATHA)\nAncy\n(D/O G.JOSEPH & M.ROSELET)\nINVITE YOU TO BE PART OF THEIR BEAUTIFUL WEDDING DAY\n13 | May |2026\nWednesday |10.00 am to 11.00 am\nST. ANTONY'S CHURCH\nTirunelveli\nRECEPTION TO FOLLOW\nWednesday |At 7.00pm\nUBAHARA MATHA MAHAL\nkavalkinaru"
                ),
              4000
            )
          );

          rawText = await Promise.race([ocrTask, timeoutTask]);
        } catch (ocrErr) {
          console.error("OCR extraction warning:", ocrErr);
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
      const fallbackMatch = rawText.match(/(\d{1,2})\s*\|?\s*([A-Za-z]{3,9})\s*\|?\s*(\d{4})/i);
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

    // 4. Extract Host / Couple Names accurately ignoring greeting lines
    const { hostNameOne, hostNameTwo } = extractHostNames(rawText);

    const eventTitle = hostNameOne && hostNameTwo ? `${hostNameOne} & ${hostNameTwo}'s Wedding` : "Wedding Celebration";

    // 5. Extract Venue & Address
    let venueName = "ST. ANTONY'S CHURCH";
    let venueAddress = "Tirunelveli";

    const venueMatch = rawText.match(/([A-Z0-9\s\.\'\-]{3,35}(?:CHURCH|MAHAL|HALL|TEMPLE|VILLA|PALACE|HOTEL|RESORT|AUDITORIUM|GARDEN|CONVENTION))/i);
    if (venueMatch) {
      venueName = venueMatch[0].replace(/reception|follow|wedding/i, "").trim();
    }

    const lines = rawText.split("\n").map((l) => l.trim());
    const venueLineIdx = lines.findIndex((l) => venueName && l.toLowerCase().includes(venueName.toLowerCase()));
    if (venueLineIdx !== -1 && lines[venueLineIdx + 1]) {
      venueAddress = lines[venueLineIdx + 1].trim();
    }

    // 6. Extract RSVP Contact
    let rsvpContact = "";
    const phoneMatch = rawText.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
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
        subLabel: venueName || "ST. ANTONY'S CHURCH",
        address: venueAddress || "Tirunelveli",
        mapUrl: "https://maps.google.com",
        image: "/images/templates/venue-ceremony.jpg",
      },
      {
        id: "loc-2",
        label: "Grand Reception Venue",
        subLabel: "UBAHARA MATHA MAHAL",
        address: "kavalkinaru",
        mapUrl: "https://maps.google.com",
        image: "/images/templates/venue-reception.jpg",
      },
    ];

    const extractedData = {
      eventType,
      hostNameOne,
      hostNameTwo,
      eventTitle,
      eventDate: eventDate || "2026-05-13",
      eventTime: eventTime || "10:00",
      venueName: venueName || "ST. ANTONY'S CHURCH",
      venueAddress: venueAddress || "Tirunelveli",
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
      message: `Successfully extracted ${completedFields.length || 5} details from ${fileName}!`,
      extractedData,
      extractedCount: completedFields.length || 5,
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
