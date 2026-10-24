import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FormularioLogin from "../componentes/organismos/FormularioLogin";

describe("Componente FormularioLogin", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("19. Debe mostrar alerta si se intenta ingresar con campos vacíos", async () => {
    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    expect(window.alert).toHaveBeenCalledWith("Por favor, ingrese su correo y contraseña.");
  });

  test("20. Debe autenticar correctamente y guardar datos en sessionStorage con credenciales válidas", async () => {
    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const inputCorreo = inputs[0];
    const inputClave = screen.getByPlaceholderText("••••••••");

    await userEvent.type(inputCorreo, "admin@nutrivida.cl");
    await userEvent.type(inputClave, "1234");

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    const sesionAlmacenada = JSON.parse(sessionStorage.getItem("sesionNutriVida") || "{}");
    expect(sesionAlmacenada.correo).toBe("admin@nutrivida.cl");
    expect(sesionAlmacenada.rol).toBe("Admin");
  });

  test("21. Debe mostrar alerta de error cuando las credenciales son incorrectas", async () => {
    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const inputCorreo = inputs[0];
    const inputClave = screen.getByPlaceholderText("••••••••");

    await userEvent.type(inputCorreo, "usuario@inexistente.cl");
    await userEvent.type(inputClave, "0000");

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    expect(window.alert).toHaveBeenCalledWith("Correo o contraseña incorrectos.");
  });
});