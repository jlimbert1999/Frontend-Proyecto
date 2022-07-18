export interface Workflow {
    id_workflow?: number
    id_cuentaEmisor: number
    Funcionario_Emisor:string
    id_cuentaReceptor: number
    Funcionario_Receptor:string
    id_tramite: number
    detalle: string
    enviado: boolean
    recibido: boolean
    fecha_envio: number
    fecha_recibido: number
}
export interface Bandeja_Entrada {
    id_tramite: number
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio: number
    fecha_recibido: number
    aceptado: boolean
}
export interface Bandeja_Salida {
    id_bandeja?: number
    id_tramite: number
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio: number
    fecha_recibido: number
    aceptado: boolean
    rechazado: boolean
}