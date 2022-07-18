import { Component, OnInit, ViewChild } from '@angular/core';
import decode from 'jwt-decode'
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { Router } from '@angular/router';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css']
})
export class BandejaSalidaComponent implements OnInit {
  Info_Cuenta_Actual = this.decodificarToken()
  Tramites_Emitidos: any[] = []

  expandedIndex = 0;
  aux_busqueda: any[] = [] //para realizar bsuquedas guardar los valores recuperados antes
  modo_busqueda: boolean = false
  @ViewChild(MatAccordion) accordion: MatAccordion;

  spiner_carga: boolean = false
  sin_emitidos: boolean = false


  constructor(private tramiteService: BandejaService, private router: Router, public dialog: MatDialog) {
  }


  ngOnInit(): void {

    console.log(this.Info_Cuenta_Actual);
    this.obtener_bandejaSalida()
  }


  obtener_bandejaSalida() {
    this.spiner_carga = true
    this.tramiteService.getListaEmitida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        this.spiner_carga = false
        this.Tramites_Emitidos = resp.Tramites_Recibidos
        this.aux_busqueda = resp.Tramites_Recibidos
        if (resp.Tramites_Recibidos.length == 0) {
          this.sin_emitidos = true
        }


      }
    })
  }


  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  ver_flujo(id_tramite: number) {
    // let id_tramite = this.DatosEnvio.id_tramite
    this.router.navigate(['inicio/Workflow', id_tramite])

  }

  abrir_DialogRemision(DatosEnvio: any) {
    let tramite = {
      id_tramite: DatosEnvio.id_tramite,
      Titulo: DatosEnvio.titulo,
      Alterno: DatosEnvio.alterno
    }
    // //enviar id para que las bandeja obtengan datos desde la trabla workflow

    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: tramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.obtener_bandejaSalida()
      }

      // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
    })


  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Tramites_Emitidos = this.aux_busqueda.filter(obj => Object.values(obj).some((val: any) => val.toString().toLowerCase().includes(filterValue)));
    if (filterValue == "" || filterValue == null) {
      this.Tramites_Emitidos = this.aux_busqueda
    }
  }
  desactivar_busqueda() {
    this.modo_busqueda = false
    this.Tramites_Emitidos = this.aux_busqueda

  }
  cerrar_busqueda() {

  }
  recargar() {
    this.obtener_bandejaSalida()
  }
  filtrar_listado(tipo: string) {
    if (tipo == "Aceptados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.aceptado == true || tramite.aceptado == 1)
    }
    else if (tipo == "Enviados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.aceptado == false && tramite.rechazado == false)
    }
    else if (tipo == "Rechazados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.rechazado == true)
    }
    else if (tipo == "Todos") {
      this.Tramites_Emitidos = this.aux_busqueda
    }


  }

  crear_Hoja_Ruta(Tramite: any) {
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../assets/img/gams.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION CABECERA
    doc.addImage(img, 'png', 0, -5, 65, 40)
    doc.setFont("helvetica", "bold");
    doc.text("Hoja de ruta", 105, 20, undefined, "center");
    doc.setFont("", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30);

    doc.rect(15, 55, 180, 80);

    doc.setFontSize(9);
    doc.setFont("normal");
    doc.text("CORRESPONDENCIA", 30, 40, undefined, "center");
    doc.text("INTERNA", 30, 43, undefined, "center");
    doc.rect(47, 38, 5, 5);

    doc.text("COPIA", 55, 40);
    doc.rect(67, 38, 5, 5);

    doc.text("Correspondecia", 80, 40);
    doc.text("Externa", 85, 43);
    doc.rect(105, 38, 5, 5);

    doc.text("Nro. unico de ", 115, 40);
    doc.text("Correspondencia", 115, 43);
    doc.text(`${Tramite.alterno}`, 150, 40);
    doc.rect(145, 36, 45, 8);

    doc.text("Emision / Recepcion: ", 70, 50);
    doc.text(`${moment(parseInt(Tramite.fecha_envio)).format('DD-MM-YYYY HH:mm:ss a')}`, 104, 50);

    doc.text("DATOS DE ORIGEN", 20, 60);
    doc.text("Cite: ............................................", 20, 65);
    doc.text("Nro. de registro interno (Correlativo)", 100, 65);
    doc.rect(160, 61, 20, 6);

    doc.text(`Remitente: ${this.Info_Cuenta_Actual.Nombre}`, 20, 75);
    doc.text(`Cargo: ${this.Info_Cuenta_Actual.NombreCargo}`, 100, 75);

    doc.text(`Destinatario: ${Tramite.Nombre} ${Tramite.Apellido_P} ${Tramite.Apellido_M} `, 20, 80);
    doc.text(`Cargo: ${Tramite.NombreCargo}`, 100, 80);

    doc.text(`Referencia: ${Tramite.detalle} `, 20, 85);

    doc.text("Salida: ", 70, 90);
    doc.text(`${moment(parseInt(Tramite.fecha_recibido)).format('DD-MM-YYYY HH:mm:ss a')}`, 94, 90);

    doc.text(`Destinatario 1: ${Tramite.Nombre} ${Tramite.Apellido_P} ${Tramite.Apellido_M} (${this.Info_Cuenta_Actual.NombreCargo})`, 20, 95);
    doc.rect(20, 97, 30, 30);
    doc.text("Instruccion / Proveido ", 55, 105);
    doc.text("Nro. de registro interno (Correlativo)", 100, 100);
    doc.rect(160, 96, 20, 6);

    doc.line(180, 121, 140, 121); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, 125);

    doc.text(`Ingreso ${"..........."}`, 40, 132);
    doc.text(`Salida ${"..........."}`, 130, 132);

    let pos_Y = 142

    for (let i = 1; i < 4; i++) {
      doc.rect(15, pos_Y - 4, 180, 50);
      doc.text(`Destinatario ${i + 1}: ${".............."}`, 20, pos_Y);
      doc.rect(20, pos_Y + 2, 30, 30);
      doc.text("Instruccion / Proveido ", 55, pos_Y + 10);
      doc.text("Nro. de registro interno (Correlativo)", 100, pos_Y + 5);
      doc.rect(160, pos_Y + 1, 20, 6);

      doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
      doc.text("Firma y sello", 150, pos_Y + 30);

      doc.text(`Ingreso ${"..........."}`, 40, pos_Y + 37);
      doc.text(`Salida ${"..........."}`, 130, pos_Y + 37);
      pos_Y = pos_Y + 52
    }


    doc.output('dataurlnewwindow')
  }




}
