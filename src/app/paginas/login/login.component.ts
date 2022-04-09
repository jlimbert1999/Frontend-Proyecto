import { Component, OnInit } from '@angular/core';

//UTILIDADES
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
import { LoginService } from 'src/app/servicios/servicios-m1/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msg = new Mensajes()
  datosLogin= {
    login: '',
    password: ''
  }

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.loginService.login(this.datosLogin).subscribe((res: any) => {
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
