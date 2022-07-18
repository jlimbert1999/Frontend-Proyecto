import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { DialogDetallesComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-detalles/dialog-detalles.component';
import { DialogUsuariosComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-usuarios/dialog-usuarios.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { FuncionarioModel } from 'src/app/modelos/administracion-usuarios/usuario.model';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  Funcionarios: FuncionarioModel[] = []
  msg = new Mensajes()
  displayedColumns = [
    // { key: "Nro", titulo: "NUMERO" },
    { key: "Nombre", titulo: "Nombre" },
    { key: "Apellido_P", titulo: "Paterno" },
    { key: "Apellido_M", titulo: "Materno" },
    { key: "Telefono", titulo: "Telefono" },
    { key: "Direccion", titulo: "Direccion" },
    { key: "id_cuenta", titulo: "Cuenta" }
    // { key: "Activo", titulo: "HABILITADO" }
  ]
  verHabilitados: boolean = true
  verConCuentas: boolean = true
  OpcionesTabla: string[] = []
  dataSource = new MatTableDataSource()
  modo_busqueda: boolean = false
  spiner_carga: boolean = false

  //Variables para mensajes
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false
  })


  constructor(
    private usuariosService: UsuariosService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.obtener_Funcionarios_Habilitados()
  }


  obtener_Funcionarios_Habilitados() {
    this.OpcionesTabla = ['Editar', 'VerDetalles', 'Eliminar']
    this.spiner_carga = true
    this.usuariosService.getUsuarios_Habilitados().subscribe((res: any) => {
      if (res.ok) {
        this.spiner_carga = false
        this.Funcionarios = res.usuarios
        this.dataSource.data = this.Funcionarios
        
      }
    })
  }
  obtener_Funcionarios_NoHabilitados() {
    this.OpcionesTabla = ['Editar', 'VerDetalles', 'Habilitar']
    this.spiner_carga = true
    this.usuariosService.getUsuarios_noHabilitados().subscribe((res: any) => {
      if (res.ok) {
        this.spiner_carga = false
        this.Funcionarios = res.usuarios
        this.dataSource.data = res.usuarios

      }
    })
  }
  agregar_Funcionario() {
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: {}
    })
    dialogRef.afterClosed().subscribe((datosFormulario: any) => {
      if (datosFormulario) {
        this.Funcionarios.unshift(datosFormulario)
        this.dataSource.data = this.Funcionarios
      }
    });
  }
  editar_Funcionario(datosFuncionario: any) {
    if (datosFuncionario.Activo == '1') {
      datosFuncionario.Activo = true
    }
    else if (datosFuncionario.Activo == '0') {
      datosFuncionario.Activo = false
    }
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: datosFuncionario
    });
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        const index = this.Funcionarios.findIndex((item: FuncionarioModel) => item.id_funcionario == datosFormulario.id_funcionario);
        this.Funcionarios[index] = datosFormulario
        this.dataSource.data = this.Funcionarios
      }
    });
  }

  eliminarUsuario(datos: any) {
    Swal.fire({
      title: `Eliminar funcionario?`,
      text: `Se desabilitara al funcionario ${datos.Nombre} ${datos.Apellido_P} ${datos.Apellido_M}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        let id = datos.id_funcionario
        this.usuariosService.deleteUsuarios(id).subscribe((resp: any) => {
          this.Funcionarios = this.Funcionarios.filter(user => user.id_funcionario != datos.id_funcionario);
          this.dataSource.data = this.Funcionarios
          // this.obtener_Funcionarios_Habilitados();
          if (resp.ok) {
            this.swalWithBootstrapButtons.fire(
              `${resp.message}`,
              'El funcionario ha sido eliminado',
              'success'
            )
          }
          else {
            this.swalWithBootstrapButtons.fire(
              `${resp.messafe}`,
              'La operacion fallo',
              'error'
            )
          }
        })

      }
    })
  }
  habilitarUsuario(datos: any) {
    Swal.fire({
      title: `Habilitar funcionario?`,
      text: `El funcionario se mostrara como habilitado`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.putUsuario(datos.id_funcionario, { Activo: true }).subscribe((resp: any) => {
          this.Funcionarios = this.Funcionarios.filter(user => user.id_funcionario != datos.id_funcionario);
          this.dataSource.data = this.Funcionarios
          // this.obtener_Funcionarios_Habilitados();
          if (resp.ok) {
            this.swalWithBootstrapButtons.fire(
              `${resp.message}`,
              'El funcionario ha sido habilitado',
              'success'
            )
          }
          else {
            this.swalWithBootstrapButtons.fire(
              `${resp.messafe}`,
              'La operacion fallo',
              'error'
            )
          }
        })

      }
    })

  }


  FinalizarCargo(datos: any) {
    let id_cuenta: number = datos.id_cuenta;
    let NombreFuncionario: string = `${datos.Nombre} ${datos.Apellido_P} ${datos.Apellido_M}`
    let Dni: number = datos.Dni
    let Cargo: string = datos.NombreCar
    Swal.fire({
      icon: 'question',
      title: `Finalizar el cargo "${Cargo.toLocaleUpperCase()}" del funcionario: "${NombreFuncionario}" con DNI: ${Dni}`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.finalizarCuenta(id_cuenta).subscribe((resp: any) => {
          if (resp.ok) {

            // Reigstrar finalizacion del cargo
            let detallesTrabajoFuncionario = {
              id_funcionario: datos.id_funcionario,
              id_cargo: datos.id_cargo,
              detalle: "Finalizo",
              fecha: this.getFecha()
            }
            this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()
            this.msg.mostrarMensaje("success", resp.message)
            // this.obtener_cuentasAsignadas()
          }
        })
      }
    })

  }
  obtenerDetallesFuncionario(id: any) {
    const dialogRef = this.dialog.open(DialogDetallesComponent, {
      width: '60%',
      data: id
    })
  }
  getFecha(): any {
    return Date.now()
  }





  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.obtener_Funcionarios_Habilitados()
    }
    else {

      this.obtener_Funcionarios_NoHabilitados()

    }
  }


  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }
  activar_busqueda() {
    this.modo_busqueda = true
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}