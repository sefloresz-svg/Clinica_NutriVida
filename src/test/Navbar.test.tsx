import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../componentes/organismos/Navbar";

describe("Componente Navbar", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("14. Debe mostrar el botón 'Iniciar Sesión' cuando no hay usuario autenticado", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
  });

  test("15. Debe mostrar el nombre de usuario y el botón 'Cerrar Sesión' cuando existe sesión activa", () => {
    sessionStorage.setItem(
      "sesionNutriVida",
      JSON.stringify({ nombre: "Dra. Carolina Fuentes", rol: "Nutricionista" })
    );

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dra. Carolina Fuentes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar Sesión" })).toBeInTheDocument();
  });

  test("16. Debe mostrar las opciones 'Panel Administración' y 'Console Admin' cuando la sesión pertenece a un Admin", () => {
    sessionStorage.setItem(
      "sesionNutriVida",
      JSON.stringify({ nombre: "Administrador", rol: "Admin" })
    );

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Console Admin")).toBeInTheDocument();
    expect(screen.getByText("Panel Administración")).toBeInTheDocument();
  });
});