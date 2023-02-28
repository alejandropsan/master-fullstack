import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from '../models/user';
import { global } from './global';

@Injectable()
export class UserService{
  public url: string;
  public identity: any;
  public token: any;

  constructor(
    private _http: HttpClient
  ){
    this.url = global.url;
  }

  prueba(){
    return 'Hola mundo desde el servicio de angular';
  }


  register(user: User): Observable<any>{
    // CONVERTIR EL OBJETO DEL USUARIO A UN JSON STRING
    let params = JSON.stringify(user);

    // DEFINIR LAS CABECERAS
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    // HACER PETICIÓN AJAX
    return this._http.post(this.url + 'register', params, {headers: headers});
  }


  signup(user: any, getToken = false): Observable<any>{

    // COMPROBAR SI LLEGA EL GETTOKEN
    if(getToken != null){
      user.getToken = getToken;
  }

  let params = JSON.stringify(user);
  let headers = new HttpHeaders().set('Content-Type', 'application/json');

  return this._http.post(this.url + 'login', params, {headers: headers});

  }


  update(user: User): Observable<any>{
    let params = JSON.stringify(user);

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken());

    return this._http.put(this.url + 'update', params, {headers: headers});

  }


  getIdentity(){
    let identity = localStorage.getItem('identity');

    if(identity && identity != null && identity != undefined && identity != 'undefined'){
      this.identity = JSON.parse(identity);
    }else {
      this.identity = null;
    }

    return this.identity;
  }




  getToken(){
    let token = localStorage.getItem('token');

    if(token && token != null && token != undefined && token != 'undefined'){
      this.token = token;
    }else {
      this.token = null;
    }

    return this.token;
  }


  getUsers(): Observable<any>{
    return this._http.get(this.url + 'users');
  }

  getUser(userId: any): Observable<any>{
    return this._http.get(this.url + 'user/' + userId);
  }



}
