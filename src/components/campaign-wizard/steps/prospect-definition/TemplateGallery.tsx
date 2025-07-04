
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Eye, Copy, Star, TrendingUp, Users, Zap } from "lucide-react";
import { CampaignData } from "../../types";

interface TemplateGalleryProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'cold-outreach' | 'follow-up' | 'product-launch' | 'partnership';
  industry: string[];
  seniority: string[];
  openRate: number;
  replyRate: number;
  usage: number;
  preview: {
    subject: string;
    body: string;
  };
  tags: string[];
  isRecommended?: boolean;
}

export const TemplateGallery = ({ campaignData, setCampaignData }: TemplateGalleryProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filter, setFilter] = useState<'all' | 'recommended' | 'high-performing'>('all');

  const templates: Template[] = [
    {
      id: 'saas-cold-intro',
      name: 'SaaS Cold Introduction',
      description: 'Professional introduction for SaaS prospects with value proposition',
      category: 'cold-outreach',
      industry: ['Software/SaaS'],
      seniority: ['Founder/CEO', 'C-Level (CTO, CMO, etc.)'],
      openRate: 42,
      replyRate: 8.5,
      usage: 1247,
      preview: {
        subject: 'Quick question about {{company}}\'s growth plans',
        body: 'Hi {{firstName}},\n\nI noticed {{company}} recently {{recent_news}}. Impressive growth!\n\nI\'m reaching out because I help SaaS companies like yours reduce customer acquisition costs by an average of 30% through automated lead scoring.\n\nWorth a quick 15-minute conversation?\n\nBest,\n{{your_name}}'
      },
      tags: ['High Converting', 'Personalized', 'Value-First'],
      isRecommended: true
    },
    {
      id: 'executive-brief',
      name: 'Executive Brief',
      description: 'Concise, executive-level messaging for C-suite prospects',
      category: 'cold-outreach',
      industry: ['Software/SaaS', 'E-commerce', 'FinTech'],
      seniority: ['Founder/CEO', 'C-Level (CTO, CMO, etc.)'],
      openRate: 38,
      replyRate: 12.1,
      usage: 892,
      preview: {
        subject: '3 minute read: {{industry}} insights',
        body: '{{firstName}},\n\nThree insights from working with 50+ {{industry}} leaders:\n\n1. {{insight_1}}\n2. {{insight_2}} \n3. {{insight_3}}\n\nHappy to share our {{industry}} playbook if relevant.\n\n{{your_name}}'
      },
      tags: ['Executive Level', 'Insights-Based', 'Authority'],
      isRecommended: true
    },
    {
      id: 'partnership-intro',
      name: 'Partnership Introduction',
      description: 'Collaborative approach for partnership opportunities',
      category: 'partnership',
      industry: ['Software/SaaS', 'Marketing/Advertising'],
      seniority: ['VP/Director', 'Manager'],
      openRate: 35,
      replyRate: 15.3,
      usage: 634,
      preview: {
        subject: 'Partnership opportunity: {{your_company}} + {{company}}',
        body: 'Hi {{firstName}},\n\nI\'ve been following {{company}}\'s work in {{industry}} - particularly your approach to {{specific_area}}.\n\nWe\'re seeing interesting synergies between our solutions. Our mutual clients often ask about integrating {{their_product}} with {{your_product}}.\n\nWorth exploring together?\n\n{{your_name}}'
      },
      tags: ['Partnership', 'Mutual Benefit', 'Collaborative']
    },
    {
      id: 'problem-solution',
      name: 'Problem-Solution Fit',
      description: 'Direct approach highlighting specific pain points and solutions',
      category: 'cold-outreach',
      industry: ['E-commerce', 'Real Estate', 'Manufacturing'],
      seniority: ['VP/Director', 'Manager'],
      openRate: 33,
      replyRate: 9.8,
      usage: 756,
      preview: {
        subject: 'Solving {{company}}\'s {{specific_problem}}?',
        body: 'Hi {{firstName}},\n\n{{industry}} companies like {{company}} typically struggle with {{specific_problem}}.\n\nWe\'ve helped similar companies reduce this by {{percentage}}% through {{solution_approach}}.\n\nRecent case study: {{case_study_brief}}\n\nInterested in the details?\n\n{{your_name}}'
      },
      tags: ['Problem-Focused', 'Case Study', 'Results-Driven']
    },
    {
      id: 'follow-up-sequence',
      name: 'Follow-up Sequence',
      description: '3-touch follow-up sequence for non-responders',
      category: 'follow-up',
      industry: ['Software/SaaS', 'FinTech', 'HealthTech'],
      seniority: ['Founder/CEO', 'C-Level (CTO, CMO, etc.)', 'VP/Director'],
      openRate: 28,
      replyRate: 6.2,
      usage: 543,
      preview: {
        subject: 'Following up: {{previous_subject}}',
        body: 'Hi {{firstName}},\n\nI sent a note last week about {{brief_recap}}.\n\nI know you\'re busy, so I\'ll keep this short:\n\n{{key_value_prop}}\n\nWorth 10 minutes of your time?\n\n{{your_name}}\n\nP.S. If this isn\'t a priority right now, just let me know and I\'ll follow up in {{timeframe}}.'
      },
      tags: ['Follow-up', 'Persistent', 'Respectful']
    }
  ];

  const getRecommendedTemplates = () => {
    return templates.filter(template => {
      const industryMatch = template.industry.includes(campaignData.industry || '');
      const seniorityMatch = template.seniority.includes(campaignData.seniority || '');
      return industryMatch || seniorityMatch;
    });
  };

  const getFilteredTemplates = () => {
    switch (filter) {
      case 'recommended':
        return getRecommendedTemplates();
      case 'high-performing':
        return templates.filter(t => t.replyRate > 10);
      default:
        return templates;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cold-outreach': return Mail;
      case 'follow-up': return TrendingUp;
      case 'partnership': return Users;
      case 'product-launch': return Zap;
      default: return Mail;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cold-outreach': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'follow-up': return 'bg-green-100 text-green-800 border-green-200';
      case 'partnership': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'product-launch': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectTemplate = (template: Template) => {
    setCampaignData({
      ...campaignData,
      template: template.id,
      subjectLine: template.preview.subject,
      emailBody: template.preview.body
    });
  };

  const filteredTemplates = getFilteredTemplates();
  const recommendedTemplates = getRecommendedTemplates();

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Template Gallery
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Templates ({templates.length})
          </Button>
          <Button
            variant={filter === 'recommended' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('recommended')}
          >
            Recommended ({recommendedTemplates.length})
          </Button>
          <Button
            variant={filter === 'high-performing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('high-performing')}
          >
            High Performing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const IconComponent = getCategoryIcon(template.category);
            const isSelected = campaignData.template === template.id;
            const isRecommended = recommendedTemplates.some(t => t.id === template.id);
            
            return (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md relative ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => selectTemplate(template)}
              >
                {isRecommended && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-sm">{template.name}</h3>
                    </div>
                    <Badge className={getCategoryColor(template.category)} variant="outline">
                      {template.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{template.openRate}% open</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{template.replyRate}% reply</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{template.usage} uses</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Subject Line:</h4>
                            <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                              {template.preview.subject}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Email Body:</h4>
                            <div className="p-3 bg-muted rounded-lg font-mono text-sm whitespace-pre-line">
                              {template.preview.body}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => {
                                selectTemplate(template);
                                setSelectedTemplate(null);
                              }}
                              className="flex-1"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Use This Template
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTemplate(template);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
