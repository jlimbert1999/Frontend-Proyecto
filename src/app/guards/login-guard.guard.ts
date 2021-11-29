import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UsuariosService} from '../servicios/usuarios.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(private usuarioService:UsuariosService , private router:Router){

  }
  canActivate():boolean{
    if(!this.usuarioService.estaAuntentificado()){
      this.router.navigate(['login']);
      return false
    }
    return true;
  }
  
}
