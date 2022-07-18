import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';  

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data = new MatTableDataSource<any>();;
  @Input() displayedColumns: any = [];
  @Input() Titulos: any = []
  @Input() palabraFiltro: any = "";
  @Output() llamarEditar: EventEmitter<object>;
  @Output() llamarEliminar: EventEmitter<object>;
  @Output() llamarHabilitar: EventEmitter<object>;
  @Output() llamarFinalizar: EventEmitter<object>;
  @Output() llamarVerDetalles: EventEmitter<object>;
  @Output() llamarImprimir: EventEmitter<object>;
  @Output() llamarRemision: EventEmitter<object>;
  @Output() llamarRevision: EventEmitter<object>;
  @Output() llamarVerFlujo: EventEmitter<object>;
  @Input() TiposOpciones: string[] = [];
  TitulosTabla: string[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLargeScreen: boolean = false;


  ngAfterViewInit(): void {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }




  constructor(private breakpointObserver: BreakpointObserver
  ) {
    this.llamarEditar = new EventEmitter();
    this.llamarHabilitar=new EventEmitter()
    this.llamarEliminar = new EventEmitter();
    this.llamarFinalizar = new EventEmitter();
    this.llamarVerDetalles = new EventEmitter();
    this.llamarImprimir = new EventEmitter();
    this.llamarRemision = new EventEmitter();
    this.llamarRevision = new EventEmitter();
    this.llamarVerFlujo = new EventEmitter();
    // setTimeout(() => this.data.paginator = this.pag  inator);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.displayedColumns) {
      this.TitulosTabla = this.displayedColumns.map((titulo: any) => titulo.key);
      this.TitulosTabla.push("Opciones")
    }

  }


  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(min-width: 600px)'
    ]).pipe(
      tap(result => this.isLargeScreen = result.matches)
    ).subscribe(result => {
      if (result.matches) {
        
        this.data.paginator = this.paginator;
      } else {
        this.data.paginator = null;
      }
    });
  }
  editarDatos(datos: object, pos: number) {
    this.llamarEditar.emit(datos);
  }
  eliminarDatos(id: object) {
    this.llamarEliminar.emit(id)
  }
  HabilitarDatos(id: object) {
    this.llamarHabilitar.emit(id)
  }

  //METODOS EXCLUSIVO PARA ADMNISTRACION CUENTA
  finalizarCargo(datos: object) {
    this.llamarFinalizar.emit(datos)
  }
  //METODOS EXCLUSIVO PARA ADMNISTRACION USUARIOS/FUNCIONARIOS
  verDetallesUsuario(datos: any) {
    this.llamarVerDetalles.emit(datos)
  }
  verFlujoTrabajo(datos: any) {
    this.llamarVerFlujo.emit(datos)
  }

  imprimirFicha(tramite: any) {
    this.llamarImprimir.emit(tramite)
  }
  remitir(datos: any, pos: number) {
    let data: any = datos
    data['posicion'] = pos
    this.llamarRemision.emit(data)
  }
  revisar(datos: any) {
    this.llamarRevision.emit(datos)
  }


}
