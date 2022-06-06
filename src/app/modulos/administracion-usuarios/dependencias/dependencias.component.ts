import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDependenciaComponent } from 'src/app/componentes/dialogs/dialog-dependencia/dialog-dependencia.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit {
  OpcionesTabla: string[]
  verHabilitados: boolean = true
  Dependencia:any
  dataSource = new MatTableDataSource();
  modo_busqueda:boolean=false
  msg = new Mensajes();
  displayedColumns = [
    { key: "SiglaInst", titulo: "INSTITUCION" },
    { key: "Nombre", titulo: "NOMBRE" },
    { key: "Sigla", titulo: "SIGLA" },
    { key: "Fecha_creacion", titulo: "FECHA CREACION" },
    // { key: "Activo", titulo: "HABILITADO" }
  ]
  
  
  constructor(private configService: ConfiguracionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_Dephabilitadas()
  }

  obtener_Dephabilitadas() {
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.verHabilitados = true
    this.configService.getDepen_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Dependencias.length > 0) {
          this.Dependencia = resp.Dependencias
          this.dataSource.data = this.Dependencia

        } else {
          this.msg.mostrarMensaje('info', "No hay dependencias habilitadas")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }

  obtener_DepNohabilitadas() {
    this.configService.getDepen_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Dependencias.length > 0) {
          this.dataSource.data = resp.Dependencias
          this.OpcionesTabla = ['Editar']
        }
        else {
          this.msg.mostrarMensaje('info', "No hay dependencias no habilitadas")
          this.verHabilitados = true
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  agregar_Dependencia() {
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: { Activo: true } 
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Dependencia = datosFormulario
        this.Dependencia.Fecha_creacion = this.Dependencia.Fecha_actualizacion = this.getFecha()
        this.configService.addDependencia(this.Dependencia).subscribe((res: any) => {
          if (res.ok) {
            this.msg.mostrarMensaje('success', res.message)
          }
          this.obtener_Dephabilitadas()
          // this.obtener_Instihabilitadas()
        })
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
    let id = datos.id_dependencia
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) {
        delete DataDialog['SiglaInst'] //eliminar siglaInst para poder registrar
        DataDialog.Fecha_actualizacion = this.getFecha()
        this.configService.putDependencia(id, DataDialog).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
          }
          this.obtener_Dephabilitadas()
        })
      }
    });
  }
  eliminar_Dependencia(datos: any) {
    this.configService.putDependencia(datos.id_dependencia, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', 'La dependencia fue desabilidata')
        this.obtener_Dephabilitadas()
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
      this.dataSource.data = this.Dependencia
      this.OpcionesTabla = ['Editar', 'Eliminar']
      
     

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
