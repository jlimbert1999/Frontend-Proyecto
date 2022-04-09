import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCargoComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-cargo/dialog-cargo.component';
import { DialogDependenciaComponent } from 'src/app/componentes/dialogs/dialog-dependencia/dialog-dependencia.component';
import { DialogInstitucionComponent } from 'src/app/componentes/dialogs/dialogs-m1/dialog-institucion/dialog-institucion.component';
import { ConfiguracionService } from 'src/app/servicios/servicios-m1/configuracion.service';
import { Mensajes } from '../../../componentes/mensaje/mensaje'
import { Router, ActivatedRoute } from '@angular/router';
import { DialogTramitesRequisitosComponent } from 'src/app/componentes/dialogs/dialogs-m2/dialog-tramites-requisitos/dialog-tramites-requisitos.component';
import { Subject } from 'rxjs';
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
@Component({
  selector: 'app-adm-configuracion',
  templateUrl: './adm-configuracion.component.html',
  styleUrls: ['./adm-configuracion.component.css']
})
export class AdmConfiguracionComponent implements OnInit {

  //evento que se usara en el routre-oulet para el componente que se genere ahi

  mostrarTabla: boolean = false;
  displayedColumns: any;
  dataSource: any = new MatTableDataSource();
  msg = new Mensajes();
  TipoTabla: string = ''
  OpcionesTabla: string[] = []
  verHabilitados: boolean = true
  Dependencia: any
  Institucion: InstitucionModel;
  Cargo: any
  eventsSubject: Subject<void> = new Subject<void>();
  eventsSubject2: Subject<void> = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private configService: ConfiguracionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }
  obtener_Instihabilitadas() {
    this.verHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.configService.getInsti_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Instituciones.length > 0) {

          this.Institucion = resp.Instituciones
          this.dataSource.data = resp.Instituciones
        }
        else {
          this.msg.mostrarMensaje('info', "No hay insituciones habilitadas")
        }

      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_InstNohabilitadas() {

    this.configService.getInsti_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Instituciones.length > 0) {
          this.dataSource.data = resp.Instituciones
          this.OpcionesTabla = ['Editar']

        }
        else {
          this.msg.mostrarMensaje('info', "No hay insituciones no habilitadas")
          this.verHabilitados = true
        }
      }
      else {
        this.msg.mostrarMensaje('info', resp.message)
      }
    })
  }
  obtener_Dephabilitadas() {
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.verHabilitados = true
    this.configService.getDepen_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Dependencias.length > 0) {
          this.Dependencia = resp.Dependencias
          this.dataSource.data = this.Dependencia

        } else {
          this.msg.mostrarMensaje('info', "No hay dependencias habilitadas")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }

  obtener_DepNohabilitadas() {
    this.configService.getDepen_noHabilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Dependencias.length > 0) {
          this.dataSource.data = resp.Dependencias
          this.OpcionesTabla = ['Editar']
        }
        else {
          this.msg.mostrarMensaje('info', "No hay dependencias no habilitadas")
          this.verHabilitados = true
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_CargosHabilitados() {
    this.verHabilitados = true
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.configService.getCargos_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cargos.length > 0) {
          this.Cargo = resp.Cargos
          this.dataSource.data = this.Cargo

        }
        else {
          this.msg.mostrarMensaje('info', "No hay cargos habilitadas")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
  }
  obtener_CargosNoHabilitados() {

    this.configService.getCargos_NoHabilitados().subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Cargos.length > 0) {

          this.dataSource.data = resp.Cargos
          this.OpcionesTabla = ['Editar']
        }
        else {
          this.msg.mostrarMensaje('info', "No hay cargos no habilitados")
        }
      }
      else {
        this.msg.mostrarMensaje('error', resp.message)
      }
    })
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
  eliminar_Datos(datos: any) {
    if (this.TipoTabla == "Instituciones") {
      this.configService.putInstitucion(datos.id_institucion, { Activo: false }).subscribe((resp: any) => {
        if (resp.ok) {
          this.msg.mostrarMensaje('success', 'La institucion fue desabilidata')
          this.obtener_Instihabilitadas()
        }
      })
    }
    if (this.TipoTabla == "Dependencias") {
      this.configService.putDependencia(datos.id_dependencia, { Activo: false }).subscribe((resp: any) => {
        if (resp.ok) {
          this.msg.mostrarMensaje('success', 'La dependencia fue desabilidata')
          this.obtener_Dephabilitadas()
        }
      })
    }
    if (this.TipoTabla == "Cargos") {
      this.configService.putCargo(datos.id_cargo, { Activo: false }).subscribe((resp: any) => {
        if (resp.ok) {
          this.msg.mostrarMensaje('success', 'El cargo fue desabilidato')
          this.obtener_CargosHabilitados()
        }
      })
    }

  }

  agregar_Institucion() {
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: { Activo: true }//enviar una lalve para que sea registro
    })

    dialogRef.afterClosed().subscribe((DataDialog: any) => {
      if (DataDialog) { //si se recibe la llave enviada, registrar
        this.obtener_Instihabilitadas()
      }
    });
  }

  editar_Instituciones(datos: InstitucionModel) {
    if (datos.Activo == true) {
      datos.Activo = true
    }
    if (datos.Activo == false) {
      datos.Activo = false
    }
    const dialogRef = this.dialog.open(DialogInstitucionComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(DataDialog => {
      if (DataDialog) {
        this.obtener_Instihabilitadas()
      }
    });
  }

  agregar_Dependencia() {
    const dialogRef = this.dialog.open(DialogDependenciaComponent, {
      data: { Activo: true } 
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
  AdministrarTramites() {
    this.TipoTabla = 'Tramites'
    this.mostrarTabla = false
    this.router.navigate(['Tipos-Tramites'], { relativeTo: this.activatedRoute })
  }
  agregar_Tramite() {
    this.eventsSubject.next();
  }
  alternarVista_TiposTramite(){ //ca,biar vista del compoente admin tramites y requisitos
    this.eventsSubject2.next()
  }

  generar_tabla_Intituciones() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Instituciones";
    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.displayedColumns = [
      // { key: "Nro", titulo: "NUMERO" },
      { key: "Nombre", titulo: "Nombre" },
      { key: "Sigla", titulo: "Sigla" },
      { key: "Direccion", titulo: "Direccion" },
      { key: "Telefono", titulo: "Telefono" },
      { key: "Fecha_creacion", titulo: "Fecha creacion" }
      // { key: "Activo", titulo: "HABILITADO" }
    ]
    this.obtener_Instihabilitadas()
  }
  generar_tabla_Dependencias() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Dependencias";

    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.displayedColumns = [
      { key: "SiglaInst", titulo: "INSTITUCION" },
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Sigla", titulo: "SIGLA" },
      { key: "Fecha_creacion", titulo: "FECHA CREACION" },
      // { key: "Activo", titulo: "HABILITADO" }
    ]
    this.obtener_Dephabilitadas();
  }
  generar_tabla_Cargos() {
    this.router.navigate(['Configuraciones'])
    this.verHabilitados = true
    this.TipoTabla = "Cargos";

    this.OpcionesTabla = ['Editar', 'Eliminar']
    this.mostrarTabla = true;
    this.displayedColumns = [
      { key: "Nombre", titulo: "NOMBRE" },
      { key: "Responsable_regis", titulo: "RESPONSABLE DE REGISTRO" },
      { key: "Fecha_creacion", titulo: "CREACION" }
      // { key: "Activo", titulo: "HABILITADO" }
    ]
    this.obtener_CargosHabilitados()

  }


  getFecha() {
    return Date.now()
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ver_Habilitados() {
    this.verHabilitados = !this.verHabilitados
    if (this.verHabilitados) {
      if (this.TipoTabla == "Instituciones") {
        this.dataSource.data = this.Institucion
        this.OpcionesTabla = ['Editar', 'Eliminar']

      }
      if (this.TipoTabla == "Dependencias") {
        this.dataSource.data = this.Dependencia
        this.OpcionesTabla = ['Editar', 'Eliminar']
      }
      if (this.TipoTabla == "Cargos") {
        this.dataSource.data = this.Cargo
        this.OpcionesTabla = ['Editar', 'Eliminar']
      }

    }
    else {
      if (this.TipoTabla == "Instituciones") {
        this.obtener_InstNohabilitadas()

      }
      if (this.TipoTabla == "Dependencias") {

        this.obtener_DepNohabilitadas()

      }
      if (this.TipoTabla == "Cargos") {
        this.obtener_CargosNoHabilitados()

      }
    }
  }


}
