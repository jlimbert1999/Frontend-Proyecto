import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { DialogObservacionesComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-observaciones/dialog-observaciones.component';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import { SolicitanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { RepresentanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-tramite',
  templateUrl: './ficha-tramite.component.html',
  styleUrls: ['./ficha-tramite.component.css']
})
export class FichaTramiteComponent implements OnInit, OnChanges {
  @Input() DatosEnvio: any  //contiene info del emisor y detalles de tramite
  @Input() tipoBandeja: any
  @Output() Actualizar_listaRecibidos: EventEmitter<object>;
  Info_cuenta_Actual = this.decodificarToken()
  Tramite: TramiteModel
  Solicitante: SolicitanteModel
  Representante: RepresentanteModel
  Requerimientos_presentados: any[] = []
  observaciones: any[] = []
  mis_observaciones: any[] = []
  displayColumns_misObservaciones: string[] = ['descripcion', 'estado', 'fecha_registro', 'op'];
  displayColumns_Observaciones: string[] = ['descripcion', 'estado', 'fecha_registro'];

  datosObservacion = {  //para registrar observacion
    id_tramite: 0,
    id_cuenta: 0,
    detalle: '',
    fecha_registro: 0
  }
  requisitosPresentados: any
  datos_Funcionario: any
  estadosTramite: string[] = ['En revision', 'Devuelto', 'Observado', 'Concluido', 'Anulado']

  datosWorkflow: Workflow
  //ver si se abre desde bandeja o desde admin tramite
  //2 tipos de vista Ficha_envio, Ficha_detalle
  Tipo_Vista_Ficha: string

  @ViewChild(MatAccordion) accordion: MatAccordion;


  constructor(
    private tramiteService: RegistroTramiteService,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private bandejaService: BandejaService,
    private _location: Location


  ) {
    this.Actualizar_listaRecibidos = new EventEmitter();

  }

  ngOnInit(): void {
    //ficha puede ser abierta desde badeja o desde registro de tramites
    if (!this.DatosEnvio) {
      this.activateRoute.params.subscribe(params => {
        this.DatosEnvio = {
          id_tramite: params['id'],
          Recibido: false
        }
        this.Tipo_Vista_Ficha = 'Ficha_detalles'
        this.obtener_InfoFicha(this.DatosEnvio.id_tramite)
      });
    }
    else {
      this.Tipo_Vista_Ficha = 'Ficha_envio'
    }
  }
  ngOnChanges(): void {
    this.obtener_InfoFicha(this.DatosEnvio.id_tramite)
  }

  obtener_InfoFicha(id_tramite: number) {
    forkJoin(
      [
        this.tramiteService.getFicha_InfoTramite(id_tramite),
        this.tramiteService.getFicha_InfoSolicitante(id_tramite),
        this.tramiteService.getFicha_InfoRepresentante(id_tramite),
        this.tramiteService.getFicha_InfoRequerimientos(id_tramite)
      ]
    ).subscribe((results: any) => {
      if (results[0].ok, results[1].ok, results[2].ok, results[3].ok) {
        this.Tramite = results[0].Tramite[0]
        this.Solicitante = results[1].Solicitante[0]
        if (results[2].Representante) {
          this.Representante = results[2].Representante[0]
        }
        this.Requerimientos_presentados = results[3].Requerimientos
        this.obtener_Observaciones(id_tramite)
      }
    })

  }



