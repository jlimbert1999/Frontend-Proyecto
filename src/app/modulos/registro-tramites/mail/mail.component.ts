import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import decode from 'jwt-decode'
import { MatDialog } from '@angular/material/dialog';
import { DialogObservacionesComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-observaciones/dialog-observaciones.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  id_tramite: number

  Mail: any
  Tramite: any;
  Solicitante: any;
  Representante: any
  Requerimientos_presentados: any[] = [];

  Observaciones: any[] = []
  Mis_Observaciones: any[] = []
  datosObservacion: any = {}

  Info_cuenta_Actual = this.decodificarToken()

  datosWorkflow: any

  spiner_carga: boolean = false
  @ViewChild(MatAccordion) accordion: MatAccordion;


  constructor(private location: Location, private mailService: RegistroTramiteService, private activateRoute: ActivatedRoute, public dialog: MatDialog, private _snackBar: MatSnackBar, private bandejaService: BandejaService, private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id_tramite = params['id']
      this.spiner_carga = true
      this.mailService.getMail_DatosEmisor(params['id']).subscribe((resp: any) => {
        if (resp.ok) {
          this.Mail = resp.Mail
          this.obtener_InfoFicha(params['id'])
        }
      })

    });

  }

  obtener_InfoFicha(id_tramite: number) {
    forkJoin(
      [
        this.mailService.getFicha_InfoTramite(id_tramite),
        this.mailService.getFicha_InfoSolicitante(id_tramite),
        this.mailService.getFicha_InfoRepresentante(id_tramite),
        this.mailService.getFicha_InfoRequerimientos(id_tramite),
        this.mailService.getObservaciones(id_tramite)
      ]
    ).subscribe((results: any) => {
      if (results[0].ok, results[1].ok, results[2].ok, results[3].ok, results[4].ok) {
        this.spiner_carga = false
        this.Tramite = results[0].Tramite[0]
        this.Solicitante = results[1].Solicitante[0]
        if (results[2].Representante) {
          this.Representante = results[2].Representante[0]
        }
        this.Requerimientos_presentados = results[3].Requerimientos
        this.ordenar_Observaciones(results[4].Observaciones)
      }
    })

  }
  ordenar_Observaciones(observaciones: any[]) {
    this.Observaciones = []
    let unicos: number[] = []
    let aux: any[] = []
    for (let i = 0; i < observaciones.length; i++) {
      if (!unicos.includes(observaciones[i].id_cuenta) && observaciones[i].id_cuenta != this.Info_cuenta_Actual.id_cuenta) {
        unicos.push(observaciones[i].id_cuenta);
      }
    }
    unicos.forEach((id: number) => {
      aux = observaciones.filter((obs: any) => obs.id_cuenta == id)
      this.Observaciones.push(aux)
    })
    this.Mis_Observaciones = observaciones.filter((obs: any) => obs.id_cuenta == this.Info_cuenta_Actual.id_cuenta)
  }

  agregar_observacion() {
    const dialogRef = this.dialog.open(DialogObservacionesComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.datosObservacion.detalle = dataDialog
        this.datosObservacion.id_tramite = this.id_tramite
        this.datosObservacion.id_cuenta = this.Info_cuenta_Actual.id_cuenta
        this.datosObservacion.fecha_registro = this.getFecha()
        this.mailService.addObservacion(this.datosObservacion).subscribe((resp: any) => {
          if (resp.ok) {
            this.openSnackBar(resp.message, '')
            this.Mis_Observaciones.push(this.datosObservacion)
            if (this.Tramite.estado == "En revision" || this.Tramite.estado == "Inscrito") {
              this.actualizar_estadoTramite('Observado')
            }
          }
        })

      }
    });
  }
  corregir_Observacion(id_observacion: number, pos: number) {
    if (!this.Mis_Observaciones[pos].situacion) { //si ya esta corregido, no hacer query
      this.mailService.putObservacion(id_observacion, { situacion: true }).subscribe((resp: any) => {
        if (resp.ok) {
          this.Mis_Observaciones[pos].situacion = true
        }
      })
    }
  }
  actualizar_estadoTramite(estado: string) {
    this.mailService.putTramite(this.id_tramite, { estado }).subscribe((resp: any) => {
      if (resp.ok) {
        this.Tramite.estado = estado
      }
    })
  }

  aceptar_tramite() {
    let fecha = this.getFecha() //para igualar en bandeja entrada y salida

    //se debe enviar id_tramite, id_cuentaEmisor, id_cuentaReceptor, data_update_bandejaEntrada, data_update_badejaSalida
    let datos_para_aceptar = {
      id_tramite: this.id_tramite,
      id_cuentaEmisor: this.Mail.id_cuentaEmisor,
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
        this.Mail.Recibido = true
        this.registrar_Workflow(fecha)
      }
    },
      error => console.log('oops', error)
    )
  }
  rechazar_tramite() {

    //enviar datos para eliminar el registro unico con id_tramite, id_cuentaEmisor, id_cuentaRecpetor
    let datos_para_eliminar = {
      id_tramite: this.id_tramite,
      id_cuentaEmisor: this.Mail.id_cuentaEmisor,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta
    }
    this.bandejaService.rechazar_tramite(datos_para_eliminar).subscribe((resp: any) => {
      if (resp.ok) {
        // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
        this._snackBar.open(resp.message, "", {
          duration: 3000
        });
        this.router.navigate(['inicio/bandeja-entrada'])
      }
    })
  }

  registrar_Workflow(Fecha: number) {
    this.datosWorkflow = {
      id_cuentaEmisor: this.Mail.id_cuentaEmisor,
      id_cuentaReceptor: this.Info_cuenta_Actual.id_cuenta,
      Funcionario_Emisor: this.Mail.Nombre,
      Funcionario_Receptor: this.Info_cuenta_Actual.Nombre,
      id_tramite: this.id_tramite,
      fecha_envio: this.Mail.Fecha_Envio,
      fecha_recibido: Fecha,
      detalle: this.Mail.Mensaje,
      enviado: true,
      recibido: true,
    }
    if (this.datosWorkflow.id_cuentaEmisor != null && this.datosWorkflow.id_cuentaEmisor != null) {
      this.mailService.addtFlujoTrabajo(this.datosWorkflow).subscribe((resp: any) => {
        if (resp.ok) {
          this._snackBar.open('Tramite acepado!', '', {
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
  abrir_DialogRemision() {
    let tramite = {
      id_tramite: this.id_tramite,
      Titulo: this.Tramite.titulo,
      Alterno: this.Tramite.alterno,
      Estado: this.Tramite.estado
    }
    // //enviar id para que las bandeja obtengan datos desde la trabla workflow

    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: tramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {

      if (dataDialog) {
        this.router.navigate(['inicio/bandeja-entrada'])
        // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
      }

    })

  }
  abrir_Workflow() {
    this.router.navigate(['inicio/Workflow', this.id_tramite])
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
          Fecha_finalizacion: this.getFecha()
        }
        this.mailService.putTramite(this.id_tramite, data).subscribe((resp: any) => {
          if (resp.ok) {
            this.Tramite.estado = data.estado
            // this.Actualizar_listaRecibidos.emit(this.DatosEnvio.id_tramite)
            this._snackBar.open("Tramite finalizado", "", {
              duration: 3000
            });
            this.router.navigate(['inicio/bandeja-entrada'])
          }
        })
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

  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  regresar() {
    this.location.back();
  }

}
