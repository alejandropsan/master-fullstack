import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['./search.component.css'],
  providers: [TopicService]
})
export class SearchComponent implements OnInit{
  public pageTitle: string;
  public topics: Topic[];
  public noPaginate: boolean;
  public prev_page: any;
  public next_page: any;
  public number_pages: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _topicService: TopicService
  ){
    this.pageTitle = 'Encontrado: ';
    this.topics = [];
    this.noPaginate = true;
    this.prev_page = null;
    this.next_page = null;
    this.number_pages = null;

  }


  ngOnInit() {
    this._route.params.subscribe(params => {
      var search = params['search'];
      this.pageTitle = this.pageTitle + ' ' + search;

      this.getTopics(search);
    });
  }


  getTopics(search: any) {
    this._topicService.search(search).subscribe(
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

}
