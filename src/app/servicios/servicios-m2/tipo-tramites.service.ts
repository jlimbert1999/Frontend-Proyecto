import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entorno } from '../api-config'
import { TipoTramite } from 'src/app/modelos/tramites-requisitos/Tipo_Tramite.model';
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos';

@Injectable({
  providedIn: 'root'
})
export class TipoTramitesService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }

  //API TIPOS DE TRAMITE
  addTipoTramite(tipoTramite: TipoTramite) {
    return this.http.post(`${this.URL}/tipos_tramites`, tipoTramite)
  }
  getTipoTramite_Habilitados() {
    return this.http.get(`${this.URL}/tipos_tramites/1`)
  }
  getTipoTramite_NoHabilitados() {
    return this.http.get(`${this.URL}/tipos_tramites/0`)
  }
  deleteTipoTramite(id: number) {
    return this.http.put(`${this.URL}/eliminar_tipo_tramite/${id}`, null)
  }
  putTipoTramite(id: number, datos: TipoTramite) {
    return this.http.put(`${this.URL}/tipos_tramites/${id}`, datos)
  }

  //API REQUERIMIENTOS
  addRequerimientos(requerimientos: Requerimientos) {
    return this.http.post(`${this.URL}/requerimientos`, requerimientos)
  }
  getRequerimientos_Habilitados(id_TipoTramite: number) {
    return this.http.get(`${this.URL}/requerimientos_Habilitados/${id_TipoTramite}`)
  }
  getRequerimientos_noHabilitados(id_TipoTramite: number) {
    return this.http.get(`${this.URL}/requerimientos_noHabilitados/${id_TipoTramite}`)
  }

  //METODO PARA ELIMINAR LOGICAMENTE
  // deleteRequerimiento(id:number){
  //   return this.http.put(`${this.URL}/eliminar-requerimientos/${id}`, null)
  // }
  putRequisito(id: number, datos: any) {
    return this.http.put(`${this.URL}/requerimientos/${id}`, datos)
  }

  deleteRequerimiento(id: number) {
    return this.http.delete(`${this.URL}/requerimientos/${id}`)
  }

}
