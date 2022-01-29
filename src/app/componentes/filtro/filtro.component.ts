import { Component, Input, OnInit } from '@angular/core';

import {MatTableDataSource} from '@angular/material/table';
import { IntitucionModel } from 'src/app/modelos/administracion-usuarios/institucion.model';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  @Input() data:any=[];
  dataSource = new MatTableDataSource(this.data);
  constructor() { }
  @Input() displayedColumns:any=[]
  

  ngOnInit(): void {
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue!==""){     
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else{
      this.dataSource= new MatTableDataSource(this.data);
    }
  }

}
