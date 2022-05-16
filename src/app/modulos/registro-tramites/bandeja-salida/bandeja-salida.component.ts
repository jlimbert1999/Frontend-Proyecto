import { Component, OnInit } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { identifierModuleUrl } from '@angular/compiler';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';

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

  constructor(private tramiteService: BandejaService, private router:Router, private _snackBar: MatSnackBar,) {
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
        this.Tramites_Emitidos=resp.Tramites_Recibidos
        console.log(this.Tramites_Emitidos);
      }
    })
  }


  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  ver_flujo(id_tramite:number){
    // let id_tramite = this.DatosEnvio.id_tramite
    this.router.navigate(['Workflow', id_tramite])

  }

  abrir_DialogRemision(DatosEnvio:any) {
    console.log(DatosEnvio);
    let tramite = {
      id_tramite: DatosEnvio.id_tramite,
      Titulo: DatosEnvio.titulo,
      Alterno: DatosEnvio.alterno
    }
    // //enviar id para que las bandeja obtengan datos desde la trabla workflow

    let snackBarRef = this._snackBar.openFromComponent(DialogRemisionComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar'],
      data: tramite
    });
    snackBarRef.onAction().subscribe(() => {
      this.obtener_bandejaSalida()
      // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
    })

  }
  

  

}
