// Athlete Data Provider tsx

import { createContext, useContext, useState, useEffect } from 'react';
import { getAthleteHistory, getAthleteIds, getLatestAthleteData } from '@/services';
import { Athlete } from '@/types/Athlete';
import { AthleteData } from '@/types/AthleteData';
import getAthleteIdsOnce from '@/services/getAtheleteIdsOnce';
import getAthleteHistoryOnce from '@/services/getAtheleteHistoryOnce';
import getLatestAthleteDataOnce from '@/services/getLatestAtheleteDataOnce';

interface AthleteDataContextType {
  athlete: Athlete[];
  selectedAthlete: Athlete | null;
  setSelectedAthlete: (athlete: Athlete) => void;
  athleteData: AthleteData[] | null;
  historicalData: Record<string, AthleteData[]>;
  latestData: AthleteData | null;
  loading: boolean;
  fetchAllAthleteData: () => void;
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
  const [latestData, setLatestData] = useState<AthleteData | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchAllAthleteData = async () => {
    try {
      setLoading(true);

      // Fetch all athlete data
      const athletes = await fetchAthleteIds();
      console.log(athletes);
      if (athletes) {
        setAthlete(athletes);
        await fetchAthleteHistory(athletes);
      }
    } catch (error) {
      console.error("Error fetching athlete data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * On-Demand
   * Fetch Athlete Ids
   */
  const fetchAthleteIds = async () => {
    try {
      const athletes = await getAthleteIdsOnce();
      return athletes;
    } catch (error) {
      console.error('Error getting athlete Ids: ', error);
    }
  };

  /**
   * On-Demand
   * Fetch Athlete History
   */
  const fetchAthleteHistory = async (athletes: Athlete[]) => {
    if (athletes.length <= 0) return;

    setLoading(true);
    const historyData = await Promise.all(
      athletes.map(async (athlete) => {
        const data = await getAthleteHistoryOnce(athlete);
        return { athleteId: athlete.id, data };
      })
    );

    const updatedHistory = historyData.reduce((acc, { athleteId, data }) => {
      acc[athleteId] = data;
      return acc;
    }, {} as Record<string, AthleteData[]>);

    setHistoricalData(updatedHistory);
    setLoading(false);
  };

  /**
   * On-Demand
   * Fetch Athlete Latest
   */
  useEffect(() => {
    if (!selectedAthlete) return;

    const fetchLatestAthleteData = async () => {
      try {
        const data = await getLatestAthleteDataOnce(selectedAthlete);
        if (!data) return;

        setLatestData(data);
      } catch (error) {
        console.error('Error getting latest athlete data: ', error);
      }
    };

    fetchLatestAthleteData();
  }, [selectedAthlete]);




  return (
    <AthleteDataContext.Provider
      value={{
        athlete, selectedAthlete, setSelectedAthlete, athleteData, historicalData, latestData, loading,
        fetchAllAthleteData
      }} >
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




/**
 * The Following functions use automatic updates and case
 * a high level of database reads, as they continue to query on every
 * database update. This caused over 50k data reads within a single day.
 * This would be useful for realtime events but not for the FREE version of Firebase!
 * As such, I have moved to use On-Demand Functions. "Button Click"
 */

/**
 * Fetch Athlete IDs and Names in Real-Time
 */
// useEffect(() => {
//   const unsubscribeIds = getAthleteIds((athletes: Athlete[]) => {
//     setAthlete(athletes);
//   });

//   return () => unsubscribeIds();
// }, []);

/**
 * Fetch Athlete Historical Data for all Athletes
 */
// useEffect(() => {
//   const unsubscribers: (() => void)[] = athlete.map((athlete) => {
//     return getAthleteHistory(athlete, (data: AthleteData[]) => {
//       setHistoricalData((prevData) => ({
//         ...prevData,
//         [athlete.id]: data, // Store historical data for each athlete
//       }));
//     });
//   });

//   return () => {
//     unsubscribers.forEach(unsubscribe => unsubscribe());
//   };
// }, [athlete]);

/**
 * Fetch data for the selected athlete in real-time
 */
// useEffect(() => {
//   if (selectedAthlete) {
//     setLoading(true);
//     const unsubscribe = getAthleteHistory(selectedAthlete, (data: AthleteData[]) => {
//       setAthleteData(data); // Set the athlete data for the selected athlete
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }
// }, [selectedAthlete]);

/**
 * Fetch Latest Athlete Data for all Athletes
 */
// useEffect(() => {
//   const unsubscribers: (() => void)[] = athlete.map((athlete) => {
//     return getLatestAthleteData(athlete, (data: AthleteData | null) => {
//       setLatestData((prevData) => ({
//         ...prevData,
//         [athlete.id]: data, // Store latest data for each athlete
//       }));
//     });
//   });

//   return () => {
//     unsubscribers.forEach(unsubscribe => unsubscribe());
//   };
// }, [athlete]);