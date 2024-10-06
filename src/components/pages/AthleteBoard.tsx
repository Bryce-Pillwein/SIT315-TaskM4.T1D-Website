// Athlete Board tsx

"use client";

import AthleteDetails from "../AthleteDetails";
import AthleteList from "../AthleteList";
import Charts from "../Charts";



const AthleteBoard = () => {

  return (
    <div className="flex flex-col flex-grow flex-shrink-0">
      <div className="grid grid-cols-5 gap-x-4 h-full">
        <div className="col-span-1">
          <AthleteDetails />
        </div>

        <div className="col-span-3">
          <Charts />
        </div>

        <div className="col-span-1">
          <AthleteList />
        </div>
      </div>
    </div>
  );
};

export default AthleteBoard;