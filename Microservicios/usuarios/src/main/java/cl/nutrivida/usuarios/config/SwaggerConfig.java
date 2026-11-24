package cl.nutrivida.usuarios.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

// Configura Swagger (http://localhost:8081/swagger-ui.html):
// agrega el boton "Authorize" para pegar el token JWT y probar los endpoints protegidos
@Configuration
@OpenAPIDefinition(
        info = @Info(title = "NutriVida - API Usuarios", version = "1.0"),
        security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class SwaggerConfig {
}
