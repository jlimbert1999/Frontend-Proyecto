import { Component, OnInit } from '@angular/core';

//servicio
import {RegistroTramitesService} from '../../../servicios/registro-tramites.service';
@Component({
  selector: 'app-dialog-lista-tramites',
  templateUrl: './dialog-lista-tramites.component.html',
  styleUrls: ['./dialog-lista-tramites.component.css']
})
export class DialogListaTramitesComponent implements OnInit {
  listaTiposTramites = []
  displayedColumns: string[] = ['numero', 'nombre', 'tipo', 'estado', 'fecha'];
  constructor(private registroTramiteService:RegistroTramitesService) { }

  ngOnInit(): void {
    this.registroTramiteService.getTramite().subscribe((resp:any)=>{
      this.listaTiposTramites=resp.Tramite
      console.log(this.listaTiposTramites)
    })

  }

}
