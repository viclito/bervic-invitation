const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function captureThumbnail(slug) {
  const outputDir = path.join(__dirname, "..", "public", "templates", "thumbnails");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${slug}.jpg`);
  console.log(`Launching browser to capture ${slug}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1500,
      deviceScaleFactor: 1.5,
    });

    const url = `http://localhost:3000/templates/${slug}?thumbnail=true`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait 2.5 seconds for fonts, animations and hero images to fully load
    await new Promise((resolve) => setTimeout(resolve, 2500));

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
      quality: 90,
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 1350,
      },
    });

    console.log(`✅ Thumbnail saved to ${outputPath}`);
  } catch (err) {
    console.error(`❌ Error capturing ${slug}:`, err);
  } finally {
    await browser.close();
  }
}

// Run for 1 template first
const targetSlug = process.argv[2] || "vintage-newspaper";
captureThumbnail(targetSlug);
