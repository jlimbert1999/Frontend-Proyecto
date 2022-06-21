import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstitucionModel } from '../../../../modelos/administracion-usuarios/institucion.model'
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service';
@Component({
  selector: 'app-dialog-institucion',
  templateUrl: './dialog-institucion.component.html',
  styleUrls: ['./dialog-institucion.component.css']
})
export class DialogInstitucionComponent implements OnInit {
  tituloDialog: string = '';
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
  Form_Institucion: FormGroup

  constructor(
    public dialogRef: MatDialogRef<DialogInstitucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstitucionModel,
    public InstService: InstitucionService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.iniciar_Form_Institucion()
    this.generarTitulo()
  }

  generarTitulo() {
    if (Object.keys(this.data).length == 0) {
      this.tituloDialog = "Registro de institucion"

    }
    else {
      this.tituloDialog = "Edicion de institucion";
      this.Institucion = this.data
      this.Form_Institucion.patchValue(this.data)
    }
  }

  agregar_Institucion() {
    this.Institucion = this.Form_Institucion.value
    this.Institucion.Fecha_creacion = this.Institucion.Fecha_actualizacion = this.getFecha();
    this.InstService.addInstitucion(this.Institucion).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
        this.Institucion.id_institucion = resp.institucion.insertId
        this.dialogRef.close(this.Institucion)
      }
    })
  }
  editar_Institucion() {
    if (this.Form_Institucion.touched) {
      this.Institucion = this.Form_Institucion.value
      this.Institucion.Fecha_actualizacion = this.getFecha();
      this.InstService.putInstitucion(this.data.id_institucion!, this.Institucion).subscribe((resp: any) => {
        if (resp.ok) {
          this.dialogRef.close(this.Institucion)
          this.Institucion.id_institucion = this.data.id_institucion
          // this.msg.mostrarMensaje('success', resp.message)
        }
      })

    }


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

  iniciar_Form_Institucion() {
    this.Form_Institucion = this.formBuilder.group({
      Nombre: [null, Validators.required],
      Direccion: ['', Validators.required],
      Sigla: ['', Validators.required],
      Telefono: ['', Validators.required],
      Fecha_actualizacion: 0,
      Fecha_creacion: 0,
      Activo: true
    });
  }

}
