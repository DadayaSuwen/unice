'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)

      if (!desktop) {
        setIsCollapsed(false)
        setIsMobileMenuOpen(false)
      } else {
        setIsMobileMenuOpen(false)
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    const mainContent = document.getElementById('admin-main-content')
    if (mainContent && isDesktop) {
      if (isCollapsed) {
        mainContent.style.marginLeft = '4rem'
      } else {
        mainContent.style.marginLeft = '16rem'
      }
    }
  }, [isCollapsed, isDesktop])

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setIsCollapsed(!isCollapsed)
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuItemClick = () => {
    if (!isDesktop) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleMobileMenuToggle}
        />
      )}

      <div className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
                      ${isCollapsed ? 'w-16' : 'w-64'}
                      ${!isDesktop ? '-translate-x-full' : 'translate-x-0'}
                      ${isMobileMenuOpen && !isDesktop ? 'translate-x-0' : ''}`}>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleSidebarToggle}
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuItemClick={handleMobileMenuItemClick}
        />
      </div>
    </>
  )
}