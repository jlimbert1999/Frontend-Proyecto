import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/servicios/servicios-m1/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-dialog-detalles',
  templateUrl: './dialog-detalles.component.html',
  styleUrls: ['./dialog-detalles.component.css']
})
export class DialogDetallesComponent implements OnInit {
  displayedColumns: string[] = ['Fecha', 'Detalle', 'Cargo'];
  dataSource = new MatTableDataSource();
  detalles_Funcionario: any

  constructor(
    public dialogRef: MatDialogRef<DialogDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuariosService: UsuariosService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // data=contiene el id del funcionario recibido desde admin usuarios
    this.usuariosService.getDetallesUsuarios(this.data.id_funcionario).subscribe((resp: any) => {
      if (resp.ok) {
        this.dataSource.data = resp.Detalles
      }
    })
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
