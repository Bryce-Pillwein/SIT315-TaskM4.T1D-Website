// Athlete Data Provider tsx

import { createContext, useContext, useState, useEffect } from 'react';
import { getAthleteHistory, getAthleteIds, getLatestAthleteData } from '@/services';
import { Athlete } from '@/types/Athlete';
import { AthleteData } from '@/types/AthleteData';

interface AthleteDataContextType {
  athlete: Athlete[];
  selectedAthlete: Athlete | null;
  setSelectedAthlete: (athlete: Athlete) => void;
  athleteData: AthleteData[] | null;
  historicalData: Record<string, AthleteData[]>;
  latestData: Record<string, AthleteData | null>;
  loading: boolean;
}

const AthleteDataContext = createContext<AthleteDataContextType | undefined>(undefined);

interface AthleteDataProviderProps {
  children: React.ReactNode
}

export const AthleteDataProvider: React.FC<AthleteDataProviderProps> = ({ children }) => {
  const [athlete, setAthlete] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [athleteData, setAthleteData] = useState<AthleteData[] | null>(null);
  const [historicalData, setHistoricalData] = useState<Record<string, AthleteData[]>>({});
  const [latestData, setLatestData] = useState<Record<string, AthleteData | null>>({});
  const [loading, setLoading] = useState(false);

  /**
   * Fetch Athlete IDs and Names in Real-Time
   */
  useEffect(() => {
    const unsubscribeIds = getAthleteIds((athletes: Athlete[]) => {
      setAthlete(athletes);
    });

    return () => unsubscribeIds();
  }, []);

  /**
   * Fetch Athlete Historical Data for all Athletes
   */
  useEffect(() => {
    const unsubscribers: (() => void)[] = athlete.map((athlete) => {
      return getAthleteHistory(athlete, (data: AthleteData[]) => {
        setHistoricalData((prevData) => ({
          ...prevData,
          [athlete.id]: data, // Store historical data for each athlete
        }));
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [athlete]);

  /**
   * Fetch data for the selected athlete in real-time
   */
  useEffect(() => {
    if (selectedAthlete) {
      setLoading(true);
      const unsubscribe = getAthleteHistory(selectedAthlete, (data: AthleteData[]) => {
        setAthleteData(data); // Set the athlete data for the selected athlete
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [selectedAthlete]);

  /**
 * Fetch Latest Athlete Data for all Athletes
 */
  useEffect(() => {
    const unsubscribers: (() => void)[] = athlete.map((athlete) => {
      return getLatestAthleteData(athlete, (data: AthleteData | null) => {
        setLatestData((prevData) => ({
          ...prevData,
          [athlete.id]: data, // Store latest data for each athlete
        }));
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [athlete]);

  return (
    <AthleteDataContext.Provider
      value={{ athlete, selectedAthlete, setSelectedAthlete, athleteData, historicalData, latestData, loading, }} >
      {children}
    </AthleteDataContext.Provider>
  );
};

// Custom hook to use the context
export const useAthleteDataContext = (): AthleteDataContextType => {
  const context = useContext(AthleteDataContext);
  if (!context) {
    throw new Error('useAthleteData must be used within an AthleteDataProvider');
  }
  return context;
};
