import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardServicio from "../componentes/moleculas/CardServicio";
import type { Servicio } from "../utils/tipos";

// Servicio de ejemplo (igual a uno de los datos iniciales del back)
const servicio: Servicio = {
  id: 1,
  codigo: "CN001",
  titulo: "Consulta Nutricional Integral",
  tipo: "Consulta",
  duracion: "50 min",
  modalidad: "Presencial",
  precio: 35000,
  activo: true,
};

describe("Componente CardServicio", () => {
  test("25. Debe mostrar los datos del servicio que llegan por props", () => {
    render(
      <CardServicio servicio={servicio} esAdmin={false} esNutri={false}
        alEditar={vi.fn()} alEliminar={vi.fn()} alReservar={vi.fn()} />
    );

    expect(screen.getByText("Consulta Nutricional Integral")).toBeInTheDocument();
    expect(screen.getByText(/CN001/)).toBeInTheDocument();
    expect(screen.getByText("$35.000")).toBeInTheDocument();
  });

  test("26. Un paciente debe poder reservar: se llama a alReservar con el id", async () => {
    const alReservar = vi.fn();
    render(
      <CardServicio servicio={servicio} esAdmin={false} esNutri={false}
        alEditar={vi.fn()} alEliminar={vi.fn()} alReservar={alReservar} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Reservar este servicio" }));
    expect(alReservar).toHaveBeenCalledWith(1);
  });

  test("27. El Admin ve Editar y Eliminar, y cada botón llama a su función", async () => {
    const alEditar = vi.fn();
    const alEliminar = vi.fn();
    render(
      <CardServicio servicio={servicio} esAdmin={true} esNutri={false}
        alEditar={alEditar} alEliminar={alEliminar} alReservar={vi.fn()} />
    );

    expect(screen.queryByRole("button", { name: "Reservar este servicio" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Editar Arancel" }));
    expect(alEditar).toHaveBeenCalledWith(servicio);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(alEliminar).toHaveBeenCalledWith(1);
  });
});
