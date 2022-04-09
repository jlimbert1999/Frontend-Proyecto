export interface TramiteModel {
    id_tramite?: number,
    estado: string
    id_TipoTramite?: Number
    alterno: string,
    pin: number,
    detalle: string,
    cantidad: number,
    activo?: boolean,  //innecesario???
    id_cuenta?: number,
    Fecha_creacion: number,
    nombreC_solicitante?: string
}