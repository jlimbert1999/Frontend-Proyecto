import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { ConsultaService } from 'src/app/servicios/servicios-m4/consulta.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  Codigo_Tramite:string=""
  Tramite:any //informacion del tramite
  Observaciones_Tramite:any[]=[]
  displayedColumns: string[] = ['descripcion', 'estado', 'fecha_registro'];

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor( 
    private tramiteService: RegistroTramiteService,
    private consultaService:ConsultaService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  obtener_Observaciones(id_tramite: number) {
    this.Observaciones_Tramite = []
    this.tramiteService.getObservaciones(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
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
  Obtener_Informacion_Tramite(){
    // this.obtener_Observaciones(39)
    this.consultaService.get_InformacionTramite({Alterno:this.Codigo_Tramite}).subscribe((resp:any)=>{
      if(resp.Tramite.length>0){
        this.Tramite=resp.Tramite[0]
        this.obtener_Observaciones(resp.Tramite[0].id_tramite)
      }
      else{
        this.abrir_Mensaje('No se econtro el codigo ingresado')
      }
    })
  }
  abrir_Mensaje(Mensaje:string){
    this._snackBar.open(Mensaje, '', {
      duration: 3000
    });
  }

  

}
