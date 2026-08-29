import { NextResponse } from 'next/server';

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
    console.warn(`[Gemini OCR] 429 Rate Limit encountered. Retrying in ${delay}ms (attempt ${i + 1}/${retries})...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2; // Exponential: 1s -> 2s -> 4s
  }
  return fetch(url, options);
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is not configured in server environment.' },
        { status: 500 }
      );
    }

    let base64Data = '';
    let mimeType = 'image/jpeg';
    let userPrompt =
      'Extract all visible text and structured fields from this invitation or document image. Return only valid JSON.';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('image')) as File | null;
      const promptParam = formData.get('prompt') as string | null;
      if (promptParam) userPrompt = promptParam;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided in FormData (use file or image).' },
          { status: 400 }
        );
      }

      mimeType = file.type || 'image/jpeg';
      const buffer = Buffer.from(await file.arrayBuffer());
      base64Data = buffer.toString('base64');
    } else {
      // JSON Payload
      const body = await req.json();
      const rawBase64 = body.imageBase64 || body.base64 || body.image || '';
      if (body.prompt) userPrompt = body.prompt;
      if (body.mimeType) mimeType = body.mimeType;

      if (!rawBase64) {
        return NextResponse.json(
          { success: false, error: 'No imageBase64 data provided in request body.' },
          { status: 400 }
        );
      }

      // Strip data URL prefix if present (e.g. data:image/png;base64,...)
      if (rawBase64.includes('base64,')) {
        const parts = rawBase64.split('base64,');
        const match = parts[0].match(/data:(.*?);/);
        if (match && match[1]) mimeType = match[1];
        base64Data = parts[1];
      } else {
        base64Data = rawBase64;
      }
    }

    const systemPrompt = `You are a high-accuracy multimodal OCR and document parser.
${userPrompt}

Analyze the uploaded image thoroughly. Extract all visible text, host/couple names, event types, dates, times, venues, addresses, contact details, and sub-events.
Return only a strict, valid JSON object with clean key-value pairs.`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
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
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    };

    // Try models: gemini-3.6-flash -> gemini-3.5-flash -> gemini-2.5-flash-lite -> gemini-flash-latest
    const models = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
    let geminiRes: Response | null = null;
    let selectedModel = models[0];

    for (const model of models) {
      selectedModel = model;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      geminiRes = await fetchGeminiWithBackoff(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (geminiRes.ok) break;
      console.warn(`[Gemini OCR] Model ${model} returned status ${geminiRes.status}. Trying fallback...`);
    }

    if (!geminiRes || !geminiRes.ok) {
      const errorText = geminiRes ? await geminiRes.text() : 'No response';
      console.error('[Gemini OCR] All Gemini endpoints failed:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to process image with Gemini AI Vision.', details: errorText },
        { status: geminiRes?.status || 502 }
      );
    }

    const resultData = await geminiRes.json();
    const rawContent = resultData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Clean JSON response (defensive stripping of markdown fences if any)
    const cleanedJsonStr = rawContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    let structuredOutput = {};
    try {
      structuredOutput = JSON.parse(cleanedJsonStr);
    } catch (parseErr) {
      console.error('[Gemini OCR] Failed to parse JSON output:', parseErr, rawContent);
      structuredOutput = { rawText: rawContent };
    }

    return NextResponse.json({
      success: true,
      model: selectedModel,
      data: structuredOutput,
    });
  } catch (error: unknown) {
    console.error('[Gemini OCR Route Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error)?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
