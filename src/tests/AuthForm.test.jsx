import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import AuthForm from "../components/AuthForm";
import * as AuthServices from "../services/AuthServices";
import useAuthStore from "../store/authStore";
import { showCustomAlert } from "../components/CustomAlert";

// Мокаем зависимости
const mockNavigate = vi.fn();
const mockSetToken = vi.fn();
const mockSetUser = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()],
  };
});

vi.mock("../services/AuthServices", () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  default: vi.fn(() => ({
    setToken: mockSetToken,
    setUser: mockSetUser,
  })),
}));

vi.mock("../components/CustomAlert", () => ({
  showCustomAlert: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockClear();
  mockSetToken.mockClear();
  mockSetUser.mockClear();
});

const renderAuthForm = (mode = "login") => {
  return render(
    <BrowserRouter>
      <AuthForm mode={mode} />
    </BrowserRouter>
  );
};

describe("AuthForm - Login Mode", () => {
  it("отображает форму входа с правильными полями", () => {
    renderAuthForm("login");
    
    expect(screen.getByText("Bienvenido de vuelta")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("не показывает поля для регистрации", () => {
    renderAuthForm("login");
    
    expect(screen.queryByPlaceholderText("Nombre")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Apellido")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Confirm Password")).not.toBeInTheDocument();
  });

  it("показывает ошибку при невалидном email", async () => {
    renderAuthForm("login");
    
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    
    // Используем email без @, чтобы не пройти regex валидацию
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    // Находим форму и отправляем её напрямую, обходя встроенную валидацию браузера
    const form = emailInput.closest("form");
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeInTheDocument();
    });
  });

  it("показывает ошибку при короткой пароле", async () => {
    renderAuthForm("login");
    
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText("Mínimo 6 caracteres")).toBeInTheDocument();
    });
  });

  it("успешно логинит пользователя", async () => {
    const mockResponse = {
      token: "test-token",
      user: { id: 1, email: "test@test.com", userType: "user" },
    };
    
    AuthServices.login.mockResolvedValue(mockResponse);
    
    renderAuthForm("login");
    
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(AuthServices.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockSetToken).toHaveBeenCalledWith("test-token");
      expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user);
      expect(mockNavigate).toHaveBeenCalledWith("/app/home", { replace: true });
    });
  });

  it("перенаправляет админа на admin dashboard", async () => {
    const mockResponse = {
      token: "admin-token",
      user: { id: 1, email: "admin@test.com", userType: "admin" },
    };
    
    AuthServices.login.mockResolvedValue(mockResponse);
    
    renderAuthForm("login");
    
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", { replace: true });
    });
  });

  it("обрабатывает ошибку входа", async () => {
    AuthServices.login.mockRejectedValue(
      new Error("Credenciales inválidas")
    );
    
    renderAuthForm("login");
    
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(showCustomAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          text: "Credenciales inválidas",
          type: "error",
        })
      );
    });
  });
});

describe("AuthForm - Register Mode", () => {
  it("отображает форму регистрации с всеми полями", () => {
    renderAuthForm("register");
    
    expect(screen.getByText("Crea tu cuenta")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Apellido")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("валидирует обязательные поля регистрации", async () => {
    renderAuthForm("register");
    
    const submitBtn = screen.getByRole("button", { name: /crear cuenta/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText("Nombre requerido")).toBeInTheDocument();
      expect(screen.getByText("Apellido requerido")).toBeInTheDocument();
    });
  });

  it("проверяет совпадение паролей", async () => {
    renderAuthForm("register");
    
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "different123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));
    
    await waitFor(() => {
      expect(screen.getByText("No coincide")).toBeInTheDocument();
    });
  });

  it("успешно регистрирует пользователя", async () => {
    const mockResponse = {
      token: "new-token",
      user: { id: 2, email: "new@test.com", userType: "user" },
    };
    
    AuthServices.register.mockResolvedValue(mockResponse);
    
    renderAuthForm("register");
    
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));
    
    await waitFor(() => {
      expect(AuthServices.register).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "new@test.com",
        password: "password123",
      });
      expect(mockSetToken).toHaveBeenCalledWith("new-token");
      expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user);
    });
  });

  it("блокирует кнопку во время отправки", async () => {
    AuthServices.register.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    
    renderAuthForm("register");
    
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });
    
    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);
    
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent("Procesando…");
  });
});

describe("AuthForm - Navigation", () => {
  it("показывает ссылку на регистрацию в режиме логина", () => {
    renderAuthForm("login");
    
    const link = screen.getByText("Crea tu cuenta");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", expect.stringContaining("/register"));
  });

  it("показывает ссылку на логин в режиме регистрации", () => {
    renderAuthForm("register");
    
    const link = screen.getByText("Inicia sesión");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", expect.stringContaining("/login"));
  });
});