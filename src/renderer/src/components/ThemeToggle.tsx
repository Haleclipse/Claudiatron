import { type ReactNode } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes: Array<{
    value: Theme
    label: string
    icon: ReactNode
  }> = [
    { value: 'light', label: '浅色', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: '深色', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: '跟随系统', icon: <Monitor className="h-4 w-4" /> }
  ]

  const currentTheme = themes.find((t) => t.value === theme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" aria-label="切换主题">
          {currentTheme?.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className={`cursor-pointer ${theme === item.value ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center gap-2 w-full">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
