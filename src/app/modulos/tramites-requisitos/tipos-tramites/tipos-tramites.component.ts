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

  displayedColumns = [
    { key: "titulo", titulo: "Titulo" },
    { key: "sigla", titulo: "Sigla" },
    { key: "segmento", titulo: "Segmento" },
    { key: "Fecha_creacion", titulo: "Fecha Creacion" }
  ]
  OpcionesTabla: string[] = ['Editar', 'Eliminar']
  dataSource = new MatTableDataSource();

  Tipos_Tramites: TipoTramite[] = []
  TramitesNoHabilitados: TipoTramite[] = []
  VerHabilitados: boolean = true
  Requisitos: Requerimientos[] = []
  msg = new Mensajes()
  modo_busqueda: boolean = false

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
        this.Tipos_Tramites = resp.TiposTramites
        this.dataSource.data = this.Tipos_Tramites
      }

    })
  }
  obtner_TiposTramites_NoHabilitados() {
    this.OpcionesTabla = ['Editar', 'Habilitar']
    this.tipoTramitesService.getTipoTramite_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.TiposTramites.length == 0) {
          this.msg.mostrarMensaje('info', "No hay tramites deshabilitados")
        }
        this.Tipos_Tramites = resp.TiposTramites
        this.dataSource.data = this.Tipos_Tramites
      }

    })
  }
  agregar_TipoTramite() {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent, {
      width: '700px',
      data: {}
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        this.Tipos_Tramites.unshift(dataDialog)
        this.dataSource.data = this.Tipos_Tramites
      }
    })
  }
  editar_TipoTramite(datos: any) {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent, {
      width: '700px',
      data: datos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        const index = this.Tipos_Tramites.findIndex((item: TipoTramite) => item.id_TipoTramite == datosFormulario.id_TipoTramite);
        this.Tipos_Tramites[index] = datosFormulario
        this.dataSource.data = this.Tipos_Tramites
      }
    })
  }
  eliminar_TipoTramite(datos: any) {
    let id = datos.id_TipoTramite
    this.tipoTramitesService.deleteTipoTramite(id).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tipos_Tramites = this.Tipos_Tramites.filter(elemento => elemento.id_TipoTramite !== datos.id_TipoTramite);
        this.dataSource.data = this.Tipos_Tramites
      }
    })
  }
  habilitar_TipoTramite(datos: any) {
    this.tipoTramitesService.putTipoTramite(datos.id_TipoTramite, { Activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tipos_Tramites = this.Tipos_Tramites.filter(elemento => elemento.id_TipoTramite !== datos.id_TipoTramite);
        this.dataSource.data = this.Tipos_Tramites

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
      this.obtner_TiposTramites_Habilitados()
    }
    else {
      this.obtner_TiposTramites_NoHabilitados()

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
