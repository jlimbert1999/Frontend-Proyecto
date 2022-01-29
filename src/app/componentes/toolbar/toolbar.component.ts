import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  verActivos:boolean=true;
  tituloVista:string="Ver no Activos";
  @Input() titulo:string='';
  // @Input() color:string='';
  @Output() llamarAgregar: EventEmitter<any>;
  @Output() llamarVerNoActivos: EventEmitter<any>;
  constructor() { 
    this.llamarAgregar = new EventEmitter();
    this.llamarVerNoActivos = new EventEmitter();
  }

  ngOnInit(): void {
  }
  agregar(){
    this.llamarAgregar.emit()
  }
  VerNoActivos(){
    this.verActivos=!this.verActivos
    if(this.verActivos){
      this.tituloVista="Ver no activos"
    }
    else{
      this.tituloVista="Ver Activos"
    }

    this.llamarVerNoActivos.emit(this.verActivos)
  }

}
