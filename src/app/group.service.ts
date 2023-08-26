import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Group } from './Group';
import { CallbackObject } from './Callback';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient,private authService: AuthenticationService,private router:Router) { }

  join(groupName: string,callbackObject: CallbackObject){
    this.authService.makeRequest("https://localhost:7298/Group/join",{groupName:groupName},this.router,callbackObject);
  }

  getUserGroups(callbackObject: CallbackObject){
    this.authService.makeRequest("https://localhost:7298/Group/myGroups",{},this.router,callbackObject);
  }

  getGroups(callbackObject: CallbackObject){
    this.authService.makeRequest("https://localhost:7298/Group/groups",{},this.router,callbackObject);
  }

  addGroup(groupName: string,callbackObject: CallbackObject){
    this.authService.makeRequest('https://localhost:7298/Group/create',{groupName: groupName},this.router,callbackObject);
  }
}
