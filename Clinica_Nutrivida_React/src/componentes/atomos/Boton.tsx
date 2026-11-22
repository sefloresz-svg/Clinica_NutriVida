interface BotonProps {
  texto: string;
  tipo?: "button" | "submit" | "reset";
  clase?: string;
  onClick?: () => void;
  // Para bloquear el boton mientras se envia una peticion al back
  deshabilitado?: boolean;
}

function Boton({ texto, tipo = "button", clase = "btn btn-primary",
    onClick, deshabilitado = false }: BotonProps) {
  return (
    <button type={tipo} className={clase} onClick={onClick} disabled={deshabilitado}>
      {texto}
    </button>
  );
}

export default Boton;
