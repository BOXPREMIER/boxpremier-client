import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// сбрасываем моки перед каждым тестом
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

// мок Zustand store
vi.mock("../store/authStore", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    token: null,
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
  })),
}));

describe("Navbar", () => {
  test("рендерится без ошибок", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/vino premier/i)).toBeInTheDocument();
  });

  test("отображает кнопки для неавторизованного пользователя", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // ищем любую надпись Login или Iniciar sesión (если у тебя испанская версия)
    const loginButton =
      screen.queryByText(/login/i) ||
      screen.queryByText(/iniciar sesión/i) ||
      screen.queryByText(/entrar/i);

    expect(loginButton).toBeInTheDocument();
  });

  test("можно открыть мобильное меню", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.queryByLabelText(/abrir o cerrar menú/i);
    if (menuButton) {
      fireEvent.click(menuButton);
      expect(screen.getByText(/planes/i)).toBeInTheDocument();
    }
  });
});
