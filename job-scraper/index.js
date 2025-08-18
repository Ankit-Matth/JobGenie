const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://the-job-genie.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-side)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST"]
}));

app.use(express.json());

const scrapeShine = async (browser, query) => {
  const page = await browser.newPage();
  await page.goto(`https://www.shine.com/job-search/${query}-jobs`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".jobCardNova_bigCard__W2xn3.jdbigCard"))
      .slice(0, 6)
      .map((job, idx) => {
        const title = job.querySelector('p[itemprop="name"] a')?.innerText || "N/A";
        const company = job.querySelector(".jobCardNova_bigCardTopTitleName__M_W_m")?.innerText || "N/A";
        const url = job.querySelector('meta[itemprop="url"]')?.content || "#";
        const location = job.querySelector(".jobCardNova_bigCardCenterListLoc__usiPB span")?.innerText || "N/A";
        const experience = job.querySelector(".jobCardNova_bigCardExperience__54Ken span")?.innerText || "N/A";
        const posted = job.querySelector(".jobCardNova_postedData__LTERc")?.innerText || "N/A";

        return {
          id: idx + 1,
          title,
          company,
          location,
          experience,
          posted,
          platform: "Shine",
          src: url
        };
      });
  });

  await page.close();
  return jobs;
};

const scrapeNaukri = async (browser, query) => {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  }); 

  await page.goto(`https://www.naukri.com/${query}-jobs?k=${query}`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".srp-jobtuple-wrapper"))
      .slice(0, 6)
      .map((job, idx) => {
        const title = job.querySelector("h2 a.title")?.innerText.trim() || "N/A";
        const url = job.querySelector("h2 a.title")?.href || "#";
        const company = job.querySelector(".comp-name")?.innerText.trim() || "N/A";
        const location = job.querySelector(".locWdth")?.innerText.trim() || "N/A";
        const experience = job.querySelector(".expwdth")?.innerText.trim() || "N/A";
        const posted = job.querySelector(".job-post-day")?.innerText.trim() || "N/A";

        return {
          id: idx + 7,
          title,
          company,
          location,
          experience,
          posted,
          platform: "Naukri",
          src: url
        };
      });
  });

  await page.close();
  return jobs;
};

const scrapeInternshala = async (browser, query) => {
  const page = await browser.newPage();
  await page.goto(`https://internshala.com/jobs/keywords-${query}/`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".individual_internship"))
      .slice(0, 6)
      .map((job, idx) => {
        const title = job.querySelector(".job-internship-name a.job-title-href")?.innerText.trim() || "N/A";
        const company = job.querySelector(".company-name")?.innerText.trim() || "N/A";
        const location = job.querySelector(".locations a")?.innerText.trim() || "N/A";
        const salary = job.querySelector(".stipend")?.innerText.trim() || "N/A";
        const posted = job.querySelector(".detail-row-2 .status-inactive span")?.innerText.trim() || "N/A";

        let relativeUrl = job.getAttribute("data-href") || job.querySelector(".job-internship-name a")?.href || "#";
        const url = relativeUrl.startsWith("http") ? relativeUrl : `https://internshala.com${relativeUrl}`;

        return {
          id: idx + 13,
          title,
          company,
          location,
          experience: salary,
          posted,
          platform: "Internshala",
          src: url
        };
      });
  });

  await page.close();
  return jobs;
};

app.get("/", (req, res) => {
  res.send("Welcome to Puppeteer setup for Serverless environment");
});

app.post("/scrape-jobs", async (req, res) => {
  const query = req.body.query || "reactjs";

  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: false,
    });

    // Sequential scraping
    const shineJobs = await scrapeShine(browser, query);
    const naukriJobs = await scrapeNaukri(browser, query);
    const internshalaJobs = await scrapeInternshala(browser, query);

    const allJobs = [...shineJobs, ...naukriJobs, ...internshalaJobs];

    res.status(200).json({
      isDataScraped: true,
      scrapedJobs: allJobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scrape jobs" });
  } finally {
    if (browser) await browser.close();
  }
});


// For local use, we would normally use regular puppeteer, which comes 
// with Chromium bundled. Then we wouldn’t need @sparticuz/chromium.
// But setup is currently configured for serverless environments like Vercel.

// So uncommenting the following lines makes no sense:

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

module.exports = app;
