import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from '../servicios/servicios-m1/usuarios.service';
import decode from 'jwt-decode';
import { LoginService } from '../servicios/servicios-m1/login.service';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService:LoginService
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem('token')) {
      const expectedRole = route.data['expectedRole'];
      const token = localStorage.getItem('token')
      const {Tipo}:any= decode(token!)
      if(Tipo!==expectedRole || !this.loginService.estaAuntentificado()){
        console.log('Usted no es', expectedRole);
        this.router.navigate(['Tramites'])
        return false  
      }
    }
    return true
  }

}
