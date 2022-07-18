import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entorno } from '../api-config'
import { TramiteModel } from 'src/app/modelos/registro-tramites/resistro-tramites.model';
import { RepresentanteModel, SolicitanteModel, SolicitudModel } from 'src/app/modelos/registro-tramites/solicitante.model';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroTramiteService {
  private URL = entorno.baseUrl;

  constructor(private http: HttpClient) { }
  addTramite(tramite: TramiteModel) {
    return this.http.post(`${this.URL}/tramite`, tramite)
  }
  getTramites(id_cuenta: number) {  //tramites registrados por esta cuenta
    return this.http.get(`${this.URL}/api/tramites/${id_cuenta}`)
  }
  putTramite(id: number, datos: any) {
    return this.http.put(`${this.URL}/tramite/${id}`, datos)
  }



  addSolicitante(solicitante: SolicitanteModel) {
    return this.http.post(`${this.URL}/solicitante`, solicitante)
  }
  getSolicitate_PorTramite(id_tramite: number) {
    return this.http.get(`${this.URL}/solicitante/${id_tramite}`)
  }
  putSolicitante(id: number, datos: any) {
    return this.http.put(`${this.URL}/solicitante/${id}`, datos)
  }


  addRepresentante(representante: RepresentanteModel) {
    return this.http.post(`${this.URL}/representante`, representante)
  }
  getRepresentante_PorTramite(id_tramite: number) {
    return this.http.get(`${this.URL}/representante/${id_tramite}`)
  }
  putRepresentante(id: number, datos: any) {
    return this.http.put(`${this.URL}/representante/${id}`, datos)
  }

  addSolicitud(solicitud: SolicitudModel) {
    return this.http.post(`${this.URL}/solicitud`, solicitud)
  }
  putSolicitud(id_solicitud: number, datos: any) {
    return this.http.put(`${this.URL}/solicitud/${id_solicitud}`, datos)
  }
  getRequisitos_presentados(id_tramite: number) {
    return this.http.get(`${this.URL}/requisitos_presentados/${id_tramite}`)
  }


  //CONECCION WORKFLOW
  addtFlujoTrabajo(datos: any) {
    return this.http.post(`${this.URL}/workflow`, datos)
  }



  //Obtener datos ficha
  getFicha_InfoTramite(id_tramite: number) {
    return this.http.get(`${this.URL}/ficha-tramite/${id_tramite}`)
  }
  getFicha_InfoSolicitante(id_tramite: number) {
    return this.http.get(`${this.URL}/ficha-solicitante/${id_tramite}`)
  }
  getFicha_InfoRepresentante(id_tramite: number) {
    return this.http.get(`${this.URL}/ficha-representante/${id_tramite}`)
  }
  getFicha_InfoRequerimientos(id_tramite: number) {
    return this.http.get(`${this.URL}/ficha-requisitos_presentados/${id_tramite}`)
  }

  //obtener datos emisor
  getMail_DatosEmisor(id_tramite: number) {
    return this.http.get(`${this.URL}/mail-emisor/${id_tramite}`)
  }

  //info de un funcionario
  getDatosFuncionario(id_cuenta: number) {
    return this.http.get(`${this.URL}/detalles-funcionario/${id_cuenta}`)
  }
  // Info de user dentro de un workflow
  getUser_Workflow(id_cuenta: number) {
    return this.http.get(`${this.URL}/detalles-funcionario-workflow/${id_cuenta}`)
  }


  //observaciones
  addObservacion(datos: any) {
    return this.http.post(`${this.URL}/observacion`, datos)
  }
  getObservaciones(id_tramite: number) {
    return this.http.get(`${this.URL}/observaciones/${id_tramite}`)
  }
  putObservacion(id_tramite: number, datos: any) {
    return this.http.put(`${this.URL}/observacion/${id_tramite}`, datos)
  }
  getObservaciones_deUsuario(id_cuenta: number) {
    return this.http.get(`${this.URL}/observacion-usuario/${id_cuenta}`)
  }

  //detalles envio
  getDetalles_Envio(id_tramite: number) {
    return this.http.get(`${this.URL}/detalles-envio/${id_tramite}`)
  }

  //getrequisitos presentados
  getRequisitos_Tramite(id_tramite: number) {
    return this.http.get(`${this.URL}/requisitos-presentados/${id_tramite}`)
  }

  //aceptar tramite
  putWorkflow_AceptarTramite(datos: any, id_tramite: number) {
    return this.http.put(`${this.URL}/workflow-aceptarTramite/${id_tramite}`, datos)
  }
  putWorkflow(datos: any, id_tramite: number) {
    return this.http.put(`${this.URL}/workflow/${id_tramite}`, datos)
  }

  getFuncionarioEspecifico(datos: any) {
    //revisar post para get
    return this.http.get(`${this.URL}/api/funcionarios_especificos?insti=${datos.id_institucion}&dep=${datos.id_dependencia}`)
  }

  getReporte() {
    return this.http.get(`${this.URL}/reporte`)
  }
  getReporteFlujo(alterno: any) {
    return this.http.post(`${this.URL}/reporte-flujo`, alterno)
  }




}
