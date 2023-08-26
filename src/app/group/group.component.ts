import { Component,Input } from '@angular/core';
import { Group } from '../Group';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() Group:Group | undefined

  constructor(public groupService: GroupService){}
}
