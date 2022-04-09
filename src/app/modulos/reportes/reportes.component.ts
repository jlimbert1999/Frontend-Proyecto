import { Component, OnInit } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  Reportes: string[] = ['Tramite realizados', 'Flujo']

  listaTramites:any
  id_cuenta=this.decodificarToken().id
  tipoReporte:number=0
  total:number=0
  listaWorkflow:any
  dataSource:any
  displayedColumns=['Tipo', 'Estado', 'Solicitante']
  displayedColumnss:string[]=['Emisor', 'Receptor', 'Detalle', 'Enviado', 'Recibido']
  mostrar_tabla=false
  alterno:any
  constructor( private tramiteService: RegistroTramiteService,
    private workflowService: WorkflowServiceService) { }

  ngOnInit(): void {
  }
  
  generar_Reporte(tipo: string) {
    if(tipo=='Tramite realizados'){
      this.tipoReporte=1
      this.tramiteService.getReporte().subscribe((resp: any) => {
        if (resp.ok) {
          this.listaTramites = resp.Reporte
          this.total=this.listaTramites.length
          console.log(this.listaTramites);
        }
      })
    }
    if(tipo=='Flujo'){
      this.tipoReporte=2
      
    }
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  obtener_Workflow(id: number) {
    this.workflowService.getWorkflow(id).subscribe((resp: any) => {
      if (resp.ok) {
        this.listaWorkflow = resp.Workflow
        this.dataSource=resp.Workflow
        console.log(resp);
      }
    })
  }
  obtenerId(){
    this.tramiteService.getReporteFlujo({alterno:this.alterno}).subscribe((resp:any)=>{
      if(resp.ok)
      {
        console.log(resp.Reporte[0].id_tramite);
        if(resp.Reporte.length>0){
          this.obtener_Workflow(37)
        }
      }
    })

  }


}
