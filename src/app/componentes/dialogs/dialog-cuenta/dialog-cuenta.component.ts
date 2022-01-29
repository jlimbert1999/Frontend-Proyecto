import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-cuenta',
  templateUrl: './dialog-cuenta.component.html',
  styleUrls: ['./dialog-cuenta.component.css']
})
export class DialogCuentaComponent implements OnInit {
  panelOpenState = false;
  hide = true;
  constructor() { }
 

  ngOnInit(): void {
  }

}
