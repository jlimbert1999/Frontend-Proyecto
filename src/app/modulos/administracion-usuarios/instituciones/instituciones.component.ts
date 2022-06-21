import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogInstitucionComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-institucion/dialog-institucion.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  OpcionesTabla: string[] = []
  verHabilitados: boolean = true
  Institucion: InstitucionModel[]
  dataSource = new MatTableDataSource();
  msg = new Mensajes();
  modo_busqueda: boolean = false
  displayedColumns = [
    { key: "Nombre", titulo: "Nombre" },
    { key: "Sigla", titulo: "Sigla" },
    { key: "Direccion", titulo: "Direccion" },
    { key: "Telefono", titulo: "Telefono" },
    { key: "Fecha_creacion", titulo: "Fecha creacion" }
  ]
  constructor(private InstiService: InstitucionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_Instihabilitadas()
  }

  obtener_Instihabilitadas() {
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.InstiService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Institucion = resp.Instituciones
        this.dataSource.data = resp.Instituciones
      }

    })
  }
  obtener_InstNohabilitadas() {
    this.OpcionesTabla = ['Editar', 'Habilitar']
    this.InstiService.getInstituciones_NoHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Institucion = resp.Instituciones
        this.dataSource.data = resp.Instituciones
      }

    })
  }
  agregar_Institucion() {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: {}//enviar una lalve para que sea registro
    })

    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) { //si se recibe la llave enviada, registrar
        // this.obtener_Instihabilitadas()
        this.Institucion.unshift(DataDialog)
        this.dataSource.data = this.Institucion
      }
    });
  }
  editar_Institucion(datos: any) {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(DataDialog => {
      if (DataDialog) {
        const index = this.Institucion.findIndex((item: InstitucionModel) => item.id_institucion == datos.id_institucion);
        this.Institucion[index] = DataDialog
        this.dataSource.data = this.Institucion
      }
    });
  }
  eliminar_Institucion(datos: any) {
    this.InstiService.putInstitucion(datos.id_institucion, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Institucion = this.Institucion.filter(elemento => elemento.id_institucion != datos.id_institucion);
        this.dataSource.data=this.Institucion
        this.msg.mostrarMensaje('success', 'La institucion fue desabilidata')
      }
    })
  }
  habilitar_Institucion(datos: any) {
    this.InstiService.putInstitucion(datos.id_institucion, { Activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        
        this.Institucion = this.Institucion.filter(elemento => elemento.id_institucion !== datos.id_institucion);
        this.dataSource.data=this.Institucion
        this.msg.mostrarMensaje('success', 'La institucion se habilito')
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
      this.obtener_Instihabilitadas()
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
