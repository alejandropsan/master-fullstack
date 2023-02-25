import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit{
  public pageTitle: string;
  public user: User;
  public identity: any;
  public token: any;
  public afuConfig: any;
  public url: any;
  public status: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService
  ){
    this.pageTitle = 'Ajustes de usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = global.url;
    this.status = '';
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg, .png, .gif, .jpeg",
      maxSize: "20",
      uploadAPI: {
        url: this.url + 'upload-avatar',
        method:"POST",
        headers: {
          "Authorization": this.token
        }
      },
      theme: "attachPin",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: false,
      fileNameIndex: true,
      autoUpload: false,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Inserta una imagen',
        afterUploadMsg_success: 'Imagen subida correctamente !',
        afterUploadMsg_error: 'Fallo al subir la imagen !',
        sizeLimit: 'Archivo demasiado grande'
      }
  }
}

  ngOnInit() {

  }

  onSubmit(form: any){
    this._userService.update(this.user).subscribe(
      response => {
        console.log(response.user);
        if(!response.user){
          this.status = 'error';
        }else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  avatarUpload(data: any){
    let data_obj = data.body;
    console.log(data_obj);
    this.user.image = data_obj.userUpdated.image;
    console.log(this.user);
  }

}
