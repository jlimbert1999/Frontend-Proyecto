import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { entorno } from '../api-config'
@Injectable({
  providedIn: 'root'
})
export class LoginService implements HttpInterceptor {
  private URL: string = entorno.baseUrl

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //envio de token
    const token = localStorage.getItem('token') || ''
    const tokenHeader = req.clone({
      setHeaders: {
        token
      }
    })
    return next.handle(tokenHeader)
  }

  constructor(private http: HttpClient) { }

  login(datosLogin: object) {
    return this.http.post(`${this.URL}/login`, datosLogin)
  }

  estaAuntentificado(): boolean {
    if (!localStorage.getItem('token')) {
      return false
    }
    return true
  }
}
