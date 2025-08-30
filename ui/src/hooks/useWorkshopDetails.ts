import { useState, useEffect, useCallback } from 'react';
import { workshopService, type WorkshopDetails } from '@/services/workshop.service';

export interface UseWorkshopDetailsResult {
  workshop: WorkshopDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWorkshopDetails = (id: string): UseWorkshopDetailsResult => {
  const [workshop, setWorkshop] = useState<WorkshopDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkshopDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await workshopService.getWorkshopDetails(id);
      
      if (response.success) {
        setWorkshop(response.data);
      } else {
        setError(response.message || 'Failed to fetch workshop details');
        setWorkshop(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching workshop details');
      setWorkshop(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWorkshopDetails();
    }
  }, [id, fetchWorkshopDetails]);

  return {
    workshop,
    loading,
    error,
    refetch: fetchWorkshopDetails
  };
};
