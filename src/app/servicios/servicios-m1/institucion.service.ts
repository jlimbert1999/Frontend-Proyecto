import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entorno } from '../api-config'
import { IntitucionModel } from '../../modelos/administracion-usuarios/institucion.model'

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {
  private URL = entorno.baseUrl;
 
  
  constructor(private http:HttpClient) { }

  addInstitucion(institucion:IntitucionModel) {
    return this.http.post(`${this.URL}/institucion`, institucion)
  }
  getInstituciones_Habilitadas(){
    return this.http.get(`${this.URL}/institucion-habilitados`)
  }
  getInstituciones_NoHabilitadas(){
    return this.http.get(`${this.URL}/institucion-no_habilitados`)
  }
  
  putInstitucion(id:number, datos:any){
    return this.http.put(`${this.URL}/institucion/${id}`, datos)
  }
  deleteInstitucion(id:number){
    return this.http.delete(`${this.URL}/institucion/${id}`)
  }
}
