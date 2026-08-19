const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Read and parse templatesRegistry.ts
const registryFilePath = path.join(__dirname, "..", "data", "templatesRegistry.ts");
const registryFileContent = fs.readFileSync(registryFilePath, "utf-8");

// Extract templates using regex or dynamic evaluation
const slugMatches = [];
const regex = /slug:\s*["']([^"']+)["'],[\s\S]*?isPremium:\s*(true|false)/g;
let match;
while ((match = regex.exec(registryFileContent)) !== null) {
  const slug = match[1];
  const isPremium = match[2] === "true";
  if (!isPremium && slug !== "scroll-scrubber" && slug !== "premium-scroll") {
    if (!slugMatches.includes(slug)) {
      slugMatches.push(slug);
    }
  }
}

console.log(`Found ${slugMatches.length} non-premium templates to capture:`, slugMatches);

async function captureAll() {
  const outputDir = path.join(__dirname, "..", "public", "templates", "thumbnails");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 1500,
    deviceScaleFactor: 1.5,
  });

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i];
    const outputPath = path.join(outputDir, `${slug}.jpg`);
    console.log(`[${i + 1}/${slugMatches.length}] Capturing ${slug}...`);

    try {
      const url = `http://localhost:3000/templates/${slug}?thumbnail=true`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait for fonts, images & layout to settle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Remove any preview overlays, envelope wrappers, or floating editor buttons
      await page.evaluate(() => {
        const envelope = document.querySelector("[class*='PersonalizedEnvelopeCover'], [class*='z-[100]']");
        if (envelope) envelope.style.display = "none";
        
        // Hide floating buttons like "All Templates" or "Edit Event Details" or bottom bars
        document.querySelectorAll("header a[href*='/templates'], a[href*='/dashboard'], button[class*='fixed'], div[class*='TemplatePreviewBottomBar']").forEach(el => {
          el.style.display = "none";
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Take screenshot capturing Hero, Countdown, and top portion of Portrait/Story
      await page.screenshot({
        path: outputPath,
        type: "jpeg",
        quality: 88,
        clip: {
          x: 0,
          y: 0,
          width: 1200,
          height: 1350,
        },
      });

      console.log(`✅ Saved ${outputPath}`);
    } catch (err) {
      console.error(`❌ Failed capturing ${slug}:`, err.message);
    }
  }

  await browser.close();
  console.log("🎉 All captures completed!");

  // Now update templatesRegistry.ts previewImage paths
  let updatedContent = registryFileContent;
  for (const slug of slugMatches) {
    const thumbnailPath = `/templates/thumbnails/${slug}.jpg`;
    // Replace previewImage for this slug's block
    const blockRegex = new RegExp(`(slug:\\s*["']${slug}["'][\\s\\S]*?previewImage:\\s*["'])([^"']+)(["'])`, "g");
    updatedContent = updatedContent.replace(blockRegex, `$1${thumbnailPath}$3`);
  }

  fs.writeFileSync(registryFilePath, updatedContent, "utf-8");
  console.log("✅ Updated templatesRegistry.ts with thumbnail paths!");
}

captureAll();
