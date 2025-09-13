import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CampaignData, AirtableLead } from "../types";
import { Search, User, Building, Mail, Star, RefreshCw } from "lucide-react";

interface LeadResultsReviewStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId: string | null;
  onNext: () => void;
}

export const LeadResultsReviewStep = ({ 
  campaignData, 
  setCampaignData, 
  campaignId,
  onNext 
}: LeadResultsReviewStepProps) => {
  const [leads, setLeads] = useState<AirtableLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<AirtableLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (campaignId) {
      fetchLeads();
    }
  }, [campaignId]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, activeTab]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-airtable-leads', {
        body: { campaignId }
      });

      if (error) throw error;

      if (data?.leads) {
        setLeads(data.leads);
        setCampaignData({
          ...campaignData,
          enrichedLeadsCount: data.leads.length,
          enrichmentStatus: 'enrichment_complete'
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads from Airtable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.title.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
      );
    }

    // Filter by tab
    switch (activeTab) {
      case "high":
        filtered = filtered.filter(lead => lead.score >= 80);
        break;
      case "medium":
        filtered = filtered.filter(lead => lead.score >= 60 && lead.score < 80);
        break;
      case "low":
        filtered = filtered.filter(lead => lead.score < 60);
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    setFilteredLeads(filtered);
  };

  const handleLeadSelection = (leadId: string, selected: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (selected) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTabCounts = () => {
    return {
      all: leads.length,
      high: leads.filter(lead => lead.score >= 80).length,
      medium: leads.filter(lead => lead.score >= 60 && lead.score < 80).length,
      low: leads.filter(lead => lead.score < 60).length,
    };
  };

  const handleProceed = () => {
    const selectedLeadData = leads.filter(lead => selectedLeads.has(lead.id));
    setCampaignData({
      ...campaignData,
      selectedLeads: selectedLeadData,
      qualifiedLeads: selectedLeadData.length,
    });
    onNext();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium">Loading enriched leads...</h3>
          <p className="text-muted-foreground">Fetching data from Airtable</p>
        </div>
      </div>
    );
  }

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review Lead Results</h2>
        <p className="text-muted-foreground mt-2">
          Review and select leads for your email campaign
        </p>
      </div>

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {selectedLeads.size} of {filteredLeads.length} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll(selectedLeads.size !== filteredLeads.length)}
          >
            {selectedLeads.size === filteredLeads.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="high">High Score ({tabCounts.high})</TabsTrigger>
          <TabsTrigger value="medium">Medium Score ({tabCounts.medium})</TabsTrigger>
          <TabsTrigger value="low">Low Score ({tabCounts.low})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leads found for this filter.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <Card key={lead.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedLeads.has(lead.id)}
                        onCheckedChange={(checked) => 
                          handleLeadSelection(lead.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {lead.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{lead.title}</p>
                          </div>
                          <Badge className={`ml-2 ${getScoreColor(lead.score)}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {lead.score}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {lead.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                          {lead.emailVerification && (
                            <Badge variant={lead.emailVerification === 'deliverable' ? 'default' : 'secondary'}>
                              {lead.emailVerification}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => fetchLeads()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        
        <Button 
          onClick={handleProceed}
          disabled={selectedLeads.size === 0}
          className="px-8"
        >
          Proceed with {selectedLeads.size} Lead{selectedLeads.size !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};