import { Component, OnInit } from '@angular/core';
import { CargoService } from '../../../servicios/servicios-m1/cargo.service'
import { CargoModel } from '../../../modelos/administracion-usuarios/cargo.model'
import { MatDialog } from '@angular/material/dialog';
import { DialogCargoComponent } from 'src/app/componentes/dialogs/dialog-cargo/dialog-cargo.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-adm-cargo',
  templateUrl: './adm-cargo.component.html',
  styleUrls: ['./adm-cargo.component.css']
})
export class AdmCargoComponent implements OnInit {
  Cargo: CargoModel = {
    Nombre: '',
    Responsable_regis: '',
    Activo: true,
    Fecha_creacion: '',
    Fecha_actualizacion: ''
  }
  cargosRegistradas: any = [];
  cargosEliminados: any = [];
  // displayedColumns = ['Nombre', 'Responsable_regis', 'Fecha_creacion', 'Activo', 'Opciones']
  dataSource = new MatTableDataSource(this.cargosRegistradas);
  displayedColumns = [
    {key:"Nombre", titulo:"NOMBRE"},
    {key:"Responsable_regis", titulo:"RESPONSABLE DE REGISTRO"},
    {key:"Fecha_creacion", titulo:"CREACION"},
    {key:"Activo", titulo:"HABILITADO"},
    {key:"Opciones", titulo:"OPCIONES"},

  ]
  checked:boolean=false

  constructor(
    private cargoService: CargoService,
    public dialog: MatDialog,
  ) {
    this.cargarCargos()

  }

  ngOnInit(): void {

  }
  registrarCargo() {
    const vacio={Activo:true} //para que dialog inicie en vacion
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: vacio
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Cargo = datosFormulario
        this.Cargo.Fecha_creacion = this.Cargo.Fecha_actualizacion = this.getFecha()
        this.Cargo.Responsable_regis = "Admin"
        this.cargoService.addCargo(this.Cargo).subscribe((res: any) => {
          if (res.ok) {
            this.cargarCargos()
          }

        })
      }
    });
  }
  cargarCargos() {
    this.cargosRegistradas=[];
    this.cargosEliminados=[];
    this.cargoService.getCargo().subscribe((resp: any) => {
      if (resp.ok) {
        resp.cargo.forEach((element: any) => {
          if (element.Activo == '1') {
            element.Activo = true
            this.cargosRegistradas.push(element)
          }
          else if (element.Activo == '0') {
            element.Activo = false
            this.cargosEliminados.push(element)
          }
        });
        this.dataSource = new MatTableDataSource(this.cargosRegistradas);
        this.checked=false
      }
    })
  }

  editarCargo(datos:any){
    let id=datos.id_cargo;
    const dialogRef = this.dialog.open(DialogCargoComponent, {
      data: datos
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        this.Cargo = datosFormulario
        this.Cargo.Fecha_actualizacion = this.getFecha()
        this.Cargo.Responsable_regis = "Admin"
        this.cargoService.putCargo(id, this.Cargo).subscribe((res: any) => {
          if (res.ok) {
            this.cargarCargos()
            console.log(res.message);
          }
        })
      }
    });
  }
  eliminarCargo(){
    
  }

  getFecha(): string {
    let dateObj = new Date();
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
  aplicarFiltro(event: Event, activos: boolean) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.cargosEliminados);
      }
      else {
        this.dataSource = new MatTableDataSource(this.cargosRegistradas);
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      if (activos) {
        this.dataSource = new MatTableDataSource(this.cargosEliminados);
      }
      else {
        this.dataSource = new MatTableDataSource(this.cargosRegistradas);
      }
    }
  }

  mostrarNoHabilitados() {
    if (this.checked) {
      this.dataSource = new MatTableDataSource(this.cargosEliminados);

    } else {
      this.dataSource = new MatTableDataSource(this.cargosRegistradas);
    }

  }

}
