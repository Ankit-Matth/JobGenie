import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * STEP 1: Validate Query using Gemini
 */
const validateQuery = async (query) => {
  if (!query || typeof query !== "string" || query.trim().length === 0) return false;

  const prompt = `Is the query "${query}" related to a job title, job field, company name, or job-related keyword? 
  Return only "true" or "false".`;

  try {
    const res = await model.generateContent(prompt);
    const text = res.response.text().trim().toLowerCase();
    return text === "true";
  } catch (err) {
    console.error("Gemini validation failed:", err);
    return false;
  }
};

/**
 * STEP 2: Scrape Shine.com
 */
const scrapeShine = async (query) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.shine.com/job-search/${query}-jobs`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".jobCardNova_bigCard__W2xn3.jdbigCard"))
      .slice(0, 6)   // ✅ scrape 6 jobs now
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

  await browser.close();
  return jobs;
};



/**
 * STEP 3: Scrape Naukri.com
 */
const scrapeNaukri = async (query) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.naukri.com/${query}-jobs?k=${query}`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".srp-jobtuple-wrapper"))
      .slice(0, 6)  // ✅ scrape 6 jobs
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

  await browser.close();
  return jobs;
};


/**
 * STEP 4: Scrape Internshala
 */
const scrapeInternshala = async (query) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(`https://internshala.com/jobs/keywords-${query}/`, { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".individual_internship"))
      .slice(1, 7)  // ✅ limit to 6 jobs
      .map((job, idx) => {
        const title = job.querySelector(".job-internship-name a.job-title-href")?.innerText.trim() || "N/A";
        const company = job.querySelector(".company-name")?.innerText.trim() || "N/A";
        const location = job.querySelector(".locations a")?.innerText.trim() || "N/A";
        const salary = job.querySelector(".stipend")?.innerText.trim() || "N/A";
        const posted = job.querySelector(".detail-row-2 .status-inactive span")?.innerText.trim() || "N/A";

        // ✅ link (Internshala uses relative paths)
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

  await browser.close();
  return jobs;
};


/**
 * STEP 5: API Route
 */
export async function POST(request) {
  const { query } = await request.json();

  try {
    // const isValid = await validateQuery(query);
    const isValid = true
    if (!isValid) {
      return NextResponse.json({
        isDataScraped: false,
        scrapedJobs: [],
        reason: "Invalid job-related query"
      }, { status: 200 });
    }

    const [shineJobs, naukriJobs, internshalaJobs] = await Promise.all([
      scrapeShine(query),
      scrapeNaukri(query),
      scrapeInternshala(query)
    ]);

    const allJobs = [...shineJobs, ...naukriJobs, ...internshalaJobs];

    return NextResponse.json({
      isDataScraped: true,
      scrapedJobs: allJobs,
    }, { status: 200 });

  } catch (error) {
    console.error("Scraping failed:", error);
    return NextResponse.json({ isDataScraped: false }, { status: 500 });
  }
}
