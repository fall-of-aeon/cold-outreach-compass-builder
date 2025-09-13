
export const steps = [
  {
    title: "Define Prospects",
    description: "Specify your ideal target audience criteria"
  },
  {
    title: "Enrich Leads", 
    description: "Let us find and enrich your prospects"
  },
  {
    title: "Review Results",
    description: "Review and select enriched leads"
  },
  {
    title: "Review Emails",
    description: "Approve AI-generated personalized messages"
  },
  {
    title: "Monitor Campaign",
    description: "Track your campaign performance"
  }
];

export const locationOptions = [
  "United States",
  "Canada", 
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Remote/Worldwide"
];

export const industryOptions = [
  "Software/SaaS",
  "E-commerce",
  "FinTech", 
  "HealthTech",
  "Marketing/Advertising",
  "Real Estate",
  "Manufacturing",
  "Consulting",
  "Education",
  "Other"
];

export const seniorityOptions = [
  "Founder/CEO",
  "C-Level (CTO, CMO, etc.)",
  "VP/Director",
  "Manager",
  "Individual Contributor"
];

export const companySizeOptions = [
  "1-10 employees",
  "11-50 employees", 
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees"
];

export const templates = [
  {
    id: "cold-outreach",
    name: "Cold Outreach",
    description: "Professional introduction template",
    usage: "Most popular for B2B sales",
    preview: "Hi {{firstName}}, I noticed {{company}} recently..."
  },
  {
    id: "follow-up",
    name: "Follow-up Sequence",
    description: "Multi-touch follow-up campaign",
    usage: "Great for nurturing leads",
    preview: "Following up on my previous message about..."
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Announce new products or features",
    usage: "Perfect for product announcements",
    preview: "Excited to share that we just launched..."
  }
];

export const suggestionChips = {
  roles: [
    "CEO", "CTO", "CMO", "VP Sales", "Marketing Director", "Product Manager",
    "Founder", "Head of Growth", "Sales Manager"
  ],
  industries: [
    "SaaS", "E-commerce", "FinTech", "HealthTech", "EdTech", "MarTech",
    "Real Estate", "Manufacturing", "Consulting", "Agency"
  ],
  locations: [
    "United States", "California", "New York", "Texas", "Canada", "UK",
    "Germany", "Australia", "Remote"
  ],
  companySizes: [
    "1-10 employees", "11-50 employees", "51-200 employees", 
    "201-1000 employees", "1000+ employees", "Series A", "Series B"
  ]
};

export const examplePrompts = [
  "SaaS founders in California with 10-50 employees who recently raised Series A funding",
  "Marketing Directors at e-commerce companies in the US with $1M+ revenue",
  "CTOs at FinTech startups in Europe with 20-100 employees",
  "VP of Sales at B2B software companies in North America"
];
