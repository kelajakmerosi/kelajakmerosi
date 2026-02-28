import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

const logoutMock = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isGuest: true,
    logout: logoutMock,
  }),
}))

vi.mock('../../hooks', () => ({
  useLang: () => ({
    t: (key: string) => {
      if (key === 'login') return 'Login'
      if (key === 'dashboard') return 'Dashboard'
      if (key === 'subjects') return 'Subjects'
      if (key === 'profile') return 'Profile'
      return key
    },
  }),
}))

describe('Sidebar guest footer', () => {
  it('shows login CTA for guests and triggers logout flow', () => {
    logoutMock.mockReset()

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar mobileOpen={false} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(screen.queryByText('guestWarning')).toBeNull()

    const loginButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(loginButton)

    expect(logoutMock).toHaveBeenCalledTimes(1)
  })
})
