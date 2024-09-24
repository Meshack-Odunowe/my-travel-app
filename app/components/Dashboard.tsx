import React from "react";
import TopNav from "./TopNav";
import TravellingIndicator from "./TravellingIndicator";
import FleetEngineMap from "./FleetEngineMap";

const Dashboard = () => {
  return (
    <div className=" p-4">
      {" "}
      <TopNav />
      <TravellingIndicator />
      <FleetEngineMap />
    </div>
  );
};

export default Dashboard;
