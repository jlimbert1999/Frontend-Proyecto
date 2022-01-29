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
  Requerimientos: Requerimientos = {
    detalle: '',
    funcionario: '',
    id_documento: '',
    fecha_creacion: '',
    fecha_actualizacion: '',
    Activo: true
  }
  displayedColumns: string[] = [];
  TiposDoc = [
    { id_documento: 1, titulo: "Carnet de indetidad" },
    { id_documento: 2, titulo: "Pasaporte" }
  ]
  OpcionHabilitar: boolean = false;

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

  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
  recargarRequisitosTabla() {
    if (this.tablaRequisitos) {   //esperar a que tabla sea visible
      this.tablaRequisitos.renderRows(); //actulizar tabla
    }
  }

  quitar_Requisito(posicion: number) {
    this.DatosTramite.Requisitos.splice(posicion, 1);
    this.recargarRequisitosTabla()
  }

  generar_TituloDialog() {
    if (Object.keys(this.DatosTramite.TipoTramite).length == 0) {
      this.tituloDialog = "Registro tipo de tramite"
      this.displayedColumns = ['descripcion', 'tipoDoc', 'opciones'];
      this.DatosTramite.NuevosRequitos = true
      //si es nuevo el boton de eliminar no se mostrara
    }
    else {
      this.tituloDialog = "Edicion tipo de tramite"
      this.displayedColumns = ['descripcion', 'tipoDoc', 'respRegistro', 'fecha_reg', 'opciones'];  //, 'habilitado'
      //Se recibe el id cuando es edicion
      this.obtener_RequerientosTramite(this.DatosTramite.id_TipoTramite)
      if (this.DatosTramite.TipoTramite.Activo == false || this.DatosTramite.TipoTramite.Activo == '0') {
        this.OpcionHabilitar = true
      }

    }
  }

  agregar_requisito() {
    const dialogRef = this.dialog.open(DialogRequisitosComponent, {
      data: {}
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        let aux: Requerimientos = {
          detalle: dataDialog.detalle,
          funcionario: "Admin",
          id_documento: dataDialog.id_documento,
          fecha_creacion: this.getFecha(),
          fecha_actualizacion: this.getFecha(),
          Activo: true
        }
        if (this.DatosTramite.NuevosRequitos) {
          this.DatosTramite.Requisitos.push(aux)
          this.recargarRequisitosTabla()
        }
        else {
          aux.id_TipoTramite = this.DatosTramite.id_TipoTramite
          this.registrar_Requerimiento(aux)

        }
      }
    })
  }

  registrar_Requerimiento(datos: Requerimientos) {
    this.tipoTramitesService.addRequerimientos(datos).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message);
        this.obtener_RequerientosTramite(this.DatosTramite.id_TipoTramite)
      }
    })
  }

  obtener_RequerientosTramite(id: number) {
    this.tipoTramitesService.getRequerimientos(id).subscribe((resp: any) => {
      if (resp.ok) {
        this.DatosTramite.Requisitos = resp.Requerimientos
      }
      if (resp.Requerimientos == undefined) {
        this.DatosTramite.NuevosRequitos = true //marcar como que es actualizacion con registro de tramites
      }
    })
  }

  eliminar_Requisito(requerimiento: any) {
    this.tipoTramitesService.deleteRequerimiento(requerimiento.id_requerimiento).subscribe((resp: any) => {
      if (resp.ok) {
        this.obtener_RequerientosTramite(this.DatosTramite.id_TipoTramite)
      }
    })
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

  //Actualiza los valores del requerimiento en la db
  actualizar_Requerimientos(id: any, datos: Requerimientos) {
    this.tipoTramitesService.putRequisito(id, datos).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }







}
