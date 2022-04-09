import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';
import { DialogListaTramitesComponent } from './componentes/dialogs/dialog-lista-tramites/dialog-lista-tramites.component';
import { AdmConfiguracionComponent } from './modulos/administracion-usuarios/adm-configuracion/adm-configuracion.component';
import { AdmTramiteComponent } from './modulos/registro-tramites/adm-tramite/adm-tramite.component';
import { BandejaEntradaComponent } from './modulos/registro-tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './modulos/registro-tramites/bandeja-salida/bandeja-salida.component';
import { DialogRegistrarTramiteComponent } from 'src/app/componentes/dialogs/dialogs-m3/dialog-registrar-tramite/dialog-registrar-tramite.component'
import { FichaTramiteComponent } from './modulos/registro-tramites/ficha-tramite/ficha-tramite.component';
import { SeguimientoTramitesComponent } from './modulos/seguimiento-tramites/seguimiento-tramites.component';
import { ReportesComponent } from './modulos/reportes/reportes.component';
import { ConsultaComponent } from './paginas/consulta/consulta.component';
import { AdmFuncionarioComponent } from './modulos/administracion-usuarios/adm-funcionario/adm-funcionario.component';
import { RoleGuard } from './guards/role.guard';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'Usuarios', component: AdministracionUsuariosComponent, canActivate:[LoginGuardGuard, RoleGuard], data:{expectedRole:'ADMIN_ROLE'}
  },
  {
    path: 'Configuraciones', component: AdmConfiguracionComponent, canActivate:[LoginGuardGuard, RoleGuard],data:{expectedRole:'ADMIN_ROLE'}, 
    children: [
      { path: 'Tipos-Tramites', component: TramitesRequisitosComponent }
    ]
  },
  {
    path: 'Tramites', component: RegistroTramitesComponent,
    children: [
      { path: 'administrar-tramite', component: AdmTramiteComponent },
      { path: 'bandeja-entrada', component: BandejaEntradaComponent },
      { path: 'bandeja-salida', component: BandejaSalidaComponent },
      { path: 'ficha/:id', component: FichaTramiteComponent}
    
    ]
  },
  {
    path: 'Workflow/:id', component: SeguimientoTramitesComponent
  },
  {
    path: 'Reportes', component: ReportesComponent
  },
  { path: 'Administrar-cuenta/:id', component: AdmFuncionarioComponent },
  {
    path: 'inicio', component: InicioComponent,canActivate:[LoginGuardGuard],
  },
  {
    path: 'Consulta', component: ConsultaComponent
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
