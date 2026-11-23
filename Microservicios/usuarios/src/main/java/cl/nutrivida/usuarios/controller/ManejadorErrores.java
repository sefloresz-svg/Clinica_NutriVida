package cl.nutrivida.usuarios.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// QUE HACE: atrapa los errores de @Valid (MethodArgumentNotValidException) y devuelve
// solo el primer mensaje del DTO en el campo "message", ej: {"message": "El correo es obligatorio."}.
// POR QUE EXISTE: sin esta clase Spring responde un texto largo en ingles; con ella el front
// lee los errores de validacion igual que los de ResponseStatusException (respuesta.message).
@RestControllerAdvice
public class ManejadorErrores {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> errorValidacion(MethodArgumentNotValidException e) {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("message", e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cuerpo);
    }
}
