import { Component, Input,OnInit } from '@angular/core';
import { Group } from '../Group';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  Groups:Group[] = []
  MyGroups:Group[] = []

  constructor(){}

  ngOnInit(){
    
  }
}
