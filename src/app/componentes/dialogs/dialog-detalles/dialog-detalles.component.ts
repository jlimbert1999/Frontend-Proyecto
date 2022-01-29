import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';

@Component({
  selector: 'app-dialog-detalles',
  templateUrl: './dialog-detalles.component.html',
  styleUrls: ['./dialog-detalles.component.css']
})
export class DialogDetallesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuariosService: UsuariosService
  ) { }
  Detalles: string[] = []
  ngOnInit(): void {
    // data=contiene el id del funcionario recibido desde admin usuarios
    this.usuariosService.getDetallesUsuarios(this.data).subscribe((resp: any) => {
      if (resp.ok) {
        if (resp.Detalles.length <= 0) {
          this.Detalles.push("EL FUNCIONARIO NO TIENE REGISTROS SOBRE CARGOS INICIADOS O FINALIZADOS")
        }
        else {
          let texto: string
          resp.Detalles.forEach((element: any) => {
            texto = `El funcionario ${element.Nombre} ${element.Apellido_P} ${element.Apellido_M} ${element.detalle} el cargo ${element.NombreCar} en fecha: ${element.fecha}`
            this.Detalles.push(texto)
          });
          

        }
        

      }
    })
  }

}
