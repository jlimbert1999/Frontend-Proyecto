import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//ANGULAR MATERIAL
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';

import { HttpClientModule } from '@angular/common/http';

//UTILIDADES
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { TramitesRequisitosComponent } from './modulos/tramites-requisitos/tramites-requisitos.component';
import { DialogTramitesRequisitosComponent } from './componentes/dialogs/dialog-tramites-requisitos/dialog-tramites-requisitos.component';
import { RegistroTramitesComponent } from './modulos/registro-tramites/registro-tramites.component';

//providers
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AdministracionUsuariosComponent } from './modulos/administracion-usuarios/administracion-usuarios.component';
import { DialogUsuariosComponent } from './componentes/dialogs/dialog-usuarios/dialog-usuarios.component';
import { DialogListaTramitesComponent } from './componentes/dialogs/dialog-lista-tramites/dialog-lista-tramites.component';

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
    DialogListaTramitesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //UTILIDADES
    FormsModule,

    // MATERIAL 
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule



  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
