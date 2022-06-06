import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDetallesComponent } from 'src/app/componentes/dialogs/dialog-detalles/dialog-detalles.component';
import { DialogUsuariosComponent } from 'src/app/componentes/dialogs/dialog-usuarios/dialog-usuarios.component';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { CuentaModel } from 'src/app/modelos/administracion-usuarios/cuenta.model';
import { TrabajoModel } from 'src/app/modelos/administracion-usuarios/trabajo.model';
import { FuncionarioModel } from 'src/app/modelos/usuario.model';
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

  TipoTabla: string = ""
  displayedColumns: any
  verHabilitados: boolean = true
  mostrarTabla: boolean = false;
  OpcionesTabla: string[] = []
  dataSource = new MatTableDataSource()
  modo_busqueda: boolean = false

  datos_funcionario: FuncionarioModel
  datos_cuenta: CuentaModel

  dataFormRegistro = {
    datosFuncionario: {}, //datos_funcionario
    datosCuenta: {},  //datos_cuenta
    Tipo_Registro: '',
    Tipo: '' // tipo de permisos que tendra, admin, funcionario
  }
  datos_Trabajo: TrabajoModel;

  //Variables para mensajes
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  constructor(private usuariosService: UsuariosService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_Funcionarios_Habilitados()
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
          console.log(resp)
          this.obtener_Funcionarios_Habilitados();
          if (resp.ok) {
            this.swalWithBootstrapButtons.fire(
              `${resp.message}`,
              'La operacion a sido exitosa',
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





  editar_Funcionario(datos: any) {
    if (datos.Activo == '1') {
      datos.Activo = true
    }
    else if (datos.Activo == '0') {
      datos.Activo = false
    }
    let id_funcionario: number = datos.id_funcionario;
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: { datosFuncionario: datos, datosCuenta: {} }
    });
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        datosFormulario.datosFuncionario.Fecha_actualizacion = this.getFecha()
        this.usuariosService.putUsuarios(id_funcionario, datosFormulario.datosFuncionario).subscribe((resp: any) => {

          if (!datosFormulario.Tipo_Registro) { //si no quiere crer ni asignar hay 2 opciones
            if (Object.keys(datosFormulario.datosCuenta).length == 0) { //no tiene cuenta, per quiere actualizar datos funcionario
              this.msg.mostrarMensaje('success', 'Datos del funcionario actualizados!')
              this.obtener_Funcionarios_Habilitados()
            }
            else {  //si tiene cuenta, y actualizara datos funcionario y datos cuenta
              let datosCuenta = {
                login: datosFormulario.datosCuenta.login,
                password: datosFormulario.datosCuenta.Password,
                fecha_actualizacion: this.getFecha()
              }
              this.usuariosService.putCuenta(datosFormulario.datosCuenta.id_cuenta, datosCuenta).subscribe((resp: any) => {
                if (resp.ok) {
                  this.msg.mostrarMensaje('success', 'Datos cuenta y del funcionario actualizados!')
                  this.obtener_Funcionarios_Habilitados()
                }
              })
            }
          }
          if (datosFormulario.Tipo_Registro == "Crear") {
            this.datos_cuenta = datosFormulario.datosCuenta
            this.datos_cuenta.fecha_creacion = this.datos_cuenta.fecha_actualizacion = this.getFecha()
            this.datos_cuenta.Activo = true;
            this.datos_cuenta.id_funcionario = id_funcionario
            this.usuariosService.addCuenta(this.datos_cuenta).subscribe((resp: any) => {
              if (resp.ok) {

                // crear los valores para registrar en trabajo
                this.datos_Trabajo = {
                  id_cuenta: resp.cuenta.insertId,
                  id_cargo: this.datos_cuenta.id_cargo,
                  id_institucion: datosFormulario.id_institucion,
                  id_dependencia: datosFormulario.id_dependencia
                }
                this.usuariosService.addTrabajo(this.datos_Trabajo).subscribe((resp2: any) => {
                  if (resp2.ok) {

                    let detallesTrabajoFuncionario = {
                      id_funcionario: id_funcionario,
                      id_cargo: this.datos_cuenta.id_cargo,
                      detalle: "Inicio",
                      fecha: this.getFecha()
                    }
                    this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()

                    this.msg.mostrarMensaje('success', resp.message)
                    this.obtener_Funcionarios_Habilitados()
                  }
                })
              }
            })
          }
          if (datosFormulario.Tipo_Registro == "Asignar") {
            // crear obtjeto con datos de la actulizacion
            let cuentaAsignada: object = {
              id_funcionario: id_funcionario, //a que funcionario se dara la cuenta
              login: datosFormulario.datosCuenta.login
            }
            this.usuariosService.asignarCuenta(cuentaAsignada, datosFormulario.datosCuenta.id_cuenta).subscribe((resp: any) => {
              let detallesTrabajoFuncionario = {
                id_funcionario: id_funcionario,
                id_cargo: datosFormulario.datosCuenta.id_cargo,
                detalle: "Inicio",
                fecha: this.getFecha()
              }
              this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()
              this.msg.mostrarMensaje('success', resp.message)
            })


          }

        })
      }
    });
  }
  obtener_Funcionarios_Habilitados() {
    this.usuariosService.getUsuarios_Habilitados().subscribe((res: any) => {
      if (res.ok) {

        this.Funcionarios = res.usuarios
        this.dataSource.data = this.Funcionarios
        this.crear_tabla_Funcionarios()
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
  crear_tabla_Funcionarios() {
    this.OpcionesTabla = ['Editar', 'VerDetalles', 'Eliminar']
    this.displayedColumns = [
      // { key: "Nro", titulo: "NUMERO" },
      { key: "Nombre", titulo: "Nombre" },
      { key: "Apellido_P", titulo: "Paterno" },
      { key: "Apellido_M", titulo: "Materno" },
      { key: "Telefono", titulo: "Telefono" },
      { key: "Direccion", titulo: "Direccion" }
      // { key: "Activo", titulo: "HABILITADO" }
    ]
  }
  agregar_Funcionario() {
    this.dataFormRegistro.datosFuncionario = { Activo: true } //vaciar
    this.dataFormRegistro.datosCuenta = {}
    this.dataFormRegistro.Tipo_Registro = '';
    this.dataFormRegistro.Tipo = ''

    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: this.dataFormRegistro
    })
    dialogRef.afterClosed().subscribe((datosFormulario: any) => {
      if (datosFormulario) {
        console.log(datosFormulario.Tipo[0]);
        if (datosFormulario.Tipo_Registro == '') { //creo funcionario sin cuenta
          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuarios(this.datos_funcionario).subscribe((resp: any) => {
            if (resp.ok) {
              this.obtener_Funcionarios_Habilitados()
              this.msg.mostrarMensaje('success', resp.message)
            }
          })
        }
        else if (datosFormulario.Tipo_Registro == 'Crear') {
          //creacion funcionario
          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuarios(this.datos_funcionario).subscribe((resp: any) => {
            if (resp.ok) {
              //creacion cuenta
              this.datos_cuenta = datosFormulario.datosCuenta
              this.datos_cuenta.fecha_creacion = this.datos_cuenta.fecha_actualizacion = this.getFecha()
              this.datos_cuenta.Activo = true;
              this.datos_cuenta.id_funcionario = resp.usuario.insertId
              this.usuariosService.addCuenta(this.datos_cuenta).subscribe((resp1: any) => {
                if (resp1.ok) {

                  //agregar detalles de donde trabaja
                  let detallesTrabajoFuncionario = {
                    id_funcionario: resp.usuario.insertId,
                    id_cargo: this.datos_cuenta.id_cargo,
                    detalle: "Inicio",
                    fecha: this.getFecha()
                  }
                  this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()
                  // crear los valores para registrar en trabajo
                  this.datos_Trabajo = {
                    id_cuenta: resp1.cuenta.insertId,
                    id_cargo: this.datos_cuenta.id_cargo,
                    id_institucion: datosFormulario.id_institucion,
                    id_dependencia: datosFormulario.id_dependencia
                  }
                  this.usuariosService.addTrabajo(this.datos_Trabajo).subscribe((resp2: any) => {
                    if (resp2.ok) {
                      this.msg.mostrarMensaje('success', 'Funcionario y cuenta creados exitosamente!')
                      this.obtener_Funcionarios_Habilitados()
                    }
                  })
                  let permiso = {
                    id_cuenta: resp1.cuenta.insertId,
                    tipo: datosFormulario.Tipo[0]
                  }
                  this.usuariosService.postPermisos(permiso).subscribe((resp: any) => {
                    if (resp.ok == false) {
                      this.msg.mostrarMensaje('error', 'Error al crear los permisos')
                    }
                  })
                }
              })
            }
          })
        }
        else if (datosFormulario.Tipo_Registro == 'Asignar') {
          //agregar funcionario
          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuarios(this.datos_funcionario).subscribe((resp: any) => {
            if (resp.ok) {

              //crear obtjeto con datos de   la actualizacion
              let cuentaAsignada = {
                id_funcionario: resp.usuario.insertId //a que funcionario se dara la cuenta
              }
              this.usuariosService.asignarCuenta(cuentaAsignada, datosFormulario.datosCuenta.id_cuenta).subscribe((resp: any) => {
                if (resp.ok) {
                  let detallesTrabajoFuncionario = {
                    id_funcionario: cuentaAsignada.id_funcionario,
                    id_cargo: datosFormulario.datosCuenta.id_cargo,
                    detalle: "Inicio",
                    fecha: this.getFecha()
                  }
                  this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()
                  this.msg.mostrarMensaje('success', 'Funcionario creado y cuenta asignada correctamente!')
                }

              })
            }
          })
        }
      }
    });
  }


  obtener_Funcionarios_NoHabilitados() {
    this.verHabilitados = false
    this.usuariosService.getUsuarios_noHabilitados().subscribe((res: any) => {
      if (res.ok) {
        if (res.usuarios.length > 0) {
          this.dataSource.data = res.usuarios
          this.OpcionesTabla = ['Editar', 'VerDetalles']
        }
        else {
          this.msg.mostrarMensaje('info', 'No hay usuarios no habilitados')
          this.verHabilitados = true
        }
      }
    })
  }
  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.OpcionesTabla = ['Editar', 'VerDetalles', 'Eliminar']
      this.generar_titulosTabla_Funcionario()
      this.dataSource.data = this.Funcionarios

    }
    else {
      this.obtener_Funcionarios_NoHabilitados()

    }

  }
  generar_titulosTabla_Funcionario() {
    this.displayedColumns = [
      // { key: "Nro", titulo: "NUMERO" },
      { key: "Nombre", titulo: "Nombre" },
      { key: "Apellido_P", titulo: "Paterno" },
      { key: "Apellido_M", titulo: "Materno" },
      { key: "Telefono", titulo: "Telefono" },
      { key: "Direccion", titulo: "Direccion" }
      // { key: "Activo", titulo: "HABILITADO" }
    ]

  }
  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}