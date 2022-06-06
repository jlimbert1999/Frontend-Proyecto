import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//modelos
import { FuncionarioModel } from 'src/app/modelos/usuario.model';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';

//servicios
import { CargoService } from '../../../servicios/servicios-m1/cargo.service'

import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { Mensajes } from '../../mensaje/mensaje';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-usuarios',
  templateUrl: './dialog-usuarios.component.html',
  styleUrls: ['./dialog-usuarios.component.css']
})
export class DialogUsuariosComponent implements OnInit {

  tituloDialog: string = "";
  CargosActivos: any[] = [];
  InstiActivos: any[] = [];
  DepActivos: any[] = [];
  DepdeInstitucion: any[] = [];
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

  Tipo_Permisos=[
    {value:'ADMIN_ROLE', viewValue:'administrador'},
    {value:'USER1_ROLE',viewValue:'Responsable de recepcion de tramite' },
    {value:'USER2_ROLE',viewValue:'Responsable de evaluacion de tramites' }
  ]
  mostrar_opcion_habilitar:boolean=false



  constructor(
    public dialogRef: MatDialogRef<DialogUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cargoService: CargoService,
    private instService: InstitucionService,
    private depService: DependenciaService,
    private usuariosService: UsuariosService
  ) {
    this.generarTitulo()
    this.obtenerInstitucionesActivas()
    this.obtenerDependenciasActivas()
    this.obtenerCargosActivos()
  }



  ngOnInit(): void {
    if(!this.data.datosFuncionario.Activo){
      this.mostrar_opcion_habilitar=true
    }
    console.log();
  }

  generarTitulo() {

    // Si datos que vienen son vacios al abrir este dialog, es creacion de usarios
    if (Object.keys(this.data.datosFuncionario).length == 1) {
      this.tituloDialog = "Registro de funcionario";
      this.TipoRegistroCuenta = "Nueva cuenta"

    }
    //Si datos no estan vacios, se quiere actualizar los datos antiguos
    else {
      this.tituloDialog = "Edicion datos de funcionario";
      this.TipoRegistroCuenta = "Editar cuenta"
      this.verificar_tieneCuenta(this.data.datosFuncionario.id_funcionario)
    }
  }

  obtenerInstitucionesActivas() {
    this.instService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.InstiActivos = resp.Instituciones
      }
    })
  }
  obtenerDependenciasActivas() {
    this.depService.getDependencia_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.DepActivos = resp.Dependencias
      }
    })
  }
  obtenerCargosActivos() {
    this.cargoService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.CargosActivos = resp.Cargos
      }
    })
  }
  obtener_dep_deInstitucion(id: number) {
    this.DepdeInstitucion = []
    this.DepActivos.forEach((element: any) => {
      if (element.id_institucion === id) {
        this.DepdeInstitucion.push(element)
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


  RegistroCuenta(Tipo: string) {
    this.data.Tipo_Registro = Tipo
    if (Tipo == 'Asignar') {
      this.obtener_CuentasSinAsignar()
    }
    if(Tipo == 'Crear'){
      this.data.datosCuenta.login=(`${this.data.datosFuncionario.Nombre} ${this.data.datosFuncionario.Apellido_P.charAt(0)} ${this.data.datosFuncionario.Apellido_M.charAt(0)}`).replace(/\s/g, '').toUpperCase()
      this.data.datosCuenta.password=this.data.datosFuncionario.Dni.toString()
    }
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  AsignarCuenta(datosCuenta: any) {
    let pregunta: string = `Asignar la cuenta con el cargo "${datosCuenta.NombreCar}" al funcionario: ${this.data.datosFuncionario.Nombre} ${this.data.datosFuncionario.Apellido_P}?`
    Swal.fire({
      icon: "question",
      title: `${pregunta}`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {

      if (result.isConfirmed) {
        //creamos propiedad id_cuenta en datos cuenta, para usarla en el Adm-Usuarios
        this.data.datosCuenta['id_cuenta'] = datosCuenta.id_cuenta
        this.data.datosCuenta['id_cargo'] = datosCuenta.id_cargo
        this.data.datosCuenta['login'] = ("" + `${this.data.datosFuncionario.Nombre} ${this.data.datosFuncionario.Apellido_P.charAt(0)} ${this.data.datosFuncionario.Apellido_M.charAt(0)}` + "").replace(/\s/g, '').toUpperCase()
      }
    })
  }

  verificar_tieneCuenta(id_funcionario: number) {
    this.usuariosService.verificarSiTieneCuenta(id_funcionario).subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.tiene) {
          this.PoseeCuenta = true
          this.data.datosCuenta.login = resp.Cuenta[0].login
          this.data.datosCuenta.id_cuenta = resp.Cuenta[0].id_cuenta
          this.DetallesCuenta = {
            FechaC: resp.Cuenta[0].fecha_creacion,
            FechaA: resp.Cuenta[0].fecha_actualizacion
          }
        }
        else {
          this.PoseeCuenta = false
        }
      }
    })
  }


 






}
