import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DependenciaModel } from 'src/app/modelos/administracion-usuarios/dependencia.model';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';

import { InstitucionService } from '../../../servicios/servicios-m1/institucion.service'

@Component({
  selector: 'app-dialog-dependencia',
  templateUrl: './dialog-dependencia.component.html',
  styleUrls: ['./dialog-dependencia.component.css']
})
export class DialogDependenciaComponent implements OnInit {
  tituloDialog: string = '';
  Instituciones:any[]=[];

  constructor(public dialogRef: MatDialogRef<DialogDependenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DependenciaModel, 
    public dialog: MatDialog,
    private instService:InstitucionService,
    private configService:ConfiguracionService
    ) { }

  ngOnInit(): void {
    this.generarTitulo()
    this.obtenerInstituciones()
  }

  generarTitulo() {
   
    if (Object.keys(this.data).length<=0) {
      this.tituloDialog = "Registro de dependencia";
    }
    else {
      this.tituloDialog = "Edicion de dependencia";
    }

  }
  cerrarDialog() {
    this.dialogRef.close();
  }
  obtenerInstituciones(){
    this.configService.getInsti_Habilitadas().subscribe((resp:any)=>{
      if(resp.ok){
        this.Instituciones=resp.Instituciones
      }
    })
    
  }

}
