import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { identifierModuleUrl } from '@angular/compiler';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css']
})
export class BandejaSalidaComponent implements OnInit {
  Info_Cuenta_Actual = this.decodificarToken()
  Tramites_Emitidos: any[] = []

  expandedIndex = 0;
  aux_busqueda: any[] = [] //para realizar bsuquedas guardar los valores recuperados antes
  modo_busqueda:boolean=false
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private tramiteService: BandejaService, private router: Router, public dialog: MatDialog) {
  }


  ngOnInit(): void {
    

    this.obtener_bandejaSalida()
  }
  

  obtener_bandejaSalida() {
    this.tramiteService.getListaEmitida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tramites_Emitidos = resp.Tramites_Recibidos
        this.aux_busqueda = resp.Tramites_Recibidos
      }
    })
  }


  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  ver_flujo(id_tramite: number) {
    // let id_tramite = this.DatosEnvio.id_tramite
    this.router.navigate(['inicio/Workflow', id_tramite])

  }

  abrir_DialogRemision(DatosEnvio: any) {
    let tramite = {
      id_tramite: DatosEnvio.id_tramite,
      Titulo: DatosEnvio.titulo,
      Alterno: DatosEnvio.alterno
    }
    // //enviar id para que las bandeja obtengan datos desde la trabla workflow

    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: tramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if(dataDialog){
        this.obtener_bandejaSalida()
      }
     
      // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
    })


  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Tramites_Emitidos = this.aux_busqueda.filter(obj => Object.values(obj).some((val: any) => val.toString().toLowerCase().includes(filterValue)));
    if (filterValue == "" || filterValue == null) {
      this.Tramites_Emitidos = this.aux_busqueda
    }
  }
  desactivar_busqueda(){
    this.modo_busqueda=false
    this.Tramites_Emitidos = this.aux_busqueda
    
  }
  cerrar_busqueda() {
    
  }
  recargar() {
    this.obtener_bandejaSalida()
  }
  filtrar_listado(tipo: string) {
    if (tipo == "Aceptados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.aceptado == true || tramite.aceptado == 1)
    }
    else if (tipo == "Enviados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.aceptado == false && tramite.rechazado == false)
    }
    else if (tipo == "Rechazados") {
      this.Tramites_Emitidos = this.aux_busqueda.filter((tramite: any) => tramite.rechazado == true)
    }
    else if (tipo == "Todos") {
      this.Tramites_Emitidos = this.aux_busqueda
    }


  }




}
