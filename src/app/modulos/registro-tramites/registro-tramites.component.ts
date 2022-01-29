import { Component, OnInit } from '@angular/core';

//sevicios
import { TipoTramitesService } from '../../servicios/servicios-m2/tipo-tramites.service'
import { RegistroTramitesService } from '../../servicios/registro-tramites.service'

//modelos
import { TipoTramite } from '../../modelos/tramites-requisitos/Tipo_Tramite.model'
import { TramiteModel } from '../../modelos/resistro-tramites.model'
//materials
import { MatListOption } from '@angular/material/list'
import { Router, ActivatedRoute } from '@angular/router';

//generacion ficha
import { jsPDF } from 'jspdf';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-registro-tramites',
  templateUrl: './registro-tramites.component.html',
  styleUrls: ['./registro-tramites.component.css']
})
export class RegistroTramitesComponent implements OnInit {
  listaTiposTramites: TipoTramite[] = [];
  listaRequisitos: string[] = [];
  tipoTramite: any = "";
  //datos para el registro solicitante
  datosSolicitante: TramiteModel = {
    estado: "Inscrito",
    tipo: "",
    codigo: "",
    detalle: "",
    cantidad: 0,
    fecha_creacion: "",
    activo: false,

    nombre: "",
    apellido_p: "",
    apellido_m: "",
    telefono: "",
    tipos_doc: "",
    dni: "",
    expedido: ""
  }
  docSolicitante = [
    { value: 'CI', viewValue: 'Ci' },
    { value: 'Libreta', viewValue: 'Libreta' }
  ];

  constructor(
    private tipoTramitesService: TipoTramitesService, 
    private registroTramitesService: RegistroTramitesService, 
    private router: Router,
    private activatedRoute:ActivatedRoute
    ) { }
  ngOnInit(): void {
    // this.cargarTiposTramites()
  }
  // cargarTiposTramites() {

  //   this.tipoTramitesService.getTipoTramite().subscribe((resp: any) => {
  //     this.listaTiposTramites = resp.tipoTramite//arreglo de objetos de la bd con id tramite, nombre tramite y requistos
  //   })
  // }
  // seleccionarTramite(registro: TipoTramite) {
  //   let lista = registro.requistos_tramite.toString()
  //   this.listaRequisitos = lista.split(',')
  //   console.log(this.listaRequisitos)
  // }

  registrarTramite(requisitosSelec: MatListOption[]) {
    console.log(requisitosSelec.map(o => o.value));
    this.datosSolicitante.tipos_doc = requisitosSelec.map(o => o.value).toString()
  }

  ejemplo() {
    this.datosSolicitante.tipo = this.tipoTramite.nombre_TipoTramite
    // console.log(this.datosSolicitante.tipo);
    this.getfecha()
    this.registroTramitesService.addTramite(this.datosSolicitante).subscribe(resp => {
      console.log(resp);

    })
    this.router.navigate(['inicio/lista-registros'])
    this.crearFicha()

    console.log(this.datosSolicitante)
  }
  getfecha() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear()
    this.datosSolicitante.fecha_creacion = day + "/" + month + "/" + year;
    return day + "/" + month + "/" + year;
  }

  crearFicha() {
    let txtNombre=this.datosSolicitante.nombre.toString()
    let txtCodigo="3242"
    let txtFecha=this.getfecha()
    let txtTipTramite=this.tipoTramite.nombre_TipoTramite

    const doc = new jsPDF();
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 0, 0,50, 50)

    doc.text("Solicitante", 60, 10);
    doc.text("Codigo", 60, 20);
    doc.text("Tipo tramite", 60, 30);
    doc.text("Fecha", 60, 40);

    doc.text(txtNombre, 100, 10);
    doc.text(txtCodigo, 100, 20);
    doc.text(txtTipTramite, 100, 30);
    doc.text(txtFecha, 100, 40);

    doc.save("ficha.pdf");
  }

  Administrar_Tramites(){
    this.router.navigate(['administrar-tramite'], {relativeTo: this.activatedRoute})
  }
  Abrir_BandejaEntrada(){
    this.router.navigate(['bandeja-entrada'], {relativeTo: this.activatedRoute})

  }
  Abrir_BandejaSalida(){
    this.router.navigate(['bandeja-salida'], {relativeTo: this.activatedRoute})
  }


}
