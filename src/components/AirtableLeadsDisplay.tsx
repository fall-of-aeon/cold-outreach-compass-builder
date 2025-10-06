import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Mail, Building2, MapPin, Users, TrendingUp } from "lucide-react";
import { useAirtableLeads, type AirtableLead } from "@/hooks/useAirtableLeads";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface AirtableLeadsDisplayProps {
  campaignId: string;
}

const LeadCard = ({ lead }: { lead: AirtableLead }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'qualified': return 'default';
      case 'contacted': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="hover:shadow-md transition-shadow">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 text-left">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {lead.name}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {lead.title} at {lead.company}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(lead.status)} className="capitalize">
                  {lead.status}
                </Badge>
                <Badge className={getScoreColor(lead.score)}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {lead.score}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {lead.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{lead.email}</span>
                </div>
              )}
              {lead.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{lead.location}</span>
                </div>
              )}
              {lead.companySize && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{lead.companySize}</span>
                </div>
              )}
              {lead.industry && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{lead.industry}</span>
                </div>
              )}
            </div>

            {lead.generatedEmailSubject && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-2">Generated Email</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  <p className="font-medium text-sm">{lead.generatedEmailSubject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {lead.generatedEmailBody}
                  </p>
                </div>
              </div>
            )}

            {(lead.linkedinProfile || lead.companyWebsite) && (
              <div className="flex gap-2 pt-2 border-t">
                {lead.linkedinProfile && (
                  <a
                    href={lead.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    LinkedIn Profile →
                  </a>
                )}
                {lead.companyWebsite && (
                  <a
                    href={lead.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Company Website →
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export const AirtableLeadsDisplay = ({ campaignId }: AirtableLeadsDisplayProps) => {
  const { data, isLoading, error } = useAirtableLeads(campaignId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Airtable Leads</CardTitle>
          <CardDescription>Loading leads from Airtable...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Airtable Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load leads: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Airtable Leads</CardTitle>
          <CardDescription>No leads found in Airtable yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airtable Leads ({data.total})</CardTitle>
        <CardDescription>
          Showing {data.leads.length} lead{data.leads.length !== 1 ? 's' : ''} from Airtable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {data.hasMore && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            More leads available...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
