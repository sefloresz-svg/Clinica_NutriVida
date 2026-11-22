import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeEstado from "../componentes/atomos/BadgeEstado";

describe("Componente BadgeEstado", () => {
  test("22. Debe mostrar el estado recibido por props", () => {
    render(<BadgeEstado estado="Confirmada" />);
    expect(screen.getByText("Confirmada")).toBeInTheDocument();
  });

  test("23. Debe aplicar el color correcto según el estado", () => {
    render(
      <>
        <BadgeEstado estado="Confirmada" />
        <BadgeEstado estado="Atendida" />
        <BadgeEstado estado="Cancelada" />
        <BadgeEstado estado="Pendiente" />
      </>
    );

    expect(screen.getByText("Confirmada")).toHaveClass("badge", "bg-success");
    expect(screen.getByText("Atendida")).toHaveClass("bg-primary");
    expect(screen.getByText("Cancelada")).toHaveClass("bg-secondary");
    expect(screen.getByText("Pendiente")).toHaveClass("bg-warning", "text-dark");
  });

  test("24. Debe agregar las clases extra que llegan en 'clase'", () => {
    render(<BadgeEstado estado="Pendiente" clase="mb-1" />);
    expect(screen.getByText("Pendiente")).toHaveClass("mb-1");
  });
});
