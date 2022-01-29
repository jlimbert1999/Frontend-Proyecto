import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//modelos
import { UsuarioModel } from 'src/app/modelos/usuario.model';
import { CargoModel } from 'src/app/modelos/administracion-usuarios/cargo.model';

//servicios
import { CargoService } from '../../../servicios/servicios-m1/cargo.service'

import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service';
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Mensajes } from '../../mensaje/mensaje';
import Swal from 'sweetalert2';
import { MatInput } from '@angular/material/input';
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
  // dataSource: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Cuenta', 'Cargo', 'Institucion', 'Dependencia', 'Opciones'];
  msg = new Mensajes()
  TipoRegistroCuenta: string = ''
  PoseeCuenta: boolean = false

  DetallesCuenta: any = {}


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
        this.InstiActivos=resp.Institucion
       
      }
    })
  }
  obtenerDependenciasActivas() {
    this.depService.getDependencia().subscribe((resp: any) => {
      if (resp.ok) {
        resp.dependencia.forEach((element: any) => {
          if (element.Activo == '1') {
            this.DepActivos.push(element)
          }
        });
      }
    })
  }
  obtenerCargosActivos() {
    this.cargoService.getCargo().subscribe((resp: any) => {
      if (resp.ok) {
        resp.cargo.forEach((element: any) => {
          if (element.Activo == '1') {
            this.CargosActivos.push(element)
          }
        });
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
    this.data.TipoCuenta = Tipo
    if (Tipo == 'Asignar') {
      this.obtener_CuentasSinAsignar()
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
