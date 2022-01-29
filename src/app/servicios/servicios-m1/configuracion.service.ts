import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entorno } from '../api-config'
import { DependenciaModel } from 'src/app/modelos/administracion-usuarios/dependencia.model';
import { IntitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  //INSTITUCIONES
  addInstitucion(institucion: IntitucionModel) {
    return this.http.post(`${this.URL}/institucion`, institucion)
  }
  getInsti_Habilitadas() {
    return this.http.get(`${this.URL}/instituciones/1`)
  }
  getInsti_noHabilitadas() {
    return this.http.get(`${this.URL}/instituciones/0`)
  }
  putInstitucion(id: number, datos: any) {
    return this.http.put(`${this.URL}/instituciones/${id}`, datos)
  }



  //DEPENDENCIAS
  addDependencia(dependencia: DependenciaModel) {
    return this.http.post(`${this.URL}/dependencia`, dependencia)
  }
  getDepen_Habilitadas() {
    return this.http.get(`${this.URL}/dependencias/1`)
  }
  getDepen_noHabilitadas() {
    return this.http.get(`${this.URL}/dependencias/0`)
  }
  putDependencia(id: number, datos: object) {
    return this.http.put(`${this.URL}/dependencias/${id}`, datos)
  }

  //Cargos
  addCargo(datos:any){
    return this.http.post(`${this.URL}/cargo`, datos)
  }
  getCargos_Habilitados() {
    return this.http.get(`${this.URL}/cargos/1`)
  }
  getCargos_NoHabilitados() {
    return this.http.get(`${this.URL}/cargos/0`)
  }
  putCargo(id: number, datos: object) {
    return this.http.put(`${this.URL}/cargos/${id}`, datos)
  }



}
