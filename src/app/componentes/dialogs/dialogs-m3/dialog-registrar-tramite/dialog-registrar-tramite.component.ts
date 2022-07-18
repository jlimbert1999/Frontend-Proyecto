import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TipoTramite } from 'src/app/modelos/tramites-requisitos/Tipo_Tramite.model'
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos'
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import decode from 'jwt-decode'
import { TipoTramitesService } from 'src/app/servicios/servicios-m2/tipo-tramites.service'
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'
import { SolicitanteModel, RepresentanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dialog-registrar-tramite',
  templateUrl: './dialog-registrar-tramite.component.html',
  styleUrls: ['./dialog-registrar-tramite.component.css']
})
export class DialogRegistrarTramiteComponent implements OnInit {

  lista_TiposTramites: TipoTramite[] = []
  lista_Requerimientos: Requerimientos[] = []
  CodigoUnicoTramite: string = ""
  TituloTramite: string = ""
  elemento_tabla: any  //objeto que se envira a la tabla para agregarlo

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
    telefono: '',
    tipo_solicitante: ''
  }
  tramite: TramiteModel
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

  spiner_carga: boolean = false


  @ViewChild('listaRequerimientos') private allSelected: MatSelectionList;

  tiene_representante: boolean = false //varible para ver si tiene rep al momento de editar
  isLinear = false;

  TramiteFormGroup: FormGroup;
  SolicitanteFormGroup: FormGroup;
  RepresentanteFormGroup: FormGroup;

  Tipos_Solicitantes = [
    { tipo: 'natural', nombre: 'Persona natural' },
    { tipo: 'juridico', nombre: 'Persona juridica' }
  ]
  Tipo_Solicitante: string = ""


  constructor(
    private tiposTramiteService: TipoTramitesService,
    private regitroTramiteService: RegistroTramiteService,
    public dialogRef: MatDialogRef<DialogRegistrarTramiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.iniciar_form_Tramite()
    this.iniciar_form_Solicitante_Natural()
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

  seleccionar_TipoTramite(tipoTramite: TipoTramite) {
    this.CodigoUnicoTramite = tipoTramite.segmento
    this.TituloTramite = tipoTramite.titulo
    this.obtener_Requerimientos_Tramite(tipoTramite.id_TipoTramite)
  }
  obtener_Requerimientos_Tramite(id_TipoTramite: any) {

    this.spiner_carga = true
    this.tiposTramiteService.getRequerimientos_Habilitados(id_TipoTramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.spiner_carga = false
        this.lista_Requerimientos = resp.Requerimientos
      }
    })
  }

  registrar_Tramite() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false
    })
    Swal.showLoading();
    let year = new Date()
    let pin: number = this.generar_numRandom()
    this.tramite = {
      alterno: `${this.CodigoUnicoTramite.toLocaleUpperCase()}-${this.Info_cuenta_actua.Sigla}-${year.getFullYear()}-${pin}`,
      estado: "Inscrito",
      Fecha_creacion: this.getFecha(),
      pin: pin,
      id_cuenta: this.decodificarToken().id_cuenta,
      detalle: this.TramiteFormGroup.controls['detalle'].value,
      cantidad: this.TramiteFormGroup.controls['cantidad'].value,
      id_TipoTramite: this.TramiteFormGroup.controls['id_TipoTramite'].value
    }
    this.solicitante = this.SolicitanteFormGroup.value
    this.solicitante.tipo_solicitante = this.Tipo_Solicitante
    if (this.regis_Representante) {
      this.representante = this.RepresentanteFormGroup.value
      forkJoin([this.regitroTramiteService.addTramite(this.tramite), this.regitroTramiteService.addSolicitante(this.solicitante), this.regitroTramiteService.addRepresentante(this.representante)]).subscribe((results: any) => {
        if (results[0].ok && results[1].ok && results[2].ok) {
          this.registrar_solicitud_ConRepresentante(results[1].Solicitante.insertId, results[2].Representante.insertId, results[0].Tramite.insertId, this.Ids_requisitos_presentados)
          
        }
        else {
          this.msg.mostrarMensaje('error', "Error al registrar tramite, solicitante y representante")
        }
      })
    }
    else {
      forkJoin([this.regitroTramiteService.addTramite(this.tramite), this.regitroTramiteService.addSolicitante(this.solicitante)]).subscribe((results: any) => {
        if (results[0].ok && results[1].ok) {
          this.registrar_solicitud_SinRepresentante(results[1].Solicitante.insertId, results[0].Tramite.insertId, this.Ids_requisitos_presentados)
        }
        else {
          this.msg.mostrarMensaje('error', "Error al registrar tramite y solicitante")
        }
      })
    }

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
        this.elemento_tabla = {
          id_tramite,
          alterno: this.tramite.alterno,
          Fecha_creacion: this.tramite.Fecha_creacion,
          estado: this.tramite.estado,
          titulo: this.TituloTramite,
          enviado: false,
          solicitante: `${this.solicitante.nombres} ${this.solicitante.paterno} ${this.solicitante.materno}`,
          dni: this.solicitante.dni,
          expedido: this.solicitante.expedido,
          detalle: this.tramite.detalle,
          cantidad: this.tramite.cantidad,
          id_TipoTramite: this.tramite.id_TipoTramite,
          id_representante: null,
          id_solicitante,
          id_solicitud: resp.Solicitud.insertId
        }
        Swal.fire({
          title: "Se registro el tramite",
          // text: "Se actualizo correctamente",
          icon: 'success'
        })
        this.dialogRef.close(this.elemento_tabla);
        // this.msg.mostrarMensaje('success', "Registro de tramite y solicitante correcto")
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

        this.elemento_tabla = {
          id_tramite: id_tramite,
          alterno: this.tramite.alterno,
          Fecha_creacion: this.tramite.Fecha_creacion,
          estado: this.tramite.estado,
          titulo: this.TituloTramite,
          enviado: false,
          solicitante: `${this.solicitante.nombres} ${this.solicitante.paterno} ${this.solicitante.materno}`,
          detalle: this.tramite.detalle,
          cantidad: this.tramite.cantidad,
          id_TipoTramite: this.tramite.id_TipoTramite,
          id_representante,
          id_solicitante,
          id_solicitud: resp.Solicitud.insertId
        }
        Swal.fire({
          title: "Se registro el tramite",
          // text: "Se actualizo correctamente",
          icon: 'success'
        })
        this.dialogRef.close(this.elemento_tabla);
        // this.msg.mostrarMensaje('success', "Registro de tramite, solicitante y representante correcto")
      }
    })
  }



  editar_Tramite() {
    let id_solicitud: number = this.data.id_solicitud
    if (this.TramiteFormGroup.touched) {
      this.tramite = this.TramiteFormGroup.value
      let datos_update_tramite = {
        detalle: this.TramiteFormGroup.controls['detalle'].value,
        cantidad: this.TramiteFormGroup.controls['cantidad'].value
      }
      this.regitroTramiteService.putTramite(this.data.id_tramite, datos_update_tramite).subscribe((resp: any) => {
        if (!resp.ok) {
          this.msg.mostrarMensaje('error', resp)
        }
      })
    }

    if (this.SolicitanteFormGroup.touched) {
      this.solicitante = this.SolicitanteFormGroup.value
      this.regitroTramiteService.putSolicitante(this.data.id_solicitante, this.SolicitanteFormGroup.value).subscribe((resp: any) => {
        if (!resp.ok) {
          this.msg.mostrarMensaje('error', resp)
        }
      })
    }
    if (this.tiene_representante) {
      this.representante = this.RepresentanteFormGroup.value
      if (this.RepresentanteFormGroup.touched) {
        this.regitroTramiteService.putRepresentante(this.data.id_representante, this.RepresentanteFormGroup.value).subscribe((resp: any) => {
          if (!resp.ok) {
            this.msg.mostrarMensaje('error', resp)
          }
        })
      }
    }
    // else if (this.tiene_representante == false) {  //no tiene representante
    //   if (this.regis_Representante) { //quiere agregar?
    //     this.regitroTramiteService.addRepresentante(this.RepresentanteFormGroup.value).subscribe((resp: any) => {
    //       if (resp.ok) {
    //         this.actualizar_solicitud(id_solicitud, { id_representante: resp.Representante.insertId })
    //       }
    //     })
    //   }
    // }
    this.actualizar_solicitud(id_solicitud, { presento: this.Ids_requisitos_presentados.toString() })



  }

  actualizar_solicitud(id_solicitud: number, datos: any) {
    this.regitroTramiteService.putSolicitud(id_solicitud, datos).subscribe((resp: any) => {
      if (resp.ok) {
        this.elemento_tabla = {
          id_tramite: this.data.id_tramite,
          alterno: this.data.alterno,
          Fecha_creacion: this.data.Fecha_creacion,
          estado: this.data.estado,
          titulo: this.data.titulo,
          enviado: false,
          solicitante: `${this.solicitante.nombres} ${this.solicitante.paterno} ${this.solicitante.materno}`,
          detalle: this.tramite.detalle,
          cantidad: this.tramite.cantidad,
          id_TipoTramite: this.tramite.id_TipoTramite,
          id_representante: this.data.id_representante,
          id_solicitante: this.solicitante.id_solicitante,
          id_solicitud,
          posicion: this.data.posicion
        }
        this.dialogRef.close(this.elemento_tabla);
        this.msg.mostrarMensaje('success', 'Solicitud actualizada')
      }
    })
  }

  obtener_SolicitanteTramite(id_tramite: number) {
    this.regitroTramiteService.getSolicitate_PorTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.SolicitanteFormGroup.patchValue(resp.Solicitante[0])
        this.solicitante = resp.Solicitante[0]
      }
    })
  }
  obtener_requisito_presentados(id_tramite: number) {
    this.spiner_carga = true
    this.regitroTramiteService.getRequisitos_presentados(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.spiner_carga = true
        if (resp.Requisitos.length > 0) { //ids de los requisitos
          this.Ids_requisitos_presentados = resp.Requisitos[0].presento.split(',').map(Number);
          this.obtener_Requerimientos_Tramite(this.data.id_TipoTramite)
        }
      }
    })
  }
  obtener_RepresentanteTramite(id_tramite: number) {
    this.regitroTramiteService.getRepresentante_PorTramite(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.representante = resp.Representante[0]
        this.RepresentanteFormGroup.patchValue(resp.Representante[0])
      }
    })
  }
  seleccionar_tipo_solicitante(tipo: string) {
    console.log(tipo);
    this.Tipo_Solicitante = tipo
    if (tipo == 'natural') {
      this.iniciar_form_Solicitante_Natural()
    }
    else if (tipo == 'juridico') {
      this.iniciar_form_Solicitante_Juridico()
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
  deselectAll() {
    this.allSelected.deselectAll();
    this.Ids_requisitos_presentados = []

  }
  iniciar_form_Tramite() {
    this.TramiteFormGroup = this._formBuilder.group({
      cantidad: ['', Validators.required],
      detalle: ['', Validators.required],
      id_TipoTramite: ['', Validators.required]
    });

  }
  iniciar_form_Solicitante_Natural() {
    this.SolicitanteFormGroup = this._formBuilder.group({
      nombres: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      id_documento: ['', Validators.required],
      dni: ['', Validators.required],
      expedido: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }
  iniciar_form_Solicitante_Juridico() {
    this.SolicitanteFormGroup = this._formBuilder.group({
      nombres: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }
  iniciar_form_Representante() {
    this.RepresentanteFormGroup = this._formBuilder.group({
      nombres: ['', Validators.required],
      paterno: ['', Validators.required],
      materno: ['', Validators.required],
      id_documento: ['', Validators.required],
      dni: ['', Validators.required],
      expedido: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }
  cargar_Inputs() {
    this.TramiteFormGroup.patchValue(this.data)
    // data viene con varios datos que se muestan en la tabla de tramites registrados
    this.tramite = this.data
    this.obtener_requisito_presentados(this.data.id_tramite)
    this.obtener_SolicitanteTramite(this.data.id_tramite)
    if (this.data.id_representante) {
      this.tiene_representante = true
      this.regis_Representante = true //para mostrar la ventana del represetante
      this.iniciar_form_Representante()
      this.obtener_RepresentanteTramite(this.data.id_tramite)
    }
    else {
      this.tiene_representante = false
    }
  }
  habilitar_representante(valor: boolean) {
    if (valor) {
      this.iniciar_form_Representante()
      this.regis_Representante = true
    }
    else {
      this.regis_Representante = false
    }
  }
  Registrar_Datos() {
    if (this.tituloDialog == "Nuevo tramite") {
      this.registrar_Tramite()
    }
    else if (this.tituloDialog == "Edicion de tramite") {
      this.editar_Tramite()
    }
  }






}
