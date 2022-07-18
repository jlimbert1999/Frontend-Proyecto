import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//modelos
import { FuncionarioModel } from 'src/app/modelos/administracion-usuarios/usuario.model';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';

//servicios
import { CargoService } from '../../../../servicios/servicios-m1/cargo.service'

import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { Mensajes } from '../../../mensaje/mensaje';
import Swal from 'sweetalert2';
import { CuentaModel } from 'src/app/modelos/administracion-usuarios/cuenta.model';
import { forkJoin } from 'rxjs';
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-dialog-usuarios',
  templateUrl: './dialog-usuarios.component.html',
  styleUrls: ['./dialog-usuarios.component.css']
})
export class DialogUsuariosComponent implements OnInit {
  Funcionario: FuncionarioModel
  Cuenta: CuentaModel
  Form_Funcionario: FormGroup
  Form_Cuenta: FormGroup
  Tipo_Registro_cuenta: string = ""
  hide = true;
  Permisos: string = ''
  isChecked: boolean = false
  User_habilitado: boolean = true

  tituloDialog: string = "";
  Cargos: any[] = [];
  Instituciones: InstitucionModel[] = []; //obtener solo bombre y id
  DepActivos: any[] = [];
  DepsdeInstitucion: any[] = [];
  Expedido = [
    { NombreLugar: 'Cochabamba', Abreviacion: 'CB' },
    { NombreLugar: 'Santa Cruz', Abreviacion: 'SC' },
    { NombreLugar: 'La paz', Abreviacion: 'LZ' },
    { NombreLugar: 'Oruro', Abreviacion: 'OR' },
    { NombreLugar: 'Pando', Abreviacion: 'PD' },
    { NombreLugar: 'Chuquisaca', Abreviacion: 'CH' },
    { NombreLugar: 'Tarija', Abreviacion: 'TJ' },
    { NombreLugar: 'Beni', Abreviacion: 'BE' },
    { NombreLugar: 'Potosi', Abreviacion: 'PT' }
  ]

  //Elementos para mostrar en tabla
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Cuenta', 'Cargo', 'Institucion', 'Dependencia', 'Opciones'];
  msg = new Mensajes()
  TipoRegistroCuenta: string = ''
  PoseeCuenta: boolean = false
  DetallesCuenta: any = {}

  Tipo_Permisos = [
    { value: 'ADMIN_ROLE', viewValue: 'administrador' },
    { value: 'USER1_ROLE', viewValue: 'Responsable de recepcion de tramite' },
    { value: 'USER2_ROLE', viewValue: 'Responsable de evaluacion de tramites' }
  ]
  mostrar_opcion_habilitar: boolean = false



  constructor(
    public dialogRef: MatDialogRef<DialogUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cargoService: CargoService,
    private instService: InstitucionService,
    private depService: DependenciaService,
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder
  ) {
    // this.obtenerInstitucionesActivas()
    // this.obtenerDependenciasActivas()
    // this.obtenerCargosActivos()
  }



  ngOnInit(): void {
    this.iniciar_Form_Funcionario()
    this.generarTitulo()
  }

  generarTitulo() {
    // Si datos que vienen son vacios al abrir este dialog, es creacion de usarios
    if (Object.keys(this.data).length == 0) {
      this.tituloDialog = "Registro de funcionario";
      this.TipoRegistroCuenta = "Nueva cuenta"

    }
    //Si datos no estan vacios, se quiere actualizar los datos antiguos
    else {
      this.Funcionario = this.data
      this.Form_Funcionario.patchValue(this.data)
      this.tituloDialog = "Edicion datos de funcionario";
      this.TipoRegistroCuenta = "Editar cuenta"
      if (this.data.id_cuenta) {
        this.iniciar_Form_Cuenta()
        this.obtener_Cuenta(this.data.id_cuenta)
      }
      if (!this.Funcionario.Activo) {
        this.User_habilitado = false
      }
    }
  }
  RegistroCuenta(Tipo: string) {
    this.Tipo_Registro_cuenta = Tipo
    if (Tipo == 'Asignar') {
      this.obtener_CuentasSinAsignar()
      this.iniciar_Form_Cuenta()
    }
    if (Tipo == 'Crear') {
      this.iniciar_Form_Cuenta()
      this.Form_Cuenta.controls['login'].setValue((`${this.Form_Funcionario.controls['Nombre'].value} ${this.Form_Funcionario.controls['Apellido_P'].value.charAt(0)} ${this.Form_Funcionario.controls['Apellido_M'].value.charAt(0)}`).replace(/\s/g, '').toUpperCase())
      this.Form_Cuenta.controls['password'].setValue(this.Form_Funcionario.controls['Dni'].value)
      this.obtenerCargosActivos()
      this.obtenerInstitucionesActivas()

      // this.data.datosCuenta.login = (`${this.data.datosFuncionario.Nombre} ${this.data.datosFuncionario.Apellido_P.charAt(0)} ${this.data.datosFuncionario.Apellido_M.charAt(0)}`).replace(/\s/g, '').toUpperCase()
      // this.data.datosCuenta.password = this.data.datosFuncionario.Dni.toString()
    }
  }

