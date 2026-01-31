'use client'

import React, { ReactNode } from 'react'
import { ThemeToggle } from '../common/ThemeToggle'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * Main layout wrapper component
 * Provides the basic structure for the application
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 min-h-0 overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h1>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden pt-16"> {/* Add padding-top to account for fixed header */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Footer placeholder */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <p>Built with Next.js + AI Template</p>
      </footer>
    </div>
  )
}
