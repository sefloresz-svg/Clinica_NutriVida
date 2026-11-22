import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../componentes/atomos/Input";

describe("Componente Input", () => {
  test("9. Debe renderizar los atributos correctos tipo, nombre, valor y placeholder", () => {
    render(
      <Input
        tipo="text"
        nombre="usuario"
        valor="Juan"
        placeholder="Nombre completo"
        alCambiar={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("Nombre completo");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Juan");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "usuario");
  });

  test("10. Debe disparar el evento alCambiar al escribir texto", async () => {
    const alCambiarMock = vi.fn();
    render(
      <Input
        tipo="email"
        nombre="correo"
        valor=""
        placeholder="correo@ejemplo.com"
        alCambiar={alCambiarMock}
      />
    );

    const input = screen.getByPlaceholderText("correo@ejemplo.com");
    await userEvent.type(input, "a");

    expect(alCambiarMock).toHaveBeenCalledTimes(1);
    expect(alCambiarMock).toHaveBeenCalledWith("a");
  });

  test("11. Debe tener la clase Bootstrap 'form-control'", () => {
    render(
      <Input
        tipo="text"
        nombre="campo"
        valor="Valor"
        alCambiar={() => {}}
      />
    );

    const input = screen.getByDisplayValue("Valor");
    expect(input).toHaveClass("form-control");
  });
});