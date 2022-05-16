import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogRegistrarTramiteComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-registrar-tramite/dialog-registrar-tramite.component'
import { SolicitanteModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { DialogRemisionComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import decode from 'jwt-decode'
import { FichaTramiteComponent } from '../ficha-tramite/ficha-tramite.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-adm-tramite',
  templateUrl: './adm-tramite.component.html',
  styleUrls: ['./adm-tramite.component.css']
})
export class AdmTramiteComponent implements OnInit {

  // datos_tramiteArmados: any[] = [] //valores armandos para mostrar en la tabla
  lista_Tramites_Registrados: any[] = []
  dataSource = new MatTableDataSource();
  displayedColumns: any[] = []
  opcionesTabla: string[] = []
  Info_cuenta_actual = this.decodificarToken()

  
  constructor(
    private tramiteService: RegistroTramiteService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit(): void {
   this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
  }

  registrar_Tramite() {
    const dialogRef = this.dialog.open(DialogRegistrarTramiteComponent, {
      width:'100%',
      data: {}
    });
    dialogRef.afterClosed().subscribe((dataDialog: TramiteModel) => {
      if (dataDialog) {
        this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
      }
    });
  }
  editar_tramite(datosTramite: any) {
    const dialogRef = this.dialog.open(DialogRegistrarTramiteComponent, {
      data: datosTramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: TramiteModel) => {
      if (dataDialog) {
        this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
      }
    });
  }
  
  obtener_Tramites_Registrados(id_cuenta: number) {
    this.crear_tabla_tramites()
    this.tramiteService.getTramites(id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
       
        resp.Tramites.forEach((element: any) => { //armar nombre
          element.solicitante = `${element.nombres} ${element.paterno} ${element.materno}`;
          element.enviado=element['IF(t5.id_tramite is null, true, false)']?false:true;
        })
        this.lista_Tramites_Registrados = resp.Tramites
        this.dataSource.data = this.lista_Tramites_Registrados
      }
    })
  }
  crear_tabla_tramites(){
    this.displayedColumns = [
      { key: "enviado", titulo: "Enviado" },
      { key: "alterno", titulo: "Codigo" },
      { key: "titulo", titulo: "Tipo de Tramite" },
      { key: "solicitante", titulo: "Solicitante" },
      { key: "estado", titulo: "Estado" },
      { key: "Fecha_creacion", titulo: "Fecha" }
    ]
    this.opcionesTabla = ['Imprimir', 'Editar', 'Remitir', 'Revisar', 'VerFlujo']

  }

  imprimir_ficha(tramite: any) {
    const fecha = new Date(parseInt(tramite.Fecha_creacion))
    const doc = new jsPDF();
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 0, 0, 50, 50)
    doc.setFontSize(22)
    doc.text('Gobierno Autonomo Municipal de Sacaba', 60, 10)
    doc.setFontSize(16);
    doc.text(`Tipo de tramite: ${tramite.titulo}`, 60, 20)
    doc.text(`Fecha registro: ${fecha.toLocaleString()}`, 60, 30)
    doc.text(`Numero de tramite: ${tramite.alterno}`, 60, 40)
    doc.text(`Solicitante: ${tramite.expedido} ${tramite.dni} - ${tramite.nombres} ${tramite.paterno} ${tramite.materno}`, 60, 50)
    doc.save('ficha.pdf');

  }



  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrir_DialogRemision(datosTramite: any) {
    // datosTramite contiene data de la tabla y la su posicion
    let tramite = {
      id_tramite: datosTramite.datos.id_tramite,
      Titulo: datosTramite.datos.titulo,
      Alterno: datosTramite.datos.alterno,
      Mensaje:''
    }
    //enviar id para que las bandeja obtengan datos desde la trabla workflow

    let snackBarRef = this._snackBar.openFromComponent(DialogRemisionComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar'],
      data: tramite
    });
    // snackBarRef.onAction().subscribe(() => {
    //   this.datos_tramiteArmados.splice(datosTramite.pos, 1);
    //   this.dataSource.data = this.datos_tramiteArmados
    // })

  }
  abrir_FichaTramite(datosTramite: any) {
    this.router.navigate(['Tramites/ficha', datosTramite.id_tramite])

  }
  abrir_Workflow(datos: any) {
    this.router.navigate(['Workflow', datos.id_tramite])
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }
  









}
