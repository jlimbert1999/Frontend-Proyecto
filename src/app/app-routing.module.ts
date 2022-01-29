import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';
import { DialogListaTramitesComponent } from './componentes/dialogs/dialog-lista-tramites/dialog-lista-tramites.component';
import { AdmInstitucionComponent } from './modulos/administracion-usuarios/adm-institucion/adm-institucion.component';
import { AdmDependenciaComponent } from './modulos/administracion-usuarios/adm-dependencia/adm-dependencia.component';
import { AdmCargoComponent } from './modulos/administracion-usuarios/adm-cargo/adm-cargo.component';
import { AdmCuentaComponent } from './modulos/administracion-usuarios/adm-cuenta/adm-cuenta.component';
import { AdmConfiguracionComponent } from './modulos/administracion-usuarios/adm-configuracion/adm-configuracion.component';
import { AdmTramiteComponent } from './modulos/registro-tramites/adm-tramite/adm-tramite.component';
import { BandejaEntradaComponent } from './modulos/registro-tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './modulos/registro-tramites/bandeja-salida/bandeja-salida.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'Usuarios', component: AdministracionUsuariosComponent,
    children: [
      { path: 'cuentas', component: AdmCuentaComponent }
    ]
  },
  {
    path: 'Configuraciones', component: AdmConfiguracionComponent,
    children: [
      { path: 'instituciones', component: AdmInstitucionComponent },
      { path: 'dependencias', component: AdmDependenciaComponent },
      { path: 'cargos', component: AdmCargoComponent },
      { path: 'Tipos-Tramites', component: TramitesRequisitosComponent }
    ]
  },
  {
    path: 'Tramites', component: RegistroTramitesComponent,
    children: [
      { path: 'administrar-tramite', component: AdmTramiteComponent },
      { path: 'bandeja-entrada', component: BandejaEntradaComponent},
      { path: 'bandeja-salida', component: BandejaSalidaComponent }
    ]
  },
  {
    path: 'inicio', component: InicioComponent,
    children: [
      //Admin Usuarios
      { path: 'usuarios', component: AdministracionUsuariosComponent },
      { path: 'instituciones', component: AdmInstitucionComponent },
      { path: 'dependencias', component: AdmDependenciaComponent },
      { path: 'cargos', component: AdmCargoComponent },
      // { path: 'cuentas', component: AdmCuentaComponent },

      { path: 'tramites', component: TramitesRequisitosComponent },
      { path: 'registro-tramites', component: RegistroTramitesComponent },

      { path: 'lista-registros', component: DialogListaTramitesComponent }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
