import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// мок состояния авторизации
vi.mock("../store/authStore", () => ({
  default: () => ({
    isAuthenticated: false, // меняй на true для теста авторизованного состояния
    user: null,
  }),
}));

describe("Navbar", () => {
  test("рендерится без ошибок", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // проверка, что логотип есть
    expect(screen.getByAltText("Vino Premier")).toBeInTheDocument();
  });

  test("отображает кнопки для неавторизованного пользователя", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // пример проверки: есть кнопка входа
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  // пример теста клика по меню для мобилки
  test("можно открыть мобильное меню", () => {
    render(
      <MemoryRouter>
        <Navbar isMobile={true} />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText("Toggle Menu");
    if (menuButton) {
      fireEvent.click(menuButton);
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    }
  });
});
