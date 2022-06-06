import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  displayedColumns: any
  Cuentas: any[] = []
  dataSource = new MatTableDataSource();
  msg = new Mensajes()
  OpcionesTabla: string[] = []
  modo_busqueda: boolean = false
  verHabilitados: boolean = true
  constructor(private usuariosService: UsuariosService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_cuentasAsignadas()
  }

  crear_tabla_cuentas() {
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
    this.OpcionesTabla = ['Finalizar']
  }

  obtener_cuentasAsignadas() {
    this.usuariosService.getCuentasAsignadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cuentas.length > 0) {
          this.Cuentas = resp.Cuentas
          resp.Cuentas.forEach((cuenta: any, index: number) => {
            this.Cuentas[index]['NombreCompleto'] = `${cuenta.Nombre} ${cuenta.Apellido_P} ${cuenta.Apellido_M}`

          });
          this.dataSource.data = this.Cuentas;
          this.crear_tabla_cuentas()

        }
        else {
          this.msg.mostrarMensaje('info', 'No hay cuentas asignadas')
          this.dataSource.data = []
        }

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
            this.obtener_cuentasAsignadas()
          }
        })
      }
    })

  }
  Cargar_tablaCuentas() {
    this.OpcionesTabla = ['Finalizar']
    this.generar_titulosTabla_Cuentas()
    this.obtener_cuentasAsignadas()
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
  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      this.OpcionesTabla = ['Editar', 'VerDetalles', 'Eliminar']
      this.generar_titulosTabla_Cuentas()
      this.dataSource.data = this.Cuentas

    }
    else {
      this.OpcionesTabla = ['Editar']
      this.obtener_cuentasNoAsignadas()
      
      this.displayedColumns = [
        { key: "login", titulo: "Login" },
        { key: "NombreCar", titulo: "Cargo" },
        { key: "NombreDep", titulo: "Dependencia" },
        { key: "SiglaInst", titulo: "Institucion" }
      ]
    }

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
  getFecha(): any {
    return Date.now()
  }

}