import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Requerimientos } from 'src/app/modelos/tramites-requisitos/Requerimientos';

@Component({
  selector: 'app-dialog-requisitos',
  templateUrl: './dialog-requisitos.component.html',
  styleUrls: ['./dialog-requisitos.component.css']
})
export class DialogRequisitosComponent implements OnInit {
  TiposDoc = [
    { id_documento: 1, titulo: "Carnet de indetidad" },
    { id_documento: 2, titulo: "Pasaporte" }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public requisito: Requerimientos) { }

  ngOnInit(): void {
  }

}
