import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import decode from 'jwt-decode'

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  DatoSesion: any
  menuItems: any[]
  // menuItems: any[] = [
  //   {
  //     label: 'Usuarios',
  //     icon: 'people_alt'
  //   },
  //   {
  //     label: 'Configuraciones',
  //     icon: 'settings'
  //   },
  //   {
  //     label: 'Tramites',
  //     icon: 'article'
  //   },
  //   {
  //     label: 'Reportes',
  //     icon: 'content_paste'
  //   }
  // ];
  constructor(private router: Router) {
  }


  ngOnInit(): void {
    this.DatoSesion = this.decodificarToken()
    if (this.DatoSesion.Tipo == 'ADMIN_ROLE') {
      this.menuItems = [
        {
          label: 'Usuarios',
          icon: 'people_alt'
        },
        {
          label: 'Configuraciones',
          icon: 'settings'
        }
      ]
    }
    else if (this.DatoSesion.Tipo == 'USER1_ROLE' || this.DatoSesion.Tipo =='USER2_ROLE') {
      this.menuItems = [
        {
          label: 'Tramites',
          icon: 'article'
        },
        {
          label: 'Reportes',
          icon: 'content_paste'
        }
      ]
    }
  }


  decodificarToken(): any {
    let token = localStorage.getItem('token')!
    return decode(token)
  }
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])
  }

  administrar_cuenta() {
    this.router.navigate(['Administrar-cuenta', this.DatoSesion.id_cuenta])
  }


}
