import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//UTILIDADES
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//material
import { MaterialModule } from './material/material.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { DialogTramitesRequisitosComponent } from './componentes/dialogs/dialogs-m2/dialog-tramites-requisitos/dialog-tramites-requisitos.component';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';

//providers
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';
import { DialogUsuariosComponent } from './componentes/dialogs/dialog-usuarios/dialog-usuarios.component';
import { DialogListaTramitesComponent } from './componentes/dialogs/dialog-lista-tramites/dialog-lista-tramites.component';
import { DialogInstitucionComponent } from './componentes/dialogs/dialogs-m1/dialog-institucion/dialog-institucion.component';
import { DialogDependenciaComponent } from './componentes/dialogs/dialog-dependencia/dialog-dependencia.component';

import { TablaComponent } from './componentes/tabla/tabla.component';
import { DialogCargoComponent } from './componentes/dialogs/dialogs-m1/dialog-cargo/dialog-cargo.component';
import { LayoutModule } from '@angular/cdk/layout';

import { DialogCuentaComponent } from './componentes/dialogs/dialog-cuenta/dialog-cuenta.component';
import { DialogDetallesComponent } from './componentes/dialogs/dialog-detalles/dialog-detalles.component';
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { AdmConfiguracionComponent } from './modulos/administracion-usuarios/adm-configuracion/adm-configuracion.component';
import { AdmTramiteComponent } from './modulos/registro-tramites/adm-tramite/adm-tramite.component';
import { BandejaEntradaComponent } from './modulos/registro-tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './modulos/registro-tramites/bandeja-salida/bandeja-salida.component';
import { DialogRequisitosComponent } from './componentes/dialogs/dialogs-m2/dialog-requisitos/dialog-requisitos.component';
import { DialogRegistrarTramiteComponent } from './componentes/dialogs/dialogs-m3/dialog-registrar-tramite/dialog-registrar-tramite.component';
import { DialogRemisionComponent } from './componentes/dialogs/dialogs-m3/dialog-remision/dialog-remision.component';
import { FichaTramiteComponent } from './modulos/registro-tramites/ficha-tramite/ficha-tramite.component';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DialogObservacionesComponent } from './componentes/dialogs/dialogs-m3/dialog-observaciones/dialog-observaciones.component';
import { SeguimientoTramitesComponent } from './modulos/seguimiento-tramites/seguimiento-tramites.component';
import { ReportesComponent } from './modulos/reportes/reportes.component'
import { ConsultaComponent } from './paginas/consulta/consulta.component';
import { AdmFuncionarioComponent } from './modulos/administracion-usuarios/adm-funcionario/adm-funcionario.component';
import { LoginService } from './servicios/servicios-m1/login.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    TramitesRequisitosComponent,
    DialogTramitesRequisitosComponent,
    RegistroTramitesComponent,
    AdministracionUsuariosComponent,
    DialogUsuariosComponent,
    DialogListaTramitesComponent,
    DialogInstitucionComponent,
    DialogDependenciaComponent,
    TablaComponent,
    DialogCargoComponent,
    DialogCuentaComponent,
    DialogDetallesComponent,
    NavegacionComponent,
    AdmConfiguracionComponent,
    AdmTramiteComponent,
    BandejaEntradaComponent,
    BandejaSalidaComponent,
    DialogRequisitosComponent,
    DialogRegistrarTramiteComponent,
    DialogRemisionComponent,
    FichaTramiteComponent,
    DialogObservacionesComponent,
    SeguimientoTramitesComponent,
    ReportesComponent,
    ConsultaComponent,
    AdmFuncionarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    NgxGraphModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    NgxChartsModule
    
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {provide:HTTP_INTERCEPTORS, useClass:LoginService, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
