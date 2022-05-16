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
  Mail_Seleccionado: number
  visualizarFicha: boolean = false
  datosFicha: any

  breakpoint: number = 3
  rowHeight: any = '100%'
  colSpawn: number = 2
  aux_busqueda: any[] = [] //para realizar bsuquedas guardar los valores recuperados antes
  modo_busqueda:boolean=false
  constructor(
    private bandejaService: BandejaService,
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
    this.Tramites_Recibidos=[]
    this.bandejaService.getListaRecibida(this.Info_Cuenta_Actual.id_cuenta).subscribe((resp: any) => {
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
            Recibido: (elemento.aceptado == 1 ? true : false), 
            Estado:elemento.estado
          }
          this.Tramites_Recibidos.push(Datos_Envio)
        })
        this.aux_busqueda = this.Tramites_Recibidos
        
      }
    })
  }
  ver_fichaTramite(tramite: any, pos:number) {
    // this.Mail_Seleccionado = posicion
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

  actualizar_lista_recibidos(id_tramiteEnviado: any) {
    //cuando se envia el tramite se recarga la lista de recibidos para que ya no tenga ese tramite
    this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite: any) => tramite.id_tramite != id_tramiteEnviado)
    this.datosFicha=""
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Tramites_Recibidos = this.Tramites_Recibidos.filter(obj => Object.values(obj).some((val: any) => val.toString().toLowerCase().includes(filterValue)));
    if (filterValue == "" ||filterValue==null ) {
      this.Tramites_Recibidos = this.aux_busqueda
    }

  }
  obtnener_no_recibidos() {
    this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite: any) => tramite.Recibido == false || tramite.Recibido == 0)
  }
  obtnener_recibidos() {
    this.obtener_tramitesRecibidos()
  }

  recargar(){
    this.obtener_tramitesRecibidos()
  }
  activar_busqueda(){
    this.modo_busqueda=true
  }
  desactivar_busqueda(){
    this.modo_busqueda=false
  }





}
