import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service'
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service'
import Swal from 'sweetalert2';
import decode from 'jwt-decode'
import { WorkflowServiceService } from 'src/app/servicios/servicios-m4/workflow-service.service';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model'
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
import { id } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css']
})
export class DialogRemisionComponent implements OnInit {
  msg = new Mensajes()
  Tipos_Envio: string[] = ['Funcionarios activos', 'Funcionario especifico']
  Info_Cuenta_Actual = this.decodificarToken()
  usuarios_Conectados: any[] = []
  usuarios_Desconectados: any[] = []
  Info_UserReceptor = {
    Nombre: '',
    NombreCargo: '',
    id_cuenta: 0,
    id: 0  //id por el socket
  }
  Opcion_Envio: string //opcion para ver si envio sera a usuarios activos o especificos
  Posicion_Ventana: number = 0  //Ventanas 1.- Seleccion  2.-Datos
  datosWorkflow: Workflow
  Fecha: number  //para tener solo una fecha exata de envio
  instituciones: InstitucionModel[] = []
  dependencias: any[] = []

  enviar_tiempo_real: boolean = false //verificar si se envia a user activo
  constructor(
    private snackBarRef: MatSnackBarRef<DialogRemisionComponent>,
    private _snackBar: MatSnackBar,
    private tramiteService: RegistroTramiteService,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private socketService: SocketService,
    private instService: InstitucionService,
    private depService: DependenciaService,
    private snackBar: MatSnackBar,
    private workflow: WorkflowServiceService
  ) {
  }

  ngOnInit(): void {
    this.obtener_users_conectados()
    this.obtener_Instituciones()
  }

  obtener_Instituciones() {
    this.instService.getInstituciones_Habilitadas().subscribe((resp: any) => {
      if (resp.ok) {
        this.instituciones = resp.Instituciones
      }

    })
  }
  obtener_DependenciasInst(id_institucion: number) {
    this.depService.getDependencias_de_Instituto(id_institucion).subscribe((resp: any) => {
      if (resp.ok) {
        this.dependencias = resp.Dependencias
      }

    })
  }

  obtener_users_conectados() {
    this.socketService.Emitir('getUsers_Activos', null).subscribe((resp: any) => {
      this.usuarios_Conectados = resp.filter((user: any) => user.id_cuenta != this.Info_Cuenta_Actual.id_cuenta)
    })
  }

  obtener_users_desconectados(id_inst: number, id_dep: number) {
    let datos_busqueda = {
      id_institucion: id_inst,
      id_dependencia: id_dep
    }
    this.tramiteService.getFuncionarioEspecifico(datos_busqueda).subscribe((resp: any) => {
      if (resp.ok) {
        this.usuarios_Desconectados = resp.Funcionarios
      }
    })
  }
  registrar_Workflow(Fecha: number) {
    this.datosWorkflow = {
      id_cuentaEmisor: this.Info_Cuenta_Actual.id_cuenta,
      id_cuentaReceptor: this.Info_UserReceptor.id_cuenta,
      id_tramite: this.data.id_tramite,
      fecha_envio: Fecha,
      fecha_recibido: 0,
      detalle: this.data.Mensaje,
      enviado: true,
      recibido: false
    }
    if (this.datosWorkflow.id_cuentaEmisor != null && this.datosWorkflow.id_cuentaEmisor != null) {
      this.tramiteService.addtFlujoTrabajo(this.datosWorkflow).subscribe((resp: any) => {
        if (resp.ok) {
          this.snackBar.open('Tramite enviado!', '', {
            duration: 3000,
            horizontalPosition:'center'
          });
        }
      })
    }
    else{
      alert('Id user no encontrado, recargue pagina')
    }
  }

  armar_datos_Envio_UserActivo(Fecha: number) {
    const Data_Envio = {
      id_receptor: this.Info_UserReceptor.id, //id_socket
      Tramite: {
        id_cuenta: this.Info_Cuenta_Actual.id_cuenta,
        Nombre: this.Info_Cuenta_Actual.Nombre,
        NombreCargo: this.Info_Cuenta_Actual.NombreCargo,
        Mensaje: this.data.Mensaje,
        id_tramite: this.data.id_tramite,
        Titulo: this.data.Titulo,
        Alterno: this.data.Alterno,
        Fecha_Envio: Fecha,
        Enviado: true,
        Recibido: false
      }
    }
    return Data_Envio
  }

