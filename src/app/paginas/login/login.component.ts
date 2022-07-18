import { Component, OnInit } from '@angular/core';

//UTILIDADES
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import decode from 'jwt-decode'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { LoginService } from 'src/app/servicios/servicios-m1/login.service';
import { SocketService } from 'src/app/servicios/servicios-m3/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msg = new Mensajes()
  datosLogin = {
    login: '',
    password: ''
  }

  constructor(
    private router: Router,
    private loginService: LoginService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.loginService.login(this.datosLogin).subscribe((res: any) => {
      if (res.ok) {
        this.socketService.Escuchar('listar').subscribe((resp: any) => {
          console.log('Usuarios conectados', resp);
        })
        this.guardarToken(res.token)
        this.unirse_Groupware()
        if (this.decodificarToken().Tipo == 'USER1_ROLE') {
          this.router.navigate(['inicio/administrar-tramite'])
        }
        else if (this.decodificarToken().Tipo == 'USER2_ROLE') {
          this.router.navigate(['inicio/bandeja-entrada'])
        }
        else{
          this.router.navigate(['inicio'])
        }

      }
      else {
        this.msg.mostrarMensaje('error', res.message)
      }
    })
  }
  guardarToken(token: string) {
    localStorage.setItem('token', token)
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
