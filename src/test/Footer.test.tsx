import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../componentes/organismos/Footer";

describe("Componente Footer", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("17. Debe renderizar la información de contacto y enlaces institucionales", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("Clínica NutriVida")).toBeInTheDocument();
    expect(screen.getByText(/Temuco, Región de la Araucanía/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto@nutrivida.cl/i)).toBeInTheDocument();
  });

  test("18. Debe incluir la insignia 'Admin Mode' cuando el usuario activo tiene rol Admin", () => {
    sessionStorage.setItem(
      "sesionNutriVida",
      JSON.stringify({ nombre: "Admin", rol: "Admin" })
    );

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Mode")).toBeInTheDocument();
  });
});