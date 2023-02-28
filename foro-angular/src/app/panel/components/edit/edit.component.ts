import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from 'src/app/models/topic';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [UserService, TopicService]
})
export class EditComponent implements OnInit{
  public pageTitle: string;
  public topic: Topic;
  public identity: any;
  public token: string;
  public status: string;
  public is_edit: boolean;


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _topicService: TopicService
  ){
    this.pageTitle = 'Editar un tema';
    this.identity = this._userService.getIdentity();
    this.topic = new Topic('', '', '', '', '', '', this.identity._id, null);
    this.token = this._userService.getToken();
    this.status = '';
    this.is_edit = true;
  }

  ngOnInit() {
    this.getTopic();
  }


  onSubmit(form: any){
    let id = this.topic._id;
    this._topicService.update(this.token, id, this.topic).subscribe(
      response => {
        if(response.topic){
          this.status = 'success';
          this.topic = response.topic;
        }else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    )
  }


  getTopic(){
    this._route.params.subscribe((params) => {
      let id = params['id'];

      this._topicService.getTopic(id).subscribe(
        response => {
          if(!response.topic){
            this._router.navigate(['/panel']);
          }else {
            this.topic = response.topic;
          }
        },
        error => {
          console.log(error);
        }
      )
    });
  }
}
