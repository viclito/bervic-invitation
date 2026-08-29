import { NextResponse } from "next/server";

// Standard high-accuracy dictionary for recurring Indian wedding card phrases
const WEDDING_DICTIONARY: Record<string, Record<string, string>> = {
  ta: {
    "wedding invitation": "திருமண அழைப்பிதழ்",
    "marriage invitation": "திருமண அழைப்பிதழ்",
    "save the date": "முக்கிய நாள் நினைவூட்டல்",
    "wedding & reception": "திருமணம் மற்றும் வரவேற்பு",
    "wedding": "திருமணம்",
    "reception": "வரவேற்பு",
    "engagement": "நிச்சயதார்த்தம்",
    "with love": "அன்புடன்",
    "welcomes you all": "அனைவரையும் அன்புடன் அழைக்கிறது",
    "venue": "இடம்",
    "date": "தேதி",
    "time": "நேரம்",
    "bride": "மணமகள்",
    "groom": "மணமகன்",
    "parents": "பெற்றோர்கள்",
    "address": "முகவரி",
  },
  te: {
    "wedding invitation": "వివాహ ఆహ్వాన పత్రిక",
    "marriage invitation": "వివాహ ఆహ్వాన పత్రిక",
    "save the date": "శుభ ముహూర్తం",
    "wedding & reception": "వివాహం మరియు రిసెప్షన్",
    "wedding": "వివాహం",
    "reception": "రిసెప్షన్",
    "engagement": "నిశ్చితార్థం",
    "with love": "ప్రేమతో",
    "welcomes you all": "మీ అందరికీ సాదర ఆహ్వానం",
    "venue": "వేదిక",
    "date": "తేదీ",
    "time": "సమయం",
    "bride": "వధువు",
    "groom": "వరుడు",
    "parents": "తల్లిదండ్రులు",
    "address": "చిరునామా",
  },
  ml: {
    "wedding invitation": "വിവാഹ ക്ഷണക്കത്ത്",
    "marriage invitation": "വിവാഹ ക്ഷണക്കത്ത്",
    "save the date": "വിവാഹ തിയ്യതി",
    "wedding & reception": "വിവാഹവും സൽക്കാരവും",
    "wedding": "വിവാഹം",
    "reception": "സൽക്കാരം",
    "engagement": "വിവാഹനിശ്ചയം",
    "with love": "സ്നേഹത്തോടെ",
    "welcomes you all": "ഏവരെയും ഹൃദ്യമായി സ്വാഗതം ചെയ്യുന്നു",
    "venue": "സ്ഥലം",
    "date": "തീയതി",
    "time": "സമയം",
    "bride": "വധു",
    "groom": "വരൻ",
    "parents": "മാതാപിതാക്കൾ",
    "address": "മേൽവിലാസം",
  },
  hi: {
    "wedding invitation": "शुभ विवाह निमंत्रण पत्र",
    "marriage invitation": "शुभ विवाह निमंत्रण",
    "save the date": "शुभ तिथि",
    "wedding & reception": "विवाह एवं प्रीतिभोज",
    "wedding": "शुभ विवाह",
    "reception": "प्रीतिभोज",
    "engagement": "सगाई / रोका",
    "with love": "सस्नेह",
    "welcomes you all": "आप सभी का हार्दिक अभिनंदन",
    "venue": "स्थान",
    "date": "दिनांक",
    "time": "समय",
    "bride": "वधू",
    "groom": "वर",
    "parents": "अभिभावक",
    "address": "पता",
  },
  kn: {
    "wedding invitation": "ವಿವಾಹ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ",
    "marriage invitation": "ವಿವಾಹ ಆಮಂತ್ರಣ",
    "save the date": "ಶುಭ ದಿನ",
    "wedding & reception": "ವಿವಾಹ ಮತ್ತು ಆರತಕ್ಷತೆ",
    "wedding": "ವಿವಾಹ",
    "reception": "ಆರತಕ್ಷತೆ",
    "engagement": "ನಿಶ್ಚಿತಾರ್ಥ",
    "with love": "ಪ್ರೀತಿಯಿಂದ",
    "welcomes you all": "ಸರ್ವರಿಗೂ ಆತ್ಮೀಯ ಸುಸ್ವಾಗತ",
    "venue": "ಸ್ಥಳ",
    "date": "ದಿನಾಂಕ",
    "time": "ಸಮಯ",
    "bride": "ವಧು",
    "groom": "ವರ",
    "parents": "ಪೋಷಕರು",
    "address": "ವಿಳಾಸ",
  },
  mr: {
    "wedding invitation": "शुभ विवाह निमंत्रण पत्रिका",
    "marriage invitation": "शुभ विवाह निमंत्रण",
    "save the date": "शुभ मुहूर्त",
    "wedding & reception": "शुभ विवाह आणि स्वागत समारंभ",
    "wedding": "शुभ विवाह",
    "reception": "स्वागत समारंभ",
    "engagement": "साखरपुडा",
    "with love": "सस्नेह निमंत्रण",
    "welcomes you all": "आपले सहर्ष स्वागत आहे",
    "venue": "स्थळ",
    "date": "दिनांक",
    "time": "वेळ",
    "bride": "वधू",
    "groom": "वर",
    "parents": "पालक",
    "address": "पत्ता",
  },
};

