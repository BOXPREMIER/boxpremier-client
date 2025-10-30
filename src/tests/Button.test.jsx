import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Button from "../components/Button.jsx"; // путь поправь, если нужно
import { describe, it, expect, vi } from "vitest";

describe("Button component", () => {
  it("renders button with correct title", () => {
    render(<Button title="Click me" data-testid="my-button" />);
    const button = screen.getByTestId("my-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("calls action when clicked and shows loading state", async () => {
    const mockAction = vi.fn().mockResolvedValue("success");
    render(<Button title="Submit" action={mockAction} data-testid="my-button" />);
    const button = screen.getByTestId("my-button");

    // кнопка изначально активна
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("Submit");

    // кликаем по кнопке
    fireEvent.click(button);

    // после клика должно быть состояние loading
    expect(button).toHaveTextContent("Cargando...");
    expect(button).toBeDisabled();

    // ждём вызова async action
    await waitFor(() => expect(mockAction).toHaveBeenCalledTimes(1));

    // после завершения loading пропадает
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(button).toHaveTextContent("Submit");
  });

  it("does not crash if action is not provided", () => {
    render(<Button title="No action" data-testid="my-button" />);
    const button = screen.getByTestId("my-button");

    // клик просто не должен вызывать ошибку
    fireEvent.click(button);
    expect(button).toHaveTextContent("No action");
  });
});
