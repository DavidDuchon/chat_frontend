import { Component,Input } from '@angular/core';
import { Group } from '../Group';
import { GroupService } from '../group.service';
import { CallbackObject } from '../Callback';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() Group:Group | undefined

  OnJoin: CallbackObject = {
    next: (res) => {
      this.router.navigate([`/chat/${this.Group!.groupName}`])
    }
  }
  constructor(public groupService: GroupService,public router: Router){}
}
