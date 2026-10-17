import Input from "../atomos/Input";
interface CampoFormularioProps {
 etiqueta: string;
 tipo: string;
 nombre: string;
 valor: string;
 placeholder?: string;
 alCambiar: (valor: string) => void;
}
function CampoFormulario({ etiqueta, tipo, nombre, valor, placeholder,
alCambiar }: CampoFormularioProps) {
 return (
 <div className="mb-3 text-start">
 <label className="form-label fw-bold">{etiqueta}</label>
 <Input
 tipo={tipo}
 nombre={nombre}
 valor={valor}
 placeholder={placeholder}
 alCambiar={alCambiar}
 />
 </div>
 );
}
export default CampoFormulario;