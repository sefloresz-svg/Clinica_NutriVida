import { validarRutChileno } from "../paginas/Agendar";

describe("Validación de RUT Chileno (validarRutChileno)", () => {
    test("Debe retornar true para un RUT válido con dígito numérico", () => {
        expect(validarRutChileno("12345678-5")).toBe(true);
    });

    test("Debe retornar true para un RUT válido con dígito verificador K", () => {
    // Ejemplo de RUT con DV 'K' válido
    expect(validarRutChileno("11111111-K")).toBe(true);
    });

    test("Debe retornar false para un RUT con dígito verificador incorrecto", () => {
        expect(validarRutChileno("12345678-0")).toBe(false);
    });

    test("Debe retornar false para un formato sin guion", () => {
        expect(validarRutChileno("123456785")).toBe(false);
    });

    test("Debe retornar false para cadenas vacías o solo espacios", () => {
        expect(validarRutChileno("   ")).toBe(false);
    });
});