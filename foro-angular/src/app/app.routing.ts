// IMPORTAR LOS MÓDULOS DEL ROUTER
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from "./services/user.guard";
import { NoIdentityGuard } from './services/no.identity.guard';

// IMPORTAR COMPONENTES
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';

// ARRAY DE RUTAS
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'login', canActivate: [NoIdentityGuard], component: LoginComponent},
  { path: 'registro', canActivate: [NoIdentityGuard], component: RegisterComponent },
  { path: 'ajustes', canActivate: [UserGuard], component: UserEditComponent },
  { path: 'temas', component: TopicsComponent },
  { path: 'temas/:page', component: TopicsComponent },
  { path: 'tema/:id', component: TopicDetailComponent },
  { path: 'usuarios', canActivate: [UserGuard], component: UsersComponent },
  { path: 'perfil/:id', canActivate: [UserGuard], component: ProfileComponent },
  { path: 'buscar/:search', component: SearchComponent },
  { path: '**', component: HomeComponent}
];

// EXPORTAR CONFIGURACIÓN
export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
