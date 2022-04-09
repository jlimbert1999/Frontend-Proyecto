import { Injectable } from '@angular/core';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WorkflowServiceService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }

  getWorkflow(id_tramite:number){ 
    return this.http.get(`${this.URL}/workflow/${id_tramite}`)
  }

  get_SiTramite_FueEnviado(id_tramite:number, id_cuenta:any){
    return this.http.post(`${this.URL}/workflow-envio/${id_tramite}`, id_cuenta)
  }

}
