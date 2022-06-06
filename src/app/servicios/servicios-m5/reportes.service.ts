import { Injectable } from '@angular/core';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  obtener_tramites_realizados() {
    return this.http.get(`${this.URL}/reporte_tramites`)
  }
  obtener_tramites_funcionarios() {
    return this.http.get(`${this.URL}/reporte_funcionario`)
  }
  obtener_tramites_solicitante() {
    return this.http.get(`${this.URL}/reporte_solicitante`)
  }
  obtener_tramites_estado(estado: any) {
    return this.http.post(`${this.URL}/reporte_estado`, estado)
  }

  reporte_ficha(datos: any) {
    return this.http.post(`${this.URL}/reporte_fichaTramite`, datos)
  }
  reporte_ficha_workflow(id_tramite: any) {
    return this.http.get(`${this.URL}/reporte_fichaTramite_Worflow?id_tramite=${id_tramite}`)
  }
}
