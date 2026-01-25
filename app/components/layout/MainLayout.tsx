'use client'

import React, { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * Main layout wrapper component
 * Provides the basic structure for the application
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-white min-h-0 overflow-hidden">
      {/* Sidebar placeholder - customize for your needs */}
      {/* <Sidebar /> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Footer placeholder */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-gray-100 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500">
        <p>Built with Next.js + AI Template</p>
      </footer>
    </div>
  )
}
