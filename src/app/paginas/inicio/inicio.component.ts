import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import decode from 'jwt-decode'

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  DatoSesion: any = {}
  constructor(private router: Router) {
    this.decodificarToken()
  }


  ngOnInit(): void {
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])
  }
  decodificarToken(): any {
    if(!localStorage.getItem('token')){
      this.router.navigate(['login'])
    }
    else{
      let token=localStorage.getItem('token')!
      this.DatoSesion=decode(token)
    }
  }

}
