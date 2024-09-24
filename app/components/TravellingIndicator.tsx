import React from "react";

function TravellingIndicator() {
  return (
    <div className=" flex items-center justify-center gap-12 mb-8 ">
      <div className=" flex items-center justify-center gap-4">
        <div className="rounded-full size-[40px] bg-[#0153AF]"></div>
        <p>Moving</p>
      </div>
      <div className=" flex items-center justify-center gap-4">
        <div className="rounded-full size-[40px] bg-[#FF0D0D]"></div>
        <p>Stopped</p>
      </div>
      <div className=" flex items-center justify-center gap-4">
        <div
          className="rounded-full size-[40px] bg-[#29FF0D]"></div>
        <p>Arrived</p>
      </div>
      <div className=" flex items-center justify-center gap-4">
        <div className="rounded-full size-[40px] bg-black"></div>
        <p>Wrong route</p>
      </div>
    </div>
  );
}

export default TravellingIndicator;
