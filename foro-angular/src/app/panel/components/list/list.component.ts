import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from 'src/app/models/topic';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [UserService, TopicService]
})
export class ListComponent implements OnInit{
  public pageTitle: string;
  public topics: Array<Topic>;
  public identity: any;
  public token: string;
  public status: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _topicService: TopicService
  ){
    this.pageTitle = 'Todos mis temas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.status = '';
    this.topics = [];
  }

  ngOnInit() {
    this.getTopics();
  }

  getTopics(){
    let userId = this.identity._id;
    this._topicService.getTopicsByUser(userId).subscribe(
      response => {
        if(response.topics){
          this.topics = response.topics;
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  deleteTopic(id: any){
    this._topicService.delete(this.token, id).subscribe(
      response => {
        this.getTopics();
      },
      error => {
        console.log(error);
      }
    )
  }
}
