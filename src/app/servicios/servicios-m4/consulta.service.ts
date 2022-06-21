import { Injectable } from '@angular/core';
import { entorno } from '../api-config'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  get_InformacionTramite(pin: string, dni: string) {
    return this.http.get(`${this.URL}/consulta-tramite?pin=${pin}&dni=${dni}`)
  }
  get_verificacionConsulta(telefono: string, code: string, id_tramite:number) {
    return this.http.get(`${this.URL}/verificar-consulta?telefono=${telefono}&code=${code}&id_tramite=${id_tramite}`)
  }
}
