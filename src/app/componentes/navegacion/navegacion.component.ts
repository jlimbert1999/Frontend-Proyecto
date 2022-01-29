import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import decode from 'jwt-decode'

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  DatoSesion: any = {}
  Modulos:string[]=['Usuarios', 'Configuraciones','Tramites', 'Administracion', 'Reportes']
  constructor(private router: Router) { 
  }
 
  OpcionesModulo:string[]=['']
  ngOnInit(): void {
    this.decodificarToken()
  }
  irModulo(modulo:string){
    // if(modulo=='Usuarios'){
    //   this.OpcionesModulo=['cuentas', 'usuarios'] 
    // }
    // if(modulo=='Configuracion'){
    //   this.OpcionesModulo=['instituciones', 'cargos', 'dependencias'] 
    // }
  }
  decodificarToken(): any {
    if(!localStorage.getItem('token')){
      this.router.navigate(['login'])
    }
    else{
      let token=localStorage.getItem('token')!
      this.DatoSesion=decode(token)
      console.log(this.DatoSesion);
    }
  }
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])
  }


}