  obtenerInstitucionesActivas() {
    this.instService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Instituciones = resp.Instituciones
      }
    })
  }
  obtener_dep_deInstitucion(id_institucion: number) {
    this.DepsdeInstitucion = []
    this.depService.getDependenciasActivas_de_Instituto(id_institucion).subscribe((resp: any) => {
      if (resp.ok) {
        this.DepsdeInstitucion = resp.Dependencias
      }
    })
  }

  obtenerCargosActivos() {
    this.cargoService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.Cargos = resp.Cargos
      }
    })
  }

  obtener_CuentasSinAsignar() {
    this.usuariosService.getCuentasNoAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.dataSource.data = resp.Cuentas;


      }
    })
  }

  cancelar(): void {
    this.dialogRef.close();
  }



  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  AsignarCuenta(Cuenta_sinAsignar: any) {
    let pregunta: string = `Asignar la cuenta con el cargo "${Cuenta_sinAsignar.NombreCar}" al funcionario: ${this.Form_Funcionario.controls['Nombre'].value} ${this.Form_Funcionario.controls['Apellido_P'].value} con DNI ${this.Form_Funcionario.controls['Dni'].value}?`
    Swal.fire({
      icon: "question",
      title: `${pregunta}`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
        this.Cuenta = Cuenta_sinAsignar
        this.data.id_cuenta = Cuenta_sinAsignar.id_cuenta
        this.Form_Cuenta.patchValue(Cuenta_sinAsignar)
        this.Form_Cuenta.controls['login'].setValue((`${this.Form_Funcionario.controls['Nombre'].value} ${this.Form_Funcionario.controls['Apellido_P'].value.charAt(0)} ${this.Form_Funcionario.controls['Apellido_M'].value.charAt(0)}`).replace(/\s/g, '').toUpperCase())
        this.Form_Cuenta.controls['password'].setValue(this.Form_Funcionario.controls['Dni'].value)


        // if (this.Funcionario) {
        //   this.Cuenta = Cuenta_sinAsignar

        //   // this.usuariosService.putCuenta(Cuenta_sinAsignar.id_cuenta, { id_funcionario: this.Funcionario.id_funcionario }).subscribe((resp: any) => {
        //   //   if (resp.ok) {
        //   //     this.data.id_cuenta = Cuenta_sinAsignar.id_cuenta
        //   //     this.Cuenta = Cuenta_sinAsignar
        //   //     this.Form_Cuenta.patchValue(Cuenta_sinAsignar)
        //   //     this.Permisos="-"
        //   //   }
        //   // })

        // }
        // else {
        //   this.Cuenta = Cuenta_sinAsignar
        // }


        //creamos propiedad id_cuenta en datos cuenta, para usarla en el Adm-Usuarios
        // this.data.datosCuenta['id_cuenta'] = datosCuenta.id_cuenta
        // this.data.datosCuenta['id_cargo'] = datosCuenta.id_cargo
        // this.data.datosCuenta['login'] = ("" + `${this.data.datosFuncionario.Nombre} ${this.data.datosFuncionario.Apellido_P.charAt(0)} ${this.data.datosFuncionario.Apellido_M.charAt(0)}` + "").replace(/\s/g, '').toUpperCase()
      }
    })
  }

  obtener_Cuenta(id_cuenta: number) {
    this.usuariosService.getCuenta(id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        this.Cuenta = resp.Cuenta
        this.Form_Cuenta.patchValue(resp.Cuenta)
      }
    })

  }
  iniciar_Form_Funcionario() {
    this.Form_Funcionario = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Apellido_P: ['', Validators.required],
      Apellido_M: ['', Validators.required],
      Dni: ['', Validators.required],
      Expedido: ['', Validators.required],
      Telefono: ['', [Validators.required, Validators.minLength(8)]],
      Direccion: ['', Validators.required],

    });

  }
  iniciar_Form_Cuenta() {
    this.Form_Cuenta = this.formBuilder.group({
      id_cargo: [null, Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      id_institucion: ['', Validators.required],
      id_dependencia: ['', Validators.required],
    });
  }


  guardar_datos() {
    let fecha = this.getFecha()
    if (this.tituloDialog == "Registro de funcionario") {
      if (this.Form_Funcionario.valid) {
        this.Funcionario = this.Form_Funcionario.value
        this.Funcionario.Fecha_actualizacion = fecha
        this.Funcionario.Fecha_creacion = fecha
        this.Funcionario.Activo = true
        this.usuariosService.addUsuario(this.Funcionario).subscribe((resp: any) => {
          if (resp.ok) {
            if (this.Tipo_Registro_cuenta == 'Crear') { //crear funcionario y asignar
              this.Cuenta = {
                id_cargo: this.Form_Cuenta.controls['id_cargo'].value,
                id_funcionario: resp.Usuario.insertId,
                login: this.Form_Cuenta.controls['login'].value,
                password: this.Form_Cuenta.controls['password'].value,
                fecha_actualizacion: fecha,
                fecha_creacion: fecha,
                activo: true,
                permisos: this.Permisos
              }
              if (this.Form_Cuenta.valid) {
                this.usuariosService.addCuenta(this.Cuenta).subscribe((respCuenta: any) => {
                  if (respCuenta.ok) {
                    let detallesTrabajoFuncionario = {
                      id_funcionario: resp.Usuario.insertId,
                      id_cargo: this.Cuenta.id_cargo,
                      detalle: "Inicio",
                      fecha
                    }
                    let datos_Trabajo = {
                      id_cuenta: respCuenta.Cuenta.insertId,
                      id_cargo: this.Form_Cuenta.controls['id_cargo'].value,
                      id_institucion: this.Form_Cuenta.controls['id_institucion'].value,
                      id_dependencia: this.Form_Cuenta.controls['id_dependencia'].value
                    }
                    forkJoin([this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario), this.usuariosService.addTrabajo(datos_Trabajo)]).subscribe((results: any) => {
                      if (results[0].ok && results[1].ok) {
                        this.data = this.Funcionario
                        this.data.id_cuenta = respCuenta.Cuenta.insertId
                        this.data.id_funcionario = resp.Usuario.insertId
                        this.dialogRef.close(this.data)
                      }
                    })
                  }
                })
              }
            }
            else if (this.Tipo_Registro_cuenta == 'Asignar') {  //crear funcionario y asignar
              let cuenta_asignada = {
                id_funcionario: resp.Usuario.insertId,
                login: this.Form_Cuenta.controls['login'].value,
                password: this.Form_Cuenta.controls['password'].value,
                fecha_actualizacion: fecha
              }
              this.usuariosService.putCuenta(this.Cuenta.id_cuenta!, cuenta_asignada).subscribe((respCuenta: any) => {
                if (respCuenta.ok) {
                  this.data = this.Funcionario
                  this.data.id_funcionario = resp.Usuario.insertId
                  this.data.id_cuenta = this.Cuenta.id_cuenta
                  this.dialogRef.close(this.data)
                }
              })


            }
            else if (this.Tipo_Registro_cuenta == '') {
              this.data = this.Funcionario
              this.data.id_funcionario = resp.Usuario.insertId
              this.data.id_cuenta = null
              this.dialogRef.close(this.data)
            }

          }
        })

      }
    }
    if (this.tituloDialog == "Edicion datos de funcionario") {
      if (this.Tipo_Registro_cuenta == 'Crear') { //crear funcionario y asignar
        this.Cuenta = {
          id_cargo: this.Form_Cuenta.controls['id_cargo'].value,
          id_funcionario: this.Funcionario.id_funcionario,
          login: this.Form_Cuenta.controls['login'].value,
          password: this.Form_Cuenta.controls['password'].value,
          fecha_actualizacion: fecha,
          fecha_creacion: fecha,
          activo: true,
          permisos: this.Permisos
        }
        if (this.Form_Cuenta.valid) {
          this.usuariosService.addCuenta(this.Cuenta).subscribe((respCuenta: any) => {
            if (respCuenta.ok) {
              let detallesTrabajoFuncionario = {
                id_funcionario: this.Funcionario.id_funcionario,
                id_cargo: this.Cuenta.id_cargo,
                detalle: "Inicio",
                fecha
              }
              let datos_Trabajo = {
                id_cuenta: respCuenta.Cuenta.insertId,
                id_cargo: this.Form_Cuenta.controls['id_cargo'].value,
                id_institucion: this.Form_Cuenta.controls['id_institucion'].value,
                id_dependencia: this.Form_Cuenta.controls['id_dependencia'].value
              }
              forkJoin([this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario), this.usuariosService.addTrabajo(datos_Trabajo)]).subscribe((results: any) => {
                if (results[0].ok && results[1].ok) {
                  this.data = this.Funcionario
                  this.data.id_cuenta = respCuenta.Cuenta.insertId
                  this.dialogRef.close(this.data)
                }
              })
            }
          })
        }
      }
      if (this.Tipo_Registro_cuenta == 'Asignar') {  //crear funcionario y asignar
        let cuenta_asignada = {
          id_funcionario: this.Funcionario.id_funcionario,
          login: this.Form_Cuenta.controls['login'].value,
          password: this.Form_Cuenta.controls['password'].value,
          fecha_actualizacion: fecha
        }

        this.usuariosService.putCuenta(this.Cuenta.id_cuenta!, cuenta_asignada).subscribe((respCuenta: any) => {
          if (respCuenta.ok) {
            this.data = this.Funcionario
            this.data.id_cuenta = this.Cuenta.id_cuenta
            this.dialogRef.close(this.data)
          }
        })
      }
      else {
        if (this.Form_Funcionario.touched && this.Form_Cuenta.touched) {
          let cuanta_actualizar = {}
          if (this.isChecked) { //actualizara passowrd
            cuanta_actualizar = {
              login: this.Form_Cuenta.controls['login'].value,
              password: this.Form_Cuenta.controls['password'].value,
              fecha_actualizacion: fecha
            }

          }
          else if (!this.isChecked) {
            cuanta_actualizar = {
              login: this.Form_Cuenta.controls['login'].value,
              fecha_actualizacion: fecha
            }
          }
          if (!this.Funcionario.Activo) {
            if (this.User_habilitado) {
              this.Funcionario = Object.assign(this.Funcionario, this.Form_Funcionario.value)
              this.Funcionario.Activo = true
              console.log('volviendo a habilitar', this.Funcionario);
            }
          }

          forkJoin([this.usuariosService.putUsuario(this.Funcionario.id_funcionario!, this.Form_Funcionario.value), this.usuariosService.putCuenta(this.data.id_cuenta, cuanta_actualizar)]).subscribe((results: any) => {
            if (results[0].ok && results[1].ok) {
              this.Funcionario = this.Form_Funcionario.value
              this.data = Object.assign(this.data, this.Funcionario)
              this.dialogRef.close(this.data)
            }
          })

        }
        else if (this.Form_Funcionario.touched) {
          if (!this.Funcionario.Activo) {
            if (this.User_habilitado) {
              this.Funcionario = Object.assign(this.Funcionario, this.Form_Funcionario.value)
              this.Funcionario.Activo = true
              console.log('volviendo a habilitar', this.Funcionario);
            }
          }
          this.usuariosService.putUsuario(this.Funcionario.id_funcionario!, this.Form_Funcionario.value).subscribe((resp: any) => {
            if (resp.ok) {
              this.Funcionario = this.Form_Funcionario.value
              this.data = Object.assign(this.data, this.Funcionario)
              this.dialogRef.close(this.data)

            }
          })
        }
        else if (this.Form_Cuenta.touched) {
          let cuanta_actualizar = {}
          if (this.isChecked) { //actualizara passowrd
            cuanta_actualizar = {
              login: this.Form_Cuenta.controls['login'].value,
              password: this.Form_Cuenta.controls['password'].value,
              fecha_actualizacion: fecha
            }

          }
          else {
            cuanta_actualizar = {
              login: this.Form_Cuenta.controls['login'].value,
              fecha_actualizacion: fecha
            }

          }
          this.usuariosService.putCuenta(this.data.id_cuenta, cuanta_actualizar).subscribe((resp: any) => {
            if (resp.ok) {
              this.dialogRef.close(this.data)
            }
          })
        }

      }




    }

  }
  getFecha(): any {
    return Date.now()
  }
  toggleChanges($event: MatSlideToggleChange) {
    this.isChecked = $event.checked;
  }









}
