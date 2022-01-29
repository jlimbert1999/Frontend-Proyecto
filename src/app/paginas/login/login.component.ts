import { Component, OnInit } from '@angular/core';

//UTILIDADES
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/servicios-m1/usuarios.service'
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  datosLogin = {
    login: '',
    password: ''
  }
  msg = new Mensajes()

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }

  login() {
    this.usuariosService.login(this.datosLogin).subscribe((res: any) => {
      if (res.ok) {
        this.guardarToken(res.token)
        this.router.navigate(['inicio'])
      }
      else {
        this.msg.mostrarMensaje('error', res.message)
      }
    })
  }
  guardarToken(token: string) {
    localStorage.setItem('token', token)
  }


}
