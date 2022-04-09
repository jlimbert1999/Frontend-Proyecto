export interface SolicitanteModel {
    id_solicitante?:number
    id_documento:number
    dni: string
    expedido: string
    paterno: string
    materno: string
    nombres: string
    telefono: string
}
export interface RepresentanteModel {
    id_representante?:number
    id_documento:number
    dni: string
    expedido: string
    paterno: string
    materno: string
    nombres: string
    telefono: string
}
export interface SolicitudModel {
    id_tramite:number
    id_solicitante:number
    id_representante:number|null
}