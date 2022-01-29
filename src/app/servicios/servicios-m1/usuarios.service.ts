import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private URL: string = 'http://localhost:3000'
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  login(datosLogin: object) {
    return this.http.post(`${this.URL}/login`, datosLogin)
  }

  estaAuntentificado(): boolean {
    let token = localStorage.getItem('token')
    if (!token) {
      return false
    }
    // if (this.jwtHelper.isTokenExpired(token!)) {
    //   return false
    // }
    return true
  }


  //API USUARIOS
  getUsuarios_Habilitados() {
    return this.http.get(`${this.URL}/usuarios/1`)
  }
  getUsuarios_noHabilitados() {
    return this.http.get(`${this.URL}/usuarios/0`)
  }
  addUsuarios(datosUser: any) {
    return this.http.post(`${this.URL}/usuarios`, datosUser)
  }
  deleteUsuarios(id: number) {
    return this.http.delete(`${this.URL}/usuarios/${id}`)
  }
  putUsuarios(id: number, datos: any) {
    return this.http.put(`${this.URL}/usuarios/${id}`, datos)
  }
  getUsuario(id:number){
    return this.http.get(`${this.URL}/usuarios/${id}`)
  }
  getUsuariosTrabajado(ids:any){
    return this.http.post(`${this.URL}/usuarios-trabajando`, ids)
  }
  addDetallesUsuarios(datos:any){
    return this.http.post(`${this.URL}/usuarios-detalles`, datos)
  }
  getDetallesUsuarios(id:number){
    return this.http.get(`${this.URL}/usuarios-detalles/${id}`)
  }

  //API CUENTAS

  addCuenta(datos: any) {
    return this.http.post(`${this.URL}/cuentas`, datos)
  }
  putCuenta(id:number, datos:any){
    return this.http.put(`${this.URL}/cuentas/${id}`, datos)
  }

  getCuentasAsignadas(){
    return this.http.get(`${this.URL}/cuentas-asignadas`)
  }
  getCuentasNoAsignadas(){
    return this.http.get(`${this.URL}/cuentas-no_asignadas`)
  }

  asignarCuenta(datos:any, id:number){
    return this.http.put(`${this.URL}/cuentas-asignar/${id}`, datos)
  }
  verificarSiTieneCuenta(id:number){
    return this.http.get(`${this.URL}/cuentas-verificar/${id}`)
  }
  finalizarCuenta(id:number){
    return this.http.put(`${this.URL}/cuentas-finalizar/${id}`, null)
  }


  //API TRABAJOS
  addTrabajo(datos: any) {
    return this.http.post(`${this.URL}/cuentas/trabajos`, datos)
  }
  getTrabajos() {
    return this.http.get(`${this.URL}/cuentas/trabajos`)
  }
  getTrabajo(id:number){
    return this.http.get(`${this.URL}/cuentas/trabajos/${id}`)
  }
}
