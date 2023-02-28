import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css'],
  providers: [TopicService, UserService]
})
export class TopicDetailComponent implements OnInit{
  public topic: Topic;
  public comment: Comment;
  public identity: any;
  public token: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _topicService: TopicService,
    private _userService: UserService
  ){
    this.topic = new Topic('','','','','','','','');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.comment = new Comment('','','',this.identity._id);
  }


  ngOnInit() {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(params => {
      let id = params['id'];

      this._topicService.getTopic(id).subscribe(
        response => {
          if(response.topic){
            this.topic = response.topic;
          }else {
            this._router.navigate(['inicio']);
          }
        },
        error => {
          console.log(error);
        }
      )
    })
  }


  onSubmit(){

  }




}
