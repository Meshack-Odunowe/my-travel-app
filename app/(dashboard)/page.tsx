import React from "react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <main className="lg:ml-[275px] w-[calc(100%-275px)] justify-between ">
      <div>
        <Dashboard />
      </div>
    </main>
  );
}
