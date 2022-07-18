import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { entorno } from '../api-config'
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
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
    // return next.handle(tokenHeader)
    return next.handle(tokenHeader).pipe(
      catchError(
        (err) => {
          if (err.status === 401) {
            this.handleAuthError();
            return of(err)
          }
          throw err;
        }
      )
    ) as Observable<HttpEvent<any>>;
  }
  private handleAuthError() {
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }

  constructor(private http: HttpClient, private router: Router) { }

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
