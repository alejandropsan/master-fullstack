// MÓDULOS
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { PanelRoutingModule } from "./panel-routing.module";
import { Moment } from 'moment';
import { MomentModule } from 'ngx-moment';


// COMPONENTES
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';


// SERVICIOS
import { UserService } from "../services/user.service";
import { UserGuard } from "../services/user.guard";

// NGMODULE
@NgModule({
  declarations: [
    MainComponent,
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PanelRoutingModule,
    MomentModule
  ],
  exports: [
    MainComponent,
    ListComponent,
    AddComponent,
    EditComponent
  ],
  providers: [
    UserService,
    UserGuard
  ]
})

export class PanelModule { }
