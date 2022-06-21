import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCargoComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-cargo/dialog-cargo.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import decode from 'jwt-decode'
import { CargoService } from 'src/app/servicios/servicios-m1/cargo.service';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';

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
  Cargos: CargoModel[]


  constructor(private cargoService: CargoService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_CargosHabilitados()
  }

  obtener_CargosHabilitados() {

    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.cargoService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.Cargos = resp.Cargos
        this.dataSource.data = this.Cargos
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_CargosNoHabilitados() {
    this.OpcionesTabla = ['Editar', 'Habilitar']
    this.cargoService.getCargos_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.Cargos = resp.Cargos
        this.dataSource.data = this.Cargos

      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  agregar_Cargo() {
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: {}
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Cargos.unshift(datosFormulario)
        this.dataSource.data = this.Cargos
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
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        const index = this.Cargos.findIndex((item: any) => item.id_cargo == datos.id_cargo);
        this.Cargos[index] = Object.assign(this.Cargos[index], datosFormulario)
        this.dataSource.data = this.Cargos

      }
    });
  }

  eliminar_Cargo(datos: any) {
    this.cargoService.putCargo(datos.id_cargo, { Activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Cargos = this.Cargos.filter(elemento => elemento.id_cargo != datos.id_cargo);
        this.dataSource.data = this.Cargos
        this.msg.mostrarMensaje('success', 'El cargo fue desabilidato')
      }
    })

  }
  habilitar_cargo(datos: any) {
    this.cargoService.putCargo(datos.id_cargo, { Activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Cargos = this.Cargos.filter(elemento => elemento.id_cargo != datos.id_cargo);
        this.dataSource.data = this.Cargos
        this.msg.mostrarMensaje('success', 'El cargo se habilito')
      }
    })

  }
  ver_Habilitados() {

    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {

      this.obtener_CargosHabilitados()

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
