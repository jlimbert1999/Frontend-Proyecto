import { Component, EventEmitter, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/servicios-m1/usuarios.service';

//Modelos
import { UsuarioModel } from 'src/app/modelos/usuario.model';
import { CuentaModel } from 'src/app/modelos/administracion-usuarios/cuenta.model'
import { TrabajoModel } from 'src/app/modelos/administracion-usuarios/trabajo.model'

import { DialogUsuariosComponent } from '../../componentes/dialogs/dialog-usuarios/dialog-usuarios.component'
import { DialogDetallesComponent } from 'src/app/componentes/dialogs/dialog-detalles/dialog-detalles.component'
//material
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.css']
})
export class AdministracionUsuariosComponent implements OnInit {

  tituloOpcionVista: string = ""
  verHabilitados: boolean = true
  TipoTabla: string = ""
  displayedColumns: any
  datos_funcionario: UsuarioModel = {
    Nombre: "",
    Apellido_P: "",
    Apellido_M: "",
    Dni: "",
    Expedido: "",
    Telefono: "",
    Direccion: "",
    Fecha_creacion: "",
    Fecha_actualizacion: "",
    Activo: true
  }
  datos_cuenta: CuentaModel = {
    login: '',
    password: '',
    fecha_creacion: '',
    fecha_actualizacion: '',
    Activo: true,
    id_cargo: 0,
    id_funcionario: 0
  }
  dataFormRegistro = {
    datosFuncionario: {}, //datos_funcionario
    datosCuenta: {},  //datos_cuenta
    TipoCuenta: ''
  }
  datos_Trabajo: TrabajoModel = {
    id_cargo: -1,
    id_institucion: -1,
    id_dependencia: -1,
    id_cuenta: -1
  }

  //Variables para mensajes
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  mostrarTabla: boolean = false;
  Funcionarios: any[] = []
  Cuentas: any[] = []
  dataSource = new MatTableDataSource();
  msg = new Mensajes()
  OpcionesTabla: string[] = []
  FuncioNoHabilitados: any[]=[]
  CuentasNoAsignadas: any[]=[]



  constructor(private usuariosService: UsuariosService, public dialog: MatDialog) {
    // this.obtener_FuncionariosHabilitados()
    // this.obtener_cuentasAsignadas()
  }

