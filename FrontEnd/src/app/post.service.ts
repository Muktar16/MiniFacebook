import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(private http:HttpClient) { }

  savePost(postDetails:any){
    //return this.http.post('http://localhost:80/status/savePost',postDetails);
    return this.http.post(environment.apiBaseUrl+'/status/savePost',postDetails);
  }

  getPosts(){
    //return this.http.get('http://localhost:80/status/getPosts');
    return this.http.get(environment.apiBaseUrl+'/status/getPosts');
  }
}
