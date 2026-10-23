import { describe, test, expect } from "vitest";
import { validarRutChileno } from "../paginas/Agendar";

describe("Validación de RUT Chileno (validarRutChileno)", () => {
  test("1. Debe retornar true para un RUT válido con dígito numérico", () => {
    expect(validarRutChileno("12345678-5")).toBe(true);
  });

  test("2. Debe retornar true para un RUT válido con dígito verificador K", () => {
    expect(validarRutChileno("11111111-K")).toBe(true);
  });

  test("3. Debe retornar false para un RUT con dígito verificador incorrecto", () => {
    expect(validarRutChileno("12345678-0")).toBe(false);
  });

  test("4. Debe retornar false para un formato sin guion", () => {
    expect(validarRutChileno("123456785")).toBe(false);
  });

  test("5. Debe retornar false para cadenas vacías o compuestas solo por espacios", () => {
    expect(validarRutChileno("   ")).toBe(false);
  });
});