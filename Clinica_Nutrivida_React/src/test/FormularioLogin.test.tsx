import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FormularioLogin from "../componentes/organismos/FormularioLogin";

// Ahora el login lo responde el back, así que en los tests se simula fetch con vi.fn()
const simularRespuesta = (ok: boolean, status: number, cuerpo: object) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: ok,
    status: status,
    json: () => Promise.resolve(cuerpo),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("Componente FormularioLogin", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("19. Debe mostrar alerta si se intenta ingresar con campos vacíos", async () => {
    const fetchMock = simularRespuesta(true, 200, {});
    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    expect(window.alert).toHaveBeenCalledWith("Por favor, ingrese su correo y contraseña.");
    // Con campos vacíos ni siquiera se llama al back
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("20. Debe autenticar correctamente y guardar el usuario del back en localStorage", async () => {
    const fetchMock = simularRespuesta(true, 200, {
      id: 1,
      nombre: "Administrador General",
      rut: null,
      correo: "admin@nutrivida.cl",
      rol: "Admin",
      activo: true,
    });

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const inputCorreo = inputs[0];
    const inputClave = screen.getByPlaceholderText("••••••••");

    await userEvent.type(inputCorreo, "admin@nutrivida.cl");
    await userEvent.type(inputClave, "Admin1234");

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    // Se llamó al gateway con el correo y la contraseña
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/usuarios/login",
      expect.objectContaining({ method: "POST" })
    );

    await waitFor(() => {
      const sesionAlmacenada = JSON.parse(localStorage.getItem("sesionNutriVida") || "{}");
      expect(sesionAlmacenada.correo).toBe("admin@nutrivida.cl");
      expect(sesionAlmacenada.rol).toBe("Admin");
      expect(sesionAlmacenada.id).toBe(1);
    });
  });

  test("21. Debe mostrar alerta de error cuando las credenciales son incorrectas", async () => {
    // El back responde 401 con el mensaje en "message"
    simularRespuesta(false, 401, { message: "Correo o contraseña incorrectos." });

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const inputCorreo = inputs[0];
    const inputClave = screen.getByPlaceholderText("••••••••");

    await userEvent.type(inputCorreo, "usuario@inexistente.cl");
    await userEvent.type(inputClave, "00000000");

    const botonIngresar = screen.getByRole("button", { name: "Ingresar" });
    await userEvent.click(botonIngresar);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Correo o contraseña incorrectos.");
    });
    expect(localStorage.getItem("sesionNutriVida")).toBeNull();
  });
});
