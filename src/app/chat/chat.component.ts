import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { AuthenticationService } from '../authentication.service';
import { Message } from '../Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: Message[] = []
  currentGroupId: string = ""

  messageForm = this.fb.group({
    message: ['',Validators.required]
  })

  connection: signalR.HubConnection| null = null;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private authService: AuthenticationService){
  }

  addMessage(message: Message){
    this.messages.push(message);
  }

  ngOnInit(){
    this.currentGroupId = this.route.snapshot.paramMap.get('groupId')!;
    console.log(`Welcome from /chat/${this.currentGroupId}`);
    this.connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7298/chat",
    {
      accessTokenFactory: ()=>{
        return this.authService.updateToken();
      }
    }).build();

    this.connection.start().then((value) => {
      console.log("connection suceeded");
      this.connection!.invoke("AddToGroup",this.currentGroupId);
    },
    (reason) => {
      console.log("connection rejected");
    });

    this.connection.on("RecieveMessage", (user,message) => {

      this.addMessage({username: user,message:message});
    })
    
  }

  sendMessage(message: string){
    this.connection!.invoke("SendMessage",this.currentGroupId,this.messageForm.value.message!);
    this.messageForm.value.message = "";
    this.messageForm.patchValue({message:""})
  }
}
