
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import type { Campaign } from '@/services/supabaseService';

// Query keys
export const queryKeys = {
  dashboardStats: ['dashboard-stats'] as const,
  campaigns: ['campaigns'] as const,
  campaign: (id: string) => ['campaign', id] as const,
} as const;

// Dashboard stats hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: SupabaseService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    retry: 3
  });
};

// Campaigns list hook
export const useCampaigns = () => {
  return useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: SupabaseService.getCampaigns,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3
  });
};

// Single campaign hook
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: queryKeys.campaign(id),
    queryFn: () => SupabaseService.getCampaign(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    retry: 3
  });
};

// Create campaign mutation
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SupabaseService.createCampaign,
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
      
      toast({
        title: "Campaign Created!",
        description: `${data.name} has been created successfully.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Update campaign status mutation
export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      SupabaseService.updateCampaignStatus(id, status),
    onSuccess: (data) => {
      // Update the specific campaign in cache
      queryClient.setQueryData(queryKeys.campaign(data.id), data);
      // Invalidate campaigns list and dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
      
      toast({
        title: "Status Updated",
        description: `Campaign status changed to ${data.status}`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
