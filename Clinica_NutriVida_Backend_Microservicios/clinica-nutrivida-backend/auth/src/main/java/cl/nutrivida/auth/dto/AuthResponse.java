package cl.nutrivida.auth.dto;

public record AuthResponse(Long id, String nombre, String correo, String rol, String mensaje) {}
