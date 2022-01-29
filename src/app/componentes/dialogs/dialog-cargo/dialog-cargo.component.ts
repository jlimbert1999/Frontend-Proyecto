import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';

import { CargoService } from '../../../servicios/servicios-m1/cargo.service'

@Component({
  selector: 'app-dialog-cargo',
  templateUrl: './dialog-cargo.component.html',
  styleUrls: ['./dialog-cargo.component.css']
})
export class DialogCargoComponent implements OnInit {
  tituloDialog: string = '';
  Dependencias:any=[]
  constructor(
    public dialogRef: MatDialogRef<DialogCargoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private cargoService:CargoService,
  ) { 
    this.generarTitulo()
  }

  ngOnInit(): void {
  }
  generarTitulo() {
    if (Object.keys(this.data).length<=1) {
      this.tituloDialog = "Registro de cargo";
    }
    else {
      this.tituloDialog = "Edicion de cargo";
    }

  }
  cerrarDialog() {
    this.dialogRef.close();
  }

}
