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

  reporte_ficha(datos:any){
    return this.http.post(`${this.URL}/reporte_fichaTramite`, datos)
  }
}
