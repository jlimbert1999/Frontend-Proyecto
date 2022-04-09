import { Component, OnInit } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { identifierModuleUrl } from '@angular/compiler';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css']
})
export class BandejaSalidaComponent implements OnInit {
  Info_Cuenta_Actual = this.decodificarToken()
  Tramites_Emitidos:any[]=[]

  breakpoint:number=3
  rowHeight:any='100%'
  colSpawn:number=2

  expandedIndex = 0;

  constructor(private tramiteService: RegistroTramiteService) {
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : 3;
    if(this.breakpoint==3){
      this.rowHeight='100%'
      this.colSpawn=2
      
    }
    else{
      this.rowHeight='50%'
      this.colSpawn=1
    }

    this.obtener_bandejaSalida()
  }
  onResize(event:any) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : 3;
    if(this.breakpoint==3){
      this.rowHeight='100%'
      this.colSpawn=2
    }
    else{
      this.rowHeight='50%'
      this.colSpawn=1
    }
  }
  
  obtener_bandejaSalida(){
    this.tramiteService.getListaEmitida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp:any)=>{
      if(resp.ok){
        this.Tramites_Emitidos=resp.Tramites
      }
    })
  }


  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  

}
