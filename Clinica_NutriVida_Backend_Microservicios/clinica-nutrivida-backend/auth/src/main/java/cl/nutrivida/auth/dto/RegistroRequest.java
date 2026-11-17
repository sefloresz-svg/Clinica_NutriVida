package cl.nutrivida.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistroRequest(
    @NotBlank String nombre,
    @Email @NotBlank String correo,
    @NotBlank String password,
    @NotBlank String rol
) {}
