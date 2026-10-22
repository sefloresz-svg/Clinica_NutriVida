import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";

describe("Componente CampoFormulario", () => {
  test("Debe mostrar la etiqueta, el valor y el placeholder recibidos", () => {
    render(
      createElement(CampoFormulario, {
        etiqueta: "Correo",
        tipo: "email",
        nombre: "correo",
        valor: "ana@correo.cl",
        placeholder: "Ingrese su correo",
        alCambiar: () => {},
      })
    );

    expect(screen.getByText("Correo")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Ingrese su correo");
    expect(input).toHaveValue("ana@correo.cl");
    expect(input).toHaveAttribute("type", "email");
  });

  test("Debe llamar a alCambiar con el valor escrito por el usuario", async () => {
    const alCambiar = vi.fn();
    render(
      createElement(CampoFormulario, {
        etiqueta: "Nombre",
        tipo: "text",
        nombre: "nombre",
        valor: "",
        placeholder: "Ingrese su nombre",
        alCambiar,
      })
    );

    await userEvent.type(screen.getByPlaceholderText("Ingrese su nombre"), "A");

    expect(alCambiar).toHaveBeenCalledTimes(1);
    expect(alCambiar).toHaveBeenCalledWith("A");
  });
});