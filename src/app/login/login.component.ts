import { Component,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { UserCredentials } from '../UserCredentials';
import { Token,TokenServer } from '../Token';
import { ActivatedRoute, Router } from '@angular/router';

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

  pathToLogin:string|null = null;

  constructor(private fb: FormBuilder,private auth: AuthenticationService,private router: Router,private route: ActivatedRoute){
    this.hasToken = false;
  }

  ngOnInit(){
    this.pathToLogin = this.route.snapshot.queryParams['redirect'];
    console.log(this.pathToLogin);
    this.auth.updateToken().then((succeeded)=>{
      if (succeeded){
        this.hasToken = true;
        if (this.pathToLogin)
          this.router.navigate([this.pathToLogin])

      }
      else
        this.hasToken = false;
    }) 

  }

  login(){

    this.auth.login({username:this.loginCredentials.value.username as string,password: this.loginCredentials.value.password as string}).subscribe(
      response =>
      {
        let res = response.body as TokenServer;
        this.hasToken = true;
        this.auth.setToken(res.token);
        if (this.pathToLogin)
          this.router.navigate([this.pathToLogin])
      }
    );
  }
}