  // obtener datos completos del tramite
  obtener_Datos_Tramite(id_tramite: number) {
    this.tramiteService.getFicha_InfoTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tramite = resp.Tramite[0]
      }
    })
  }

  obtener_Datos_Solicitante(id_tramite: number) {
    this.tramiteService.getFicha_InfoTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Solicitante = resp.Solicitante[0]
      }
    })
  }

  obtener_Datos_Representante(id_tramite: number) {
    this.tramiteService.getFicha_InfoRepresentante(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Representante = resp.Representante[0]
      }
    })
  }
  obtener_Datos_Requerimientos(id_tramite: number) {
    this.tramiteService.getFicha_InfoRequerimientos(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.Requerimientos_presentados = resp.Requerimientos

      }
    })
  }


  aceptar_recepcion_tramite() {
    //NOTA: se debe enviar los ids emisor y receptor para que 
    // no marque todos los envios con el id_tramite a recibidos
    let datos_actualizar = {
      //datos para actualizar el registro especifio
      id_cuentaEmisor: this.DatosEnvio.id_cuenta,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta,
      //datos que se actualizaran
      recibido: true,
      fecha_recibido: this.getFecha()
    }
    this.tramiteService.putWorkflow_AceptarTramite(datos_actualizar, this.DatosEnvio.id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.DatosEnvio.Recibido = true
        this._snackBar.open('Tramite aceptado!', '', {
          duration: 3000,
          panelClass: ['success']
        });
      }
    })
  }


  agregar_observacion() {
    const dialogRef = this.dialog.open(DialogObservacionesComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.datosObservacion.detalle = dataDialog
        this.datosObservacion.id_tramite = this.DatosEnvio.id_tramite
        this.datosObservacion.id_cuenta = this.Info_cuenta_Actual.id_cuenta
        this.datosObservacion.fecha_registro = this.getFecha()
        this.tramiteService.addObservacion(this.datosObservacion).subscribe((resp: any) => {
          if (resp.ok) {
            this.openSnackBar(resp.message, '')
            this.obtener_Observaciones(this.DatosEnvio.id_tramite)
            if (this.Tramite.estado != "Observado") {
              this.actualizar_estadoTramite('Observado')
              this.Tramite.estado = "Observado"
            }

          }
        })

      }
    });
  }

  obtener_Observaciones(id_tramite: number) {
    this.observaciones = []
    this.tramiteService.getObservaciones(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        let unicos: number[] = []
        let aux: any[] = []
        for (let i = 0; i < resp.Observaciones.length; i++) {
          if (!unicos.includes(resp.Observaciones[i].id_cuenta) && resp.Observaciones[i].id_cuenta != this.Info_cuenta_Actual.id_cuenta) {
            unicos.push(resp.Observaciones[i].id_cuenta);
          }
        }
        unicos.forEach((id: number) => {
          aux = resp.Observaciones.filter((obs: any) => obs.id_cuenta == id)
          this.observaciones.push(aux)
        })
        this.mis_observaciones = resp.Observaciones.filter((obs: any) => obs.id_cuenta == this.Info_cuenta_Actual.id_cuenta)
      }
    })
  }
  corregir_Observacion(id_observacion: number, pos: number) {
    if (!this.mis_observaciones[pos].situacion) { //si ya esta corregido, no hacer query
      this.tramiteService.putObservacion(id_observacion, { situacion: true }).subscribe((resp: any) => {
        if (resp.ok) {
          this.mis_observaciones[pos].situacion = true
        }
      })
    }
  }



  obtener_RequisitosPresentados(id_tramite: number) {
    this.tramiteService.getRequisitos_Tramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.requisitosPresentados = resp.Requisitos
      }
    })
  }






  //metodo usado para traer info de emisor o receptor
  obtener_detallesFuncionario(id_cuenta: number) {
    this.tramiteService.getDatosFuncionario(id_cuenta).subscribe((resp: any) => {
      this.datos_Funcionario = resp.Funcionario[0]
    })
  }



  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }



  actualizar_estadoTramite(estado: string) {
    this.tramiteService.putTramite(this.DatosEnvio.id_tramite, { estado }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tramite.estado = estado
      }
    })
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
  getFecha(): any {
    return Date.now()
  }




  abrir_DialogRemision() {
    let tramite = {
      id_tramite: this.DatosEnvio.id_tramite,
      Titulo: this.DatosEnvio.Titulo,
      Alterno: this.DatosEnvio.Alterno,
      Estado: this.Tramite.estado
    }
    // //enviar id para que las bandeja obtengan datos desde la trabla workflow

    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: tramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {

      if(dataDialog){
        this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
      }
      
    })

  }

  abrir_Workflow() {
    let id_tramite = this.DatosEnvio.id_tramite
    this.router.navigate(['inicio/Workflow', id_tramite])
  }
  rechazar_tramite() {

    //enviar datos para eliminar el registro unico con id_tramite, id_cuentaEmisor, id_cuentaRecpetor
    let datos_para_eliminar = {
      id_tramite: this.DatosEnvio.id_tramite,
      id_cuentaEmisor: this.DatosEnvio.id_cuenta,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta
    }
    this.bandejaService.rechazar_tramite(datos_para_eliminar).subscribe((resp: any) => {
      if (resp.ok) {
        this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
        this._snackBar.open(resp.message, "", {
          duration: 3000
        });
      }
    })
  }
  aceptar_tramite() {
    let fecha = this.getFecha() //para igualar en bandeja entrada y salida

    //se debe enviar id_tramite, id_cuentaEmisor, id_cuentaReceptor, data_update_bandejaEntrada, data_update_badejaSalida
    let datos_para_aceptar = {
      id_tramite: this.DatosEnvio.id_tramite,
      id_cuentaEmisor: this.DatosEnvio.id_cuenta,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta,
      data_update_bandejaEntrada: {
        fecha_recibido: fecha,
        aceptado: true
      },
      data_update_badejaSalida: {
        fecha_recibido: fecha,
        aceptado: true
      }
    }
    this.bandejaService.aceptar_tramite(datos_para_aceptar).subscribe((resp: any) => {
      if (resp.ok) {
        this.DatosEnvio.Recibido = true
        this.registrar_Workflow(fecha)
        this._snackBar.open("Tramite aceptado", "", {
          duration: 3000
        });
      }
    },
      error => console.log('oops', error)
    )
  }


  registrar_Workflow(Fecha: number) {
    this.datosWorkflow = {
      id_cuentaEmisor: this.DatosEnvio.id_cuenta,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta,
      id_tramite: this.DatosEnvio.id_tramite,
      fecha_envio: this.DatosEnvio.Fecha_Envio,
      fecha_recibido: Fecha,
      detalle: this.DatosEnvio.Mensaje,
      enviado: true,
      recibido: true,
    }
    if (this.datosWorkflow.id_cuentaEmisor != null && this.datosWorkflow.id_cuentaEmisor != null) {
      this.tramiteService.addtFlujoTrabajo(this.datosWorkflow).subscribe((resp: any) => {
        if (resp.ok) {
          this._snackBar.open('Tramite enviado!', '', {
            duration: 3000,
            horizontalPosition: 'center'
          });
        }
      })
    }
    else {
      alert('Id user no encontrado, recargue pagina')
    }
  }

  regresar() {
    //metodo para volver atras cuando de abre desde ver Inforacion ficha tramite
    this._location.back();
  }

  finalizar_tramite() {
    Swal.fire({
      title: `Concluir el tramite ${this.Tramite.alterno}?`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          estado: 'Concluido',
          activo: true,
          Fecha_finalizacion:this.getFecha()
        }
        this.tramiteService.putTramite(this.DatosEnvio.id_tramite, data).subscribe((resp: any) => {
          if (resp.ok) {
            this.Tramite.estado = data.estado
            this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
            this._snackBar.open("Tramite finalizado", "", {
              duration: 3000
            });
          }
        })
      }
    })




  }






}
