import { MediaMatcher } from '@angular/cdk/layout';
import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import decode from 'jwt-decode'
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  mobileQuery: MediaQueryList;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );
  private _mobileQueryListener: () => void;

  Info_cuenta_actual = this.decodificarToken()
  Modulos: any
  router1: any = this.router.url
  constructor(private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private socketService: SocketService, private snackBar: MatSnackBar,) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }


  ngOnInit(): void {
    this.cargar_modulos()
    this.recibir_tramite()
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  decodificarToken(): any {
    let token = localStorage.getItem('token')!
    return decode(token)
  }
  cargar_modulos() {
    if (this.Info_cuenta_actual.Tipo == "USER1_ROLE") {
      this.Modulos = [
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Administrar tramites', ruta: 'administrar-tramite', icon: 'text_snippet' },
            { nombre: 'Bandeja entrada', ruta: 'bandeja-entrada', icon: 'mark_as_unread' },
            { nombre: 'Bandeja salida', ruta: 'bandeja-salida', icon: 'outgoing_mail' },
          ]
        },
        {
          modulo: "Reportes",
          submodulos: [
            { nombre: 'Reporte ficha', ruta: 'reporte-ficha', icon: 'receipt_long' },
            { nombre: 'Reporte estado', ruta: 'reporte-estado', icon: 'summarize' },
            { nombre: 'Estadisticas', ruta: 'reporte-estadistico', icon: 'content_paste' }
          ]
        }


      ]

    }
    if (this.Info_cuenta_actual.Tipo == "ADMIN_ROLE") {
      this.Modulos = [
        {
          modulo: "Usuarios",
          submodulos: [
            { nombre: 'Funcionarios', ruta: 'administrar-funcionarios', icon: 'group' },
            { nombre: 'Cuentas', ruta: 'administrar-cuentas', icon: 'badge' },
            { nombre: 'Grupo de trabajo', ruta: 'groupware', icon: 'groups' },

          ]
        },
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Tipos de Tramites', ruta: 'administrar-tipos-tramites', icon: 'summarize' }

          ]
        },
        {
          modulo: "Configuraciones",
          submodulos: [
            { nombre: 'Instituciones', ruta: 'administrar-instituciones', icon: 'apartment' },
            { nombre: 'Dependencias', ruta: 'administrar-dependencias', icon: 'home_work' },
            { nombre: 'Cargos', ruta: 'administrar-cargos', icon: 'assignment_ind' }

          ]
        }


      ]

    }
    if (this.Info_cuenta_actual.Tipo == "USER2_ROLE") {
      this.Modulos = [
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Bandeja entrada', ruta: 'bandeja-entrada', icon: 'text_snippet' },
            { nombre: 'Bandeja salida', ruta: 'bandeja-salida', icon: 'outgoing_mail' },
          ]
        },
        {
          modulo: "Reportes",
          submodulos: [
            { nombre: 'Reporte ficha', ruta: 'reporte-ficha', icon: 'receipt_long' },
            { nombre: 'Reporte estado', ruta: 'reporte-estado', icon: 'summarize' },
            { nombre: 'Estadisticas', ruta: 'reporte-estadistico', icon: 'content_paste' }
          ]
        }


      ]

    }
  }
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])
    this.socketService.Emitir('eliminarUser', null).subscribe()
  }

  administrar_cuenta() {

    this.router.navigate(['Administrar-cuenta', this.Info_cuenta_actual.id_cuenta])
  }
  recibir_tramite() {
    this.socketService.Escuchar('recibirTramite').subscribe((resp: any) => {
      this.openSnackBar("Nuevo tramite recibido")
    })
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      duration: 5000
    });

  }


}
