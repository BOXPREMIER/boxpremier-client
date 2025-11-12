import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import AuthForm from "../components/AuthForm";
import * as AuthServices from "../services/AuthServices";
import useAuthStore from "../store/authStore";
import { MemoryRouter } from "react-router-dom";

// моки
vi.mock("../store/authStore", () => ({
  default: () => ({
    setToken: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.mock("../services/AuthServices", () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../components/CustomAlert", () => ({
  showCustomAlert: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [{ get: () => null }],
  };
});

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form by default", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenido de vuelta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it("renders registration form when mode='register'", () => {
    render(
      <MemoryRouter>
        <AuthForm mode="register" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Crea tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
  });

  it("validates empty login fields", async () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it("calls login on valid input", async () => {
    AuthServices.login.mockResolvedValue({
      token: "abc",
      user: { userType: "user" },
    });

    const { setToken, setUser } = useAuthStore();

    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    await waitFor(() => {
      expect(AuthServices.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "123456",
      });
      expect(setToken).toHaveBeenCalledWith("abc");
      expect(setUser).toHaveBeenCalledWith({ userType: "user" });
      expect(mockNavigate).toHaveBeenCalledWith("/app/home", { replace: true });
    });
  });

  it("calls register on valid input", async () => {
    AuthServices.register.mockResolvedValue({
      token: "abc",
      user: { userType: "user" },
    });

    const { setToken, setUser } = useAuthStore();

    render(
      <MemoryRouter>
        <AuthForm mode="register" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/Calle/i), { target: { value: "Street 1" } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Código Postal/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: "Madrid" } });
    fireEvent.change(screen.getByLabelText(/Provincia/i), { target: { value: "Madrid" } });

    fireEvent.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(AuthServices.register).toHaveBeenCalled();
      expect(setToken).toHaveBeenCalledWith("abc");
      expect(setUser).toHaveBeenCalledWith({ userType: "user" });
      expect(mockNavigate).toHaveBeenCalledWith("/app/home", { replace: true });
    });
  });
});
