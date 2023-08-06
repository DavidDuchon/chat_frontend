import { Component,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { UserCredentials } from '../UserCredentials';
import { Token,TokenServer } from '../Token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginCredentials = this.fb.group({
    username: ['',Validators.required],
    password: ['',Validators.required]
  }) 

  hasToken: boolean;

  constructor(private fb: FormBuilder,private router: Router,private auth: AuthenticationService){
    this.hasToken = false;
  }

  ngOnInit(){
    this.auth.makeRequest("https://localhost:7298/Authentication/verify",{},this.router,{
      next: (observer)=>{
        this.hasToken = true;
      }
    });
    
  }

  login(){

    this.auth.login({username:this.loginCredentials.value.username as string,password: this.loginCredentials.value.password as string}).subscribe(
      response =>
      {
        let res = response.body as any;
        this.hasToken = true;
        this.auth.setToken(res.token as Token);
      }
    );
  }
}
