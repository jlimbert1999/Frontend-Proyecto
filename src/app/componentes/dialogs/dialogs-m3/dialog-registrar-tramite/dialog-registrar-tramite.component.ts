import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TipoTramite } from 'src/app/modelos/tramites-requisitos/Tipo_Tramite.model'
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos'
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import decode from 'jwt-decode'
import { TipoTramitesService } from 'src/app/servicios/servicios-m2/tipo-tramites.service'
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'
import { SolicitanteModel, RepresentanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { map, Observable, observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list'
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dialog-registrar-tramite',
  templateUrl: './dialog-registrar-tramite.component.html',
  styleUrls: ['./dialog-registrar-tramite.component.css']
})
export class DialogRegistrarTramiteComponent implements OnInit {

  lista_TiposTramites: TipoTramite[] = []
  lista_Requerimientos: Requerimientos[] = []
  CodigoUnicoTramite: string = ""

  TiposDoc = [  //tipos de documento registrados
    { id_documento: 1, titulo: "Carnet de indetidad" },
    { id_documento: 2, titulo: "Pasaporte" }
  ]
  Lugares: any[] = [
    { nombre: 'Cochabamba', sigla: 'Cbba' },
    { nombre: 'Santa Cruz', sigla: 'Scz' },
    { nombre: 'La paz', sigla: 'Lp' },
    { nombre: 'Beni', sigla: 'Bn' },
    { nombre: 'Pando', sigla: 'Pn' },
    { nombre: 'Oruro', sigla: 'Or' },
    { nombre: 'Potosi', sigla: 'Pt' },
    { nombre: 'Tarija', sigla: 'Tr' },
    { nombre: 'Chuquisaca', sigla: 'Chq' },
  ]

  solicitante: SolicitanteModel = {
    id_documento: 0,
    dni: '',
    expedido: '',
    paterno: '',
    materno: '',
    nombres: '',
    telefono: ''
  }
  tramite: TramiteModel = {
    estado: '',
    alterno: '',
    pin: 0,
    detalle: '',
    cantidad: 0,
    id_cuenta: 0,
    Fecha_creacion: 0
  }
  representante: RepresentanteModel = {
    id_documento: 0,
    dni: '',
    expedido: '',
    paterno: '',
    materno: '',
    nombres: '',
    telefono: ''
  }
  Ids_requisitos_presentados: number[] = []
  regis_Representante: boolean = false
  msg = new Mensajes()
  tituloDialog = "";
  Info_cuenta_actua = this.decodificarToken()

  @ViewChild('listaRequerimientos') private allSelected: MatSelectionList;

  tiene_representante: boolean = false //varible para ver si tiene rep al momento de editar
  isLinear = false;



  constructor(
    private tiposTramiteService: TipoTramitesService,
    private regitroTramiteService: RegistroTramiteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogRegistrarTramiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.generarTitulo()
  }
  generarTitulo() {
    if (Object.keys(this.data).length == 0) {
      this.tituloDialog = "Nuevo tramite";
      this.obtener_TiposTramites()
    }
    else {
      this.tituloDialog = "Edicion de tramite";
      this.cargar_Inputs()

    }
  }


