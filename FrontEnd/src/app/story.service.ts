import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(private http:HttpClient) { }

  saveStory(postDetails:any){
    return this.http.post(environment.apiBaseUrl+'/story/saveStory',postDetails);
  }
  
  getStories(){
    return this.http.get(environment.apiBaseUrl+'/story/getStories/');
  }
}
