import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom, mergeScan } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogCuentaComponent } from 'src/app/componentes/dialogs/dialog-cuenta/dialog-cuenta.component';
import Swal from 'sweetalert2';
import { Mensajes } from 'src/app/componentes/mensaje/mensaje';
@Component({
  selector: 'app-adm-cuenta',
  templateUrl: './adm-cuenta.component.html',
  styleUrls: ['./adm-cuenta.component.css']
})
export class AdmCuentaComponent implements OnInit {
  msg=new Mensajes()

  dataSource:any
  DatosCuentas:any[]=[]
  DatosRegistro:any

  displayedColumns= [
    {key:"Dni", titulo:"DNI"},
    {key:"Nombre", titulo:"NOMBRE"},
    {key:"Apellido_P", titulo:"PATERNO"},
    {key:"Apellido_M", titulo:"MATERNO"},
    {key:"login", titulo:"LOGIN"},
    {key:"NombreCar", titulo:"CARGO"},
    {key:"NombreDep", titulo:"DEPENDENCIA"},
    {key:"SiglaInst", titulo:"INSTITUCION"},
    {key:"Opciones", titulo:"OPCIONES"}
  ]

  

  constructor(private usuariosService: UsuariosService, public dialog: MatDialog) {
    this.obtener_CuentasAsignadas()
  }
  ngOnInit(): void {

  }
  obtener_CuentasAsignadas(){
    this.usuariosService.getCuentasAsignadas().subscribe((resp:any)=>{
      if(resp.ok){
        this.dataSource=new MatTableDataSource(resp.Cuentas)
      }
    })
  }
  obtener_CuentasSinAsignar(){
    this.usuariosService.getCuentasNoAsignadas().subscribe((resp:any)=>{
      if(resp.ok){   
        this.dataSource=new MatTableDataSource(resp.Cuentas)
        
      }
    })
  }
  
  EditarCuenta(id:any){
    const dialogRef = this.dialog.open(DialogCuentaComponent, {
      data: this.DatosRegistro
    })
  }

  //metodo para colocar id_funcionario en null en la cuenta
  FinalizarCargo(datos:any){
    let id_cuenta:number=datos.id_cuenta;
    let NombreFuncionario:string=`${datos.Nombre} ${datos.Apellido_P} ${datos.Apellido_M}`
    let Dni:number=datos.Dni
    let Cargo:string=datos.NombreCar
    Swal.fire({
      icon:'question',
      title: `Finalizar el cargo "${Cargo.toLocaleUpperCase()}" del funcionario: "${NombreFuncionario}" con DNI: ${Dni}`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.finalizarCuenta(id_cuenta).subscribe((resp:any)=>{
          if(resp.ok){

            // Reigstrar finalizacion del cargo
            let detallesTrabajoFuncionario = {
              id_funcionario:datos.id_funcionario,
              id_cargo: datos.id_cargo,
              detalle: "Finalizo",
              fecha:this.getFecha()
            }
            this.usuariosService.addDetallesUsuarios(detallesTrabajoFuncionario).subscribe()
            
            this.msg.mostrarMensaje("success", resp.message)
          }
        })
      }
    })
    
  }
  
  MostrarCuentas(asignados:boolean){
    if(asignados){
      this.obtener_CuentasAsignadas()
    }
    else{
      this.obtener_CuentasSinAsignar()
    }
  }
  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }





   





}
