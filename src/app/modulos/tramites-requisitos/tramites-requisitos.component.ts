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
    { key: "fecha_creacion", titulo: "Fecha Creacion" }
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

  constructor(
    public dialog: MatDialog,
    private tipoTramitesService: TipoTramitesService
  ) { }

  ngOnInit(): void {
    this.obtner_TiposTramites_Habilitados()
    //evento se recibirar del compomete padre, que es adm-configuraiones
    this.eventoAgregar.subscribe(() => this.agregar_TipoTramite());
  }

  obtner_TiposTramites_Habilitados() {
    this.VerHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.tipoTramitesService.getTipoTramite_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if(resp.TiposTramites.length==0){
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
        if(resp.TiposTramites.length==0){
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
      data: { TipoTramite: {}, Requisitos: [] } //no se endia datos
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        dataDialog.TipoTramite.Activo = true
        dataDialog.TipoTramite.fecha_creacion = dataDialog.TipoTramite.fecha_actualizacion = this.getFecha()
        if (dataDialog.Requisitos.length == 0) {
          this.tipoTramitesService.addTipoTramite(dataDialog.TipoTramite).subscribe((resp: any) => {
            if (resp.ok) {
              this.msg.mostrarMensaje('success', resp.message)
              this.obtner_TiposTramites_Habilitados()
            }
          })
        }
        else {
          this.tipoTramitesService.addTipoTramite(dataDialog.TipoTramite).subscribe((resp: any) => {
            if (resp.ok) {
              dataDialog.Requisitos.forEach((requerimiento: Requerimientos) => {
                requerimiento.id_TipoTramite = resp.TipoTramite.insertId
                this.registrar_Requerimientos(requerimiento)
              })
              this.msg.mostrarMensaje("success", resp.message)
              this.obtner_TiposTramites_Habilitados()
            }
          })
        }
      }
    })
  }
  registrar_Requerimientos(datos: Requerimientos) {
    this.tipoTramitesService.addRequerimientos(datos).subscribe((resp: any) => {
      if (resp.ok) {
        console.log(resp);
      }
    })
  }



  editar_TipoTramite(datos: any) {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent, {
      data: { TipoTramite: datos, Requisitos: [], id_TipoTramite: datos.id_TipoTramite }
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        datosFormulario.TipoTramite.fecha_actualizacion = this.getFecha()
        if (datosFormulario.NuevosRequitos) { //actualizacion con registo de tramites
          this.tipoTramitesService.putTipoTramite(datos.id_TipoTramite, datosFormulario.TipoTramite).subscribe((resp: any) => {
            if (resp.ok) {
              datosFormulario.Requisitos.forEach((requerimiento: Requerimientos) => {
                requerimiento.id_TipoTramite = datos.id_TipoTramite
                this.registrar_Requerimientos(requerimiento)
              })
              this.obtner_TiposTramites_Habilitados()
              this.msg.mostrarMensaje('success', resp.message)
            }
          })
        }
        else {
          this.tipoTramitesService.putTipoTramite(datos.id_TipoTramite, datosFormulario.TipoTramite).subscribe((resp: any) => {
            if (resp.ok) {
              this.msg.mostrarMensaje('success', resp.message)
              this.obtner_TiposTramites_Habilitados()
            }
          })
        }
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
  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
}
