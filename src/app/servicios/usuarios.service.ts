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

  login(usuarioLogin: object) {
    return this.http.post(`${this.URL}/login`, usuarioLogin)
  }

  estaAuntentificado(): boolean {
    let token = localStorage.getItem('token')
    if (!token) {
      return false
    }
    if (this.jwtHelper.isTokenExpired(token!)) {
      return false
    }
    return true
  }


  //API USUARIOS
  getUsuarios() {
    return this.http.get(`${this.URL}/usuarios`)
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
}
