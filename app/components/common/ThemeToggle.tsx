'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { Button } from '../ui/Button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently using system preference, switch to either light or dark explicitly
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      // Otherwise toggle between light/dark/system
      setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')
    }
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  
  const icon = currentTheme === 'dark' ? (
    <SunIcon className="h-5 w-5" />
  ) : (
    <MoonIcon className="h-5 w-5" />
  )

  const label = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Button 
      variant="ghost" 
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="p-2"
    >
      {icon}
    </Button>
  )
}