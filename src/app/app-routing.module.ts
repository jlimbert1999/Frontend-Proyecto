import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';
import { DialogListaTramitesComponent } from './componentes/dialogs/dialog-lista-tramites/dialog-lista-tramites.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'inicio', component: InicioComponent,canActivate: [LoginGuardGuard],
    children: [
      { path: 'tramites', component: TramitesRequisitosComponent },
      { path: 'registro-tramites', component: RegistroTramitesComponent },
      { path: 'usuarios', component: AdministracionUsuariosComponent },
      { path: 'lista-registros', component: DialogListaTramitesComponent }  
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
