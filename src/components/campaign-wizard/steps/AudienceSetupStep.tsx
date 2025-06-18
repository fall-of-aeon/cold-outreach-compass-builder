
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Upload } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CampaignData, EstimatedResults } from "../types";
import { suggestionChips, examplePrompts } from "../data";
import { StarRating } from "../StarRating";
import { calculateProspectQuality, calculateEstimatedResults, getQualityLabel } from "../utils";

interface AudienceSetupStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const AudienceSetupStep = ({ campaignData, setCampaignData }: AudienceSetupStepProps) => {
  const [prospectQuality, setProspectQuality] = useState(0);
  const [estimatedResults, setEstimatedResults] = useState<EstimatedResults>({ min: 0, max: 0, time: 0 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleProspectDescriptionChange = (description: string) => {
    setCampaignData({ ...campaignData, prospectDescription: description });
    
    const quality = calculateProspectQuality(description);
    setProspectQuality(quality);
    setEstimatedResults(calculateEstimatedResults(quality));
  };

  const addChipToDescription = (chip: string) => {
    const current = campaignData.prospectDescription;
    const newDescription = current ? `${current} ${chip}` : chip;
    handleProspectDescriptionChange(newDescription);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="prospectDescription" className="text-lg font-semibold">
          Describe Your Ideal Prospects
        </Label>
        <Textarea
          id="prospectDescription"
          placeholder="e.g., SaaS founders in California with 10-50 employees who recently raised Series A funding"
          value={campaignData.prospectDescription}
          onChange={(e) => handleProspectDescriptionChange(e.target.value)}
          className="mt-2 min-h-[120px]"
          maxLength={500}
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-blue-600">
            💡 Tip: Be specific about role, location, company size, and industry for better targeting
          </p>
          <p className="text-sm text-gray-500">{campaignData.prospectDescription.length}/500</p>
        </div>
      </div>

      {/* Smart Suggestion Chips */}
      <div className="space-y-4">
        <h3 className="font-medium">Quick Add:</h3>
        
        {Object.entries(suggestionChips).map(([category, chips]) => (
          <div key={category}>
            <Label className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1')}</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {chips.map((chip) => (
                <Button
                  key={chip}
                  variant="outline"
                  size="sm"
                  onClick={() => addChipToDescription(chip)}
                  className="h-8 text-xs"
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quality Indicator */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Description Quality:</span>
            <div className="flex items-center space-x-2">
              <StarRating rating={prospectQuality} />
              <span className="text-sm text-gray-600">
                {getQualityLabel(prospectQuality)}
              </span>
            </div>
          </div>
          
          {prospectQuality < 3 && (
            <p className="text-sm text-orange-600">
              💡 Tip: Add more specific criteria like industry, location, or company size for better results
            </p>
          )}
        </CardContent>
      </Card>

      {/* Expected Results */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">📊 Estimated Results</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Expected prospects:</span>
              <span className="font-medium">~{estimatedResults.min}-{estimatedResults.max} qualified leads</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Processing time:</span>
              <span className="font-medium">{estimatedResults.time}-{estimatedResults.time + 15} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Quality score:</span>
              <div className="flex items-center space-x-1">
                <StarRating rating={prospectQuality} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Prompts */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-0">
            <Lightbulb className="h-4 w-4 mr-2" />
            View Example Descriptions
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <p className="text-sm font-medium">💡 Example targeting descriptions:</p>
          {examplePrompts.map((prompt, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm italic">"{prompt}"</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleProspectDescriptionChange(prompt)}
                className="mt-1 h-6 text-xs text-blue-600"
              >
                Use This Example
              </Button>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Filters */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            Advanced Targeting Options
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <div>
            <Label>Exclude Competitors</Label>
            <Input placeholder="e.g., Salesforce, HubSpot" className="mt-1" />
          </div>
          <div>
            <Label>Technology Stack</Label>
            <Input placeholder="e.g., AWS, React, Shopify" className="mt-1" />
          </div>
          <div>
            <Label>Funding Stage</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any funding stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-seed">Pre-seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series-a">Series A</SelectItem>
                <SelectItem value="series-b">Series B+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Alternative Upload */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium mb-2">Already have a lead list?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload your CSV file instead of using AI generation
          </p>
          <Button variant="outline">
            📤 Upload CSV Instead
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Requires: Name, Email, Company, Title columns • Max 1,000 contacts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
