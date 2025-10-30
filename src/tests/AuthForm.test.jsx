import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthForm from '../components/AuthForm'

describe('AuthForm', () => {
  test('рендерится без ошибок', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('можно вводить данные и кликать кнопку', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button'))
  })
})

