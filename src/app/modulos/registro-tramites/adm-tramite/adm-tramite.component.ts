import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adm-tramite',
  templateUrl: './adm-tramite.component.html',
  styleUrls: ['./adm-tramite.component.css']
})
export class AdmTramiteComponent implements OnInit {

  // datos_tramiteArmados: any[] = [] //valores armandos para mostrar en la tabla
  lista_Tramites_Registrados: any[] = []
  ejem: TramiteModel[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: any[] = [];
  opcionesTabla: string[] = [];
  Info_cuenta_actual = this.decodificarToken();
  modo_busqueda: boolean = false;
  carga_spiner: boolean = false;

  // responsive
  destroyed = new Subject<void>();
  currentScreenSize: string;

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private tramiteService: RegistroTramiteService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {

            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            if (this.currentScreenSize == "XSmall") {
              this.displayedColumns = [
                { key: "alterno", titulo: "Codigo" },
                { key: "titulo", titulo: "Tipo de Tramite" }
              ]
            }
            else  {
              this.displayedColumns = [
                { key: "enviado", titulo: "Enviado" },
                { key: "alterno", titulo: "Codigo" },
                { key: "titulo", titulo: "Tipo de Tramite" },
                { key: "solicitante", titulo: "Solicitante" },
                { key: "estado", titulo: "Estado" },
                { key: "Fecha_creacion", titulo: "Fecha" }
              ]
            }
          }
        }
      });

  }

  ngOnInit(): void {
    console.log(this.Info_cuenta_actual);
    this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
    if(this.currentScreenSize=='XSmall'){
      this.displayedColumns = [
        { key: "alterno", titulo: "Codigo" },
        { key: "titulo", titulo: "Tipo de Tramite" }
      ]
    }
 
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  obtener_Tramites_Registrados(id_cuenta: number) {
    this.carga_spiner = true
    this.crear_tabla_tramites()
    this.tramiteService.getTramites(id_cuenta).subscribe((resp: any) => {
      if (resp.ok) {
        resp.Tramites.forEach((element: any) => { //armar nombre
          element['solicitante'] = `${element.nombres} ${element.paterno} ${element.materno}`;
          element['enviado'] = element['enviado'] ? false : true;
        })
        this.lista_Tramites_Registrados = resp.Tramites
        this.dataSource.data = this.lista_Tramites_Registrados
        this.carga_spiner = false
      }
    })
  }


  registrar_Tramite() {
    const dialogRef = this.dialog.open(DialogRegistrarTramiteComponent, {
      data: {},
      width:'900px'
    });
    dialogRef.afterClosed().subscribe((dataDialog: TramiteModel) => {
      if (dataDialog) {
        this.lista_Tramites_Registrados.unshift(dataDialog)
        this.dataSource.data = this.lista_Tramites_Registrados
        this.openSnackBar('Tramite registrado')
        // this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
      }
    });
  }
  editar_tramite(datosTramite: any) {
    const dialogRef = this.dialog.open(DialogRegistrarTramiteComponent, {
      data: datosTramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        const rightIndex = this.lista_Tramites_Registrados.findIndex((item: any) => item.id_tramite == dataDialog.id_tramite);
        this.lista_Tramites_Registrados[rightIndex] = dataDialog;
        this.dataSource.data = this.lista_Tramites_Registrados
        // this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
      }
    });
  }


  crear_tabla_tramites() {
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
    const doc = new jsPDF('p', 'mm', [60, 90]);
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 20, 0, 20, 20)
    doc.setFontSize(8)
    doc.text("Gobierno Autonomo Municipal de Sacaba", 30, 25, undefined, "center");
    doc.setFontSize(6);
    doc.text(`Tipo de tramite: ${tramite.titulo}`, 30, 30, {
      maxWidth: 40,
      align: 'center'
    })
    doc.text(`Fecha registro: ${fecha.toLocaleString()}`, 30, 40, undefined, 'center')
    doc.text(`Numero de tramite: ${tramite.alterno}`, 30, 45, undefined, 'center')
    doc.text(`Solicitante: ${tramite.expedido} ${tramite.dni} - ${tramite.solicitante}`, 30, 50, undefined, 'center')
    doc.setFont("times", 'italic');
    doc.text(`Para la cosulta ingrese a:`, 30, 65, undefined, 'center')
    doc.text(`https://siste-sacaba.herokuapp.com/Consulta `, 30, 70, undefined, 'center')
    doc.setFont("times", 'normal');
    doc.text(`Firma ..................`, 30, 85, undefined, 'center')
    // doc.output('dataurlnewwindow', { filename: 'ficha.pdf' })
    doc.autoPrint()
    doc.output('dataurlnewwindow')
  }



  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  agrupar_tramites(estado: string) {
    if (estado == 'Todos') {
      this.dataSource.data = this.lista_Tramites_Registrados
    }
    else {
      this.dataSource.data = this.lista_Tramites_Registrados.filter((elemet: any) => elemet.estado == estado)
    }
  }

  abrir_DialogRemision(datosTramite: any) {
    let tramite = {
      id_tramite: datosTramite.id_tramite,
      Titulo: datosTramite.titulo,
      Alterno: datosTramite.alterno,
      Mensaje: '',
      Estado: datosTramite.estado,
      Posicion: datosTramite.posicion
    }
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: tramite
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        const rightIndex = this.lista_Tramites_Registrados.findIndex((item: any) => item.id_tramite == dataDialog.id_tramite);
        this.lista_Tramites_Registrados[rightIndex].enviado = true;
        this.lista_Tramites_Registrados[rightIndex].estado = dataDialog.Estado;
        this.dataSource.data = this.lista_Tramites_Registrados
        // this.obtener_Tramites_Registrados(this.Info_cuenta_actual.id_cuenta)
      }
    });

  }
  abrir_FichaTramite(datosTramite: any) {
    this.router.navigate(['Tramites/ficha', datosTramite.id_tramite])

  }
  abrir_Workflow(datos: any) {
    this.router.navigate(['inicio/Workflow', datos.id_tramite])
  }
  decodificarToken(): any {
    let token: any = localStorage.getItem('token')
    return decode(token)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      duration: 5000
    });
  }

  desactivar_busqueda() {
    this.dataSource.filter = ""
    this.modo_busqueda = false
  }











}
