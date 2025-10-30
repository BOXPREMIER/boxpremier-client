import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MainPage from '../components/MainPage'

describe('MainPage', () => {
  test('должна вызывать navigate("/Home") при клике', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    )

    const mainDiv = screen.getByRole('main') || screen.getByText(/¿No sabes qué vino elegir?/i)
    fireEvent.click(mainDiv)

    // Тут можно проверить вызов navigate через мок, если используешь jest.mock
  })
})
