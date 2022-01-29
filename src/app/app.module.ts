import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//UTILIDADES
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { AdmInstitucionComponent } from './modulos/administracion-usuarios/adm-institucion/adm-institucion.component';
import { DialogInstitucionComponent } from './componentes/dialogs/dialog-institucion/dialog-institucion.component';
import { AdmDependenciaComponent } from './modulos/administracion-usuarios/adm-dependencia/adm-dependencia.component';
import { DialogDependenciaComponent } from './componentes/dialogs/dialog-dependencia/dialog-dependencia.component';
import { FiltroComponent } from './componentes/filtro/filtro.component';
import { TablaComponent } from './componentes/tabla/tabla.component';
import { ToolbarComponent } from './componentes/toolbar/toolbar.component';
import { AdmCargoComponent } from './modulos/administracion-usuarios/adm-cargo/adm-cargo.component';
import { DialogCargoComponent } from './componentes/dialogs/dialog-cargo/dialog-cargo.component';
import { LayoutModule } from '@angular/cdk/layout';

import { AdmCuentaComponent } from './modulos/administracion-usuarios/adm-cuenta/adm-cuenta.component';
import { DialogCuentaComponent } from './componentes/dialogs/dialog-cuenta/dialog-cuenta.component';
import { DialogDetallesComponent } from './componentes/dialogs/dialog-detalles/dialog-detalles.component';
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { AdmFuncionarioComponent } from './modulos/administracion-usuarios/adm-funcionario/adm-funcionario.component';
import { AdmConfiguracionComponent } from './modulos/administracion-usuarios/adm-configuracion/adm-configuracion.component';
import { AdmTramiteComponent } from './modulos/registro-tramites/adm-tramite/adm-tramite.component';
import { BandejaEntradaComponent } from './modulos/registro-tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './modulos/registro-tramites/bandeja-salida/bandeja-salida.component';
import { DialogRequisitosComponent } from './componentes/dialogs/dialogs-m2/dialog-requisitos/dialog-requisitos.component';

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
    AdmInstitucionComponent,
    DialogInstitucionComponent,
    AdmDependenciaComponent,
    DialogDependenciaComponent,
    FiltroComponent,
    TablaComponent,
    ToolbarComponent,
    AdmCargoComponent,
    DialogCargoComponent,
    AdmCuentaComponent,
    DialogCuentaComponent,
    DialogDetallesComponent,
    NavegacionComponent,
    AdmFuncionarioComponent,
    AdmConfiguracionComponent,
    AdmTramiteComponent,
    BandejaEntradaComponent,
    BandejaSalidaComponent,
    DialogRequisitosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
