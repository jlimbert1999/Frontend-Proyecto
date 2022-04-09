import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entorno } from '../api-config'
import { CargoModel } from '../../modelos/administracion-usuarios/cargo.model'

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  addCargo(datos: CargoModel) {
    return this.http.post(`${this.URL}/cargo`, datos)
  }
  getCargos_Habilitados() {
    return this.http.get(`${this.URL}/cargos/1`)
  }
  getCargos_NoHabilitados() {
    return this.http.get(`${this.URL}/cargos/0`)
  }

  putCargo(id:number, datos:object) {
    return this.http.put(`${this.URL}/cargo/${id}`, datos)
  }
}
