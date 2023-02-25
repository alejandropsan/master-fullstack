import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit{
  public pageTitle: string;
  public user: User;
  public status: string;
  public identity: any;
  public token: string;


  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    this.pageTitle = 'Identifícate';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER');
    this.status = '';
    this.token = '';
  }

  ngOnInit() {

  }

  onSubmit(form: any){
    // CONSEGUIR OBJETO COMPLETO DEL USUARIO LOGEADO
    this._userService.signup(this.user).subscribe(
      response => {
        if(response.user && response.user._id){
          // GUARDAMOS EL USUARIO EN UNA PROPIEDAD
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // CONSEGUIR EL TOKEN DEL USUARIO IDENTIFICADO
          this._userService.signup(this.user, true).subscribe(
            response => {
              if(response.token){

                // GUARDAR EL TOKEN DEL USUARIO EN UNA PROPIEDAD
                this.token = response.token;
                localStorage.setItem('token', this.token);

                this.status = 'success';
                this._router.navigate(['/inicio']);
              }else {
                this.status = 'error';
              }
            },
            error => {
              console.log(error);
            }
          );

        }else {
          this.status = 'error'
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
        form.reset();
      }

    )

  }
}
