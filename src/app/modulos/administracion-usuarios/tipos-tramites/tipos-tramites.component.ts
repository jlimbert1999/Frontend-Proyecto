import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogTramitesRequisitosComponent } from 'src/app/componentes/dialogs/dialogs-m2/dialog-tramites-requisitos/dialog-tramites-requisitos.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos';
import { TipoTramite } from 'src/app/modelos/tramites-requisitos/Tipo_Tramite.model';
import { TipoTramitesService } from 'src/app/servicios/servicios-m2/tipo-tramites.service';

@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  styleUrls: ['./tipos-tramites.component.css']
})
export class TiposTramitesComponent implements OnInit {

  //configuracion tabla
  displayedColumns = [
    { key: "titulo", titulo: "Titulo" },
    { key: "sigla", titulo: "Sigla" },
    { key: "segmento", titulo: "Segmento" },
    { key: "Fecha_creacion", titulo: "Fecha Creacion" }
    // { key: "Activo", titulo: "Habilitado" }
  ]
  OpcionesTabla: string[] = ['Editar', 'Eliminar']
  dataSource = new MatTableDataSource();

  TramitesHabilitados: TipoTramite[] = []
  TramitesNoHabilitados: TipoTramite[] = []
  VerHabilitados: boolean = true
  Requisitos: Requerimientos[] = []
  msg = new Mensajes()
  modo_busqueda:boolean=false

  constructor(public dialog: MatDialog,
    private tipoTramitesService: TipoTramitesService) { }


  ngOnInit(): void {
    this.obtner_TiposTramites_Habilitados()
    
  }

  obtner_TiposTramites_Habilitados() {
    this.VerHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.tipoTramitesService.getTipoTramite_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.TiposTramites.length == 0) {
          this.msg.mostrarMensaje('info', resp.message)
        }
        this.TramitesHabilitados = resp.TiposTramites
        this.dataSource.data = this.TramitesHabilitados
      }

    })
  }
  obtner_TiposTramites_NoHabilitados() {
    this.tipoTramitesService.getTipoTramite_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.TiposTramites.length == 0) {
          this.msg.mostrarMensaje('info', resp.message)
        }
        this.TramitesNoHabilitados = resp.TiposTramites
        this.dataSource.data = this.TramitesNoHabilitados
      }

    })
  }
  eliminar_TipoTramite(datos: any) {
    let id = datos.id_TipoTramite
    this.tipoTramitesService.deleteTipoTramite(id).subscribe((resp: any) => {
      if (resp.ok) {
        this.obtner_TiposTramites_Habilitados()
      }
    })
  }

  agregar_TipoTramite() {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent, {
      // width: '50%',
      data: {} //no se endia datos
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        this.obtner_TiposTramites_Habilitados()
      }
    })
  }




  editar_TipoTramite(datos: any) {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent, {
      width: '60%',
      data: datos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.obtner_TiposTramites_Habilitados()
      }
    })
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  Ver_NoHabilitados() {
    this.VerHabilitados = !this.VerHabilitados
    if (this.VerHabilitados) {
      this.dataSource.data = this.TramitesHabilitados
      this.OpcionesTabla = ['Editar', 'Eliminar']
    }
    else {
      this.obtner_TiposTramites_NoHabilitados()
      this.OpcionesTabla = ['Editar']
    }
  }
  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }
  getFecha() {
    return Date.now()
  }

}
