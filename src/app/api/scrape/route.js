import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
// import connectDB from '@/utils/dbConfig';
// import JobsModel from '@/models/JobListings';

const scrapeLinkedIn = async (query) => {
   // LinkedIn asks for sign-in to search, so it was skipped
   // due to lack of time to handle it. I plan to address it in the upcoming semester.
   // So, for now dummy data sent .....

   const data = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "HCLSoftware",
      location: "Noida, Uttar Pradesh",
      platform: "LinkedIn",
      salary: "$70,000 - $90,000",
      salaryRange: "50k-100k",
      skills: ["React", "JavaScript", "CSS"],
      jobType: "Internship",
      src: "https://www.linkedin.com/jobs/search/?currentJobId=4068024492&keywords=nextjs&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "TCS",
      location: "Bengaluru, Karnataka",
      platform: "LinkedIn",
      salary: "$105,000 - $110,000",
      salaryRange: "> 100k",
      skills: ["Node.js", "React", "MongoDB"],
      jobType: "Full-Time",
      src: "https://www.linkedin.com/jobs/search/?currentJobId=4072024592&keywords=fullstack&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Infosys",
      location: "Mumbai",
      platform: "LinkedIn",
      salary: "$60,000 - $80,000",
      salaryRange: "50k-100k",
      skills: ["Figma", "Adobe XD", "CSS"],
      jobType: "Contract",
      src: "https://www.linkedin.com/jobs/search/?currentJobId=4073124693&keywords=designer&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true",
    },
  ];

  return data;
};

const scrapeNaukri = async (query) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(`https://www.naukri.com/${query}-jobs?k=${query}&nignbevent_src=jobsearchDeskGNB`);
  
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
    
    await browser.close();
    return data;
};

const scrapeInternshala = async (query) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(`https://internshala.com/jobs/keywords-${query}/`);

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
    
    await browser.close();
    return data;
};

export async function POST(request) {
  const { query } = await request.json();

//   await connectDB();
  
  try {
    const [linkedinJobs, naukriJobs, internshalaJobs] = await Promise.all([
      scrapeLinkedIn(query),
      scrapeNaukri(query),
      scrapeInternshala(query),
    ]);
    
    // Combine the results
    const allJobs = [...linkedinJobs, ...naukriJobs, ...internshalaJobs];

    // await JobsModel.insertMany(allJobs);

    return NextResponse.json({ isDataScraped: true, scrapedJobs: allJobs }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ isDataScraped: false }, { status: 500 });
  }
};
