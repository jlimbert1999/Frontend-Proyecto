import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCargoComponent } from 'src/app/componentes/dialogs/dialog-cargo/dialog-cargo.component';
import { DialogDependenciaComponent } from 'src/app/componentes/dialogs/dialog-dependencia/dialog-dependencia.component';
import { DialogInstitucionComponent } from 'src/app/componentes/dialogs/dialog-institucion/dialog-institucion.component';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { Mensajes } from '../../../componentes/mensaje/mensaje'
import { Router, ActivatedRoute } from '@angular/router';
import { DialogTramitesRequisitosComponent } from 'src/app/componentes/dialogs/dialogs-m2/dialog-tramites-requisitos/dialog-tramites-requisitos.component';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-adm-configuracion',
  templateUrl: './adm-configuracion.component.html',
  styleUrls: ['./adm-configuracion.component.css']
})
export class AdmConfiguracionComponent implements OnInit {

  //evento que se usara en el routre-oulet para el componente que se genere ahi

  mostrarTabla: boolean = false;
  displayedColumns: any;
  dataSource = new MatTableDataSource();
  msg = new Mensajes();
  TipoTabla: string = ''
  OpcionesTabla: string[] = []
  verHabilitados: boolean = true
  tituloOpcionVista: string = ''
  Dependencia: any
  Institucion: any
  Cargo: any
  DepenNoHabilitadas: any
  InstiNoHabilitadas: any
  CargoNoHabilitadas: any
  eventsSubject: Subject<void> = new Subject<void>();


  constructor(
    public dialog: MatDialog,
    private configService: ConfiguracionService,
    private router:Router,
    private activatedRoute:ActivatedRoute) { 
    }

  ngOnInit(): void {
  }
  obtener_Instihabilitadas() {
    this.verHabilitados = true
    this.tituloOpcionVista = "Ver Instituciones no habilitadas"
    this.configService.getInsti_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Institucion = resp.Instituciones
        this.dataSource.data = this.Institucion

      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }
  obtener_Dephabilitadas() {
    this.verHabilitados = true
    this.tituloOpcionVista = "Ver Dependencias no habilitadas"
    this.configService.getDepen_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.Dependencia = resp.Dependencias
        this.dataSource.data = this.Dependencia
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }
  obtener_DepNohabilitadas() {
    this.configService.getDepen_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.DepenNoHabilitadas = resp.Dependencias
        this.dataSource.data = this.DepenNoHabilitadas
        this.tituloOpcionVista = "Ver Dependencias habilitadas"
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }
  obtener_InstNohabilitadas() {
    this.configService.getInsti_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.InstiNoHabilitadas = resp.Instituciones
        this.dataSource.data = this.InstiNoHabilitadas
        this.tituloOpcionVista = "Ver instituciones habilitadas"
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }



