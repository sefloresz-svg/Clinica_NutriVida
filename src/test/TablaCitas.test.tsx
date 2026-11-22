import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TablaCitas from "../componentes/organismos/TablaCitas";
import type { Cita } from "../utils/tipos";

// Cita de ejemplo en una fecha futura (se puede cancelar)
const citaFutura: Cita = {
  id: 10,
  idPaciente: 6,
  nombrePaciente: "Juan Pérez",
  rutPaciente: "12345678-5",
  idNutricionista: 1,
  nombreNutricionista: "Carolina Fuentes M.",
  idServicio: 1,
  nombreServicio: "Consulta Nutricional Integral",
  fecha: "2099-11-20",
  hora: "09:00:00",
  motivo: null,
  precio: 35000,
  estado: "Pendiente",
};

describe("Componente TablaCitas", () => {
  test("28. Debe mostrar un mensaje cuando no hay citas", () => {
    render(<TablaCitas citas={[]} alCancelar={vi.fn()} />);
    expect(screen.getByText("No tienes citas agendadas actualmente.")).toBeInTheDocument();
  });

  test("29. Debe mostrar los datos de cada cita que llega por props", () => {
    render(<TablaCitas citas={[citaFutura]} alCancelar={vi.fn()} />);

    expect(screen.getByText("Consulta Nutricional Integral")).toBeInTheDocument();
    expect(screen.getByText("09:00 hrs")).toBeInTheDocument();
    expect(screen.getByText(/Carolina Fuentes M\./)).toBeInTheDocument();
    expect(screen.getByText("$35.000")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  test("30. Al hacer clic en Cancelar se llama a alCancelar con la cita", async () => {
    const alCancelar = vi.fn();
    render(<TablaCitas citas={[citaFutura]} alCancelar={alCancelar} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(alCancelar).toHaveBeenCalledWith(citaFutura);
  });

  test("31. No debe mostrar Cancelar en una cita que ya pasó ni en una cancelada", () => {
    const citaPasada = { ...citaFutura, id: 11, fecha: "2020-01-10" };
    const citaCancelada = { ...citaFutura, id: 12, estado: "Cancelada" };
    render(<TablaCitas citas={[citaPasada, citaCancelada]} alCancelar={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
  });
});
