export interface TramiteModel {
    id_tramite?:string,
    estado:string
    tipo:string
    codigo?:string,
    detalle:string,
    cantidad:number,
    fecha_creacion:string,
    activo:boolean,

    nombre:string
    apellido_p:string,
    apellido_m:string,
    telefono:string,
    tipos_doc:string,
    dni:string,
    expedido:string
}