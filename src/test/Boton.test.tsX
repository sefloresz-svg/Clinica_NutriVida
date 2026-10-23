import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Boton from "../componentes/atomos/Boton";

describe("Componente Boton", () => {
  test("6. Debe renderizar el texto recibido y aplicar tipo 'button' y clases por defecto", () => {
    render(<Boton texto="Agendar cita" />);

    const boton = screen.getByRole("button", { name: "Agendar cita" });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveAttribute("type", "button");
    expect(boton).toHaveClass("btn", "btn-primary");
  });

  test("7. Debe aplicar el tipo y las clases personalizadas pasadas por props", () => {
    render(<Boton texto="Enviar" tipo="submit" clase="btn btn-danger" />);

    const boton = screen.getByRole("button", { name: "Enviar" });
    expect(boton).toHaveAttribute("type", "submit");
    expect(boton).toHaveClass("btn-danger");
  });

  test("8. Debe ejecutar la función onClick al hacer clic", async () => {
    const onClickMock = vi.fn();
    render(<Boton texto="Guardar" onClick={onClickMock} />);

    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});