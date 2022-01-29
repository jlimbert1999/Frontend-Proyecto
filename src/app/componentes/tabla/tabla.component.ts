import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

//SERVICIOS
import { InstitucionService } from '../../servicios/servicios-m1/institucion.service'
import { DependenciaService } from '../../servicios/servicios-m1/dependencia.service'

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any;
  @Input() displayedColumns: any = [];
  @Input() Titulos: any = []
  @Input() palabraFiltro: any = "";
  @Output() llamarEditar: EventEmitter<object>;
  @Output() llamarEliminar: EventEmitter<object>;
  @Output() llamarFinalizar: EventEmitter<object>;
  @Output() llamarVerDetalles: EventEmitter<object>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() TiposOpciones: string[] = [];
  TitulosTabla: string[] = []



  constructor(
    instService: InstitucionService,
    depService: DependenciaService,
  ) {
    this.llamarEditar = new EventEmitter();
    this.llamarEliminar = new EventEmitter();
    this.llamarFinalizar = new EventEmitter();
    this.llamarVerDetalles = new EventEmitter();
    setTimeout(() => this.data.paginator = this.paginator);

  }
  ngAfterViewInit(): void {
    this.data.paginator = this.paginator;

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.displayedColumns!) {
      this.TitulosTabla = this.displayedColumns.map((titulo: any) => titulo.key);
      this.TitulosTabla.push("Opciones")
    }
  }


  ngOnInit(): void {
  }
  editarDatos(datos: object) {
    this.llamarEditar.emit(datos);
  }
  eliminarDatos(id: object) {
    this.llamarEliminar.emit(id)
  }

  //METODOS EXCLUSIVO PARA ADMNISTRACION CUENTA
  finalizarCargo(datos: object) {
    this.llamarFinalizar.emit(datos)
  }
  //METODOS EXCLUSIVO PARA ADMNISTRACION USUARIOS/FUNCIONARIOS
  verDetallesUsuario(datos: any) {
    this.llamarVerDetalles.emit(datos.id_funcionario)
  }



}
