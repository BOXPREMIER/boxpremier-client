// src/tests/Navbar.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Создаем мок функции logout
const mockLogout = vi.fn();

// Мокаем authStore
vi.mock('../store/authStore', () => ({
  default: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
    logout: mockLogout,
  }))
}));

import useAuthStore from '../store/authStore';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks();
    
    // По умолчанию пользователь не авторизован
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });
  });

  it('рендерится без ошибок', () => {
    renderNavbar();
    
    // Проверяем наличие логотипов
    const logos = screen.getAllByRole('img');
    expect(logos).toHaveLength(2);
    
    // Проверяем наличие основных ссылок
    expect(screen.getByText('Planes')).toBeInTheDocument();
    expect(screen.getByText('Regala')).toBeInTheDocument();
    expect(screen.getByText('Cajas Anteriores')).toBeInTheDocument();
  });

  it('отображает кнопки для неавторизованного пользователя на десктопе', () => {
    renderNavbar();
    
    // Проверяем десктопное меню
    const desktopNav = screen.getByTestId('desktop-nav');
    expect(desktopNav).toBeInTheDocument();
    
    // В десктопном меню должна быть кнопка Login
    const loginLinks = screen.getAllByText(/login/i);
    expect(loginLinks.length).toBeGreaterThan(0);
    
    // Проверяем, что кнопка Logout отсутствует
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    
    // Мобильное меню закрыто (не должно быть видно)
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });

  it('можно открыть мобильное меню и увидеть LOGIN', () => {
    renderNavbar();
    
    // Находим кнопку открытия мобильного меню
    const menuButton = screen.getByLabelText(/abrir o cerrar menú/i);
    expect(menuButton).toBeInTheDocument();
    
    // Изначально мобильное меню закрыто
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    
    // Открываем мобильное меню
    fireEvent.click(menuButton);
    
    // Проверяем, что мобильное меню открылось
    const mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();
    
    // В мобильном меню должна быть кнопка Login
    const loginLinks = screen.getAllByText(/login/i);
    expect(loginLinks.length).toBeGreaterThan(0);
  });

  it('отображает кнопку Logout для авторизованного пользователя', () => {
    // Мокаем авторизованного пользователя
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: mockLogout,
    });
    
    renderNavbar();
    
    // Проверяем наличие кнопок Logout (в десктопном меню)
    const logoutButtons = screen.getAllByText(/logout/i);
    expect(logoutButtons.length).toBeGreaterThan(0);
    
    // Проверяем отсутствие Login в десктопном меню
    const desktopNav = screen.getByTestId('desktop-nav');
    const loginInDesktop = desktopNav.querySelector('a[href="/login"]');
    expect(loginInDesktop).not.toBeInTheDocument();
  });

  it('вызывает logout при клике на кнопку Logout', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: mockLogout,
    });
    
    renderNavbar();
    
    // Находим кнопку Logout в десктопном меню
    const logoutButton = screen.getAllByText(/logout/i)[0];
    fireEvent.click(logoutButton);
    
    // Проверяем, что функция logout была вызвана
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('закрывает мобильное меню после клика на ссылку', () => {
    renderNavbar();
    
    // Открываем мобильное меню
    const menuButton = screen.getByLabelText(/abrir o cerrar menú/i);
    fireEvent.click(menuButton);
    
    // Проверяем, что меню открыто
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
    
    // Кликаем на ссылку в мобильном меню
    const mobileNav = screen.getByTestId('mobile-nav');
    const planesLink = mobileNav.querySelector('a[href="/planes"]');
    fireEvent.click(planesLink);
    
    // Меню должно закрыться
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });
});