import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroTramitesService {
  private URL: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }
  addTramite(Tramite: object) {
    return this.http.post(`${this.URL}/registrar-tramite`, Tramite)
  }
  getTramite() {
    return this.http.get(`${this.URL}/registrar-tramite`)
  }

}
