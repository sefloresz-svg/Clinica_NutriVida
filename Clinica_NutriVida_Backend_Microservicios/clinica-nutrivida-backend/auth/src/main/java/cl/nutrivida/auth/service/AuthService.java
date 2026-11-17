package cl.nutrivida.auth.service;

import cl.nutrivida.auth.dto.*;
import cl.nutrivida.auth.model.Usuario;
import cl.nutrivida.auth.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse registrar(RegistroRequest request) {
        if (repository.existsByCorreo(request.correo())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo.");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setCorreo(request.correo());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(request.rol().toUpperCase());
        Usuario guardado = repository.save(usuario);
        return new AuthResponse(guardado.getId(), guardado.getNombre(), guardado.getCorreo(),
                guardado.getRol(), "Usuario registrado correctamente.");
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = repository.findByCorreo(request.correo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));
        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }
        return new AuthResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(),
                usuario.getRol(), "Inicio de sesión correcto.");
    }
}
