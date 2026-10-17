interface BotonProps {
  texto: string;
  tipo?: "button" | "submit" | "reset";
  clase?: string;
  onClick?: () => void;
}

function Boton({ texto, tipo = "button", clase = "btn btn-primary",
    onClick }: BotonProps) {
  return (
    <button type={tipo} className={clase} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Boton;