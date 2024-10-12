
import React from "react"
import TopNav from "./TopNav"
import TravellingIndicator from "./TravellingIndicator"
import FleetEngineMap from "./FleetEngineMap"


const Dashboard: React.FC = () => {
  return (
    <div className="p-2">
      <TopNav />
      
      <TravellingIndicator />
      <FleetEngineMap />
    </div>
  )
}

export default Dashboard