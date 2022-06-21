import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';
import { CargoService } from '../../../../servicios/servicios-m1/cargo.service'
import decode from 'jwt-decode'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';

@Component({
  selector: 'app-dialog-cargo',
  templateUrl: './dialog-cargo.component.html',
  styleUrls: ['./dialog-cargo.component.css']
})
export class DialogCargoComponent implements OnInit {
  tituloDialog: string = '';
  Form_Cargo: FormGroup
  Cargo: CargoModel
  msg = new Mensajes();
  constructor(
    public dialogRef: MatDialogRef<DialogCargoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cargoService: CargoService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.iniciar_Form_Cargo()
    this.generarTitulo()

  }
  generarTitulo() {
    if (Object.keys(this.data).length == 0) {
      this.tituloDialog = "Registro de cargo";
    }
    else {
      this.tituloDialog = "Edicion de cargo";
      this.Cargo = this.data
      this.Form_Cargo.patchValue(this.data)
    }

  }
  registrar_datos() {
    if (this.tituloDialog == "Registro de cargo") {
      this.Cargo = this.Form_Cargo.value
      this.Cargo.Fecha_creacion = this.Cargo.Fecha_actualizacion = this.getFecha()
      this.Cargo.Activo = true
      this.Cargo.Responsable_regis = this.decodificarToken().Nombre
      if (this.Form_Cargo.valid) {
        this.cargoService.addCargo(this.Cargo).subscribe((res: any) => {
          if (res.ok) {
            this.Cargo.id_cargo = res.cargo.insertId
            this.dialogRef.close(this.Cargo)
            this.msg.mostrarMensaje('success', "Cargo registrado")
          }
        })
      }
    }
    else if (this.tituloDialog == "Edicion de cargo") {
      if (this.Form_Cargo.touched) {
        this.Cargo = this.Form_Cargo.value
        this.Cargo.Fecha_actualizacion = this.getFecha()
        this.cargoService.putCargo(this.data.id_cargo!, this.Cargo).subscribe((resp: any) => {
          if (resp.ok) {
           
            this.dialogRef.close(this.Cargo)
            this.msg.mostrarMensaje('success', "Cargo actualizado")
          }
        })

      }
    }
  }
  cerrarDialog() {
    this.dialogRef.close();
  }
  iniciar_Form_Cargo() {
    this.Form_Cargo = this.formBuilder.group({
      Nombre: ['', Validators.required]
    });
  }
  getFecha(): any {
    return Date.now()
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

}
