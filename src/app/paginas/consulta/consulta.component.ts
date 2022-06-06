import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroTramiteService } from 'src/app/servicios/servicios-m3/registro-tramite.service';
import { ConsultaService } from 'src/app/servicios/servicios-m4/consulta.service';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { UpperCasePipe } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
const doc = new jsPDF()
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  Codigo_Tramite: string = ""
  Tramite: any //informacion del tramite
  Observaciones_Tramite: any[] = []
  displayedColumns: string[] = ['descripcion', 'estado', 'fecha_registro'];

  observaciones_tablaPDF = []
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);


  private _mobileQueryListener: () => void;
  instrucciones: boolean = true
  constructor(
    private tramiteService: RegistroTramiteService,
    private consultaService: ConsultaService,
    private _snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);

  ngOnInit(): void {
  }

  obtener_Observaciones(id_tramite: number) {
    this.Observaciones_Tramite = []
    this.tramiteService.getObservaciones(id_tramite).subscribe((resp: any) => {
      if (resp.ok) {
        this.observaciones_tablaPDF = resp.Observaciones
        let unicos: number[] = []
        let aux: any
        for (let i = 0; i < resp.Observaciones.length; i++) {
          const elemento = resp.Observaciones[i].id_cuenta;
          if (!unicos.includes(resp.Observaciones[i].id_cuenta)) {
            unicos.push(elemento);
          }
        }
        unicos.forEach((id: number) => {
          aux = resp.Observaciones.filter((obs: any) => obs.id_cuenta == id)
          this.Observaciones_Tramite.push(aux)
        })
      }
    })
  }
  Obtener_Informacion_Tramite(pin: any, dni: any) {
    if (pin == '' || dni == '') {
      this.abrir_Mensaje('Ingrese los campos')
    }
    else {
      this.Codigo_Tramite = this.Codigo_Tramite.trim()
      this.consultaService.get_InformacionTramite({ pin, dni }).subscribe((resp: any) => {
        if (resp.Tramite.length > 0) {
          this.Tramite = resp.Tramite[0]
          this.obtener_Observaciones(resp.Tramite[0].id_tramite)
          console.log( resp.Tramite[0]);
        }
        else {
          this.abrir_Mensaje('No se econtro el tramite. Debe apersonarse a la institucion')
        }
      })

    }
    // this.obtener_Observaciones(39)

  }
  abrir_Mensaje(Mensaje: string) {
    this._snackBar.open(Mensaje, '', {
      duration: 3000
    });
  }
  imprimir_observaciones() {
    let img = new Image()
    img.src = '../../assets/img/logoSacaba.png'
    doc.addImage(img, 'png', 170, 1, 30, 30)
    doc.setFontSize(16)
    doc.text(`Observaciones tramite: ${this.Codigo_Tramite}`, 20, 10)
    doc.setFontSize(10);
    doc.text(`Solicitante: ${this.Tramite.nombres} ${this.Tramite.paterno} ${this.Tramite.materno}`, 30, 20)
    doc.text(`CI: ${this.Tramite.expedido.toLowerCase()} ${this.Tramite.dni}`, 30, 25)

    let campos: string[][] = []
    this.observaciones_tablaPDF.forEach((element: any) => {
      if(!element.situacion){
        campos.push([element.NombreDep,`${element.Nombre} ${element.Apellido_P} ${element.Apellido_M}`, element.NombreCar, element.detalle])

      }
      
    })
    autoTable(doc, {
      startY: 35,
      head: [['Area', 'Funcionario', 'Cargo', 'Observacion']],
      body: campos
    })
    doc.save('Observaciones.pdf')
  }



}
