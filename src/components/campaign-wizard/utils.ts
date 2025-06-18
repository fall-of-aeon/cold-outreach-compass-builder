
import { EstimatedResults } from "./types";
import { suggestionChips } from "./data";

export const calculateProspectQuality = (description: string): number => {
  const words = description.trim().split(/\s+/).length;
  const hasRole = suggestionChips.roles.some(role => 
    description.toLowerCase().includes(role.toLowerCase())
  );
  const hasIndustry = suggestionChips.industries.some(industry => 
    description.toLowerCase().includes(industry.toLowerCase())
  );
  const hasLocation = suggestionChips.locations.some(location => 
    description.toLowerCase().includes(location.toLowerCase())
  );
  const hasSize = suggestionChips.companySizes.some(size => 
    description.toLowerCase().includes(size.split(' ')[0])
  );

  let quality = 0;
  if (words >= 5) quality += 1;
  if (words >= 10) quality += 1;
  if (hasRole) quality += 1;
  if (hasIndustry) quality += 1;
  if (hasLocation || hasSize) quality += 1;

  return quality;
};

export const calculateEstimatedResults = (quality: number): EstimatedResults => {
  if (quality >= 4) {
    return { min: 250, max: 500, time: 15 };
  } else if (quality >= 3) {
    return { min: 150, max: 350, time: 25 };
  } else if (quality >= 2) {
    return { min: 50, max: 200, time: 30 };
  } else {
    return { min: 100, max: 300, time: 20 };
  }
};

export const getQualityLabel = (quality: number): string => {
  if (quality >= 4) return "Excellent";
  if (quality >= 3) return "Very Good";
  if (quality >= 2) return "Good";
  return "Needs Improvement";
};
