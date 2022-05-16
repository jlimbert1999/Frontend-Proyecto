import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoTramitesService } from 'src/app/servicios/servicios-m2/tipo-tramites.service';
import { TipoTramite } from 'src/app/modelos/tramites-requisitos/Tipo_Tramite.model'
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'
import { DialogRequisitosComponent } from '../dialog-requisitos/dialog-requisitos.component';

@Component({
  selector: 'app-dialog-tramites-requisitos',
  templateUrl: './dialog-tramites-requisitos.component.html',
  styleUrls: ['./dialog-tramites-requisitos.component.css']
})
export class DialogTramitesRequisitosComponent implements OnInit {
  msg = new Mensajes()
  tituloDialog: string = '';
  Tipo_Tramite: TipoTramite = {
    titulo: '',
    sigla: '',
    segmento: '',
    Fecha_creacion: 0,
    Fecha_actualizacion: 0,
    Activo: true
  }
  Requerimientos: Requerimientos[] = []
  displayedColumns: string[] = [];
  verHabilitados: boolean = true



  @ViewChild('tablaRequisitos') tablaRequisitos: any;  //observar cambios tabla

  constructor(
    @Inject(MAT_DIALOG_DATA) public DatosTramite: any,
    private tipoTramitesService: TipoTramitesService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.generar_TituloDialog()
  }

  getFecha() {
    return Date.now()
  }
  recargarRequisitosTabla() {
    if (this.tablaRequisitos) {   //esperar a que tabla sea visible
      this.tablaRequisitos.renderRows(); //actulizar tabla
    }
  }

  generar_TituloDialog() {
    if (Object.keys(this.DatosTramite).length == 0) {
      this.tituloDialog = "Registro tipo de tramite"
      this.displayedColumns = ['descripcion',  'opciones'];
      this.DatosTramite.NuevosRequitos = true
      //si es nuevo el boton de eliminar no se mostrara
    }
    else {
      this.tituloDialog = "Edicion tipo de tramite"
      this.displayedColumns = ['descripcion','Fecha_creacion', 'opciones'];  //, 'habilitado'
      this.Tipo_Tramite = this.DatosTramite
      this.obtener_Requerimientos_habilitados_Tramite(this.DatosTramite.id_TipoTramite)
    }
  }
  agregar_TipoTramite() {
    this.Tipo_Tramite.Fecha_creacion = this.Tipo_Tramite.Fecha_actualizacion = this.getFecha()
    this.tipoTramitesService.addTipoTramite(this.Tipo_Tramite).subscribe((resp: any) => {
      if (resp.ok) {
        if (this.Requerimientos.length > 1) {
          this.Requerimientos.forEach((requisito: Requerimientos) => {
            requisito.id_TipoTramite = resp.TipoTramite.insertId
            this.tipoTramitesService.addRequerimientos(requisito).subscribe()
          })
          this.msg.mostrarMensaje('success', 'Tramite y requisitos registrados')
        }
        else {
          this.msg.mostrarMensaje('success', 'Tramite registrado')
        }
      }
    })
  }
  editar_tipoTramite() {
    this.tipoTramitesService.putTipoTramite(this.DatosTramite.id_TipoTramite, this.Tipo_Tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }
  registrar_datos() {
    if (this.tituloDialog == "Registro tipo de tramite") {
      this.agregar_TipoTramite()
    }
    else if (this.tituloDialog == "Edicion tipo de tramite") {
      this.editar_tipoTramite()
    }
  }

  agregar_requisito() {
    const dialogRef = this.dialog.open(DialogRequisitosComponent, {
      data: { Activo: true }
    })
    dialogRef.afterClosed().subscribe((dataDialog) => {
      if (dataDialog) {
        let requerimiento: Requerimientos = {
          detalle: dataDialog.detalle,
          id_documento: dataDialog.id_documento,
          Fecha_creacion: this.getFecha(),
          Fecha_actualizacion: this.getFecha(),
          Activo: true
        }
        if (this.tituloDialog == "Registro tipo de tramite") {
          this.Requerimientos.push(requerimiento)
          this.recargarRequisitosTabla()
        }
        else if (this.tituloDialog == "Edicion tipo de tramite") {
          this.registrar_requisito(requerimiento)
        }
      }
    })
  }

  obtener_Requerimientos_habilitados_Tramite(id_TipoTramite: number) {
    this.verHabilitados = true
    this.tipoTramitesService.getRequerimientos_Habilitados(id_TipoTramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Requerimientos = resp.Requerimientos
      }
    })
  }
  obtener_Requerimientos_NoHabilitados_Tramite(id_TipoTramite: number) {
    this.tipoTramitesService.getRequerimientos_noHabilitados(id_TipoTramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Requerimientos = resp.Requerimientos
      }
    })
  }
  //cambiara estado activo=false
  eliminar_Requisito(requerimiento: any) {
    this.tipoTramitesService.putRequisito(requerimiento.id_requerimiento, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.obtener_Requerimientos_habilitados_Tramite(this.DatosTramite.id_TipoTramite)
      }
    })
  }
  quitar_Requisito(posicion: number) {
    this.Requerimientos.splice(posicion, 1);
    this.recargarRequisitosTabla()
  }

  //abre menu de edicion para recibir los datos
  editar_Requisito(datosRequerimiento: Requerimientos) {
    const dialogRef = this.dialog.open(DialogRequisitosComponent, {
      data: datosRequerimiento
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        // delete dataDialog.id_requerimiento  //eliminar el id
        dataDialog.fecha_actualizacion = this.getFecha()
        this.actualizar_Requerimientos(datosRequerimiento.id_requerimiento, dataDialog)
      }
    })
  }

  //guarda requisito directo en la bd. EL tipo de tramite debe estar ya creado para usar
  registrar_requisito(requisito: Requerimientos) {
    requisito.id_TipoTramite = this.DatosTramite.id_TipoTramite
    this.tipoTramitesService.addRequerimientos(requisito).subscribe((resp: any) => {
      if (resp.ok) {
        this.obtener_Requerimientos_habilitados_Tramite(this.DatosTramite.id_TipoTramite)
      }
    })
  }


  //Actualiza los valores del requerimiento en la db
  actualizar_Requerimientos(id: any, datos: Requerimientos) {
    this.tipoTramitesService.putRequisito(id, datos).subscribe((resp: any) => {
      if (resp.ok) {
        this.obtener_Requerimientos_habilitados_Tramite(this.DatosTramite.id_TipoTramite)
      }
    })
  }
  mostrar_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.obtener_Requerimientos_habilitados_Tramite(this.DatosTramite.id_TipoTramite)
    }
    else {
      this.obtener_Requerimientos_NoHabilitados_Tramite(this.DatosTramite.id_TipoTramite)
    }
  }







}
