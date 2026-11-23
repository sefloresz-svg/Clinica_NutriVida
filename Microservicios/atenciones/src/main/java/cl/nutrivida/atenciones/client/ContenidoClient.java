package cl.nutrivida.atenciones.client;

import cl.nutrivida.atenciones.dto.ServicioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ContenidoClient {

    private final WebClient webClient;

    public ContenidoClient(WebClient.Builder builder) {
        this.webClient = builder.clone().baseUrl("http://contenido").build();
    }

    public ServicioDTO buscarServicio(Long id) {
        try {
            return webClient.get()
                    .uri("/api/servicios/{id}", id)
                    .retrieve()
                    .bodyToMono(ServicioDTO.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            return null;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "No se pudo conectar con el microservicio contenido");
        }
    }
}