  Enviar_Tramite() {
    // if (this.Opcion_Envio == 'Funcionarios activos') {
    //   Swal.fire({
    //     title: `Remitir tramite a ${this.Info_UserReceptor.Nombre} (${this.Info_UserReceptor.NombreCargo})`,
    //     showCancelButton: true,
    //     confirmButtonText: 'Aceptar',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.Fecha=this.getFecha()  //para tener una unica fecha al registrar y al enviar
    //       this.socketService.Emitir('enviarTramite', this.armar_datos_Envio_UserActivo(this.Fecha)).subscribe()
    //       this.registrar_Workflow(this.Fecha)
    //     }
    //   })
    // }
    // if(this.Opcion_Envio == 'Funcionario especifico'){
    //   Swal.fire({
    //     title: `Remitir tramite a ${this.Info_UserReceptor.Nombre} (${this.Info_UserReceptor.NombreCargo})`,
    //     showCancelButton: true,
    //     confirmButtonText: 'Aceptar',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.Fecha=this.getFecha()
    //       this.registrar_Workflow(this.Fecha)
    //     }
    //   })
    // }
    Swal.fire({
      title: `Remitir tramite a ${this.Info_UserReceptor.Nombre} (${this.Info_UserReceptor.NombreCargo})?`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Fecha = this.getFecha()
        if (this.enviar_tiempo_real) {
          this.socketService.Emitir('enviarTramite', this.armar_datos_Envio_UserActivo(this.Fecha)).subscribe()
        }
        this.registrar_Workflow(this.Fecha)
        this.dismiss()
      }
    })
  }

  verifficar_Tramite_Enviado(id_tramite: number) {
    this.workflow.get_SiTramite_FueEnviado(id_tramite, this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        console.log(resp.Workflow.length);
      }
    })

  }





  openSnackBar() {
    this._snackBar.open('Tramite enviado', 'si', {
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  dismiss() {
    this.snackBarRef.dismiss();
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  getFecha(): any {
    return Date.now()
  }


  // Seleccionar_Tipo_Envio(tipo: string) {
  //   if (tipo == "Funcionarios activos") {
  //     this.Opcion_Envio = 'Funcionarios activos'
  //     this.obtener_users_conectados()
  //   }
  //   if (tipo == "Funcionario especifico") {
  //     this.Opcion_Envio = 'Funcionario especifico'
  //     this.obtener_Instituciones()
  //   }
  // }
  // seleccionar_user_activo(infoUser: any) {  //una vez seleccionado user ir a la seigueinte ventana
  //   this.Posicion_Ventana = 1
  //   this.Info_UserReceptor = infoUser
  // }


  // seleccionar_user_desconectado(infoUser: any) {
  //   this.Posicion_Ventana = 1
  //   this.Info_UserReceptor = {
  //     Nombre: `${infoUser.Nombre} ${infoUser.Apellido_P} ${infoUser.Apellido_M}`,
  //     NombreCargo: infoUser.NombreCar,
  //     id_cuenta: infoUser.id_cuenta,
  //     id: 0
  //   }
  // }
  seleccionar_User(infoUser: any) {
    this.Posicion_Ventana = 1
    const user_socket: any = this.usuarios_Conectados.filter(e => e.id_cuenta == infoUser.id_cuenta)
    if (user_socket.length > 0) {
      this.enviar_tiempo_real = true
      this.Info_UserReceptor = {
        Nombre: `${infoUser.Nombre} ${infoUser.Apellido_P} ${infoUser.Apellido_M}`,
        NombreCargo: infoUser.NombreCar,
        id_cuenta: infoUser.id_cuenta,
        id: user_socket[0].id
      }
    }
    else {
      this.Info_UserReceptor = {
        Nombre: `${infoUser.Nombre} ${infoUser.Apellido_P} ${infoUser.Apellido_M}`,
        NombreCargo: infoUser.NombreCar,
        id_cuenta: infoUser.id_cuenta,
        id: 0
      }
    }

  }

  Anterior_Paso() {  //regiresar a ventana de seleccion receptor
    this.Posicion_Ventana = 0
  }










}
