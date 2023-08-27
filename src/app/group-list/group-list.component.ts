import { Component,OnInit } from '@angular/core';
import { Group } from '../Group';
import { GroupService } from '../group.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  Groups:Group[] = []
  MyGroups:Group[] = []

  group = this.fb.group({
    groupName: ['',Validators.required]
  }) 

  constructor(private fb: FormBuilder,private groupService: GroupService){}

  ngOnInit(){
    console.log("Welcome from /chat path");
   this.groupService.getGroups({
    next: (res) =>{
      this.Groups = res.body as Group[];
    }
   });

   this.groupService.getUserGroups({
    next: (res) => {
      this.MyGroups = res.body as Group[];
    }
   });
  }

  addGroup(){
    this.groupService.addGroup(this.group.value.groupName!,{
      next: (res) =>{
        this.MyGroups.push({groupName:this.group.value.groupName!});
      }
    })
  }
}
