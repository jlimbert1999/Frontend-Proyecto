import { Component, EventEmitter, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/servicios-m1/usuarios.service';

//Modelos
import { FuncionarioModel } from 'src/app/modelos/administracion-usuarios/usuario.model';
import { CuentaModel } from 'src/app/modelos/administracion-usuarios/cuenta.model'
import { TrabajoModel } from 'src/app/modelos/administracion-usuarios/trabajo.model'

import { DialogUsuariosComponent } from '../../componentes/dialogs/dialogs-m1/dialog-usuarios/dialog-usuarios.component'
import { DialogDetallesComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-detalles/dialog-detalles.component'
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
  Funcionarios: FuncionarioModel[] = []
  Cuentas: any[] = []

  //opciones tabla
  TipoTabla: string = ""
  displayedColumns: any
  verHabilitados: boolean = true
  mostrarTabla: boolean = false;
  OpcionesTabla: string[] = []
  dataSource = new MatTableDataSource();


  //manejo de datos para actualizar
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

  msg = new Mensajes()
  CuentasNoAsignadas: any[] = []
  Permisos: any[] = []
  panel_titulo: string = ""


  constructor(
    private usuariosService: UsuariosService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.Cargar_tablaFuncionarios()
  }
  getFecha(): any {
    return Date.now()
  }

  obtener_Funcionarios_Habilitados() {
    this.verHabilitados = true
    this.usuariosService.getUsuarios_Habilitados().subscribe((res: any) => {
      if (res.ok) {
        if (res.usuarios.length > 0) {
          this.OpcionesTabla=['Editar', 'VerDetalles', 'Eliminar']
          this.Funcionarios = res.usuarios
          this.dataSource.data = this.Funcionarios
        }
      }
    })
  }
  obtener_Funcionarios_NoHabilitados() {
    this.verHabilitados = false
    this.usuariosService.getUsuarios_noHabilitados().subscribe((res: any) => {
      if (res.ok) {
        if (res.usuarios.length > 0) {
          this.dataSource.data = res.usuarios
          this.OpcionesTabla=['Editar', 'VerDetalles']
        }
        else {
          this.msg.mostrarMensaje('info', 'No hay usuarios no habilitados')
          this.verHabilitados = true
        }
      }
    })
  }
  obtener_cuentasAsignadas() {
    this.usuariosService.getCuentasAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cuentas.length > 0) {
          this.verHabilitados = true
          this.Cuentas = resp.Cuentas
          resp.Cuentas.forEach((cuenta: any, index: number) => {
            this.Cuentas[index]['NombreCompleto'] = `${cuenta.Nombre} ${cuenta.Apellido_P} ${cuenta.Apellido_M}`

          });
          this.dataSource.data = this.Cuentas;

        }
        else {
          this.msg.mostrarMensaje('info', 'No hay cuentas asignadas')
          this.dataSource.data = []
        }

      }
    })
  }
  obtener_cuentasNoAsignadas() {
    this.usuariosService.getCuentasNoAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cuentas.length > 0) {
          this.dataSource.data = resp.Cuentas;
        }
        else {
          this.msg.mostrarMensaje('info', 'No hay cuentas sin asignar')
          this.verHabilitados = true
          this.OpcionesTabla = ['Finalizar']
        }
      }
    })
  }


  agregar_Funcionario() {
    this.dataFormRegistro.datosFuncionario = { Activo: true } //vaciar
    this.dataFormRegistro.datosCuenta = {}
    this.dataFormRegistro.Tipo_Registro = '';
    this.dataFormRegistro.Tipo = ''

    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: {}
    })
    dialogRef.afterClosed().subscribe((datosFormulario: any) => {
      if (datosFormulario) {
        console.log(datosFormulario.Tipo[0]);
        if (datosFormulario.Tipo_Registro == '') { //creo funcionario sin cuenta
          this.datos_funcionario = datosFormulario.datosFuncionario;
          this.datos_funcionario.Fecha_creacion = this.datos_funcionario.Fecha_actualizacion = this.getFecha()
          this.usuariosService.addUsuario(this.datos_funcionario).subscribe((resp: any) => {
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
          this.usuariosService.addUsuario(this.datos_funcionario).subscribe((resp: any) => {
            if (resp.ok) {
              //creacion cuenta
              this.datos_cuenta = datosFormulario.datosCuenta
              this.datos_cuenta.fecha_creacion = this.datos_cuenta.fecha_actualizacion = this.getFecha()
              this.datos_cuenta.activo = true;
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
          this.usuariosService.addUsuario(this.datos_funcionario).subscribe((resp: any) => {
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

  eliminarUsuario(datos: any) {

    Swal.fire({
      title: `Eliminar funcionario?`,
      text: `Se desabilitara al funcionario ${datos.Nombre} ${datos.Apellido_P} ${datos.Apellido_M}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText:'Cancelar',
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
    if(datos.Activo=='1'){
      datos.Activo=true
    }
    else if(datos.Activo=='0'){
      datos.Activo=false
    }
    let id_funcionario: number = datos.id_funcionario;
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data: { datosFuncionario: datos, datosCuenta: {} }
    });
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        datosFormulario.datosFuncionario.Fecha_actualizacion = this.getFecha()
        this.usuariosService.putUsuario(id_funcionario, datosFormulario.datosFuncionario).subscribe((resp: any) => {

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
            this.datos_cuenta.activo = true;
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

  obtenerDetallesFuncionario(id: any) {
    const dialogRef = this.dialog.open(DialogDetallesComponent, {
      width: '60%',
      data: id
    })
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  Cargar_tablaFuncionarios() {
    this.OpcionesTabla = ['Editar', 'VerDetalles', 'Eliminar']
    this.TipoTabla = "Funcionarios"

    this.mostrarTabla = true
    this.generar_titulosTabla_Funcionario()
    this.obtener_Funcionarios_Habilitados()
  }

  Cargar_tablaCuentas() {
    this.OpcionesTabla = ['Finalizar']
    this.TipoTabla = "Cuentas"
    this.mostrarTabla = true
    this.generar_titulosTabla_Cuentas()
    this.obtener_cuentasAsignadas()
  }

  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.OpcionesTabla=['Editar', 'VerDetalles', 'Eliminar']
      if (this.TipoTabla == "Funcionarios") {
        this.generar_titulosTabla_Funcionario()
        this.dataSource.data = this.Funcionarios
      }
      if (this.TipoTabla == "Cuentas") {
        this.generar_titulosTabla_Cuentas()
        this.dataSource.data = this.Cuentas
      }

    }
    else {
     
      if (this.TipoTabla == "Funcionarios") {
        this.obtener_Funcionarios_NoHabilitados()

      }
      if (this.TipoTabla == "Cuentas") {
        this.obtener_cuentasNoAsignadas()
        this.OpcionesTabla = ['']
        this.displayedColumns = [
          { key: "login", titulo: "Login" },
          { key: "NombreCar", titulo: "Cargo" },
          { key: "NombreDep", titulo: "Dependencia" },
          { key: "SiglaInst", titulo: "Institucion" }
        ]
      }
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
  generar_titulosTabla_Cuentas() {
    this.displayedColumns = [
      { key: "Dni", titulo: "Dni" },
      // { key: "Nombre", titulo: "Nombre" },
      { key: "NombreCompleto", titulo: "Nombre" },
      // { key: "Apellido_P", titulo: "Paterno" },
      // { key: "Apellido_M", titulo: "Materno" },
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
            this.obtener_cuentasAsignadas()
          }
        })
      }
    })

  }

  //************PERMISOS******************
  registrar_permisos(datos: any[], id_cuenta: number) {
    datos.forEach((permiso: any) => {
      permiso.id_cuenta = id_cuenta
      console.log(permiso);
      // this.usuariosService.postPermisos(permiso).subscribe((resp:any)=>{
      //   if(resp.ok){
      //     console.log(resp);
      //   }
      // })
    });
  }













}
