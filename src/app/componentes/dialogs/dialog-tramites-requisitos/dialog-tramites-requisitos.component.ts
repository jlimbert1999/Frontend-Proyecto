import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//modelos
import { TiposTramite } from '../../../modelos/tramites-requisitos'

//servicios
import { TipoTramitesService } from '../../../servicios/tipo-tramites.service';
//materiales
@Component({
  selector: 'app-dialog-tramites-requisitos',
  templateUrl: './dialog-tramites-requisitos.component.html',
  styleUrls: ['./dialog-tramites-requisitos.component.css']
})
export class DialogTramitesRequisitosComponent implements OnInit {
  tituloDialog: string = '';
  esRegistrar:boolean=false
  idRegistro:number=-1;

  tipostramite: TiposTramite = {
    nombre_TipoTramite: '',
    requistos_tramite: []
  }

  nombreTramite: string = "";
  nombreRequisito: string = "";

  //tabla configuracion
  displayedColumns: string[] = ['numero', 'nombre', 'opciones'];
  listaRequistos: string[] = []
  @ViewChild('tablaRequisitos') tablaRequisitos: any;  //observar cambios tabla

  constructor(
    public dialogRef: MatDialogRef<DialogTramitesRequisitosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tipoTramitesService: TipoTramitesService
  ) { }

  ngOnInit(): void {
    this.cargarTiposDeTramite()

  }
  onNoClick() {
    this.dialogRef.close();
  }

  cargarTiposDeTramite() {
    if (this.data === null) {
      this.tituloDialog = "Registro tipo de tramite y requisitos";
      this.esRegistrar=true;
    }
    else {
      this.tituloDialog = "Edicion tipo de tramite y requisitos";
      this.nombreTramite = this.data.nombre_TipoTramite;
      this.listaRequistos = this.data.requistos_tramite.split(',');
      this.idRegistro=this.data.id_tipoTramte
      console.log(this.idRegistro)
    }
  }

  agregarRequisitos() {
    this.listaRequistos.push(this.nombreRequisito)
    this.recargarRequisitosTabla()
  }

  recargarRequisitosTabla() {
    this.tablaRequisitos!.renderRows(); //actulizar tabla
  }

  eliminarRequisito(posicion: number) {
    this.listaRequistos.splice(posicion, 1);
    this.recargarRequisitosTabla()
  }

  registrarTramite() {
    this.tipostramite.requistos_tramite = this.listaRequistos
    this.tipostramite.nombre_TipoTramite = this.nombreTramite
    this.tipoTramitesService.addTipoTramite(this.tipostramite).subscribe(resp => {
      console.log(resp)
      this.recargarRequisitosTabla()
    })
  }
  actualizarTramite(){
    this.tipostramite.requistos_tramite = this.listaRequistos
    this.tipostramite.nombre_TipoTramite = this.nombreTramite
    this.tipoTramitesService.putTipoTramite(this.idRegistro,this.tipostramite).subscribe(resp => {
      console.log(resp)
      this.recargarRequisitosTabla()
    })

  }


  GuardarTipoTramite(){
    if(this.esRegistrar===true){
      this.registrarTramite()
    }
    else{
      this.actualizarTramite()
    }

  }



}
