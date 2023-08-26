import { ChangeDetectionStrategy,Component,OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {HubConnectionBuilder} from '@microsoft/signalr';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  messages: number[] = []
  currentGroupId: string = ""

  messageForm = this.fb.group({
    message: ['',Validators.required]
  })

  constructor(private route: ActivatedRoute,private fb: FormBuilder){
  }

  ngOnInit(){
    this.currentGroupId = this.route.snapshot.paramMap.get('groupId')!;
  }

  sendMessage(message: string){

  }
}
