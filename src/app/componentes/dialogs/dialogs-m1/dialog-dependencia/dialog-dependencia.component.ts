import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { DependenciaModel } from 'src/app/modelos/administracion-usuarios/dependencia.model';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';
import { InstitucionService } from '../../../../servicios/servicios-m1/institucion.service'

@Component({
  selector: 'app-dialog-dependencia',
  templateUrl: './dialog-dependencia.component.html',
  styleUrls: ['./dialog-dependencia.component.css']
})
export class DialogDependenciaComponent implements OnInit {
  tituloDialog: string = '';
  Instituciones: any[] = [];
  Dependencia: any
  Form_Dependencia: FormGroup
  msg = new Mensajes();

  constructor(public dialogRef: MatDialogRef<DialogDependenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DependenciaModel,
    public dialog: MatDialog,
    private instService: InstitucionService,
    private depService: DependenciaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.iniciar_Form_Dependencia()
    this.generarTitulo()

  }

  generarTitulo() {

    if (Object.keys(this.data).length == 0) {
      this.tituloDialog = "Registro de dependencia";
      this.obtenerInstituciones()
    }
    else {
      this.tituloDialog = "Edicion de dependencia";
      this.Dependencia = this.data
      this.Form_Dependencia.patchValue(this.data)
    }

  }
  cerrarDialog() {
    this.dialogRef.close();
  }
  obtenerInstituciones() {
    this.instService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Instituciones = resp.Instituciones
      }
    })
  }
  registrar_datos() {
    if (this.tituloDialog == "Registro de dependencia") {
      this.Dependencia = this.Form_Dependencia.value
      this.Dependencia.Fecha_creacion = this.Dependencia.Fecha_actualizacion = this.getFecha()
      this.Dependencia.Activo = true
      if (this.Form_Dependencia.valid) {
        this.depService.addDependencia(this.Dependencia).subscribe((res: any) => {
          if (res.ok) {
            this.Dependencia['SiglaInst'] = this.Instituciones.find(element => element.id_institucion == this.Dependencia.id_institucion).Sigla
            this.Dependencia.id_dependencia = res.dependencia.insertId
            this.dialogRef.close(this.Dependencia)
            this.msg.mostrarMensaje('success', "Dependencia registrada")
          }
        })
      }
    }
    else if (this.tituloDialog == "Edicion de dependencia") {
      if (this.Form_Dependencia.touched) {

        this.Dependencia = this.Form_Dependencia.value
        this.Dependencia.Fecha_actualizacion = this.getFecha()

        delete this.Dependencia.id_institucion //id siempre sera el mismo

        this.depService.putDependencia(this.data.id_dependencia!, this.Dependencia).subscribe((resp: any) => {
          if (resp.ok) {
            this.dialogRef.close(this.Dependencia)
            this.msg.mostrarMensaje('success', "Dependencia actualizada")
          }
        })

      }





    }
  }
  iniciar_Form_Dependencia() {
    this.Form_Dependencia = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Sigla: ['', Validators.required],
      id_institucion: [0, Validators.required]
    });

  }
  getFecha(): any {
    return Date.now()
  }

}
