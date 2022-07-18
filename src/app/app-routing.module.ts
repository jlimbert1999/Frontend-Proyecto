import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';

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
import { ReporteFichaComponent } from './modulos/reportes/reporte-ficha/reporte-ficha.component';
import { FuncionariosComponent } from './modulos/administracion-usuarios/funcionarios/funcionarios.component';
import { TiposTramitesComponent } from './modulos/tramites-requisitos/tipos-tramites/tipos-tramites.component';
import { InstitucionesComponent } from './modulos/administracion-usuarios/instituciones/instituciones.component';
import { DependenciasComponent } from './modulos/administracion-usuarios/dependencias/dependencias.component';
import { CargosComponent } from './modulos/administracion-usuarios/cargos/cargos.component';
import { CuentasComponent } from './modulos/administracion-usuarios/cuentas/cuentas.component';
import { ReporteEstadoComponent } from './modulos/reportes/reporte-estado/reporte-estado.component';
import { ReporteEstadisticoComponent } from './modulos/reportes/reporte-estadistico/reporte-estadistico.component';
import { GroupwareComponent } from './modulos/administracion-usuarios/groupware/groupware.component';
import { AyudaComponent } from './paginas/consulta/ayuda/ayuda.component';
import { MailComponent } from './modulos/registro-tramites/mail/mail.component';
import { MainComponent } from './paginas/main/main.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'Usuarios', component: AdministracionUsuariosComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' }
  },
  // {
  //   path: 'Tramites',
  //   children: [
  //     { path: 'administrar-tramite', component: AdmTramiteComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'USER1_ROLE' } },
  //     { path: 'bandeja-entrada', component: BandejaEntradaComponent },
  //     { path: 'bandeja-salida', component: BandejaSalidaComponent },
  //     { path: 'ficha/:id', component: FichaTramiteComponent }

  //   ]
  // },
  // {
  //   path: 'Workflow/:id', component: SeguimientoTramitesComponent
  // },
  {
    path: 'Reportes', component: ReportesComponent,
    children: [
      { path: 'reporte-ficha', component: ReporteFichaComponent }
    ]
  },
  { path: 'Administrar-cuenta/:id', component: AdmFuncionarioComponent },
  {
    path: 'inicio', component: InicioComponent, canActivate: [LoginGuardGuard],
    children: [
      //INICIO
      { path: '', pathMatch: 'full', redirectTo:'main' },
      { path: 'main', component: MainComponent},
      //USUARIOS
      { path: 'administrar-usuarios', component: AdministracionUsuariosComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-funcionarios', component: FuncionariosComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-cuentas', component: CuentasComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-instituciones', component: InstitucionesComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-dependencias', component: DependenciasComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-cargos', component: CargosComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'administrar-tipos-tramites', component: TiposTramitesComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      { path: 'groupware', component: GroupwareComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'ADMIN_ROLE' } },
      //REGISTRO DE TRAMIES
      { path: 'administrar-tramite', component: AdmTramiteComponent, canActivate: [LoginGuardGuard, RoleGuard], data: { expectedRole: 'USER1_ROLE' } },
      {
        path: 'bandeja-entrada', component: BandejaEntradaComponent
      },
      { path: 'tramite-recibido/:id', component: MailComponent },

      { path: 'bandeja-salida', component: BandejaSalidaComponent },
      { path: 'ficha/:id', component: FichaTramiteComponent },
      //SEGUIMIENTO TRAMITES
      { path: 'Workflow/:id', component: SeguimientoTramitesComponent },

      //REPORTES
      { path: 'reporte-ficha', component: ReporteFichaComponent },
      { path: 'reporte-estado', component: ReporteEstadoComponent },
      { path: 'reporte-estadistico', component: ReporteEstadisticoComponent }
    ]
  },
  {
    path: 'Consulta', component: ConsultaComponent,


  },
  { path: 'Ayuda', component: AyudaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
