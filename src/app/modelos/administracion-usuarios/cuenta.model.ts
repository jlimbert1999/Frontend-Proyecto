export interface CuentaModel {
    id_cuenta?:number,
    id_cargo:number,
    id_funcionario?:number,
    login:string,
    password?:string;
    fecha_creacion:string,
    fecha_actualizacion:string,
    activo:boolean,
    permisos:string
}