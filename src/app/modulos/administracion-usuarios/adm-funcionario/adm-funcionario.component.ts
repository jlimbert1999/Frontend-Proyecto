import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { Location } from '@angular/common';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje'
@Component({
  selector: 'app-adm-funcionario',
  templateUrl: './adm-funcionario.component.html',
  styles: [
    'body { font-weight: normal;}',
    '.avatar {width:200px; height:200px;}',
    '.form-group{margin-top:15px}'
  ]
})
export class AdmFuncionarioComponent implements OnInit {

  detallesCuenta: any
  datos_NuevosCuenta: any = {
    login: '',
    password: ''
  }
  id_cuenta: number = 0
  msg = new Mensajes()
  hide = true;
  constructor(private activateRoute: ActivatedRoute, private _location: Location, private userService: UsuariosService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id_cuenta = params['id']
      this.obtener_datosCuenta(this.id_cuenta)
    });
  }
  obtener_datosCuenta(id_cuenta: number) {
    this.userService.getDetallesCuenta(id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {

        this.detallesCuenta = resp.Detalles[0]
        // this.datos_NuevosCuenta.login=this.detallesCuenta.login
      }
    })

  }
  cancelar() {
    this._location.back();
  }
  actualizar_datosCuenta() {
    this.userService.putCuenta(this.id_cuenta, this.datos_NuevosCuenta).subscribe((resp: any) => {
      if (resp.ok) {
        this.msg.mostrarMensaje('success', resp.message)
        this._location.back();
      }
    })

  }




}