  ngOnInit(): void {
  }

  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }

  obtener_FuncionariosHabilitados() {
    this.usuariosService.getUsuarios_Habilitados().subscribe((res: any) => {
      this.verHabilitados = true
      res.usuarios.forEach((element: any, index:number) => {
        if (element.Activo == "1") {
          res.usuarios[index].Activo = true
          
        }
      });
      this.Funcionarios=res.usuarios

      this.dataSource = new MatTableDataSource(this.Funcionarios)
    })
  }
  obtener_FuncionariosNoHabilitados() {
    this.usuariosService.getUsuarios_noHabilitados().subscribe((res: any) => {
      if (res.ok) {
        this.tituloOpcionVista = "Ver Funcionarios Habilitados"
        res.usuarios.forEach((element: any, index:number) => {
          if (element.Activo == "0") {
            res.usuarios[index].Activo = false
          }
        });
        this.FuncioNoHabilitados=res.usuarios
        this.dataSource = new MatTableDataSource(this.FuncioNoHabilitados)
      }

    })
  }

  agregar_Funcionario() {
    this.dataFormRegistro.datosFuncionario = { Activo: true } //vaciar
    this.dataFormRegistro.datosCuenta = {}
    this.dataFormRegistro.TipoCuenta = '';

    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: this.dataFormRegistro
    })
    dialogRef.afterClosed().subscribe((datosFormulario: any) => {
      if (datosFormulario) {
        if (datosFormulario.TipoCuenta == '') {

          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuarios(this.datos_funcionario).subscribe((resp: any) => {
            this.obtener_FuncionariosHabilitados()
            this.msg.mostrarMensaje('success', resp.message)
          })
        }
        else if (datosFormulario.TipoCuenta == 'Crear') {
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
                  this.datos_Trabajo.id_cuenta = resp1.cuenta.insertId //insertID valor que regresa la BD
                  this.datos_Trabajo.id_cargo = this.datos_cuenta.id_cargo
                  this.datos_Trabajo.id_institucion = datosFormulario.id_institucion
                  this.datos_Trabajo.id_dependencia = datosFormulario.id_dependencia
                  this.usuariosService.addTrabajo(this.datos_Trabajo).subscribe((resp2: any) => {
                    if (resp2.ok) {
                      this.msg.mostrarMensaje('success', resp1.message)
                      this.obtener_FuncionariosHabilitados()
                    }
                  })
                }
              })
            }
          })
        }
        else if (datosFormulario.TipoCuenta == 'Asignar') {
          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuarios(this.datos_funcionario).subscribe((resp: any) => {
            if (resp.ok) {

              //crear obtjeto con datos de la actulizacion
              let cuentaAsignada: any = {
                id_funcionario: resp.usuario.insertId //a que funcionario se dara la cuenta
              }
              this.usuariosService.asignarCuenta(cuentaAsignada, datosFormulario.datosCuenta.id_cuenta).subscribe((resp: any) => {

                let detallesTrabajoFuncionario = {
                  id_funcionario: cuentaAsignada.id_funcionario,
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

      }
    });
  }

  eliminarUsuario(datos: any) {

    this.swalWithBootstrapButtons.fire({
      title: `Eliminar al funcionario?`,
      text: `Se eliminara al funcionario:  ${datos.Nombre} ${datos.Apellido_P} ${datos.Apellido_M}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        /////////Metdodo eliminar//////////
        let id = datos.id_funcionario
        this.usuariosService.deleteUsuarios(id).subscribe((resp: any) => {
          console.log(resp)
          this.obtener_FuncionariosHabilitados();
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
        ////////////////////////////////////
      }
    })
  }

  actualizarUsuario(datos: any) {
    let id: number = datos.id_funcionario;
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: { datosFuncionario: datos, datosCuenta: {} }
    });
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        datosFormulario.datosFuncionario.Fecha_actualizacion = this.getFecha()
        this.usuariosService.putUsuarios(id, datosFormulario.datosFuncionario).subscribe((resp: any) => {

          if (!datosFormulario.TipoCuenta) { //si no quiere crer ni asignar hay 2 opciones
            if (Object.keys(datosFormulario.datosCuenta).length == 0) { //no tiene cuenta, per quiere actualizar datos funcionario
              this.msg.mostrarMensaje('success', resp.message)
            }
            else {  //si tiene cuenta, y actualizara datos funcionario y datos cuenta
              const datosCuenta = {
                login: datosFormulario.datosCuenta.login,
                password: datosFormulario.datosCuenta.password
              }
              this.usuariosService.putCuenta(datosFormulario.datosCuenta.id_cuenta, datosCuenta).subscribe((resp: any) => {
                if (resp.ok) {
                  this.msg.mostrarMensaje('success', resp.message)
                  this.obtener_FuncionariosHabilitados()
                }
              })
            }


          }
          if (datosFormulario.TipoCuenta == "Crear") {
            this.datos_cuenta = datosFormulario.datosCuenta
            this.datos_cuenta.fecha_creacion = this.datos_cuenta.fecha_actualizacion = this.getFecha()
            this.datos_cuenta.Activo = true;
            this.datos_cuenta.id_funcionario = id
            this.usuariosService.addCuenta(this.datos_cuenta).subscribe((resp: any) => {
              if (resp.ok) {

                // crear los valores para registrar en trabajo
                this.datos_Trabajo.id_cuenta = resp.cuenta.insertId //insertID valor que regresa la BD
                this.datos_Trabajo.id_cargo = this.datos_cuenta.id_cargo
                this.datos_Trabajo.id_institucion = datosFormulario.id_institucion
                this.datos_Trabajo.id_dependencia = datosFormulario.id_dependencia
                this.usuariosService.addTrabajo(this.datos_Trabajo).subscribe((resp2: any) => {
                  if (resp2.ok) {

                    let detallesTrabajoFuncionario = {
                      id_funcionario: id,
                      id_cargo: this.datos_cuenta.id_cargo,
                      detalle: "Inicio",
                      fecha: this.getFecha()
                    }
                    this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()

                    this.msg.mostrarMensaje('success', resp.message)
                    this.obtener_FuncionariosHabilitados()
                  }
                })
              }
            })
          }
          if (datosFormulario.TipoCuenta == "Asignar") {
            // crear obtjeto con datos de la actulizacion
            let cuentaAsignada: object = {
              id_funcionario: id //a que funcionario se dara la cuenta
            }
            this.usuariosService.asignarCuenta(cuentaAsignada, datosFormulario.datosCuenta.id_cuenta).subscribe((resp: any) => {
              let detallesTrabajoFuncionario = {
                id_funcionario: id,
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

  obtenerDetallesFuncionario(id: any) {
    const dialogRef = this.dialog.open(DialogDetallesComponent, {
      // width:'400px',
      data: id
    })
  }


  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      if (this.TipoTabla == "Funcionarios") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Funcionarios)

        }
        else {
          this.dataSource = new MatTableDataSource(this.FuncioNoHabilitados)
        }
      }
      else if (this.TipoTabla == "Cuentas") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Cuentas)
        }
        else {
          this.dataSource = new MatTableDataSource(this.CuentasNoAsignadas)
        }
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      if (this.TipoTabla == "Funcionarios") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Funcionarios)
        }
        else {
          this.dataSource = new MatTableDataSource(this.FuncioNoHabilitados)
        }
      }
      else if (this.TipoTabla == "Cuentas") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Cuentas)
        }
        else {
          this.dataSource = new MatTableDataSource(this.CuentasNoAsignadas)
        }
      }
    }
  }


  obtener_cuentasAsignadas() {
    this.usuariosService.getCuentasAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.verHabilitados = true
        this.Cuentas = resp.Cuentas
        this.dataSource = new MatTableDataSource(this.Cuentas);
      }
    })
  }
  obtener_cuentasNoAsignadas() {
    this.usuariosService.getCuentasNoAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.tituloOpcionVista = "Ver Cuentas Asignadas"
        this.CuentasNoAsignadas = resp.Cuentas
        console.log(this.CuentasNoAsignadas);
        this.dataSource = new MatTableDataSource(this.CuentasNoAsignadas);
      }
    })

  }


  Cargar_tablaFuncionarios() {
    this.OpcionesTabla = ['Editar', 'Eliminar', 'VerDetalles']
    this.TipoTabla = "Funcionarios"
    this.tituloOpcionVista = "Ver Funcionarios no Habilitados"
    this.mostrarTabla = true
    this.generar_titulosTabla_Funcionario()
    this.obtener_FuncionariosHabilitados()
  }

  Cargar_tablaCuentas() {
    this.OpcionesTabla = ['Finalizar']
    this.TipoTabla = "Cuentas"
    this.tituloOpcionVista = "Ver Cuentas no Asignadas"
    this.mostrarTabla = true
    this.generar_titulosTabla_Cuentas()
    this.obtener_cuentasAsignadas()
  }


  ver_Habilitados() {
    if (this.verHabilitados) {
      if (this.TipoTabla == "Funcionarios") {
        this.generar_titulosTabla_Funcionario()
        this.dataSource.data = this.Funcionarios
        this.tituloOpcionVista = "Ver Funcionarios no Habilitados"
      }
      if (this.TipoTabla == "Cuentas") {
        this.dataSource.data = this.Cuentas
        this.tituloOpcionVista = "Ver Cuentas no asignadas"
      }

    }
    else {
      if (this.TipoTabla == "Funcionarios") {
        this.obtener_FuncionariosNoHabilitados()

      }
      if (this.TipoTabla == "Cuentas") {
        this.obtener_cuentasNoAsignadas()
      }
    }

  }

  generar_titulosTabla_Funcionario() {
    this.displayedColumns = [
      { key: "Nro", titulo: "NUMERO" },
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Apellido_P", titulo: "MATERNO" },
      { key: "Apellido_M", titulo: "PATERNO" },
      { key: "Telefono", titulo: "TELEFONO" },
      { key: "Direccion", titulo: "DIRECCION" },
      { key: "Activo", titulo: "HABILITADO" }
    ]

  }
  generar_titulosTabla_Cuentas() {
    this.displayedColumns = [
      { key: "Dni", titulo: "Dni" },
      { key: "Nombre", titulo: "Nombre" },
      { key: "Apellido_P", titulo: "Paterno" },
      { key: "Apellido_M", titulo: "Materno" },
      { key: "login", titulo: "Login" },
      { key: "NombreCar", titulo: "Cargo" },
      { key: "NombreDep", titulo: "Dependencia" },
      { key: "SiglaInst", titulo: "Institucion" }
    ]
  }

  //metodo para colocar id_funcionario en null en la cuenta
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
          }
        })
      }
    })

  }












}
