import { useEffect, useState, useCallback } from 'react';
import { fetchIssLocation, fetchAstronauts, reverseGeocode } from '../services/api';
import { calculateSpeed } from '../utils/haversine';
import { useStore } from '../store';
import { toast } from 'sonner';

export function useIssData() {
  const { issPositions, addIssPosition, astronauts, setAstronauts } = useStore();
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Loading...');
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      // Fetch ISS location
      const issData = await fetchIssLocation();

      // Only fetch astronauts if we haven't already (to avoid 429 Too Many Requests)
      if (astronauts.length === 0) {
        try {
          const astrosData = await fetchAstronauts();
          setAstronauts(astrosData.people || []);
        } catch (astroErr) {
          console.warn("Failed to fetch astronauts (Rate Limit possibly):", astroErr);
        }
      }

      const position = {
        latitude: parseFloat(issData.iss_position.latitude),
        longitude: parseFloat(issData.iss_position.longitude),
        timestamp: issData.timestamp,
      };

      // Add to store
      addIssPosition(position);

      // Reverse geocoding
      const loc = await reverseGeocode(position.latitude, position.longitude);
      setLocationName(loc);

      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch ISS data');
      setLoading(false);
    }
  }, [addIssPosition, setAstronauts]);

  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    fetchData(); // Initial fetch
    let interval;
    if (isTracking) {
      interval = setInterval(fetchData, 15000); // Every 15 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchData, isTracking]);

  // Calculate current speed when positions update
  useEffect(() => {
    if (issPositions.length >= 2) {
      const lastPos = issPositions[issPositions.length - 1];
      const prevPos = issPositions[issPositions.length - 2];
      
      const pos1 = { lat: prevPos.latitude, lng: prevPos.longitude };
      const pos2 = { lat: lastPos.latitude, lng: lastPos.longitude };
      const timeDiff = Math.abs(lastPos.timestamp - prevPos.timestamp);
      
      if (timeDiff > 0) {
        const speed = calculateSpeed(pos1, pos2, timeDiff);
        setCurrentSpeed(speed);
      }
    }
  }, [issPositions]);

  return {
    issPositions,
    astronauts,
    loading,
    locationName,
    currentSpeed,
    refetch: fetchData,
    isTracking,
    toggleTracking: () => setIsTracking(prev => !prev)
  };
}
