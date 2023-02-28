import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutesProviders } from './app.routing';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { Moment } from 'moment';
import { MomentModule } from 'ngx-moment';
import { HighlightJsModule } from 'ngx-highlight-js';


import { PanelModule } from './panel/panel.module';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UserEditComponent,
    TopicsComponent,
    TopicDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    AngularFileUploaderModule,
    PanelModule,
    MomentModule,
    HighlightJsModule
  ],
  providers: [appRoutesProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
