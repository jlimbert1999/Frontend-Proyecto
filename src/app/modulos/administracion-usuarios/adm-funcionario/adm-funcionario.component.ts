import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adm-funcionario',
  template: `
    <app-tabla   [TiposOpciones]="['Editar', 'Eliminar', 'VerDetalles']"></app-tabla>
  `,
  styles: [
  ]
})
export class AdmFuncionarioComponent implements OnInit {
  @Input() dataDialog_Usuarios: any;
  constructor() { }

  ngOnInit(): void {
  }


}
