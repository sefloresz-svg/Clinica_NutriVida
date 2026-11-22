interface BadgeEstadoProps {
  estado: string;
  // Clases extra (por ejemplo "mb-1" en la tabla de Pacientes)
  clase?: string;
}

// Color del badge según el estado de la cita
const colorEstado = (estado: string): string => {
  if (estado === "Confirmada") return "bg-success";
  if (estado === "Atendida") return "bg-primary";
  if (estado === "Cancelada") return "bg-secondary";
  return "bg-warning text-dark";
};

function BadgeEstado({ estado, clase = "" }: BadgeEstadoProps) {
  return <span className={`badge ${colorEstado(estado)} ${clase}`.trim()}>{estado}</span>;
}

export default BadgeEstado;
