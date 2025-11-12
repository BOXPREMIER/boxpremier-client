import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import NavBar from "../components/NavBar";

// Мокаем Zustand store
vi.mock("../store/authStore", () => ({
  __esModule: true,
  default: vi.fn((selector) =>
    selector({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    })
  ),
}));

import useAuthStore from "../store/authStore";

describe("🧭 NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la navegación para un usuario no autorizado (escritorio)", () => {
    useAuthStore.mockImplementation((selector) =>
      selector({ isAuthenticated: false, user: null, logout: vi.fn() })
    );

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByTestId("link-home")).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("muestra la navegación para un usuario autorizado (escritorio)", () => {
    useAuthStore.mockImplementation((selector) =>
      selector({
        isAuthenticated: true,
        user: { name: "Larysa" },
        logout: vi.fn(),
      })
    );

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Larysa/i)).toBeInTheDocument();
  });

});
