import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Group } from './Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient,private authService: AuthenticationService,private router:Router) { }

  join(groupName: string){
    this.authService.makeRequest("https://localhost:7298/Group/join",{GroupName:groupName},this.router,{
      next: (res) => {
        this.router.navigate([`/chat/${groupName}`]);
      }
    });
  }

  getUserGroups(UserGroups: Group[]){
    this.authService.makeRequest("https://localhost:7298/Group/myGroups",{},this.router,{
      next: (res) => {
        UserGroups = res.body as Group[]; 
      }
    });
  }

  getGroups(Groups:Group[]){
    this.authService.makeRequest("https://localhost:7298/Group/groups",{},this.router,{
      next: (res) => {
        Groups = res.body as Group[]; 
      }
    });
  }
}
