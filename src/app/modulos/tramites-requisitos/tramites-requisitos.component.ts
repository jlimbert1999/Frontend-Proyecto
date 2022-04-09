import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTramitesRequisitosComponent } from 'src/app/componentes/dialogs/dialogs-m2/dialog-tramites-requisitos/dialog-tramites-requisitos.component';

//servicios
import { TipoTramitesService } from '../../servicios/servicios-m2/tipo-tramites.service';

//modelos
import { TipoTramite } from '../../modelos/tramites-requisitos/Tipo_Tramite.model'
import { MatTableDataSource } from '@angular/material/table';
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'
@Component({
  selector: 'app-tramites-requisitos',
  templateUrl: './tramites-requisitos.component.html',
  styleUrls: ['./tramites-requisitos.component.css']
})
export class TramitesRequisitosComponent implements OnInit {
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
  @Input() eventoAgregar: any; //es un evento @Input() events: Observable<void>;
  @Input() eventoVer:any  //es un evento para cambiar vista
  constructor(
    public dialog: MatDialog,
    private tipoTramitesService: TipoTramitesService
  ) { }

  ngOnInit(): void {
    this.obtner_TiposTramites_Habilitados()
    //evento se recibirar del compomete padre, que es adm-configuraiones
    this.eventoAgregar.subscribe(() => this.agregar_TipoTramite());
    this.eventoVer.subscribe(()=>this.Ver_NoHabilitados())
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
      width: '50%',
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
  getFecha() {
    return Date.now()
  }
}