const ITC_CODES: Record<string, string> = {
  ta: "ta-t-i0-und",
  te: "te-t-i0-und",
  ml: "ml-t-i0-und",
  hi: "hi-t-i0-und",
  kn: "kn-t-i0-und",
  mr: "mr-t-i0-und",
  gu: "gu-t-i0-und",
  bn: "bn-t-i0-und",
};

export async function POST(req: Request) {
  try {
    const { text, targetLanguage = "ta", mode = "auto" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ success: true, translated: "", suggestions: [] });
    }

    const cleanText = text.trim();
    const lang = (targetLanguage || "ta").toLowerCase();

    if (lang === "en") {
      return NextResponse.json({ success: true, translated: cleanText, suggestions: [cleanText] });
    }

    // 1. Direct match from curated wedding phrases dictionary
    const lower = cleanText.toLowerCase();
    if (WEDDING_DICTIONARY[lang] && WEDDING_DICTIONARY[lang][lower]) {
      const match = WEDDING_DICTIONARY[lang][lower];
      return NextResponse.json({
        success: true,
        original: cleanText,
        translated: match,
        suggestions: [match],
      });
    }

    // 2. Transliteration using Google Input Tools API (Best for proper names and places)
    const itc = ITC_CODES[lang];
    if (itc && (mode === "transliterate" || mode === "auto")) {
      try {
        const inputUrl = `https://inputtools.google.com/request?text=${encodeURIComponent(
          cleanText
        )}&itc=${itc}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;

        const res = await fetch(inputUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] === "SUCCESS" && Array.isArray(data[1])) {
            const words = data[1].map((item: any) => {
              if (Array.isArray(item) && Array.isArray(item[1]) && item[1].length > 0) {
                return item[1][0];
              }
              return item[0] || "";
            });
            const suggestions = (data[1][0] && Array.isArray(data[1][0][1])) ? data[1][0][1] : [];
            const result = words.join(" ").trim();
            if (result) {
              return NextResponse.json({
                success: true,
                original: cleanText,
                translated: result,
                suggestions: suggestions.length > 0 ? suggestions : [result],
              });
            }
          }
        }
      } catch {}
    }

    // 3. Google Translate public engine fallback (for longer sentences / addresses)
    try {
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
        lang
      )}&dt=t&q=${encodeURIComponent(cleanText)}`;

      const gRes = await fetch(translateUrl, { signal: AbortSignal.timeout(4000) });
      if (gRes.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData) && Array.isArray(gData[0])) {
          const fullTranslation = gData[0]
            .map((chunk: any) => (Array.isArray(chunk) ? chunk[0] : ""))
            .join("");
          if (fullTranslation && fullTranslation.trim()) {
            return NextResponse.json({
              success: true,
              original: cleanText,
              translated: fullTranslation.trim(),
              suggestions: [fullTranslation.trim()],
            });
          }
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      original: cleanText,
      translated: cleanText,
      suggestions: [cleanText],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Translation failed" },
      { status: 500 }
    );
  }
}
