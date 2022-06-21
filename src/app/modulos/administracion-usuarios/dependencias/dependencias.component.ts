import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDependenciaComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-dependencia/dialog-dependencia.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { DependenciaModel } from 'src/app/modelos/administracion-usuarios/dependencia.model';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit {
  OpcionesTabla: string[]
  verHabilitados: boolean = true
  Dependencias: DependenciaModel[]
  dataSource = new MatTableDataSource();
  modo_busqueda: boolean = false
  msg = new Mensajes();
  displayedColumns = [
    { key: "SiglaInst", titulo: "INSTITUCION" },
    { key: "Nombre", titulo: "NOMBRE" },
    { key: "Sigla", titulo: "SIGLA" },
    { key: "Fecha_creacion", titulo: "FECHA CREACION" }
  ]


  constructor(private depService: DependenciaService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_Dephabilitadas()
  }

  obtener_Dephabilitadas() {
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.verHabilitados = true
    this.depService.getDependencia_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Dependencias = resp.Dependencias
        this.dataSource.data = this.Dependencias
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }

  obtener_DepNohabilitadas() {
    this.OpcionesTabla = ['Editar', 'Habilitar']
    this.depService.getDependencia_NoHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Dependencias = resp.Dependencias
        this.dataSource.data = this.Dependencias
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  agregar_Dependencia() {
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: {}
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Dependencias.unshift(datosFormulario)
        this.dataSource.data = this.Dependencias
      }
    });
  }

  editar_Dependecia(datos: any) {
    if (datos.Activo == '0') {
      datos.Activo = false
    }
    else if (datos.Activo == '1') {
      datos.Activo = true
    }

    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) {

        const index = this.Dependencias.findIndex((item: any) => item.id_dependencia == datos.id_dependencia);
        this.Dependencias[index] = Object.assign(this.Dependencias[index], DataDialog)
        this.dataSource.data = this.Dependencias

      }
    });
  }
  eliminar_Dependencia(datos: any) {
    this.depService.putDependencia(datos.id_dependencia, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Dependencias = this.Dependencias.filter(elemento => elemento.id_dependencia != datos.id_dependencia);
        this.dataSource.data = this.Dependencias
        this.msg.mostrarMensaje('success', 'La dependencia fue desabilidata')
      }
    })

  }
  habilitar_Institucion(datos: any) {
    this.depService.putDependencia(datos.id_dependencia, { Activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Dependencias = this.Dependencias.filter(elemento => elemento.id_dependencia != datos.id_dependencia);
        this.dataSource.data = this.Dependencias
        this.msg.mostrarMensaje('success', 'La dependencia se habilito')
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
      this.obtener_Dephabilitadas()
    }
    else {
      this.obtener_DepNohabilitadas()

    }
  }
  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }
  getFecha() {
    return Date.now()
  }


}
