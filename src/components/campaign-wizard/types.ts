
export interface CampaignData {
  name: string;
  location: string;
  industry: string;
  seniority: string;
  companySize: string;
  apolloUrl?: string;
  enrichmentStatus: 'pending' | 'in-progress' | 'completed';
  qualifiedLeads: number;
  emailsSent: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
  // Additional properties for the wizard steps
  type?: string;
  template?: string;
  prospectDescription?: string;
  subjectLine?: string;
  emailBody?: string;
  emailAccount?: string;
  schedule?: string;
  dailyLimit?: number;
}

export interface ProspectCriteria {
  location: string;
  industry: string;
  seniority: string;
  companySize: string;
}

export interface EnrichedLead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedinProfile?: string;
  companyWebsite?: string;
  generatedEmail: string;
  score: number;
}

export interface Step {
  title: string;
  description: string;
}

export interface CampaignWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export interface SmartleadConnection {
  connected: boolean;
  accountEmail?: string;
  lastSync?: string;
}

export interface EstimatedResults {
  min: number;
  max: number;
  time: number;
}
