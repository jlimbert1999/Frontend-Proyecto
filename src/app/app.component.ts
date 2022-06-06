import { Component } from '@angular/core';
import { SocketService } from './servicios/servicios-m3/socket.service';
import decode from 'jwt-decode'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  constructor(private socketService: SocketService) {
    this.unirse_Groupware()

  }
  unirse_Groupware() {
    //enviar datos para ser indetificado dentro del groupware
    if (localStorage.getItem('token')) {
      let User = this.decodificarToken()
      let infoUser = {
        id_cuenta: User.id_cuenta,
        Nombre: User.Nombre,
        NombreCargo: User.NombreCargo
      }
      
      this.socketService.Emitir('unirse', infoUser).subscribe()
    }

  }

  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
}


