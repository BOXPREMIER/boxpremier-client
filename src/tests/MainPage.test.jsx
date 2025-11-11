import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Мокаем useNavigate до импорта MainPage
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import MainPage from '../pages/MainPage';

describe('MainPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear(); // очищаем мок перед каждым тестом
  });

  it('рендерится без ошибок и отображает основные элементы', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    expect(screen.getByText('¿No sabes qué vino elegir?')).toBeInTheDocument();
    expect(screen.getByText('Elige')).toBeInTheDocument();
    expect(screen.getByAltText('Box Premier Logo')).toBeInTheDocument();
    expect(screen.getByText('¡Haz clic y déjanos sorprenderte!')).toBeInTheDocument();
  });

  it('нажимает на страницу и вызывает navigate', () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    // Клик по контейнеру
    fireEvent.click(screen.getByText('¿No sabes qué vino elegir?').closest('div'));

    expect(mockNavigate).toHaveBeenCalledWith('/Home');
  });
});
