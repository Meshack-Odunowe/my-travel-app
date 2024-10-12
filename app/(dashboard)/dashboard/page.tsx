import React from 'react'
import Dashboard from '../../components/Dashboard'
import Greeting from '@/app/components/Greeting'

const UserDashboard = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:ml-[275px] lg:w-[calc(100%-275px)]"><Greeting/>
      <Dashboard />
    </div>
  )
}

export default UserDashboard