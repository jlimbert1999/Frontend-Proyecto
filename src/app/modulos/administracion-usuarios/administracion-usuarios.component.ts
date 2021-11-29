import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { UsuarioModel } from 'src/app/modelos/usuario.model';

import { DialogUsuariosComponent } from '../../componentes/dialogs/dialog-usuarios/dialog-usuarios.component'
//material
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.css']
})
export class AdministracionUsuariosComponent implements OnInit {
  usuarios_registrados: UsuarioModel[] = []
  displayedColumns: string[] = []
  id_user: string = "";
  datos_Nuevos: UsuarioModel = {
    Nombre: "",
    Apellio_P: "",
    Apellido_M: "",
    Dni: "",
    Expedido: "",
    Telefono: "",
    Direccion: "",
    Activo: true
  }
  constructor(private usuariosService: UsuariosService, public dialog:MatDialog) { }

  ngOnInit(): void {
    this.cargar_Usuarios()
  }
  openDialog(usuario: any) {
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      // width: '250px',
      data: usuario
    });
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if(datosFormulario){
        this.actualizarUsuario(usuario.id_funcionario, datosFormulario)
      }
     
      // console.log(datosFormulario);
      
    });
  }

  cargar_Usuarios(){
    this.usuariosService.getUsuarios().subscribe((res: any) => {
      console.log(res);
      this.usuarios_registrados = res.usuarios
      this.displayedColumns = ['Nro', 'Nombre', 'Apellido P.', 'Apellido M.', 'Telefono', 'Direccion', 'Activo', 'Opciones'];
    })
  }
  eliminarUsuario(id: number) {
    console.log(id)
    this.usuariosService.deleteUsuarios(id).subscribe(resp => {
      console.log(resp)
      this.cargar_Usuarios();
    })
    
  }
  actualizarUsuario(id: number, datos:string) {
    this.usuariosService.putUsuarios(id, datos).subscribe(resp => {
      console.log(resp)
      this.cargar_Usuarios()
    })
  }
  agregarUsuario(){
    const dialogRef = this.dialog.open(DialogUsuariosComponent, {
      data:this.datos_Nuevos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      console.log(datosFormulario)
      if(datosFormulario){
        this.usuariosService.addUsuarios(datosFormulario).subscribe((resp:object)=>{
          console.log(resp)
          this.cargar_Usuarios()
        })
      }
    });
  }
    

}
