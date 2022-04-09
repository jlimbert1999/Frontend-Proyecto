import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Layout } from '@swimlane/ngx-graph';


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
  center$: Subject<boolean> = new Subject();
  dataSource=new MatTableDataSource()
  displayedColumns:string[]=['Emisor', 'Receptor', 'Detalle', 'Enviado', 'Recibido']
  Participantes:any[]=[]
  tipo_Grafico:string=""
  

  layout: any | Layout = 'dagreCluster';
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
  Info_user:any
  observacione_user:any
  info_Tramite:any
  ubicacion:any

  constructor(
    private workflowService: WorkflowServiceService,
    private activateRoute: ActivatedRoute,
    private tramiteService:RegistroTramiteService
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id_tramite = params['id'];
      this.obtener_Workflow(this.id_tramite)
      // this.obtener_InfoTramite()
    });
  }
  centerGraph() {
    this.center$.next(true)
  }

  obtener_Workflow(id_tramite: number) {
    this.workflowService.getWorkflow(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.listaWorkflow = resp.Workflow
        this.ubicacion=this.listaWorkflow[this.listaWorkflow.length-1]

        this.dataSource.data=resp.Workflow
        console.log(this.ubicacion);
        
        resp.Workflow.forEach((element: any) => {
          this.ids_Cuentas.push(element.id_cuentaEmisor)
          this.ids_Cuentas.push(element.id_cuentaReceptor)
        });
        
        //ids unicos
        let result = this.ids_Cuentas.filter((item, index) => {
          return this.ids_Cuentas.indexOf(item) === index;
        })
        console.log(result);

        this.crear_Nodos(result)
        this.crear_Vinculos()
        this.armar_tabla(result)
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
    console.log(this.nodos);
  }

  crear_Vinculos() {
    this.nodos.forEach((element: any) => {
      this.listaWorkflow.forEach((flujo: any, index: number) => {
        if (element.id == flujo.id_cuentaEmisor) {
          let aux = {
            id: `a${index}`,
            source: element.id,
            target: flujo.id_cuentaReceptor.toString(),
            label: `envio: Nro ${index+1}`
          }
          this.links.push(aux)
        }
      })
    })
  }
  armar_tabla(ids_Cuentas:number[]){
    //obtener participantes
    ids_Cuentas.forEach((element:any, index:number)=>{
      this.tramiteService.getDatosFuncionario(element).subscribe((resp:any)=>{
        this.Participantes.push(resp.Funcionario[0])
        this.nodos[index].data=resp.Funcionario[0]
        this.listaWorkflow.forEach((lista:any, i:number)=>{
          if(lista.id_cuentaEmisor==resp.Funcionario[0].id_cuenta){
            this.listaWorkflow[i]['NombreEmi']=`${resp.Funcionario[0].Nombre} ${resp.Funcionario[0].Apellido_P} ${resp.Funcionario[0].Apellido_M}`
          }
          if(lista.id_cuentaReceptor==resp.Funcionario[0].id_cuenta){
            this.listaWorkflow[i]['NombreRecep']=`${resp.Funcionario[0].Nombre} ${resp.Funcionario[0].Apellido_P} ${resp.Funcionario[0].Apellido_M}`
          }
        })
      })
    });
  }
  hacerAlgo() {
    console.log(this.tipo_Grafico);
    
  }
  click(dataNode:any) {
    this.Info_user=dataNode
    this.obtener_Observaciones(dataNode.id_cuenta)
    console.log(dataNode);
  }
  obtener_Observaciones(id_cuenta:number){
    this.tramiteService.getObservaciones_deUsuario(id_cuenta).subscribe((resp:any)=>{
      this.observacione_user=resp.Observaciones
    })
  }
  setLayout(layoutName: string): void {
    const layout = this.layouts.find(l => l.value === layoutName);
    this.layout = layoutName;
  }
  // obtener_InfoTramite(){
  //   this.tramiteService.getFicha(this.id_tramite).subscribe((resp: any) => {
  //     if (resp.ok) {
  //       this.info_Tramite=resp.Tramite[0]
  //     }
  //   })
  // }
 

}
