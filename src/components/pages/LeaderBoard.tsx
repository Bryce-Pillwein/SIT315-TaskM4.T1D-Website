// Leader Board Page tsx

"use client";

import dynamic from "next/dynamic";
import { useAthleteDataContext } from "../providers/AthleteDataProvider";
import IconGeneral from "../layout/IconGeneral";



const DynAthleteMap = dynamic(() => import('../../components/AthleteMap'), { ssr: false });


const LeaderBoard = () => {
  const { leaderBoard } = useAthleteDataContext();

  return (
    <div className="flex flex-col flex-grow flex-shrink-0">
      <div className="grid grid-cols-4 gap-x-4 h-full">

        <div className="col-span-3">
          <DynAthleteMap />
        </div>

        <div className="col-span-1">
          <div className="bg-hsl-l100 px-8 py-4 rounded-md shadow-sm border border-hsl-l95 h-full">
            <h2 className="text-center font-semibold mb-4">Leader Board</h2>
            {leaderBoard ? (
              <div className="flex flex-col gap-y-4">
                {leaderBoard.map((ath, idx) => (
                  <div key={idx} className="flex justify-between">
                    <p className="font-semibold text-xl text-hsl-l20">{idx + 1}. {ath.name} </p>

                    <div className="flex gap-x-2">
                      <IconGeneral type="heart-rate" className="fill-hsl-l20" />
                      <p className="font-semibold">{ath.heartRate.toFixed(0)}</p>
                    </div>

                    <div className="flex gap-x-2">
                      <IconGeneral type="distance" className="fill-hsl-l20" />
                      <p className="font-semibold">{ath.totalDistance.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-hsl-l50 text-sm text-center">No Data to View.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderBoard;