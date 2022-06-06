import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';
import { ReportesService } from 'src/app/servicios/servicios-m5/reportes.service';
import { LegendPosition } from '@swimlane/ngx-charts';


import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';

import jsPDF from 'jspdf';

import * as moment from 'moment'; // add this 1 of 4
import { forkJoin } from 'rxjs';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportesComponent implements OnInit {
  Reportes: string[] = ['Tramite realizados', 'Flujo']
  Tramites_realizados: any[] = []
  public legendPosition: LegendPosition = LegendPosition.Right;

  listaTramites: any
  info_cuenta_Actual = this.decodificarToken()
  tipoReporte: number = 0
  total: number = 0
  listaWorkflow: any
  dataSource: any
  displayedColumns = ['Tipo', 'Estado', 'Solicitante']
  displayedColumnss: string[] = ['Emisor', 'Receptor', 'Detalle', 'Enviado', 'Recibido']
  mostrar_tabla = false
  alterno: any

  // single: any[];
  view: [number, number] = [800, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  single: any = [
    {
      "name": "Germany",
      "value": 2
    },
    {
      "name": "USA",
      "value": 666000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    }
  ];
  tipo_reporte: string
  lista_datos: any
  lsita_solicitantes: any
  Titulo_reporte: string

  data_ReporteFicha = {
    Solicitante: <any>{},
    Tramite: <any>{},
    Representante: <any>{},
    Requerimientos_presentados: <any>{},
    titulo: '',
    Flujo: <any>{}
  }
  ids_Cuentas: number[] = []
  Lista_Cronologica: any[] = []
  estados_tramite = ['Inscrito', 'Observado', 'Concluido', 'Anulado', 'En revision']
  fecha_desde: any
  fecha_hasta: any
  constructor(private tramiteService: RegistroTramiteService,
    private workflowService: WorkflowServiceService, private reporteService: ReportesService) {


  }

  ngOnInit(): void {
    // this.generar_Reporte('Tramite realizados')
    this.obtener_reporte_tramitesRealizados()
  }

  generar_Reporte(tipo: string) {
    if (tipo == 'Tramite realizados') {
      this.tipoReporte = 1
      this.tramiteService.getReporte().subscribe((resp: any) => {
        if (resp.ok) {
          this.listaTramites = resp.Reporte
          this.total = this.listaTramites.length
        }
      })
    }
    if (tipo == 'Flujo') {
      this.tipoReporte = 2

    }
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }





  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  obtener_reporte_tramitesRealizados() {
    this.Titulo_reporte = 'Tramites realizados'
    this.tipo_reporte = "Tramites_realizados"
    this.Tramites_realizados = []
    this.reporteService.obtener_tramites_realizados().subscribe((resp: any) => {
      if (resp.ok) {
        this.lista_datos = resp.Tramites
        let nombres: string[] = []
        let contador: any
        resp.Tramites.forEach((element: any, index: number) => {
          if (!nombres.includes(element.titulo)) {
            contador = resp.Tramites.filter((user: any) => user.id_TipoTramite == element.id_TipoTramite)
            this.Tramites_realizados.push({ name: element.titulo, value: contador.length })
            nombres.push(element.titulo)
          }
        });
        this.single = this.Tramites_realizados
      }
    })
  }
  obtener_reporte_Funcionarios() {
    this.Titulo_reporte = 'Funcionarios'
    this.tipo_reporte = "Tramites_funcionarios"
    this.Tramites_realizados = []
    this.reporteService.obtener_tramites_funcionarios().subscribe((resp: any) => {
      if (resp.ok) {
        let ids_cuentas: number[] = []
        let contador: any
        resp.Tramites.forEach((element: any, index: number) => {
          if (!ids_cuentas.includes(element.id_cuenta)) {
            contador = resp.Tramites.filter((user: any) => user.id_cuenta == element.id_cuenta)
            this.Tramites_realizados.push({ name: `${element.Nombre} ${element.Apellido_P} ${element.Apellido_M}`, value: contador.length })
            ids_cuentas.push(element.id_cuenta)
          }
        });
        this.single = this.Tramites_realizados
      }
    })
  }
  obtener_reporte_Solicitantes() {
    this.Titulo_reporte = 'Solicitantes'
    this.tipo_reporte = "Tramites_solicitante"
    this.reporteService.obtener_tramites_solicitante().subscribe((resp: any) => {
      if (resp.ok) {
        this.lsita_solicitantes = resp.Tramites
      }
    })
  }
  obtener_ficha_tramite() {
    this.tipo_reporte = "reporte_ficha"
    this.Titulo_reporte = 'Ficha'
  }
  obtener_reporte_Estado() {
    this.tipo_reporte = "reporte_estado"
    this.Titulo_reporte = 'Estado'
  }
  generar_reporte_estado(tramite_estado: string) {
    this.reporteService.obtener_tramites_estado({ estado: tramite_estado }).subscribe((resp: any) => {
      if (resp.ok) {
        let aux: any[] = []
        resp.Tramites.forEach((element: any, index: number) => {
          aux.push([++index, element.alterno, element.estado, moment(parseInt(element.Fecha_creacion)).format('DD-MM-YYYY HH:mm:ss'), element.titulo])
        })
        this.Crear_PDF_estados(aux)
      }
    })
  }

  generar_reporte_ficha(alterno: string) {

    this.data_ReporteFicha.Representante = {}
    this.data_ReporteFicha.Solicitante = {}
    this.data_ReporteFicha.Tramite = {}
    this.data_ReporteFicha.Requerimientos_presentados = {}
    this.data_ReporteFicha.Flujo = {}
    let parametros_busqueda = {
      alterno
    }
    this.reporteService.reporte_ficha(parametros_busqueda).subscribe((resp: any) => {
      if (resp.ok && resp.Reporte.length != 0) {
        this.data_ReporteFicha.titulo = resp.Reporte[0].titulo

        if (resp.Reporte[0].id_representante) {
          forkJoin([this.tramiteService.getFicha_InfoTramite(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoSolicitante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRepresentante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRequerimientos(resp.Reporte[0].id_tramite)]).subscribe((results: any) => {
            if (results[0].ok && results[1].ok && results[2].ok && results[3].ok) {
              this.data_ReporteFicha.Tramite = results[0].Tramite[0]
              this.data_ReporteFicha.Solicitante = results[1].Solicitante[0]
              this.data_ReporteFicha.Representante = results[2].Representante[0]
              this.data_ReporteFicha.Requerimientos_presentados = results[3].Requerimientos
              this.obtener_Workflow(resp.Reporte[0].id_tramite)
            }
          })
        }
        else {
          forkJoin([this.tramiteService.getFicha_InfoTramite(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoSolicitante(resp.Reporte[0].id_tramite), this.tramiteService.getFicha_InfoRequerimientos(resp.Reporte[0].id_tramite)]).subscribe((results: any) => {
            if (results[0].ok && results[1].ok && results[2].ok) {
              this.data_ReporteFicha.Tramite = results[0].Tramite[0]
              this.data_ReporteFicha.Solicitante = results[1].Solicitante[0]
              this.data_ReporteFicha.Requerimientos_presentados = results[2].Requerimientos
              this.obtener_Workflow(resp.Reporte[0].id_tramite)
            }
          })
        }
      }
    })

  }
  obtener_Workflow(id_tramite: number) {
    this.workflowService.getWorkflow(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.listaWorkflow = resp.Workflow
        resp.Workflow.forEach((element: any) => {
          if (!this.ids_Cuentas.includes(element.id_cuentaEmisor)) {
            this.ids_Cuentas.push(element.id_cuentaEmisor)
          }
          if (!this.ids_Cuentas.includes(element.id_cuentaReceptor)) {
            this.ids_Cuentas.push(element.id_cuentaReceptor)
          }
        });
        this.ids_Cuentas.forEach((element: any, index: number) => {
          this.tramiteService.getDatosFuncionario(element).subscribe((resp: any) => {

            this.listaWorkflow.forEach((lista: any, i: number) => {
              if (lista.id_cuentaEmisor == resp.Funcionario[0].id_cuenta) {
                this.listaWorkflow[i]['NombreEmi'] = `${resp.Funcionario[0].Nombre} ${resp.Funcionario[0].Apellido_P} ${resp.Funcionario[0].Apellido_M}`
                this.listaWorkflow[i]['CargoEmi'] = `${resp.Funcionario[0].NombreCar}`
                this.listaWorkflow[i]['NombreDepEmi'] = `${resp.Funcionario[0].NombreDep}`
                this.listaWorkflow[i]['NombreInstEmi'] = `${resp.Funcionario[0].Sigla}`
              }
              if (lista.id_cuentaReceptor == resp.Funcionario[0].id_cuenta) {
                this.listaWorkflow[i]['NombreRecep'] = `${resp.Funcionario[0].Nombre} ${resp.Funcionario[0].Apellido_P} ${resp.Funcionario[0].Apellido_M}`
                this.listaWorkflow[i]['CargoRecep'] = `${resp.Funcionario[0].NombreCar}`
                this.listaWorkflow[i]['NombreDepRecep'] = `${resp.Funcionario[0].NombreDep}`
                this.listaWorkflow[i]['NombreInstRecep'] = `${resp.Funcionario[0].Sigla}`
              }
            })

          })

        });
        this.Crear_PDF_ficha()
      }
    })
  }


  // *************************************
  Crear_PDF_ficha() {
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
    doc.text(`Tipo: ${this.data_ReporteFicha.titulo}`, 20, 50);
    doc.text(`Tramite: ${this.data_ReporteFicha.Tramite.alterno}`, 20, 55);
    doc.text(`Detalle: ${this.data_ReporteFicha.Tramite.detalle}`, 20, 60);
    doc.text(`Registrado: ${moment(parseInt(this.data_ReporteFicha.Tramite.Fecha_creacion)).format('DD-MM-YYYY HH:mm:ss')}`, 20, 65);
    doc.text(`Hojas: ${this.data_ReporteFicha.Tramite.cantidad}`, 20, 70);
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
    let lista_workflow: any[] = []
    this.listaWorkflow.forEach((element: any) => {
      lista_workflow.push([moment(parseInt(element.fecha_envio)).format('DD-MM-YYYY HH:mm:ss'), moment(parseInt(element.fecha_recibido)).format('DD-MM-YYYY HH:mm:ss'), element.NombreDepEmi, element.NombreDepRecep, element.detalle])

    });
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
    let posY = (doc as any).lastAutoTable.finalY;
    doc.text("Ruta del tramite", 105, posY + 10, undefined, "center");
    autoTable(doc, {
      startY: posY + 15,
      head: [['Emision', 'Recepcion', 'Dependencia origen', 'Dependencia Destino', 'Motivo']],
      body: lista_workflow,
      theme: 'grid',
      margin: { horizontal: 20 },
      headStyles: {
        'fillColor': [255, 255, 255],
        'textColor': [0, 0, 0]
      }
    })

    doc.output('dataurlnewwindow')
  }
  Crear_PDF_estados(listado: any[]) {
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
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)

    autoTable(doc, {
      startY: 40,
      head: [['Numero', 'Codigo', 'Estado', 'Creacion', 'Titulo']],
      body: listado,
      theme: 'grid',
      margin: { horizontal: 20 },
      headStyles: {
        'fillColor': [255, 255, 255],
        'textColor': [0, 0, 0]
      }
    })

    doc.output('dataurlnewwindow')
  }






}

