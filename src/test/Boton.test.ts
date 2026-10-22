import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Boton from "../componentes/atomos/Boton";

describe("Componente Boton", () => {
  test("Debe renderizar el texto recibido y usar type='button' y clase por defecto", () => {
    render(<Boton texto="Agendar cita" />);

    const boton = screen.getByRole("button", { name: "Agendar cita" });
    expect(boton).toBeInTheDocument();

    expect(boton).toHaveAttribute("type", "button");

    expect(boton).toHaveClass("btn", "btn-primary");
  });

  test("Debe aplicar el tipo y la clase personalizados recibidos por props", () => {
    render(<Boton texto="Enviar" tipo="submit" clase="btn btn-danger" />);

    const boton = screen.getByRole("button", { name: "Enviar" });
    
    expect(boton).toHaveAttribute("type", "submit");

    expect(boton).toHaveClass("btn-danger");

  });

  test("Debe ejecutar onClick una vez al hacer clic", async () => {
    const onClick = vi.fn();
    render(<Boton texto="Guardar" onClick={onClick} />);

    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});