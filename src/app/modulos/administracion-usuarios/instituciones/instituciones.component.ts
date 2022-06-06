import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogInstitucionComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-institucion/dialog-institucion.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  OpcionesTabla: string[] = []
  verHabilitados: boolean = false
  Institucion: any
  dataSource = new MatTableDataSource();
  msg = new Mensajes();
  modo_busqueda: boolean = false
  displayedColumns = [
    // { key: "Nro", titulo: "NUMERO" },
    { key: "Nombre", titulo: "Nombre" },
    { key: "Sigla", titulo: "Sigla" },
    { key: "Direccion", titulo: "Direccion" },
    { key: "Telefono", titulo: "Telefono" },
    { key: "Fecha_creacion", titulo: "Fecha creacion" }
    // { key: "Activo", titulo: "HABILITADO" }
  ]
  constructor(private configService: ConfiguracionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_Instihabilitadas()
  }

  obtener_Instihabilitadas() {
    this.verHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.configService.getInsti_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Instituciones.length > 0) {

          this.Institucion = resp.Instituciones
          this.dataSource.data = resp.Instituciones
        }
        else {
          this.msg.mostrarMensaje('info', "No hay insituciones habilitadas")
        }

      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_InstNohabilitadas() {

    this.configService.getInsti_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Instituciones.length > 0) {
          this.dataSource.data = resp.Instituciones
          this.OpcionesTabla = ['Editar']

        }
        else {
          this.msg.mostrarMensaje('info', "No hay insituciones no habilitadas")
          this.verHabilitados = true
        }
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }
  agregar_Institucion() {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: { Activo: true }//enviar una lalve para que sea registro
    })

    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) { //si se recibe la llave enviada, registrar
        this.obtener_Instihabilitadas()
      }
    });
  }
  editar_Institucion(datos: any) {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(DataDialog => {
      if (DataDialog) {
        this.obtener_Instihabilitadas()
      }
    });
  }
  eliminar_Institucion(datos: any) {
    this.configService.putInstitucion(datos.id_institucion, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', 'La institucion fue desabilidata')
        this.obtener_Instihabilitadas()
      }
    })
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.dataSource.data = this.Institucion
      this.OpcionesTabla = ['Editar', 'Eliminar']


    }
    else {
      this.obtener_InstNohabilitadas()

    }
  }

  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }

}
