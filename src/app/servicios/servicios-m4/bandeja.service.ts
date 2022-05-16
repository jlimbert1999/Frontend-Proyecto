import { Injectable } from '@angular/core';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BandejaService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  add_bandejaEntrada(datos: any) {
    return this.http.post(`${this.URL}/add_bandeja_entrada`, datos)
  }
  add_bandejaSalida(datos: any) {
    return this.http.post(`${this.URL}/add_bandeja_salida`, datos)
  }

  //metodo para tener datos en la lista de bandeja de entrada
  getListaRecibida(id_cuentaActual: number) {
    return this.http.get(`${this.URL}/bandeja-recibida/${id_cuentaActual}`)
  }
  getListaEmitida(id_cuentaActual: number) {
    return this.http.get(`${this.URL}/bandeja-emitida/${id_cuentaActual}`)
  }

  //METODOS EN BACKEND, MEJORAR
  rechazar_tramite(datos: any) {
    return this.http.post(`${this.URL}/rechazar_tramite`, datos)
  }
  aceptar_tramite(datos: any) {
    return this.http.post(`${this.URL}/aceptar_tramite`, datos)
  }
}
