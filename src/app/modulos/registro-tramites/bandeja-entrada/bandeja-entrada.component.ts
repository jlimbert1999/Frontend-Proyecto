import { Component, OnInit } from '@angular/core';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import decode from 'jwt-decode'
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';
import { Workflow } from 'src/app/modelos/seguimiento-tramites/workflow.model'

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaComponent implements OnInit {
  Info_Cuenta_Actual = this.decodificarToken()
  Tramites_Recibidos: any[] = []
  Mail_Seleccionado: number
  visualizarFicha: boolean = false
  datosFicha: any

  breakpoint: number = 3
  rowHeight: any = '100%'
  colSpawn: number = 2

  constructor(
    private tramiteService: RegistroTramiteService,
    private socketService: SocketService
  ) {
  }



  ngOnInit(): void {
    this.ajustar_Tamaño()
    this.recibir_tramite()
    this.obtener_tramitesRecibidos()

  }


  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : 3;
    if (this.breakpoint == 3) {
      this.rowHeight = '100%'
      this.colSpawn = 2
    }
    else {
      this.rowHeight = '50%'
      this.colSpawn = 1
    }
  }

  recibir_tramite() {
    this.socketService.Escuchar('recibirTramite').subscribe((resp: any) => {
      this.Tramites_Recibidos.push(resp)
    })
  }
  obtener_tramitesRecibidos() {
    this.tramiteService.getListaRecibida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        resp.Tramites_Recibidos.forEach((elemento: any) => {
          let Datos_Envio = {
            id_cuenta: elemento.id_cuentaEmisor, //id_cuenta del emisor
            Nombre: `${elemento.Nombre} ${elemento.Apellido_P} ${elemento.Apellido_M}`,
            NombreCargo: elemento.NombreCargo,
            Fecha_Envio: elemento.fecha_envio,
            id_tramite: elemento.id_tramite,
            Titulo: elemento.titulo,
            Alterno: elemento.alterno,
            Mensaje: elemento.detalle,
            Enviado: (elemento.enviado == 1 ? true : false),
            Recibido: (elemento.recibido == 1 ? true : false)
          }
          this.Tramites_Recibidos.push(Datos_Envio)
        })
      }
    })
  }
  ver_fichaTramite(tramite: any, posicion: number) {
    this.Mail_Seleccionado = posicion
    this.datosFicha = tramite
  }

  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  ajustar_Tamaño() {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : 3;
    if (this.breakpoint == 3) {
      this.rowHeight = '100%'
      this.colSpawn = 2
    }
    else {
      this.rowHeight = '50%'
      this.colSpawn = 1
    }
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let result = this.Tramites_Recibidos.filter(o => o.NombreCargo.includes(filterValue));

  }
  buscar(texto: string) {
    this.Tramites_Recibidos = this.Tramites_Recibidos.find(e => e.NombreCargo === texto);

  }




}