  obtener_TiposTramites() {
    this.tiposTramiteService.getTipoTramite_Habilitados().subscribe((resp: any) => {
      if (resp.ok) {
        this.lista_TiposTramites = resp.TiposTramites
      }
    })
  }
  //revisar, obtener solo los que presento
  obtener_Requerimientos(id_TipoTramite: any) {
    this.tiposTramiteService.getRequerimientos_Habilitados(id_TipoTramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.lista_Requerimientos = resp.Requerimientos
      }
    })
  }
  seleccionar_TipoTramite(tipoTramite: TipoTramite) {
    // this.tramite.id_TipoTramite = tipoTramite.id_TipoTramite
    this.CodigoUnicoTramite = tipoTramite.segmento
    this.obtener_Requerimientos(tipoTramite.id_TipoTramite)
  }


  registrar_Tramite() {
    let id_tramite_registrado: number = 0
    let id_solicitante_registrado: number = 0
    let id_representante_registrado: number=0
    let year = new Date()
    let pin: number = this.generar_numRandom()
    this.tramite = {
      alterno: `${this.CodigoUnicoTramite.toLocaleUpperCase()}-${this.Info_cuenta_actua.Sigla}-${year.getFullYear()}-${pin}`,
      estado: "Inscrito",
      Fecha_creacion: this.getFecha(),
      pin: pin,
      detalle: this.tramite.detalle,
      cantidad: this.tramite.cantidad,
      id_cuenta: this.decodificarToken().id_cuenta,
      id_TipoTramite:this.tramite.id_TipoTramite
    }

    if (this.regis_Representante) {
      forkJoin([this.regitroTramiteService.addTramite(this.tramite), this.regitroTramiteService.addSolicitante(this.solicitante), this.regitroTramiteService.addRepresentante(this.representante)]).subscribe((results:any)=>{
        if(results[0].ok && results[1].ok && results[2].ok){
          id_tramite_registrado=results[0].Tramite.insertId
          id_solicitante_registrado=results[1].Solicitante.insertId
          id_representante_registrado=results[2].Representante.insertId
          this.registrar_solicitud_ConRepresentante(id_solicitante_registrado, id_representante_registrado, id_tramite_registrado, this.Ids_requisitos_presentados)
        }
        else{
          this.msg.mostrarMensaje('error', "Error al registrar tramite, solicitante y representante")
        }
      })
    }
    else{
      forkJoin([this.regitroTramiteService.addTramite(this.tramite), this.regitroTramiteService.addSolicitante(this.solicitante)]).subscribe((results:any)=>{
        if(results[0].ok && results[1].ok){
          id_tramite_registrado=results[0].Tramite.insertId
          id_solicitante_registrado=results[1].Solicitante.insertId
          this.registrar_solicitud_SinRepresentante(id_solicitante_registrado, id_tramite_registrado, this.Ids_requisitos_presentados)
        }
        else{
          this.msg.mostrarMensaje('error', "Error al registrar tramite y solicitante")
        }
      })
    }

  }
  //metodo para ejecutar el registor de solicitante y trmaite al mismo tiempo
  obtener_infoTramite(): Observable<any[]> {//metodo observable
    let pin: number = this.generar_numRandom()
    this.tramite = {
      alterno: `${this.CodigoUnicoTramite}-${pin}`,
      estado: "Inscrito",
      Fecha_creacion: this.getFecha(),
      pin: pin,
      id_cuenta: this.decodificarToken().id_cuenta,
      detalle: '',
      cantidad: 0
    }
    let metodoAddSolicitante = this.regitroTramiteService.addSolicitante(this.solicitante)
    let metodoAddtramite = this.regitroTramiteService.addTramite(this.tramite)
    return forkJoin([metodoAddSolicitante, metodoAddtramite])  //permite ejucutar la funciones de forma sincrona
  }

  registrar_solicitud_SinRepresentante(id_solicitante: number, id_tramite: number, requisitos: number[]) {
    let solicitud = {
      id_solicitante,
      id_representante: null,
      id_tramite,
      presento: requisitos.toString()
    }
    this.regitroTramiteService.addSolicitud(solicitud).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }
  registrar_solicitud_ConRepresentante(id_solicitante: number, id_representante: any, id_tramite: any, requisitos: number[]) {
    let solicitud = {
      id_solicitante,
      id_representante,
      id_tramite,
      presento: requisitos.toString()
    }
    this.regitroTramiteService.addSolicitud(solicitud).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
      }
    })
  }

  Registrar_Datos() {
    if (this.tituloDialog == "Nuevo tramite") {
      this.registrar_Tramite()
    }
    else if (this.tituloDialog == "Edicion de tramite") {
      this.editar_Tramite()
    }
  }

  editar_Tramite() {

    //MEJORAR QUE SOLO LOS CAMPOS NECESARIOS DE ACTUALIZEN, NO TODO COMO EL TRAMITE, SOLICITNATE

    //solo el numero de hojas y la descripcion se deben acutalizar
    let datos_update_tramite: any = {
      detalle: this.tramite.detalle,
      cantidad: this.tramite.cantidad,
    }

    //guardar id_solicitud por si quiere agregar representante
    let id_solicitud: number = this.data.id_solicitud
    this.regitroTramiteService.putTramite(this.data.id_tramite, datos_update_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.regitroTramiteService.putSolicitante(this.solicitante.id_solicitante!, this.solicitante).subscribe((resp: any) => {
          if (resp.ok) {
            this.msg.mostrarMensaje('success', 'Detalles del tramite actualizados!')
          }
        })
      }
    })
    //atualizar requisitos si presento nuevo
    this.actualizar_solicitud(id_solicitud, { presento: this.Ids_requisitos_presentados.toString() })

    if (this.tiene_representante) {
      this.regitroTramiteService.putRepresentante(this.representante.id_representante!, this.representante).subscribe((resp: any) => {
        console.log(resp);
      })
    }

    else if (this.tiene_representante == false) {  //no tiene representante
      if (this.regis_Representante) { //quiere agregar?
        this.regitroTramiteService.addRepresentante(this.representante).subscribe((resp: any) => {
          if (resp.ok) {
            this.actualizar_solicitud(id_solicitud, { id_representante: resp.Representante.insertId })
          }
        })
      }
    }
  }

  actualizar_solicitud(id_solicitud: number, datos: any) {
    this.regitroTramiteService.putSolicitud(id_solicitud, datos).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', 'Solicitud actualizada')
      }
    })
  }

  obtener_SolicitanteTramite(id_tramite: number) {
    this.regitroTramiteService.getSolicitate_PorTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.solicitante = resp.Solicitante[0]
      }
    })
  }
  obtener_requisito_presentados(id_tramite: number) {
    this.regitroTramiteService.getRequisitos_presentados(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Requisitos.length > 0) { //ids de los requisitos
          this.Ids_requisitos_presentados = resp.Requisitos[0].presento.split(',').map(Number);
          this.obtener_Requerimientos(this.data.id_TipoTramite)
        }
      }
    })
  }
  obtener_RepresentanteTramite(id_tramite: number) {
    this.regitroTramiteService.getRepresentante_PorTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.representante = resp.Representante[0]
      }
    })
  }

  cargar_Inputs() {
    //data viene con varios datos que se muestan en la tabla de tramites registrados
    this.tramite = this.data
    this.obtener_requisito_presentados(this.data.id_tramite)
    this.obtener_SolicitanteTramite(this.data.id_tramite)
    if (this.data.id_representante) {
      this.tiene_representante = true
      this.regis_Representante = true //para mostrar la ventana del represetante
      this.obtener_RepresentanteTramite(this.data.id_tramite)
    }
    else {
      this.tiene_representante = false
    }
  }

  getFecha(): any {
    return Date.now()
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  generar_numRandom(): number {
    return Math.floor(1000 + Math.random() * 90000);
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onGroupsChange(options: MatListOption[]) {
    this.Ids_requisitos_presentados = options.map(o => o.value)
  }
  selectAll() {
    this.allSelected.selectAll();
    this.Ids_requisitos_presentados = this.lista_Requerimientos.map(o => o.id_requerimiento!)
  }



}
