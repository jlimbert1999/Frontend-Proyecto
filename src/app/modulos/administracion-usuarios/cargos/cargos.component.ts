import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCargoComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-cargo/dialog-cargo.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import decode from 'jwt-decode'

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {
  Info_cuenta_actual = this.decodificarToken()
  OpcionesTabla: string[]
  verHabilitados: boolean = true
  Dependencia: any
  dataSource = new MatTableDataSource();
  modo_busqueda: boolean = false
  msg = new Mensajes();
  displayedColumns = [
    { key: "Nombre", titulo: "NOMBRE" },
    { key: "Responsable_regis", titulo: "RESPONSABLE DE REGISTRO" },
    { key: "Fecha_creacion", titulo: "CREACION" }
    // { key: "Activo", titulo: "HABILITADO" }
  ]
  Cargo: any


  constructor(private configService: ConfiguracionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_CargosHabilitados()
    console.log(this.Info_cuenta_actual);
  }

  obtener_CargosHabilitados() {
    this.verHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.configService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cargos.length > 0) {
          this.Cargo = resp.Cargos
          this.dataSource.data = this.Cargo

        }
        else {
          this.msg.mostrarMensaje('info', "No hay cargos habilitadas")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_CargosNoHabilitados() {

    this.configService.getCargos_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cargos.length > 0) {

          this.dataSource.data = resp.Cargos
          this.OpcionesTabla = ['Editar']
        }
        else {
          this.msg.mostrarMensaje('info', "No hay cargos no habilitados")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  agregar_Cargo() {
    const vacio = { Activo: true } //para que dialog inicie en vacion
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: vacio
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {

        this.Cargo = datosFormulario
        this.Cargo.Fecha_creacion = this.Cargo.Fecha_actualizacion = this.getFecha()
        this.Cargo.Responsable_regis = this.Info_cuenta_actual.Nombre
        this.configService.addCargo(this.Cargo).subscribe((res: any) => {
          if (res.ok) {
            this.obtener_CargosHabilitados()
            this.msg.mostrarMensaje('success', res.message)
          }
        })
      }
    });
  }
  editar_Cargo(datos: any) {
    if (datos.Activo == '0') {
      datos.Activo = false
    }
    else if (datos.Activo == '1') {
      datos.Activo = true
    }
    let id = datos.id_cargo;
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Cargo = datosFormulario
        this.Cargo.Fecha_actualizacion = this.getFecha()
        this.Cargo.Responsable_regis = "Admin"
        this.configService.putCargo(id, this.Cargo).subscribe((res: any) => {
          if (res.ok) {
            this.obtener_CargosHabilitados()
          }
        })
      }
    });
  }

  eliminar_Cargo(datos: any) {
    this.configService.putCargo(datos.id_cargo, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', 'El cargo fue desabilidato')
        this.obtener_CargosHabilitados()
      }
    })

  }
  ver_Habilitados() {
    this.dataSource.data = this.Cargo
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {

      this.dataSource.data = this.Cargo
      this.OpcionesTabla = ['Editar', 'Eliminar']

    }
    else {
      this.obtener_CargosNoHabilitados()

    }
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }
  getFecha() {
    return Date.now()
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }


}
