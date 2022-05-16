import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Layout } from '@swimlane/ngx-graph';
import * as moment from 'moment';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model';

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
  displayedColumns: string[] = ['Emisor', 'Receptor', 'Detalle', 'Enviado', 'Recibido']
  Participantes: any[] = []

  view:any=[700,350]
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
  info_Tramite: any


  constructor(
    private workflowService: WorkflowServiceService,
    private activateRoute: ActivatedRoute,
    private tramiteService: RegistroTramiteService
  ) { 
    this.view = [innerWidth / 1.3, 350];
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id_tramite = params['id'];
      this.obtener_Workflow(this.id_tramite)
      this.obtener_InfoTramite()
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
        console.log(resp.Funcionario[0]);
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
        })
      })
    });
  }

  hacerAlgo(data: any) {
    this.info_User = data
    this.listaWorkflow.find(object => {
      if (data.id_cuenta == object.id_cuentaEmisor) {
        let fecha1 = moment(new Date(parseInt(object.fecha_envio)));
        let fecha2 = moment(new Date(parseInt(object.fecha_recibido)))
        this.info_User['tiempo_empleado'] = { tiempo: moment(fecha2.diff(fecha1)).format('mm:ss'), formato: 'segunos' }
        // if(fecha2.diff(fecha1, 'seconds')>60){

        //   this.info_User['tiempo_empleado']={tiempo:fecha2.diff(fecha1, 'minutes'), formato:'minutos'}
        // }
        // else{
        //   this.info_User['tiempo_empleado']={tiempo:moment.duration(fecha2.diff(fecha1, 'seconds')).asDays(), formato:'segunos'}
        // }
      }
    });
    this.obtener_Observaciones(data.id_cuenta)
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
        console.log(resp);
        this.info_Tramite = resp.Tramite[0]
      }
    })
  }
  centerGraph() {
    this.center$.next(true)
  }
  onResize(event:any) {
    this.view = [event.target.innerWidth / 1.3, 350];
    console.log(this.view);
  }




}
