import { Component, OnInit } from '@angular/core';

import { IntitucionModel } from '../../../modelos/administracion-usuarios/institucion.model'

import { MatDialog } from '@angular/material/dialog';
import { DialogInstitucionComponent } from 'src/app/componentes/dialogs/dialog-institucion/dialog-institucion.component';
import { MatTableDataSource } from '@angular/material/table';

//importacion servicios
import { InstitucionService } from '../../../servicios/servicios-m1/institucion.service'

import { Mensajes } from '../../../componentes/mensaje/mensaje'
@Component({
  selector: 'app-adm-institucion',
  templateUrl: './adm-institucion.component.html',
  styleUrls: ['./adm-institucion.component.css']
})
export class AdmInstitucionComponent implements OnInit {
  instRegistradas: any[] = []
  instEliminadas: any[] = [];
  Institucion: IntitucionModel = {
    Nombre: '',
    Sigla: '',
    Direccion: '',
    Telefono: '',
    Fecha_creacion: '',
    Fecha_actualizacion: '',
    Activo: true
  };
  displayedColumns = [
    { key: "Nro", titulo: "NUMERO" },
    { key: "Nombre", titulo: "NOMBRE" },
    { key: "Sigla", titulo: "SIGAL" },
    { key: "Direccion", titulo: "DIRECCION" },
    { key: "Telefono", titulo: "TELEFONO" },
    { key: "Fecha_creacion", titulo: "FECHA CREACION" },
    { key: "Activo", titulo: "HABILITADO" },
    { key: "Opciones", titulo: "OPCIONES" },

  ]
  dataSource = new MatTableDataSource()
  msg = new Mensajes()
  checked: boolean = false;
  verhabilitados: boolean = true
  titulo_OpcionVista: string = 'Ver No Habilitados'

  constructor(
    private institucionService: InstitucionService,
    public dialog: MatDialog
  ) {
    this.cargar_InstHabilitadas()
  }

  ngOnInit(): void {

  }

  cargar_InstHabilitadas() {
    this.institucionService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok && resp.Institucion) {
        this.dataSource.data = resp.Institucion
        // this.checked = false
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
        this.dataSource.data = []
      }
    })
  }
  cargar_InstNoHabilitadas() {
    this.instRegistradas = [];
    this.instEliminadas = [];
    this.institucionService.getInstituciones_NoHabilitadas().subscribe((resp: any) => {
      if (resp.ok && resp.Institucion) {
        this.dataSource.data = resp.Institucion
      }
      else {
        this.dataSource.data = []
      }
    })
  }

  cargar_Tabla() {
    if (this.verhabilitados) {
      this.titulo_OpcionVista = 'Ver No Habilitados'
      this.cargar_InstHabilitadas()
    }
    else {
      this.cargar_InstNoHabilitadas()
      this.titulo_OpcionVista = 'Ver Habilitados'
    }
  }



  registrarIntitucion() {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: { Activo: true }
    })

    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) {
        DataDialog.Fecha_creacion = DataDialog.Fecha_actualizacion = this.getFecha();
        this.Institucion = DataDialog
        this.institucionService.addInstitucion(this.Institucion).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
          }

          this.cargar_InstHabilitadas()
          this.verhabilitados = true
        })
      }


    });
  }
  editarInstitucion(datos: any) {
    let id: number = datos.id_institucion
    if (datos.Activo == '0') {
      datos.Activo = false
    }
    else if (datos.Activo == '1') {
      datos.Activo = true
    }

    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: datos
    })

    dialogRef.afterClosed().subscribe(DataDialog => {
      if (DataDialog) {
        DataDialog.Fecha_actualizacion = this.getFecha()
        this.institucionService.putInstitucion(id, DataDialog).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
            this.cargar_InstHabilitadas()
            this.verhabilitados = true
          }
        })
      }
    });
  }
  eliminarInstitucion(datos: any) {
    let id = datos.id_institucion
    this.institucionService.deleteInstitucion(id).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
      // this.cargar_Tabla(true)
    })
  }



  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }

  aplicarFiltro(event: Event, activos: boolean) {
    //Metodo de mostrar habilitado no se usa aqui por que existe variacion en activos:boolean
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.instEliminadas);
      }
      else {
        this.dataSource = new MatTableDataSource(this.instRegistradas);
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.instEliminadas);
      }
      else {
        this.dataSource = new MatTableDataSource(this.instRegistradas);
      }
    }
  }

  mostrarNoHabilitados() {
    if (this.checked) {
      this.dataSource = new MatTableDataSource(this.instEliminadas);
    }
    else {
      this.dataSource = new MatTableDataSource(this.instRegistradas);
    }

  }

}

