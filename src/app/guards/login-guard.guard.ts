import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../servicios/servicios-m1/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(private loginService:LoginService , private router:Router){

  }
  canActivate():boolean{
    if(!this.loginService.estaAuntentificado()){
      this.router.navigate(['login']);
      console.log('Inicie sesion para acceder');
      return false
    }
    return true;
  }
  
}
