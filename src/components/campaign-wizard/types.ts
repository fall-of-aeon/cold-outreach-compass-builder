
export interface CampaignData {
  name: string;
  type: string;
  template: string;
  subjectLine: string;
  emailBody: string;
  prospectDescription: string;
  emailAccount: string;
  schedule: string;
  dailyLimit: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  usage: string;
  preview: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface CampaignWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export interface SuggestionChips {
  roles: string[];
  industries: string[];
  locations: string[];
  companySizes: string[];
}

export interface EstimatedResults {
  min: number;
  max: number;
  time: number;
}
