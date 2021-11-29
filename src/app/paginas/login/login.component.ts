import { Component, OnInit } from '@angular/core';

//UTILIDADES
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  datosLogin = {
    username: '',
    password: ''
  }

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }
  login() {
    this.usuariosService.login(this.datosLogin).subscribe((res: any) => {
      if (res.ok && res.usuario != "") {
        this.guardarToken(res.token)
        this.router.navigate(['inicio'])
      }
    }, (err) => {

      console.log(err.error.err.message)
    })
  }
  guardarToken(token: string) {
    localStorage.setItem('token', token)
  }


}
