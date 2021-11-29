import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTramitesRequisitosComponent } from 'src/app/componentes/dialogs/dialog-tramites-requisitos/dialog-tramites-requisitos.component';

//servicios
import { TipoTramitesService } from '../../servicios/tipo-tramites.service';

//modelos
import { TiposTramite } from '../../modelos/tramites-requisitos'
@Component({
  selector: 'app-tramites-requisitos',
  templateUrl: './tramites-requisitos.component.html',
  styleUrls: ['./tramites-requisitos.component.css']
})
export class TramitesRequisitosComponent implements OnInit {

  //configuracion tabla
  displayedColumns: string[] = ['numero', 'nombre', 'opciones'];
  listaTiposTramites = []
  constructor(
    public dialog: MatDialog,
    private tipoTramitesService: TipoTramitesService
  ) { }

  ngOnInit(): void {
    this.cargarTiposTramites()
  }
  

  agregarTramiteyRequisito() {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent)
    
    dialogRef.afterClosed().subscribe(datosFormulario => {
      this.cargarTiposTramites()
    });
  }
  editarTramiteyRequisito(tipoTramite:any) {
    const dialogRef = this.dialog.open(DialogTramitesRequisitosComponent,
      {
        // width: '250px',
        data: tipoTramite
      });
      // this.cargarTiposTramites()
      dialogRef.afterClosed().subscribe(datosFormulario => {
        this.cargarTiposTramites()
      });
  }
  cargarTiposTramites(){
    this.tipoTramitesService.getTipoTramite().subscribe((resp:any)=>{
      this.listaTiposTramites=resp.tipoTramite
      
    })
  }
  eliminarTramiteyRequisito(id:string){
    this.tipoTramitesService.deleteTipoTramite(id).subscribe((resp:any)=>{
      this.cargarTiposTramites()
    })
    
  }

  


}
