'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const Sidebar = () => {
  const menu = [
    {id: 1, label: "Home", icon:'/home.svg', link: "/"},
    {id: 2, label: "Drivers", icon: 'account.svg', link: "/drivers"},
    {id: 3, label: "Cars", icon: '/car.svg', link: "/cars"},
    {id: 4, label: "Schedule", icon: 'calendar-2.svg', link: "/schedule"},
    {id: 5, label: "Backup", icon: 'Data.svg', link: "/backup"},
    {id: 6, label: "Settings", icon: 'Setting.svg', link: "/settings"},
    {id: 7, label: "Log out", icon: 'shut-down.svg', link: "/sign-out"},
  ]
  const pathname = usePathname()

  return (
    <div className='mx-auto hidden text-center w-full lg:w-[275px] lg:flex flex-col items-center bg-white h-screen fixed'>
      <div className="flex mx-auto items-center justify-center mt-[55px] mb-[77px]">
        <Image src={'/logo.svg'} width={150} height={150} alt='logo' />
      </div>
      <div>
        {menu.map(link => {
          const isActive = pathname === link.link || pathname.startsWith(`${link.link}/`)
          return (
            <Link 
              href={link.link} 
              key={link.label} 
              className={`flex gap-4 items-center p-4 rounded-lg justify-start ${isActive ? 'bg-blue-1' : ''}`}
            >
              <Image src={link.icon} width={24} height={24} alt={link.label}/>
              <p className='text-[16px] font-[400] max-lg:hidden'>{link.label}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar