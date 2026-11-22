import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalFichaClinica from "../componentes/organismos/ModalFichaClinica";
import type { Cita } from "../utils/tipos";

const atencion: Cita = {
  id: 1,
  idPaciente: 7,
  nombrePaciente: "Halam Dupre",
  rutPaciente: "11111111-1",
  idNutricionista: 1,
  nombreNutricionista: "Carolina Fuentes M.",
  idServicio: 1,
  nombreServicio: "Consulta Nutricional Integral",
  fecha: "2026-11-20",
  hora: "09:00:00",
  motivo: "Control mensual",
  precio: 35000,
  estado: "Confirmada",
};

// Props comunes: los valores de la ficha y funciones simuladas con vi.fn()
const crearProps = (esNutri: boolean) => ({
  atencion: atencion,
  peso: "78.5",
  estatura: "1.72",
  diagnostico: "Baja de peso progresiva.",
  esNutri: esNutri,
  enviando: false,
  alCambiarPeso: vi.fn(),
  alCambiarEstatura: vi.fn(),
  alCambiarDiagnostico: vi.fn(),
  alGuardar: vi.fn(),
  alCerrar: vi.fn(),
});

describe("Componente ModalFichaClinica", () => {
  test("32. Debe mostrar los datos del paciente y de la ficha que llegan por props", () => {
    render(<ModalFichaClinica {...crearProps(true)} />);

    expect(screen.getByText("Ficha Clínica: Halam Dupre")).toBeInTheDocument();
    expect(screen.getByText("RUT: 11111111-1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("78.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1.72")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Baja de peso progresiva.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Control mensual")).toBeInTheDocument();
  });

  test("33. El nutricionista puede guardar y escribir: se llaman alGuardar y alCambiarDiagnostico", async () => {
    const props = crearProps(true);
    render(<ModalFichaClinica {...props} />);

    await userEvent.type(screen.getByDisplayValue("Baja de peso progresiva."), "!");
    expect(props.alCambiarDiagnostico).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));
    expect(props.alGuardar).toHaveBeenCalledTimes(1);
  });

  test("34. El Admin solo puede ver: campos bloqueados, sin botón Guardar, y Cerrar llama a alCerrar", async () => {
    const props = crearProps(false);
    render(<ModalFichaClinica {...props} />);

    expect(screen.getByDisplayValue("78.5")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Guardar Cambios" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(props.alCerrar).toHaveBeenCalledTimes(1);
  });
});
