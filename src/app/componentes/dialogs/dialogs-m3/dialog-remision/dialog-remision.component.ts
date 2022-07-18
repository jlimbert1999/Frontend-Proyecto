import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import { InstitucionService } from 'src/app/servicios/servicios-m1/institucion.service'
import { DependenciaService } from 'src/app/servicios/servicios-m1/dependencia.service'
import Swal from 'sweetalert2';
import decode from 'jwt-decode'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { InstitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Bandeja_Entrada, Bandeja_Salida } from 'src/app/modelos/seguimiento-tramites/workflow.model';
@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css']
})
export class DialogRemisionComponent implements OnInit {


  msg = new Mensajes()
  Info_Cuenta_Actual = this.decodificarToken()
  usuarios_Conectados: any[] = []
  usuarios_Desconectados: any[] = []
  Info_UserReceptor: any

  Fecha: number  //para tener solo una fecha exata de envio
  instituciones: InstitucionModel[] = []
  dependencias: any[] = []
  Bandeja_entrada: Bandeja_Entrada
  Bandeja_salida: Bandeja_Salida;
  enviar_tiempo_real: boolean = false //verificar si se envia a user activo
  stateCtrl = new FormControl();
  filteredStates: Observable<any[]>;

  @ViewChild('txt_UserRecep') inputUserRecep: any;
  constructor(
    public dialogRef: MatDialogRef<DialogRemisionComponent>,
    private tramiteService: RegistroTramiteService,
    private socketService: SocketService,
    private instService: InstitucionService,
    private depService: DependenciaService,
    private snackBar: MatSnackBar,
    private bandejasService: BandejaService,
    @Inject(MAT_DIALOG_DATA) public data: { id_tramite: number, Titulo: string, Alterno: string, Mensaje: string, Estado: string, Posicion?: number },
  ) {

  }
  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.usuarios_Desconectados.filter(state => state.Nombre.toLowerCase().includes(filterValue) || state.NombreCar.toLowerCase().includes(filterValue));
  }
  spiner_carga: boolean = false

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
    this.depService.getDependenciasActivas_de_Instituto(id_institucion).subscribe((resp: any) => {
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
    this.inputUserRecep.nativeElement.value = '';
    this.spiner_carga = true
    let datos_busqueda = {
      id_institucion: id_inst,
      id_dependencia: id_dep
    }
    this.tramiteService.getFuncionarioEspecifico(datos_busqueda).subscribe((resp: any) => {
      if (resp.ok) {
        let user: any
        this.usuarios_Desconectados = resp.Funcionarios.filter((user: any) => user.id_cuenta != this.Info_Cuenta_Actual.id_cuenta)
        this.usuarios_Desconectados.forEach((element: any) => {
          user = this.usuarios_Conectados.find(user => user.id_cuenta == element.id_cuenta)
          if (user) {
            element['id'] = user.id
          }
        })
        this.spiner_carga = false
        this.filteredStates = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filterStates(state) : this.usuarios_Desconectados.slice())),
        );

      }
    })
  }

  seleccionar_User(infoUser: any) {
    this.Info_UserReceptor = infoUser
    if (infoUser.id) {
      this.enviar_tiempo_real = true
    }
    else {
      this.enviar_tiempo_real = false
    }
  }
  armar_datos_Envio_UserActivo(Fecha: number) {
    const Data_Envio = {
      id_receptor: this.Info_UserReceptor.id, //id_socket
      Tramite: {
        id_cuenta: this.Info_Cuenta_Actual.id_cuenta,
        id_funcionario: this.Info_Cuenta_Actual.id_funcionario,
        Nombre: this.Info_Cuenta_Actual.Nombre,
        NombreCargo: this.Info_Cuenta_Actual.NombreCargo,
        Mensaje: this.data.Mensaje,
        id_tramite: this.data.id_tramite,
        Titulo: this.data.Titulo,
        Estado: this.data.Estado,
        Alterno: this.data.Alterno,
        Fecha_Envio: Fecha,
        Enviado: true,
        Recibido: false
      }
    }
    return Data_Envio
  }

  Enviar_Tramite() {
    Swal.fire({
      title: `Remitir tramite a ${this.Info_UserReceptor.Nombre} ${this.Info_UserReceptor.Apellido_P} ${this.Info_UserReceptor.Apellido_M} (${this.Info_UserReceptor.NombreCar})?`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Fecha = this.getFecha()
        if (this.enviar_tiempo_real) {
          this.socketService.Emitir('enviarTramite', this.armar_datos_Envio_UserActivo(this.Fecha)).subscribe()
        }


        //armar datos para registro
        this.Bandeja_entrada = {
          id_tramite: this.data.id_tramite,
          id_cuentaEmisor: this.Info_Cuenta_Actual.id_cuenta,
          id_cuentaReceptor: this.Info_UserReceptor.id_cuenta,
          fecha_envio: this.Fecha,
          fecha_recibido: 0,
          detalle: this.data.Mensaje,
          aceptado: false
        }
        this.Bandeja_salida = {
          id_tramite: this.data.id_tramite,
          id_cuentaEmisor: this.Info_Cuenta_Actual.id_cuenta,
          id_cuentaReceptor: this.Info_UserReceptor.id_cuenta,
          fecha_envio: this.Fecha,
          fecha_recibido: 0,
          detalle: this.data.Mensaje,
          aceptado: false,
          rechazado: false
        }
        forkJoin([this.bandejasService.add_bandejaEntrada(this.Bandeja_entrada), this.bandejasService.add_bandejaSalida(this.Bandeja_salida)]).subscribe((results: any) => {
          if (results[0].ok && results[1].ok) {
            this.openSnackBar("Tramite enviado")
            if (this.data.Estado == 'Inscrito') {
              this.data.Estado = "En revision"
              this.actualizar_estadoTramite('En revision')
            }
            this.dialogRef.close(this.data)

          }
          else {
            this.msg.mostrarMensaje('error', "No se puedo enviar el tramite")
          }
        })



      }
    })
  }

  openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, undefined, {
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  getFecha(): any {
    return Date.now()
  }


  actualizar_estadoTramite(estado: string) {
    this.tramiteService.putTramite(this.data.id_tramite, { estado }).subscribe((resp: any) => {
      if (resp.ok) {
        this.data.Estado = estado
      }
    })


  }










}
