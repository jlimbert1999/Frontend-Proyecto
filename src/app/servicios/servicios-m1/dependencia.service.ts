import { Injectable } from '@angular/core';
import { DependenciaModel } from 'src/app/modelos/administracion-usuarios/dependencia.model';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DependenciaService {
  private URL = entorno.baseUrl;

  constructor(private http:HttpClient) { }
  addDependencia(dependencia:DependenciaModel) {
    return this.http.post(`${this.URL}/api/dependencia`, dependencia)
  }
  getDependencia_Habilitadas(){
    return this.http.get(`${this.URL}/api/dependencias?tipo=1`)
  }
  getDependencia_NoHabilitadas(){
    return this.http.get(`${this.URL}/api/dependencias?tipo=0`)
  }
  putDependencia(id:number, datos:object){
    return this.http.put(`${this.URL}/dependencia/${id}`, datos)
  }
  deleteDependencia(id:number){
    return this.http.delete(`${this.URL}/dependencia/${id}`)
  }
  getDependenciasActivas_de_Instituto(id_institucion:number){
    return this.http.get(`${this.URL}/api/dependencias-activas-institucion/${id_institucion}`)
  }
}
