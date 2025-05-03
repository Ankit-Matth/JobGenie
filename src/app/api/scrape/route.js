import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
// import connectDB from '@/utils/dbConfig';
// import JobsModel from '@/models/JobListings';
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAllJobs = async (query) => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Step 1: Check if the query is job-related
  const validationPrompt = `
Is the query "${query}" related to a job title, job field, company name, or job-related keyword?
Return only "true" or "false" (no explanation, no markdown).`;

  try {
    const validationResponse = await model.generateContent(validationPrompt);
    const isValidText = validationResponse.response.text().trim().toLowerCase();

    if (isValidText !== "true") {
      return null;
    }

    // Step 2: Generate job listings if query is valid
    const jobPrompt = `
Generate 9 realistic job listings in **pure JSON array** format for the query "${query}".

Each job must include the following keys **with exact naming and structure**:
{
  id: Number,
  title: String,
  company: String,
  location: String,
  platform: String ("Indeed" | "Naukri" | "Internshala"),
  salary: String (e.g., "$40,000 - $50,000"),
  salaryRange: String ("< 10k" | "10k-50k" | "50k-100k" | "> 100k"),
  skills: Array of 3 strings,
  jobType: String ("Full-Time" | "Part-Time" | "Internship" | "Contract"),
  src: String (a valid link)
}

Rules:
- Divide the 9 jobs equally across the platforms: "Indeed", "Naukri", "Internshala"
- Every value from the following filters must appear **at least once** in the full dataset:
  - location: ["Remote", "Bengaluru", "Mumbai", "Noida", "Hyderabad"]
  - salaryRange: ["< 10k", "10k-50k", "50k-100k", "> 100k"]
  - jobType: ["Full-Time", "Part-Time", "Internship", "Contract"]
- Maintain consistent key formatting (camelCase), valid URLs, and appropriate example data.

⚠️ Output only a valid JSON array (no markdown, no comments, no explanations).
`;

    const jobResponse = await model.generateContent(jobPrompt);
    let text = jobResponse.response.text();

    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?/g, "").trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini failed:", err);
    return null;
  }
};


const scrapeIndeed = async (query) => {
   const data = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "HCLSoftware",
      location: "Noida, Uttar Pradesh",
      platform: "Indeed",
      salary: "$70,000 - $90,000",
      salaryRange: "50k-100k",
      skills: ["React", "JavaScript", "CSS"],
      jobType: "Internship",
      src: "https://www.Indeed.com/jobs/search/?currentJobId=4068024492&keywords=nextjs&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "TCS",
      location: "Bengaluru, Karnataka",
      platform: "Indeed",
      salary: "$105,000 - $110,000",
      salaryRange: "> 100k",
      skills: ["Node.js", "React", "MongoDB"],
      jobType: "Full-Time",
      src: "https://www.Indeed.com/jobs/search/?currentJobId=4072024592&keywords=fullstack&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Infosys",
      location: "Mumbai",
      platform: "Indeed",
      salary: "$60,000 - $80,000",
      salaryRange: "50k-100k",
      skills: ["Figma", "Adobe XD", "CSS"],
      jobType: "Contract",
      src: "https://www.Indeed.com/jobs/search/?currentJobId=4073124693&keywords=designer&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
  ];
};

const scrapeNaukri = async (query) => {
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    // const page = await browser.newPage();
    // await page.goto(`https://www.naukri.com/${query}-jobs?k=${query}&nignbevent_src=jobsearchDeskGNB`);
  
    const data = [
      {
        id: 4,
        title: "Data Analyst",
        company: "Google",
        location: "Remote",
        platform: "Naukri",
        salary: "$120,000 - $140,000",
        salaryRange: "> 100k",
        skills: ["Python", "SQL", "Tableau"],
        jobType: "Part-Time",
        src: "https://www.naukri.com/job-listings-data-analyst-google-mountain-view-261124906302",
      },
      {
        id: 5,
        title: "Machine Learning Engineer",
        company: "Microsoft",
        location: "Bengaluru",
        platform: "Naukri",
        salary: "$40,000 - $45,000",
        salaryRange: "10k-50k",
        skills: ["Python", "TensorFlow", "Machine Learning"],
        jobType: "Full-Time",
        src: "https://www.naukri.com/job-listings-ml-engineer-microsoft-redmond-261124906302",
      },
      {
        id: 6,
        title: "Cybersecurity Specialist",
        company: "Cisco",
        location: "Remote",
        platform: "Naukri",
        salary: "$5,000 - $10,000",
        salaryRange: "< 10k",
        skills: ["Cybersecurity", "Network Security", "Python"],
        jobType: "Contract",
        src: "https://www.naukri.com/job-listings-cybersecurity-cisco-san-jose-261124906302",
      },
    ];
    
    // await browser.close();
};

const scrapeInternshala = async (query) => {
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    // const page = await browser.newPage();
    // await page.goto(`https://internshala.com/jobs/keywords-${query}/`);

    const data = [
      {
        id: 7,
        title: "Marketing Intern",
        company: "Startup Inc.",
        location: "Mumbai, India",
        platform: "Internshala",
        salary: "Stipend: ₹10,000/month",
        salaryRange: "< 10k",
        skills: ["SEO", "Content Writing", "Social Media"],
        jobType: "Full-Time",
        src: "https://www.internshala.com/job-listings-marketing-intern-mumbai",
      },
      {
        id: 8,
        title: "Content Creator",
        company: "Zomato",
        location: "Noida, UP",
        platform: "Internshala",
        salary: "Stipend: ₹15,000/month",
        salaryRange: "10k-50k",
        skills: ["Content Writing", "Video Editing", "Canva"],
        jobType: "Part-Time",
        src: "https://www.internshala.com/job-listings-content-creator-delhi",
      },
      {
        id: 9,
        title: "Event Coordinator",
        company: "Eventura",
        location: "Hyderabad, India",
        platform: "Internshala",
        salary: "Stipend: ₹8,000/month",
        salaryRange: "< 10k",
        skills: ["Event Management", "Communication", "Team Coordination"],
        jobType: "Full-Time",
        src: "https://www.internshala.com/job-listings-event-coordinator-hyderabad",
      },
    ];
    
    // await browser.close();
};

export async function POST(request) {
  const { query } = await request.json();

//   await connectDB();
  
  try {
    // const [indeedJobs, naukriJobs, internshalaJobs] = await Promise.all([
    //   scrapeIndeed(query),
    //   scrapeNaukri(query),
    //   scrapeInternshala(query),
    // ]);
    
    // Combine the results
    // const allJobs = [...indeedJobs, ...naukriJobs, ...internshalaJobs];

    // await JobsModel.insertMany(allJobs);
    const jobs = await generateAllJobs(query);

    if (jobs) {
      return NextResponse.json({
        isDataScraped: true,
        scrapedJobs: jobs,
      }, { status: 200 });
    }

    return NextResponse.json({
      isDataScraped: false,
      scrapedJobs: [],
    }, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ isDataScraped: false }, { status: 500 });
  }
};
