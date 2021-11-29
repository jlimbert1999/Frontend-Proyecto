import { Component, OnInit, Inject } from '@angular/core';

//modelos
import { UsuarioModel } from 'src/app/modelos/usuario.model'; 

//material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-usuarios',
  templateUrl: './dialog-usuarios.component.html',
  styleUrls: ['./dialog-usuarios.component.css']
})
export class DialogUsuariosComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef< DialogUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data:UsuarioModel) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
    // console.log(this.data)  //data son los valores de los inputs del dialog
  }


}
