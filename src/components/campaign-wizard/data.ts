
import { Template, Step, SuggestionChips } from "./types";

export const templates: Template[] = [
  {
    id: "cold-intro",
    name: "Cold Introduction",
    description: "Professional introduction template",
    usage: "Used 45 times, 16% avg response rate",
    preview: "Hi {{firstName}}, I noticed {{company}} recently..."
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Announce new features or products",
    usage: "Used 23 times, 22% avg response rate",
    preview: "Hello {{firstName}}, We just launched something that could help {{company}}..."
  },
  {
    id: "partnership",
    name: "Partnership Proposal",
    description: "Collaboration and partnership opportunities",
    usage: "Used 18 times, 19% avg response rate",
    preview: "Hi {{firstName}}, I believe there's a great synergy between {{company}} and..."
  }
];

export const steps: Step[] = [
  { title: "Campaign Basics", description: "Name and template selection" },
  { title: "Message Configuration", description: "Create your outreach message" },
  { title: "Audience Setup", description: "Define your ideal prospects" },
  { title: "Sending Configuration", description: "Set delivery preferences" },
  { title: "Review & Launch", description: "Final review and launch" }
];

export const suggestionChips: SuggestionChips = {
  roles: ["Founder", "CEO", "VP Sales", "Marketing Director", "CTO", "Head of Growth"],
  industries: ["SaaS", "E-commerce", "FinTech", "HealthTech", "Manufacturing", "Consulting"],
  locations: ["United States", "California", "New York", "Remote-first", "Europe", "Canada"],
  companySizes: ["1-10 employees", "11-50", "51-200", "200-1000", "1000+ employees"]
};

export const examplePrompts = [
  "Marketing directors at B2B SaaS companies in North America with 50-500 employees",
  "Founders of early-stage startups in fintech, recently featured in TechCrunch",
  "VP of Sales at manufacturing companies in the Midwest with $10M+ annual revenue",
  "CTOs at remote-first tech companies that use AWS and have raised funding"
];
