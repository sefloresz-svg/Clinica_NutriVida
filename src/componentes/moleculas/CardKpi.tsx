interface CardKpiProps {
  titulo: string;
  valor: string | number;
  detalle: string;
  // Color del texto de abajo (verde por defecto)
  claseDetalle?: string;
}

// Un indicador (KPI) del panel de administración. El valor lo calcula el back
function CardKpi({ titulo, valor, detalle, claseDetalle = "text-success small fw-bold" }: CardKpiProps) {
  return (
    <div className="admin-card-kpi h-100">
      <span className="admin-kpi-title d-block mb-1">{titulo}</span>
      <h2 className="admin-kpi-value mb-1">{valor}</h2>
      <span className={claseDetalle}>{detalle}</span>
    </div>
  );
}

export default CardKpi;
