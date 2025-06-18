
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Star, Clock, Users, Lightbulb, Upload, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

interface CampaignWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "",
    template: "",
    subjectLine: "",
    emailBody: "",
    prospectDescription: "",
    emailAccount: "",
    schedule: "immediate",
    dailyLimit: 250
  });

  const [prospectQuality, setProspectQuality] = useState(0);
  const [estimatedResults, setEstimatedResults] = useState({ min: 0, max: 0, time: 0 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const steps = [
    { title: "Campaign Basics", description: "Name and template selection" },
    { title: "Message Configuration", description: "Create your outreach message" },
    { title: "Audience Setup", description: "Define your ideal prospects" },
    { title: "Sending Configuration", description: "Set delivery preferences" },
    { title: "Review & Launch", description: "Final review and launch" }
  ];

  const templates = [
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

  const suggestionChips = {
    roles: ["Founder", "CEO", "VP Sales", "Marketing Director", "CTO", "Head of Growth"],
    industries: ["SaaS", "E-commerce", "FinTech", "HealthTech", "Manufacturing", "Consulting"],
    locations: ["United States", "California", "New York", "Remote-first", "Europe", "Canada"],
    companySizes: ["1-10 employees", "11-50", "51-200", "200-1000", "1000+ employees"]
  };

  const examplePrompts = [
    "Marketing directors at B2B SaaS companies in North America with 50-500 employees",
    "Founders of early-stage startups in fintech, recently featured in TechCrunch",
    "VP of Sales at manufacturing companies in the Midwest with $10M+ annual revenue",
    "CTOs at remote-first tech companies that use AWS and have raised funding"
  ];

  const handleProspectDescriptionChange = (description: string) => {
    setCampaignData({ ...campaignData, prospectDescription: description });
    
    // Calculate quality score based on description length and specificity
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

    setProspectQuality(quality);

    // Estimate results based on quality
    const baseResults = { min: 100, max: 300, time: 20 };
    if (quality >= 4) {
      setEstimatedResults({ min: 250, max: 500, time: 15 });
    } else if (quality >= 3) {
      setEstimatedResults({ min: 150, max: 350, time: 25 });
    } else if (quality >= 2) {
      setEstimatedResults({ min: 50, max: 200, time: 30 });
    } else {
      setEstimatedResults(baseResults);
    }
  };

  const addChipToDescription = (chip: string) => {
    const current = campaignData.prospectDescription;
    const newDescription = current ? `${current} ${chip}` : chip;
    handleProspectDescriptionChange(newDescription);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    toast({
      title: "Campaign Launched Successfully!",
      description: "Your campaign is now being processed. Lead generation will begin shortly.",
    });
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="e.g., Spring 2024 SaaS Outreach"
                value={campaignData.name}
                onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                💡 Use descriptive names like 'Q1 SaaS Prospects' for easy tracking
              </p>
            </div>

            <div>
              <Label>Campaign Type</Label>
              <Select value={campaignData.type} onValueChange={(value) => setCampaignData({ ...campaignData, type: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                  <SelectItem value="follow-up">Follow-up Sequence</SelectItem>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Choose Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      campaignData.template === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setCampaignData({ ...campaignData, template: template.id })}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <p className="text-xs text-green-600 mb-2">{template.usage}</p>
                      <p className="text-xs text-gray-500 italic">{template.preview}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Start from Scratch
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="subjectLine">Subject Line</Label>
              <Input
                id="subjectLine"
                placeholder="e.g., Quick question about {{company}} growth"
                value={campaignData.subjectLine}
                onChange={(e) => setCampaignData({ ...campaignData, subjectLine: e.target.value })}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500">Use {{tokens}} for personalization</p>
                <p className="text-sm text-gray-500">{campaignData.subjectLine.length}/100</p>
              </div>
            </div>

            <div>
              <Label htmlFor="emailBody">Email Message</Label>
              <Textarea
                id="emailBody"
                placeholder="Hi {{firstName}},

I noticed {{company}} recently expanded their team. Congratulations!

I wanted to reach out because..."
                value={campaignData.emailBody}
                onChange={(e) => setCampaignData({ ...campaignData, emailBody: e.target.value })}
                className="mt-2 min-h-[200px]"
              />
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500">Available tokens: {{firstName}}, {{company}}, {{title}}</p>
                <p className="text-sm text-gray-500">{campaignData.emailBody.length} characters</p>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Spam Score: Low Risk</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Your message follows best practices for deliverability
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
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
                    {renderStarRating(prospectQuality)}
                    <span className="text-sm text-gray-600">
                      {prospectQuality >= 4 ? "Excellent" : 
                       prospectQuality >= 3 ? "Very Good" : 
                       prospectQuality >= 2 ? "Good" : "Needs Improvement"}
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
                      {renderStarRating(prospectQuality)}
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

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Email Account</Label>
              <Select value={campaignData.emailAccount} onValueChange={(value) => setCampaignData({ ...campaignData, emailAccount: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select email account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">john@company.com (✅ Good standing)</SelectItem>
                  <SelectItem value="secondary">sales@company.com (⚠️ New domain)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sending Schedule</Label>
              <Select value={campaignData.schedule} onValueChange={(value) => setCampaignData({ ...campaignData, schedule: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Start Immediately</SelectItem>
                  <SelectItem value="morning">Tomorrow Morning (9 AM)</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Daily Sending Limit</Label>
              <div className="mt-2">
                <Input
                  type="number"
                  value={campaignData.dailyLimit}
                  onChange={(e) => setCampaignData({ ...campaignData, dailyLimit: parseInt(e.target.value) })}
                  min={1}
                  max={1000}
                />
                <p className="text-sm text-blue-600 mt-1">
                  💡 Recommended for new domains to build reputation
                </p>
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Delivery Optimization</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>✅ Optimal sending times selected</p>
                  <p>✅ Spam compliance configured</p>
                  <p>✅ Rate limiting enabled</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Launch!</h2>
              <p className="text-gray-600">Review your campaign settings below</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Campaign Name</Label>
                    <p className="font-medium">{campaignData.name || "Untitled Campaign"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Template</Label>
                    <p className="font-medium capitalize">{campaignData.template?.replace('-', ' ') || "Custom"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Expected Prospects</Label>
                    <p className="font-medium">{estimatedResults.min}-{estimatedResults.max} leads</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Daily Limit</Label>
                    <p className="font-medium">{campaignData.dailyLimit} emails/day</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-600">Target Audience</Label>
                  <p className="font-medium">{campaignData.prospectDescription || "No description provided"}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Subject Line</Label>
                  <p className="font-medium">{campaignData.subjectLine || "No subject line"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">📋 Pre-flight Checklist</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Campaign details configured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Email message created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Target audience defined</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sending settings optimized</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">What happens next?</h4>
                  <div className="text-sm text-yellow-700 mt-1 space-y-1">
                    <p>1. Lead generation begins (15-30 minutes)</p>
                    <p>2. Prospects are verified for email accuracy</p>
                    <p>3. Campaigns starts sending based on your schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Campaign</h1>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs ${
                  index + 1 <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === 5 ? (
            <Button
              onClick={handleLaunch}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              🚀 Launch Campaign
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
