import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./componentes/organismos/Navbar";
import Inicio from "./paginas/Inicio";
import Novedades from "./paginas/Novedades";
import Servicios from "./paginas/Servicios";
import Nutricionistas from "./paginas/Nutricionistas";
import Agendar from "./paginas/Agendar";
import Login from "./paginas/Login";
import Pacientes from "./paginas/Pacientes";

function App() {
  const location = useLocation();
  // Si estamos en la ruta /login, no mostramos el Navbar superior
  const esPaginaLogin = location.pathname === "/login";

  return (
    <div>
      {!esPaginaLogin && <Navbar />}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nutricionistas" element={<Nutricionistas />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pacientes" element={<Pacientes />} />
      </Routes>
    </div>
  );
}

export default App;