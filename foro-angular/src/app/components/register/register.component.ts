import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit{
  public pageTitle: string;
  public user: User;
  public status: string;




  constructor(
    private _userService: UserService
  ){
    this.pageTitle = 'Regístro de usuarios';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER');
    this.status = '';
  }


  ngOnInit() {
    console.log(this._userService.prueba());
  }

  onSubmit(form: any){
    this._userService.register(this.user).subscribe(
      response => {
        if(response.user && response.user._id){
          this.status = 'success';
          form.reset();
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
