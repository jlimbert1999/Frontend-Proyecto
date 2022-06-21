import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Layout } from '@swimlane/ngx-graph';
import * as moment from 'moment';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model';
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import { Location } from '@angular/common';
import { SolicitanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
@Component({
  selector: 'app-seguimiento-tramites',
  templateUrl: './seguimiento-tramites.component.html',
  styleUrls: ['./seguimiento-tramites.component.css']
})
export class SeguimientoTramitesComponent implements OnInit {
  nodos: any[] = []
  links: any[] = []
  ids_Cuentas: number[] = []
  id_tramite: number = 0
  listaWorkflow: any[] = []
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['Emisor', 'Enviado', 'Receptor', 'Recibido', 'Duracion']
  Participantes: any[] = []
  view: [number, number]

  // Variables para grafica
  layout: any | Layout = 'dagre';
  center$: Subject<boolean> = new Subject();
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];
  info_User: any
  observacione_user: any
  Tramite: TramiteModel
  Solicitante: SolicitanteModel


  constructor(
    private workflowService: WorkflowServiceService,
    private activateRoute: ActivatedRoute,
    private tramiteService: RegistroTramiteService,
    private _location: Location
  ) {
    this.view = [innerWidth, innerHeight];

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id_tramite = params['id'];
      this.obtener_Workflow(this.id_tramite)
      this.obtener_InfoTramite()
      this.obtener_Datos_Solicitante(this.id_tramite)
    });

  }


  obtener_Workflow(id_tramite: number) {
    this.workflowService.getWorkflow(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.listaWorkflow = resp.Workflow
        this.dataSource.data = resp.Workflow
        resp.Workflow.forEach((element: any) => {
          
          if (!this.ids_Cuentas.includes(element.id_cuentaEmisor)) {
            this.ids_Cuentas.push(element.id_cuentaEmisor)
          }
          if (!this.ids_Cuentas.includes(element.id_cuentaReceptor)) {
            this.ids_Cuentas.push(element.id_cuentaReceptor)
          }
        });
        this.crear_Nodos(this.ids_Cuentas)
        this.crear_Vinculos()
        this.armar_tabla(this.ids_Cuentas)
      }
    })
  }

  crear_Nodos(elementos: number[]) {
    elementos.forEach((element: any) => {
      let aux = {
        id: element.toString(),
        label: `funcionario${element}`
      }
      this.nodos.push(aux)
    })
  }

  crear_Vinculos() {
    this.nodos.forEach((element: any) => {
      this.listaWorkflow.forEach((flujo: any, index: number) => {
        if (element.id == flujo.id_cuentaEmisor) {
          let aux = {
            id: `a${index}`,
            source: element.id,
            target: flujo.id_cuentaReceptor.toString(),
            label: `envio: Nro ${index + 1}`
          }
          this.links.push(aux)
        }
      })
    })
  }
  armar_tabla(ids_Cuentas: number[]) {
    ids_Cuentas.forEach((element: any, index: number) => {
      this.tramiteService.getDatosFuncionario(element).subscribe((resp: any) => {
        this.Participantes.push(resp.Funcionario[0])
        this.nodos[index].data = resp.Funcionario[0]
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
          //duracion
          let fecha1: any = 0
          let fecha2: any = 0
          if (i == 0) {
            fecha1 = moment(new Date(parseInt(this.Tramite.Fecha_creacion.toString())));
            fecha2 = moment(new Date(parseInt(this.listaWorkflow[i]['fecha_envio'])));
          }
          else if (i > 0) {
            fecha1 = moment(new Date(parseInt(this.listaWorkflow[i - 1]['fecha_recibido'])));
            fecha2 = moment(new Date(parseInt(this.listaWorkflow[i]['fecha_envio'])));

          }
          // fecha1 = moment(new Date(parseInt(this.listaWorkflow[i]['fecha_envio'])));
          // fecha2 = moment(new Date(parseInt(this.listaWorkflow[i]['fecha_recibido'])));

          let duration = moment.duration(fecha2.diff(fecha1));
          let years = duration.years(),
            months = duration.months(),
            days = duration.days(),
            hrs = duration.hours(),
            mins = duration.minutes(),
            secs = duration.seconds();
          this.listaWorkflow[i]['Duracion'] = days + ' Dia ' + hrs + ' hrs ' + mins + ' mins ' + secs + ' seg.'
        })
      })
    });
  }

  obtener_info_funcionario(data: any) {
    this.info_User = data
    const index = this.listaWorkflow.findIndex((item: any) => item.id_cuentaEmisor == this.info_User.id_cuenta);
    this.info_User['tiempo_empleado'] = this.listaWorkflow[index].Duracion
    
    // this.obtener_Observaciones(data.id_cuenta)
  }
  obtener_Observaciones(id_cuenta: number) {
    this.tramiteService.getObservaciones_deUsuario(id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        this.observacione_user = resp.Observaciones
      }
    })
  }
  setLayout(layoutName: string): void {
    const layout = this.layouts.find(l => l.value === layoutName);
    this.layout = layoutName;
  }
  obtener_InfoTramite() {
    this.tramiteService.getFicha_InfoTramite(this.id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tramite = resp.Tramite[0]
      }
    })
  }
  obtener_Datos_Solicitante(id_tramite: number) {
    this.tramiteService.getFicha_InfoSolicitante(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Solicitante = resp.Solicitante[0]
      }
    })
  }
  centerGraph() {
    this.center$.next(true)
  }
  regresar() {
    this._location.back();
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth , event.target.innerHeight/1.35];
  }





}
