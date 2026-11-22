import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Después de cada test se limpia la sesión guardada y los mocks (como fetch)
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
