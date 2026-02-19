import { useTheme } from '../../hooks'
import { Button }   from './Button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      title="Toggle theme"
      style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  )
}
