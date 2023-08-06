import { Component,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerCredentials = this.fb.nonNullable.group({
    username: ['',Validators.required],
    password: ['',Validators.required]
  });

  hasToken: boolean;
  constructor(private fb: FormBuilder,private auth: AuthenticationService,private router: Router){
    this.hasToken = false;
  }

  ngOnInit(){
    this.router.navigate(["/register"])
  }

  register(): void{
    this.auth.register({username: this.registerCredentials.value.username as string,password: this.registerCredentials.value.password as string}).subscribe(
      response => {
          let res = response.body as any;
          this.hasToken = true;

          this.auth.setToken(res.token)
      }
    );    
  }
}
