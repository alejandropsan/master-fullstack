import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from 'src/app/models/topic';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [UserService, TopicService]
})
export class AddComponent implements OnInit{
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
    this.pageTitle = 'Crear nuevo tema';
    this.identity = this._userService.getIdentity();
    this.topic = new Topic('', '', '', '', '', '', this.identity._id, null);
    this.token = this._userService.getToken();
    this.status = '';
    this.is_edit = false;
  }

  ngOnInit() {
    console.log(this._topicService.prueba());
  }

  onSubmit(form: any){
    this._topicService.addTopic(this.token, this.topic).subscribe(
      response => {
        if(response.topicStored){
          this.status = 'success';
          this.topic = response.topicStored;
          console.log(this.topic);
          this._router.navigate(['/panel']);
        }else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
