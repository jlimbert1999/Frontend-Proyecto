import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import decode from 'jwt-decode'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-registro-tramites',
  templateUrl: './registro-tramites.component.html',
  styleUrls: ['./registro-tramites.component.css']
})
export class RegistroTramitesComponent implements OnInit {
  TitleTolbar: string = "";
  permitir_registro_tramites: boolean = false
  tipo_vista_tramites: boolean = false
  eventsSubject: Subject<boolean> = new Subject<boolean>()
  Info_cuenta_actual = this.decodificarToken()


  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  clicked: boolean = false;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {

    this.escuchar_TramitesRecibidos()
    this.cargar_Opciones_Permitidas()

    if (this.router.url.split('/').length > 1) {
      switch (this.router.url.split('/').pop()) {
        case "administrar-tramite":
          this.TitleTolbar = "Administrar tramites"
          break;
        case "bandeja-entrada":
          this.TitleTolbar = "Bandeja entrada"
          break;
        case "bandeja-salida":
          this.TitleTolbar = "Bandeja salida"
          break
        default:
          this.TitleTolbar = ""

      }

    }




  }

  escuchar_TramitesRecibidos() {
    this.socketService.Escuchar('recibirTramite').subscribe((resp: any) => {
      this.snackBar.open('Nuevo tramite recibido', '', {
        duration: 3000
      });
    })
  }

  cargar_Opciones_Permitidas() {
    if (this.Info_cuenta_actual.Tipo == 'USER1_ROLE') {
      this.permitir_registro_tramites = true
    }
    else if (this.Info_cuenta_actual.Tipo == 'USER2_ROLE') {
      this.permitir_registro_tramites = false
    }

  }

  decodificarToken(): any {
    let token = localStorage.getItem('token')!
    return decode(token)
  }

}
