import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";

describe("Componente CampoFormulario", () => {
  test("12. Debe mostrar la etiqueta label y renderizar el input con sus atributos", () => {
    render(
      <CampoFormulario
        etiqueta="Correo Electrónico"
        tipo="email"
        nombre="correo"
        valor="paciente@correo.cl"
        placeholder="Ingrese su correo"
        alCambiar={() => {}}
      />
    );

    expect(screen.getByText("Correo Electrónico")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Ingrese su correo");
    expect(input).toHaveValue("paciente@correo.cl");
    expect(input).toHaveAttribute("type", "email");
  });

  test("13. Debe propagar los cambios del usuario hacia la función callback alCambiar", async () => {
    const alCambiarMock = vi.fn();
    render(
      <CampoFormulario
        etiqueta="Nombre"
        tipo="text"
        nombre="nombre"
        valor=""
        placeholder="Ingrese su nombre"
        alCambiar={alCambiarMock}
      />
    );

    await userEvent.type(screen.getByPlaceholderText("Ingrese su nombre"), "Carlos");
    expect(alCambiarMock).toHaveBeenCalled();
  });
});