import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ReportesService } from 'src/app/servicios/servicios-m5/reportes.service';

@Component({
  selector: 'app-reporte-estadistico',
  templateUrl: './reporte-estadistico.component.html',
  styleUrls: ['./reporte-estadistico.component.css']
})
export class ReporteEstadisticoComponent implements OnInit {
  single: any
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [800, 400];
  Tramites_realizados:any[]=[]
  Titulo_reporte:string=""
  lista_datos:any
  public legendPosition: LegendPosition = LegendPosition.Right;
  
  constructor(private reporteService: ReportesService) { }

  ngOnInit(): void {
    this.Titulo_reporte = 'Porcentaje tramites'
    this.obtener_reporte_tramitesRealizados()
    
  }
  obtener_reporte_Funcionarios() {

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

  obtener_reporte_tramitesRealizados() {
    
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
  seleccionar_tipo(tipo:string){
    if(tipo=='Numero tramites Registrados'){
      this.Titulo_reporte = 'Numero tramites Registrados'
      this.obtener_reporte_Funcionarios()
    }
    if(tipo=='Porcentaje tramites'){
      this.Titulo_reporte = 'Porcentaje tramites'
      this.obtener_reporte_tramitesRealizados()
      
    }
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

}
