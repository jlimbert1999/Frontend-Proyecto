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


}
