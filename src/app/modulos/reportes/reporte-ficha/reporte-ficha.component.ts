import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as moment from 'moment'; // add this 1 of 4
import { ReportesService } from 'src/app/servicios/servicios-m5/reportes.service';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';

@Component({
  selector: 'app-reporte-ficha',
  templateUrl: './reporte-ficha.component.html',
  styleUrls: ['./reporte-ficha.component.css']
})
export class ReporteFichaComponent implements OnInit {
  data_ReporteFicha = {
    Solicitante: <any>{},
    Tramite: <any>{},
    Representante: <any>{},
    Requerimientos_presentados: <any>{},
    Cronologia: [],
    titulo: ''
  }
  pdfSrc: string

  constructor(private reporteService: ReportesService, private tramiteService: RegistroTramiteService) { }

  ngOnInit(): void {
  }

  obtener_reporte_ficha(alterno: string, dni: string, tipo: string) {
    this.data_ReporteFicha.Representante = {}
    this.data_ReporteFicha.Solicitante = {}
    this.data_ReporteFicha.Tramite = {}
    this.data_ReporteFicha.Requerimientos_presentados = {}
    let parametros_busqueda = {
      alterno,
      dni
    }
    this.reporteService.reporte_ficha(parametros_busqueda).subscribe((resp: any) => {
      if (resp.ok && resp.Reporte.length != 0) {
        console.log(resp);
        this.data_ReporteFicha.titulo = resp.Reporte[0].titulo
        if (resp.Reporte[0].id_representante) {
          forkJoin([this.tramiteService.getFicha_InfoTramite(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoSolicitante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRepresentante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRequerimientos(resp.Reporte[0].id_tramite)]).subscribe((results: any) => {
            if (results[0].ok && results[1].ok && results[2].ok && results[3].ok) {
              this.data_ReporteFicha.Tramite = results[0].Tramite[0]
              this.data_ReporteFicha.Solicitante = results[1].Solicitante[0]
              this.data_ReporteFicha.Representante = results[2].Representante[0]
              this.data_ReporteFicha.Requerimientos_presentados = results[3].Requerimientos
              this.obtener_Workflow(resp.Reporte[0].id_tramite, tipo)
            }
          })
        }
        else {
          forkJoin([this.tramiteService.getFicha_InfoTramite(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoSolicitante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRequerimientos(resp.Reporte[0].id_tramite)]).subscribe((results: any) => {
            if (results[0].ok && results[1].ok && results[2].ok) {
              this.data_ReporteFicha.Tramite = results[0].Tramite[0]
              this.data_ReporteFicha.Solicitante = results[1].Solicitante[0]
              this.data_ReporteFicha.Requerimientos_presentados = results[2].Requerimientos
              this.obtener_Workflow(resp.Reporte[0].id_tramite, tipo)
            }
          })
        }

      }
    })

  }
  crear_PDF(tipo: string) {
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../assets/img/gams.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION
    doc.addImage(img, 'png', 0, -5, 65, 40)
    doc.setFont("helvetica", "bold");
    doc.text("Ficha de tramite", 105, 20, undefined, "center");
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12)
    doc.text("Datos del tramite", 20, 40);
    doc.setFontSize(10)
    doc.setFont('helvetica', "normal");
    doc.text(`Tipo: ${this.data_ReporteFicha.titulo}`, 20, 50, {
      maxWidth: 80
    });
    doc.text(`Tramite: ${this.data_ReporteFicha.Tramite.alterno}`, 20, 60);
    doc.text(`Detalle: ${this.data_ReporteFicha.Tramite.detalle}`, 20, 65);
    doc.text(`Registrado: ${moment(parseInt(this.data_ReporteFicha.Tramite.Fecha_creacion)).format('DD-MM-YYYY HH:mm:ss')}`, 20, 70);
    doc.text(`Hojas: ${this.data_ReporteFicha.Tramite.cantidad}`, 20, 75);
    let segmento = this.data_ReporteFicha.Tramite.alterno.split('-')
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12)
    doc.text("Datos solicitante", 120, 40);
    doc.setFontSize(10)
    doc.setFont('helvetica', "normal");
    doc.text(`Nombre: ${this.data_ReporteFicha.Solicitante.nombres}  ${this.data_ReporteFicha.Solicitante.paterno}  ${this.data_ReporteFicha.Solicitante.materno}`, 120, 50);
    doc.text(`Dni: ${this.data_ReporteFicha.Solicitante.dni}  ${this.data_ReporteFicha.Solicitante.expedido}`, 120, 55);
    doc.text(`Telefono: ${this.data_ReporteFicha.Solicitante.telefono}`, 120, 60);

    let alturaTable: number = 80
    if (Object.keys(this.data_ReporteFicha.Representante).length != 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12)
      doc.text("Datos representante", 20, 80);
      doc.setFontSize(10)
      doc.setFont('helvetica', "normal");
      doc.text(`Nombre: ${this.data_ReporteFicha.Representante.nombres}  ${this.data_ReporteFicha.Representante.paterno}  ${this.data_ReporteFicha.Representante.materno}`, 20, 90);
      doc.text(`Dni: ${this.data_ReporteFicha.Representante.dni}  ${this.data_ReporteFicha.Representante.expedido}`, 20, 95);
      doc.text(`Telefono: ${this.data_ReporteFicha.Representante.telefono}`, 20, 100);
      alturaTable = 110
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12)
    doc.text("Requisitos presentados", 105, alturaTable, undefined, "center");

    let campos: string[][] = []
    this.data_ReporteFicha.Requerimientos_presentados.forEach((element: any, i: number) => {
      campos.push([++i, segmento[0], element.detalle])
    })
    autoTable(doc, {
      // startY : (doc as any).lastAutoTable.finalY,
      startY: alturaTable + 5,
      head: [['Numero', 'Tipo', 'Requisito']],
      body: campos,
      theme: 'grid',
      margin: { horizontal: 20 },
      headStyles: {
        'fillColor': [255, 255, 255],
        'textColor': [0, 0, 0]
      }
    })
    let lista_cronologica: any[] = []
    let posY = (doc as any).lastAutoTable.finalY;
    doc.text("Ruta del tramite", 105, posY + 10, undefined, "center");
    this.data_ReporteFicha.Cronologia.forEach((element: any) => {
      lista_cronologica.push([moment(parseInt(element.fecha_recibido)).format('DD-MM-YYYY HH:mm:ss'), moment(parseInt(element.fecha_recibido)).format('DD-MM-YYYY HH:mm:ss'), `${element.instEmi}-${element.depEmi}`, `${element.instRecep}-${element.depRecep}`, element.detalle])
    });
    
    if(lista_cronologica.length>0){
      autoTable(doc, {
        startY: posY + 15,
        head: [['Emision', 'Recepcion', 'Dependencia origen', 'Dependencia Destino', 'Motivo']],
        body: lista_cronologica,
        theme: 'grid',
        margin: { horizontal: 20 },
        headStyles: {
          'fillColor': [255, 255, 255],
          'textColor': [0, 0, 0]
        }
      })
    }
    else if(lista_cronologica.length==0){
      doc.text("El tramite aun no ha sido remitido", 105, posY + 20, undefined, "center");
    }
    
    switch (tipo) {
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
        doc.save('reporte_ficha.pdf')
        break;
      }

    }

    // doc.output('dataurlnewwindow')
  }
  obtener_Workflow(id_tramite: number, tipo: string) {
    this.reporteService.reporte_ficha_workflow(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.data_ReporteFicha.Cronologia = resp.Cronologia
        this.crear_PDF(tipo)
      }
    })
  }
}
