import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private _http:HttpClient) { }

  postUser(user:any){
    //return this._http.post('http://localhost:80/auth/register',user,this.noAuthHeader);
    return this._http.post(environment.apiBaseUrl+'/auth/register',user,this.noAuthHeader);
  }

  login(authCredentials:any) {
    return this._http.post(environment.apiBaseUrl + '/auth/authenticate', authCredentials, this.noAuthHeader);
    //return this._http.post('http://localhost:80/auth/authenticate', authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    //return this._http.get('http://localhost:80/auth/userprofile');
     return this._http.get(environment.apiBaseUrl + '/auth/userprofile');
  }


  //Helper Methods

  setToken(token: any) {
    localStorage.setItem('token', token);
  }
  

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }


  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn(){
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
