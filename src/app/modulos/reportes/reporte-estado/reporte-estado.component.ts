import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/servicios/servicios-m5/reportes.service';
import * as moment from 'moment'; // add this 1 of 4
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-reporte-estado',
  templateUrl: './reporte-estado.component.html',
  styleUrls: ['./reporte-estado.component.css']
})
export class ReporteEstadoComponent implements OnInit {
  estados_tramite = ['Inscrito', 'Observado', 'Concluido', 'Anulado', 'En revision']
  document: any
  pdfSrc: string


  constructor(private reporteService: ReportesService) { }

  ngOnInit(): void {
  }
  generar_reporte_estado(tramite_estado: string, opcion: string) {
    this.reporteService.obtener_tramites_estado({ estado: tramite_estado }).subscribe((resp: any) => {
      if (resp.ok) {
        let aux: any[] = []
        resp.Tramites.forEach((element: any, index: number) => {
          aux.push([++index, element.alterno, moment(parseInt(element.Fecha_creacion)).format('DD-MM-YYYY HH:mm:ss'), element.titulo, `${element.nombres} ${element.paterno} ${element.materno}`])
        })
        this.Crear_PDF_estados(aux, opcion, tramite_estado)
      }
    })
  }
  Crear_PDF_estados(listado: any[], opcion: string, estado: string) {
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../assets/img/gams.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION
    doc.addImage(img, 'png', 0, -5, 65, 40)
    doc.setFont("helvetica", "bold");
    doc.text("Reporte estado tramite", 105, 20, undefined, "center");
    doc.text(`"${estado}"`, 105, 27, undefined, "center");
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)

    autoTable(doc, {
      startY: 40,
      head: [['Numero', 'Codigo', 'Creacion', 'Titulo', 'Solicitante']],
      body: listado,
      theme: 'grid',
      margin: { horizontal: 20 },
      headStyles: {
        'fillColor': [255, 255, 255],
        'textColor': [0, 0, 0]
      }
    })
    if (listado.length > 0) {
      switch (opcion) {
        case 'ver': {
          //statements; 
          this.pdfSrc = doc.output('bloburl').toString()
          break;
        }
        case 'imprimir': {
          doc.autoPrint()
          doc.output('dataurlnewwindow')
          break;
        }
        case 'guardar': {
          doc.save('reporte_estado.pdf')
          break;
        }


      }

    }



  }


}
