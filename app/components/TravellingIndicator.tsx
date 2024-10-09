import React from "react";

function TravellingIndicator() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#0153AF]"></div>
        <p className="text-sm sm:text-base">Moving</p>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FF0D0D]"></div>
        <p className="text-sm sm:text-base">Stopped</p>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#29FF0D]"></div>
        <p className="text-sm sm:text-base">Arrived</p>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className="rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-black"></div>
        <p className="text-sm sm:text-base">Wrong route</p>
      </div>
    </div>
  );
}

export default TravellingIndicator;