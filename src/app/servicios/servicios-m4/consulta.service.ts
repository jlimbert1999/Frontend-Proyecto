import { Injectable } from '@angular/core';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  get_InformacionTramite(codigo: any) {
    return this.http.post(`${this.URL}/consulta-tramite`, codigo)
  }
}
