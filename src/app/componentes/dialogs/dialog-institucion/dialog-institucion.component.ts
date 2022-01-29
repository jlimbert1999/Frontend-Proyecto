import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IntitucionModel } from '../../../modelos/administracion-usuarios/institucion.model'
@Component({
  selector: 'app-dialog-institucion',
  templateUrl: './dialog-institucion.component.html',
  styleUrls: ['./dialog-institucion.component.css']
})
export class DialogInstitucionComponent implements OnInit {
  tituloDialog: string = '';
  checked = false;
  constructor(public dialogRef: MatDialogRef< DialogInstitucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data:IntitucionModel, public dialog:MatDialog) { }

  ngOnInit(): void {
    this.generarTitulo()
  }
  generarTitulo(){
    if(Object.keys(this.data).length<=1){
      this.tituloDialog="Registro de institucion"
    }
    else
    {
      this.tituloDialog="Edicion de institucion";
      console.log("Recibiendo", this.data);
    }
  }
  cerrarDialog(){
    this.dialogRef.close();
  }

}
