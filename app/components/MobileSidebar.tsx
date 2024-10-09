'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavLink {
  id: number
  label: string
  icon: string
  link: string
}

const menu: NavLink[] = [
  {id: 1, label: "Home", icon:'/home.svg', link: "/"},
  {id: 2, label: "Drivers", icon: '/account.svg', link: "/drivers"},
  {id: 3, label: "Cars", icon: '/car.svg', link: "/cars"},
  {id: 4, label: "Schedule", icon: '/calendar-2.svg', link: "/schedule"},
  {id: 5, label: "Backup", icon: '/Data.svg', link: "/backup"},
  {id: 6, label: "Settings", icon: '/Setting.svg', link: "/settings"},
  {id: 7, label: "Log out", icon: '/shut-down.svg', link: "/sign-out"},
]

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-full shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      ></div>

      <div 
        className={`fixed top-0 left-0 w-72 h-full bg-white z-50 transform transition-all duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-3">
              <Image src={'/logo.svg'} width={150} height={150} alt='Travel Company Logo' />
            </div>
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
            {menu.map((link) => {
              const isActive = pathname === link.link || pathname.startsWith(`${link.link}/`)
              return (
                <Link 
                  href={link.link} 
                  key={link.id} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={toggleSidebar}
                >
                  <Image src={link.icon} width={20} height={20} alt={link.label} className="opacity-75" />
                  <span className='text-sm font-medium'>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileSidebar