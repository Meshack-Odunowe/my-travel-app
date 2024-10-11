
import CarsList from '@/app/components/CarsList'
import React, { Suspense } from 'react'

const CarDetails = () => {
  return (
    <div className='w-full px-4 sm:px-6 md:px-8 lg:ml-[275px] lg:w-[calc(100%-275px)]'><Suspense fallback={<div>Loading cars...</div>}>
    <CarsList />
  </Suspense></div>
  )
}

export default CarDetails