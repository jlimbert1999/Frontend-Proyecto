import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstitucionModel } from '../../../../modelos/administracion-usuarios/institucion.model'
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
@Component({
  selector: 'app-dialog-institucion',
  templateUrl: './dialog-institucion.component.html',
  styleUrls: ['./dialog-institucion.component.css']
})
export class DialogInstitucionComponent implements OnInit {
  tituloDialog: string = '';
  checked = false;
  Institucion: InstitucionModel = {
    Nombre: '',
    Direccion: '',
    Sigla: '',
    Fecha_actualizacion: 0,
    Fecha_creacion: 0,
    Telefono: 0,
    Activo: true
  }
  msg = new Mensajes();

  constructor(
    public dialogRef: MatDialogRef<DialogInstitucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstitucionModel,
    public configService: ConfiguracionService
  ) {
  }

  ngOnInit(): void {
    this.generarTitulo()
  }

  generarTitulo() {
    if (Object.keys(this.data).length <= 1) {
      this.tituloDialog = "Registro de institucion"

    }
    else {
      this.tituloDialog = "Edicion de institucion";
      this.Institucion=this.data
    }
  }

  agregar_Institucion() {
    this.Institucion.Fecha_creacion = this.Institucion.Fecha_actualizacion = this.getFecha();
    this.configService.addInstitucion(this.Institucion).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }
  editar_Institucion() {
    this.Institucion.Fecha_actualizacion = this.getFecha();
    this.configService.putInstitucion(this.Institucion.id_institucion!, this.Institucion).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }
  guardar_registro() {
    if (this.tituloDialog == "Registro de institucion") {
      this.agregar_Institucion()
    }
    else if (this.tituloDialog == "Edicion de institucion") {
      this.editar_Institucion()
    }

  }
  cerrarDialog() {
    this.dialogRef.close();
  }
  getFecha() {
    return Date.now()
  }

}
