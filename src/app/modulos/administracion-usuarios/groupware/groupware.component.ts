import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';

@Component({
  selector: 'app-groupware',
  templateUrl: './groupware.component.html',
  styleUrls: ['./groupware.component.css']
})
export class GroupwareComponent implements OnInit {
  Funcionarios_Online: any[] = []
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.obtener_users_conectados()
    this.socketService.Escuchar('listar').subscribe((resp: any) => {
      this.Funcionarios_Online = resp
    })
  }
  obtener_users_conectados() {
    this.socketService.Emitir('getUsers_Activos', null).subscribe((resp: any) => {
      this.Funcionarios_Online = resp
    })
  }

}
