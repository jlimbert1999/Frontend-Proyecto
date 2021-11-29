import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  mostrarSideBar:boolean=false;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['login'])

  }

}
