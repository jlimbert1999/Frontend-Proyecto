import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoTramitesService {
  private URL: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  //API TIPOS DE TRAMITE
  addTipoTramite(tiposTramite: object) {
    return this.http.post(`${this.URL}/tramite`, tiposTramite)
  }
  getTipoTramite() {
    return this.http.get(`${this.URL}/tramite`)
  }
  putTipoTramite(id:number, data:object) {
    return this.http.put(`${this.URL}/tramite/${id}`, data)
  }
  deleteTipoTramite(id:string) {
    return this.http.delete(`${this.URL}/tramite/${id}`)
  }

}
