export interface Workflow {
    id_workflow?:number
    id_cuentaEmisor:number
    id_cuentaReceptor:number
    id_tramite:number
    detalle:string
    enviado:boolean
    recibido:boolean
    fecha_envio:number
    fecha_recibido:number
}