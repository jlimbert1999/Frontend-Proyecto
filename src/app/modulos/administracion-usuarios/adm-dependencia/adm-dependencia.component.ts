import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';
import { DialogDependenciaComponent } from '../../../componentes/dialogs/dialog-dependencia/dialog-dependencia.component'
import { MatTableDataSource } from '@angular/material/table';

import { DependenciaModel } from '../../../modelos/administracion-usuarios/dependencia.model'
import { Mensajes} from '../../../componentes/mensaje/mensaje'
import { Cons } from 'rxjs';
@Component({
  selector: 'app-adm-dependencia',
  templateUrl: './adm-dependencia.component.html',
  styleUrls: ['./adm-dependencia.component.css']
})
export class AdmDependenciaComponent implements OnInit {
  Dependencia: DependenciaModel = {
    id_institucion: 0,
    Nombre: '',
    Sigla: '',
    Fecha_creacion: '',
    Fecha_actualizacion: '',
    Activo: true
  }
  depRegistradas: any = [];
  depEliminados: any = [];
  dataSource:any;
  msg=new Mensajes()
  checked:boolean=false;
  displayedColumns = [
    {key:"SiglaInst", titulo:"INSTITUCION"},
    {key:"Nombre", titulo:"NOMBRE"},
    {key:"Sigla", titulo:"SIGLA"},
    {key:"Fecha_creacion", titulo:"FECHA CREACION"},
    {key:"Activo", titulo:"HABILITADO"},
    {key:"Opciones", titulo:"OPCIONES"},
  ]

  //siglainst viene en el cargardatos, pero en la tabla no se usa

  constructor(
    public dialog: MatDialog,
    private depService: DependenciaService
  ) {
    this.cargarDependencia()
  }

  ngOnInit(): void {

  }
  registrarDependencia() {
    let vacio={Activo:true}  //varible a enviar y poder registrar
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data:vacio
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Dependencia = datosFormulario
        this.Dependencia.Fecha_creacion = this.Dependencia.Fecha_actualizacion = this.getFecha()
        this.depService.addDependencia(this.Dependencia).subscribe((res: any) => {
          if(res.ok){
            this.msg.mostrarMensaje('success', res.message)
          }
          this.cargarDependencia()
        })
      }
    });
  }
  cargarDependencia() {
    this.depRegistradas= [];
    this.depEliminados= [];
    this.depService.getDependencia().subscribe((res: any) => {
      console.log(res);
      if(res.ok){
        res.dependencia.forEach((element: any, index: number) => {
          if (element.Activo == "1") {
            element.Activo = true
            this.depRegistradas.push(element)
          }
          else if (element.Activo == "0" || element.Activo==null) {
            element.Activo = false
            this.depEliminados.push(element)
          }
        });
        this.dataSource = new MatTableDataSource(this.depRegistradas);
        this.checked=false
        
      }
      
    })
  }

  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
  eliminarDependecia(datos:any) {
    let id=datos.id_dependencia
    this.depService.deleteDependencia(id).subscribe((resp:any)=>{
      if(resp.ok){
        this.msg.mostrarMensaje('success', resp.message)
      }
      this.cargarDependencia()
    })

  }
  editarDependecia(datos: any) {
    let id = datos.id_dependencia
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe((datosFormulario:any) => {
      
      if (datosFormulario) {
        delete datosFormulario['SiglaInst'] //eliminar siglaInst para poder registrar
        datosFormulario.Fecha_actualizacion = this.getFecha()
        this.depService.putDependencia(id, datosFormulario).subscribe((resp: any) => {
          if(resp.ok){
            this.msg.mostrarMensaje('success', resp.message)
          }
          this.cargarDependencia()
        })
      }
    });
  }
  aplicarFiltro(event: Event, activos: boolean) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.depEliminados);
      }
      else {
        this.dataSource = new MatTableDataSource(this.depRegistradas);
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.depEliminados);
      }
      else {
        this.dataSource = new MatTableDataSource(this.depRegistradas);
      }
    }
  }

  mostrarNoHabilitados() {
    if (this.checked) {
      this.dataSource = new MatTableDataSource(this.depEliminados);

    } else {
      this.dataSource = new MatTableDataSource(this.depRegistradas);
    }

  }

}
