import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//generacion ficha
import { jsPDF } from 'jspdf';
import { Subject } from 'rxjs';
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import decode from 'jwt-decode'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro-tramites',
  templateUrl: './registro-tramites.component.html',
  styleUrls: ['./registro-tramites.component.css']
})
export class RegistroTramitesComponent implements OnInit {
  TitleTolbar: string = "";
  nroRecibidos: number = 0
  DatosSesion: any
  permitir_registro_tramites: boolean = false
  tipo_vista_tramites: boolean = false
  eventsSubject: Subject<boolean> = new Subject<boolean>()
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {

    this.escuchar_TramitesRecibidos()
    this.cargar_Opciones_Permitidas()

  }

  escuchar_TramitesRecibidos() {
    this.socketService.Escuchar('recibirTramite').subscribe((resp: any) => {
      this.nroRecibidos = this.nroRecibidos + 1
      this.snackBar.open('Nuevo tramite recibido', '', {
        duration: 3000
      });
    })

  }

  cargar_Opciones_Permitidas() {
    this.DatosSesion = this.decodificarToken()
    if (this.DatosSesion.Tipo == 'USER1_ROLE') {
      this.permitir_registro_tramites = true

    }
    else if (this.DatosSesion.Tipo == 'USER2_ROLE') {
      this.permitir_registro_tramites = false
    }

  }









  crearFicha() {
    // let txtNombre=this.datosSolicitante.nombre.toString()
    let txtCodigo = "3242"
    // let txtFecha=this.getfecha()
    // let txtTipTramite=this.tipoTramite.nombre_TipoTramite

    const doc = new jsPDF();
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 0, 0, 50, 50)

    doc.text("Solicitante", 60, 10);
    doc.text("Codigo", 60, 20);
    doc.text("Tipo tramite", 60, 30);
    doc.text("Fecha", 60, 40);

    // doc.text(txtNombre, 100, 10);
    // doc.text(txtCodigo, 100, 20);
    // doc.text(txtTipTramite, 100, 30);
    // doc.text(txtFecha, 100, 40);
    doc.save("ficha.pdf");
  }
  decodificarToken(): any {
    let token = localStorage.getItem('token')!
    return decode(token)
  }


  //TRAMITES SOLICITANTE
  Administrar_Tramites() {
    this.TitleTolbar = "Administrar tramite"
    this.router.navigate(['administrar-tramite'], { relativeTo: this.activatedRoute })
  }
  //BANDEJAS
  Abrir_BandejaEntrada() {
    this.TitleTolbar = "Bandenja de entrada"
    this.router.navigate(['bandeja-entrada'], { relativeTo: this.activatedRoute })
    this.nroRecibidos = 0
  }
  Abrir_BandejaSalida() {
    this.TitleTolbar = "Bandenja de salida"
    this.router.navigate(['bandeja-salida'], { relativeTo: this.activatedRoute })
  }

  evento_cambiar_vista() {
    this.tipo_vista_tramites=!this.tipo_vista_tramites
    //ver enviados=true
    //ver no enviados=false
    this.eventsSubject.next(this.tipo_vista_tramites);
  }

}
