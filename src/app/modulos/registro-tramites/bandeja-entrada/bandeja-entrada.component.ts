import { Component, OnInit } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model'
import { BandejaService } from 'src/app/servicios/servicios-m4/bandeja.service';

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaComponent implements OnInit {
  Info_Cuenta_Actual = this.decodificarToken()
  Tramites_Recibidos: any[] = []
  datosFicha: any
  aux_busqueda: any[] = [] //para realizar bsuquedas guardar los valores recuperados antes
  modo_busqueda: boolean = false

  constructor(
    private bandejaService: BandejaService,
    private socketService: SocketService
  ) {
  }



  ngOnInit(): void {

    this.recibir_tramite()
    this.obtener_tramitesRecibidos()

  }




  recibir_tramite() {
    this.socketService.Escuchar('recibirTramite').subscribe((tramite_recibido: any) => {
      this.Tramites_Recibidos.push(tramite_recibido)
    })
  }
  obtener_tramitesRecibidos() {
    this.Tramites_Recibidos = []
    this.bandejaService.getListaRecibida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        resp.Tramites_Recibidos.forEach((elemento: any) => {
          let Datos_Envio = {
            id_cuenta: elemento.id_cuentaEmisor, //id_cuenta del emisor
            Nombre: `${elemento.Nombre} ${elemento.Apellido_P} ${elemento.Apellido_M}`,
            NombreCargo: elemento.NombreCargo,
            Mensaje: elemento.detalle,
            id_tramite: elemento.id_tramite,
            Titulo: elemento.titulo,
            Alterno: elemento.alterno,
            Fecha_Envio: elemento.fecha_envio,
            Recibido: (elemento.aceptado == 1 ? true : false),
            Estado: elemento.estado
          }
          this.Tramites_Recibidos.unshift(Datos_Envio)
        })
        this.aux_busqueda = this.Tramites_Recibidos

      }
    })
  }
  ver_fichaTramite(tramite: any, pos: number) {
    // this.Mail_Seleccionado = posicion
    this.datosFicha = tramite
  }

  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  actualizar_lista_recibidos(id_tramiteEnviado: any) {
    //cuando se envia el tramite se recarga la lista de recibidos para que ya no tenga ese tramite
    this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite: any) => tramite.id_tramite != id_tramiteEnviado)
    this.datosFicha = ""
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Tramites_Recibidos = this.aux_busqueda.filter(obj => Object.values(obj).some((val: any) => val.toString().toLowerCase().includes(filterValue)));
    if (filterValue == "" || filterValue == null) {
      this.Tramites_Recibidos = this.aux_busqueda
    }

  }
  obtnener_no_recibidos() {
    this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite: any) => tramite.Recibido == false || tramite.Recibido == 0)
  }
  obtnener_recibidos() {
    this.obtener_tramitesRecibidos()
  }

  recargar() {
    this.obtener_tramitesRecibidos()
  }
  activar_busqueda() {
    this.modo_busqueda = true
  }
  desactivar_busqueda() {
    this.modo_busqueda = false
    this.Tramites_Recibidos=this.aux_busqueda
  }
  filtrar_listado(tipo: string) {
    if (tipo == "aceptados") {
      this.Tramites_Recibidos = this.aux_busqueda.filter((tramite: any) => tramite.Recibido == true || tramite.Recibido == 1)
    }
    else if (tipo == "nuevos") {
      this.Tramites_Recibidos = this.aux_busqueda.filter((tramite: any) => tramite.Recibido == false || tramite.Recibido == 0)
    }
    else if (tipo == "todos") {
      this.Tramites_Recibidos = this.aux_busqueda
    }


  }





}
