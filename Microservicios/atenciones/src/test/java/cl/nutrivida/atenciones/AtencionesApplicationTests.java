package cl.nutrivida.atenciones;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AtencionesApplicationTests {

	// OJO: este test levanta Spring completo, asi que NECESITA MySQL (Laragon) encendido
	// y la base de datos creada. Los *ServiceTest no la necesitan.
	@Test
	void contextLoads() {
	}

}
