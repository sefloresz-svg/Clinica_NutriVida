import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./componentes/organismos/Navbar";
import Inicio from "./paginas/Inicio";
import Novedades from "./paginas/Novedades";
import Servicios from "./paginas/Servicios";
import Nutricionistas from "./paginas/Nutricionistas";
import Agendar from "./paginas/Agendar";
import Login from "./paginas/Login";
import Pacientes from "./paginas/Pacientes";
import Footer from "./componentes/organismos/Footer";
import Administrador from "./paginas/Administrador";
import Nosotros from "./paginas/Nosotros";

function App() {
  const location = useLocation();
  const esPaginaLogin = location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!esPaginaLogin && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nutricionistas" element={<Nutricionistas />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/administrador" element={<Administrador />} />
        </Routes>
      </main>

      {!esPaginaLogin && <Footer />}
    </div>
  );
}

export default App;