  agregar_Dependencia() {
    let vacio = { Activo: true }  //varible a enviar y poder registrar
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: vacio
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Dependencia = datosFormulario
        this.Dependencia.Fecha_creacion = this.Dependencia.Fecha_actualizacion = this.getFecha()
        this.configService.addDependencia(this.Dependencia).subscribe((res: any) => {
          if (res.ok) {
            this.msg.mostrarMensaje('success', res.message)
          }
          this.obtener_Instihabilitadas()
        })
      }
    });
  }
  editar_Dependecia(datos: any) {
    if (datos.Activo == '0') {
      datos.Activo = false
    }
    else if (datos.Activo == '1') {
      datos.Activo = true
    }
    let id = datos.id_dependencia
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) {
        delete DataDialog['SiglaInst'] //eliminar siglaInst para poder registrar
        DataDialog.Fecha_actualizacion = this.getFecha()
        this.configService.putDependencia(id, DataDialog).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
          }
          this.obtener_Dephabilitadas()
        })
      }
    });
  }
  agregar_Institucion() {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: { Activo: true }
    })

    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) {
        DataDialog.Fecha_creacion = DataDialog.Fecha_actualizacion = this.getFecha();
        this.Institucion = DataDialog
        this.configService.addInstitucion(this.Institucion).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
          }

          this.obtener_Instihabilitadas()
        })
      }
    });
  }

  editar_Instituciones(datos: any) {
    let id: number = datos.id_institucion
    if (datos.Activo == '0') {
      datos.Activo = false
    }
    else if (datos.Activo == '1') {
      datos.Activo = true
    }
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: datos
    })

    dialogRef.afterClosed().subscribe(DataDialog => {
      if (DataDialog) {
        DataDialog.Fecha_actualizacion = this.getFecha()
        this.configService.putInstitucion(id, DataDialog).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', resp.message)
            this.obtener_Instihabilitadas()
          }
        })
      }
    });
  }


  Cargar_tablaInsti() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Instituciones";
    this.tituloOpcionVista = "Ver Instituciones no habilitadas"
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.generar_titulosTabla_Insti();
    this.obtener_Instihabilitadas();
  }
  Cargar_tablaDep() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Dependencias";
    this.tituloOpcionVista = "Ver Dependencias no habilitadas"
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.generar_titulosTabla_Dep();
    this.obtener_Dephabilitadas();
  }
  Cargar_tablaCargo() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Cargos";
    this.tituloOpcionVista = "Ver Cargos no habilitadas"
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.generar_titulosTabla_Carg();
    this.obtener_CargosHabilitados()
  }

  generar_titulosTabla_Insti() {
    this.displayedColumns = [
      { key: "Nro", titulo: "NUMERO" },
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Sigla", titulo: "SIGAL" },
      { key: "Direccion", titulo: "DIRECCION" },
      { key: "Telefono", titulo: "TELEFONO" },
      { key: "Fecha_creacion", titulo: "FECHA CREACION" },
      { key: "Activo", titulo: "HABILITADO" }
    ]
  }
  generar_titulosTabla_Dep() {
    this.displayedColumns = [
      { key: "SiglaInst", titulo: "INSTITUCION" },
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Sigla", titulo: "SIGLA" },
      { key: "Fecha_creacion", titulo: "FECHA CREACION" },
      { key: "Activo", titulo: "HABILITADO" }
    ]
  }
  generar_titulosTabla_Carg() {
    this.displayedColumns = [
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Responsable_regis", titulo: "RESPONSABLE DE REGISTRO" },
      { key: "Fecha_creacion", titulo: "CREACION" },
      { key: "Activo", titulo: "HABILITADO" }
    ]
  }

  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      if (this.TipoTabla == "Instituciones") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Institucion)

        }
        else {
          this.dataSource = new MatTableDataSource(this.InstiNoHabilitadas)
        }
      }
      if (this.TipoTabla == "Dependencias") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Dependencia)
        }
        else {
          this.dataSource = new MatTableDataSource(this.DepenNoHabilitadas)
        }
      }
      if (this.TipoTabla == "Cargos") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Cargo)
        }
        else {
          this.dataSource = new MatTableDataSource(this.CargoNoHabilitadas)
        }
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      if (this.TipoTabla == "Instituciones") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Institucion)
          // this.obtener_Instihabilitadas()
          //para evitar peticion de nuevo
          //cambir este metodo y solo usar la variabel Instituciones para cargar la tabla
        }
        else {
          this.dataSource = new MatTableDataSource(this.InstiNoHabilitadas)
        }
      }
      if (this.TipoTabla == "Dependencias") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Dependencia)
        }
        else {
          this.dataSource = new MatTableDataSource(this.DepenNoHabilitadas)
        }
      }
      if (this.TipoTabla == "Cargos") {
        if (this.verHabilitados) {
          this.dataSource = new MatTableDataSource(this.Cargo)
        }
        else {
          this.dataSource = new MatTableDataSource(this.CargoNoHabilitadas)
        }
      }
    }
  }
  ver_Habilitados() {
    if (this.verHabilitados) {
      if (this.TipoTabla == "Instituciones") {
        this.generar_titulosTabla_Insti()
        this.dataSource.data = this.Institucion
        this.tituloOpcionVista = "Ver instituciones no habilitadas"
      }
      if (this.TipoTabla == "Dependencias") {
        this.generar_titulosTabla_Dep()
        this.dataSource.data = this.Dependencia
        this.tituloOpcionVista = "Ver dependencias no habilitadas"
      }
      if (this.TipoTabla == "Cargos") {
        this.generar_titulosTabla_Carg()
        this.dataSource.data = this.Cargo
        this.tituloOpcionVista = "Ver cargos no habilitadas"
      }

    }
    else {
      if (this.TipoTabla == "Instituciones") {
        this.generar_titulosTabla_Insti()
        this.obtener_InstNohabilitadas()

      }
      if (this.TipoTabla == "Dependencias") {
        this.generar_titulosTabla_Dep()
        this.obtener_DepNohabilitadas()
      }
      if (this.TipoTabla == "Cargos") {
        this.generar_titulosTabla_Carg()
        this.obtener_CargosNoHabilitados()
      }
    }
  }
  //METODO EDITAR
  editar_Datos(datos: any) {
    if (this.TipoTabla == "Instituciones") {
      this.editar_Instituciones(datos)
    }
    if (this.TipoTabla == "Dependencias") {
      this.editar_Dependecia(datos)
    }
    if (this.TipoTabla == "Cargos") {
      this.editar_Cargo(datos)
    }
  }



  obtener_CargosHabilitados() {
    this.configService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.verHabilitados = true
        this.Cargo = resp.cargo
        this.dataSource.data = this.Cargo
        this.tituloOpcionVista = "Ver cargos No habilitadas"
      }
    })
  }
  obtener_CargosNoHabilitados() {
    this.configService.getCargos_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.CargoNoHabilitadas = resp.cargo
        this.dataSource.data = this.CargoNoHabilitadas
        this.tituloOpcionVista = "Ver Cargos habilitadas"
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
        this.Cargo.Responsable_regis = "Admin"
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
  AdministrarTramites(){
    this.TipoTabla='Tramites'
    this.mostrarTabla=false
    this.router.navigate(['Tipos-Tramites'], {relativeTo: this.activatedRoute})
  }
  agregar_Tramite(){
    this.eventsSubject.next();
  }


}
