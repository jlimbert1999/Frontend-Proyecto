import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { ConsultaService } from 'src/app/servicios/servicios-m4/consulta.service';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { UpperCasePipe } from '@angular/common';
const doc = new jsPDF()
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  Codigo_Tramite: string = ""
  Tramite: any //informacion del tramite
  Observaciones_Tramite: any[] = []
  displayedColumns: string[] = ['descripcion', 'estado', 'fecha_registro'];

  observaciones_tablaPDF = []
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private tramiteService: RegistroTramiteService,
    private consultaService: ConsultaService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  obtener_Observaciones(id_tramite: number) {
    this.Observaciones_Tramite = []
    this.tramiteService.getObservaciones(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.observaciones_tablaPDF = resp.Observaciones
        let unicos: number[] = []
        let aux: any
        for (let i = 0; i < resp.Observaciones.length; i++) {
          const elemento = resp.Observaciones[i].id_cuenta;
          if (!unicos.includes(resp.Observaciones[i].id_cuenta)) {
            unicos.push(elemento);
          }
        }
        unicos.forEach((id: number) => {
          aux = resp.Observaciones.filter((obs: any) => obs.id_cuenta == id)
          this.Observaciones_Tramite.push(aux)
        })
        console.log(this.Observaciones_Tramite);
      }
    })
  }
  Obtener_Informacion_Tramite() {
    // this.obtener_Observaciones(39)
    this.consultaService.get_InformacionTramite({ Alterno: this.Codigo_Tramite }).subscribe((resp: any) => {
      if (resp.Tramite.length > 0) {
        this.Tramite = resp.Tramite[0]
        this.obtener_Observaciones(resp.Tramite[0].id_tramite)
      }
      else {
        this.abrir_Mensaje('No se econtro el codigo ingresado')
      }
    })
  }
  abrir_Mensaje(Mensaje: string) {
    this._snackBar.open(Mensaje, '', {
      duration: 3000
    });
  }
  imprimir_observaciones() {
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 170, 1, 30, 30)
    doc.setFontSize(16)
    doc.text(`Observaciones tramite: ${this.Codigo_Tramite}`, 50, 10)
    doc.setFontSize(10);
    doc.text(`Solicitante: ${this.Tramite.nombres} ${this.Tramite.paterno} ${this.Tramite.materno}`, 60, 20)
    doc.text(`CI: ${this.Tramite.expedido.toLowerCase()} ${this.Tramite.dni}`, 60, 25)

    let campos: string[][] = []
    this.observaciones_tablaPDF.forEach((element: any) => {
      campos.push([`${element.Nombre} ${element.Apellido_P} ${element.Apellido_M}`, element.NombreCar, element.detalle])
    })
    autoTable(doc,{
      startY:35,
      head: [['Funcionario', 'Cargo', 'Observacion']],

      body: campos,
      //   ['Observacion', 'david@example.com', 'Sweden'],
      //   ['Castille', 'castille@example.com', 'Spain'],
      // ],
    })
    doc.save('table.pdf')
  }



}
