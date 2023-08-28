import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable,throwError,firstValueFrom } from 'rxjs';
import { catchError,retry } from 'rxjs';
import { UserCredentials } from './UserCredentials';
import { Token,TokenServer } from './Token';
import { Router } from '@angular/router';
import { CallbackObject } from './Callback';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(private http: HttpClient) {
   }

  register(data: UserCredentials): Observable<HttpResponse<Object>>{
    return this.http.post("https://localhost:7298/Authentication/register",data,{observe: "response",responseType: "json",withCredentials: true});
  }

  login(data: UserCredentials): Observable<HttpResponse<Object>>{
    return this.http.post("https://localhost:7298/Authentication/login",data,{observe: "response",responseType: "json",withCredentials: true});
  }

  refresh(): Observable<HttpResponse<Object>>{
    let token = `Bearer ${this.getTokenValue()}`
    return this.http.post("https://localhost:7298/Authentication/refresh",{},{observe: "response",responseType: "json",withCredentials: true});
  }

  verify(): Observable<HttpResponse<Object>>{
    let token = `Bearer ${this.getTokenValue()}`
    return this.http.post("https://localhost:7298/Authentication/verify",{},{observe: "response",responseType: "json",withCredentials: true});
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
  }

  getTokenValue(): string {
    let token = localStorage.getItem("token");

    return (token != null ? token: "invalid_token");
  }
  /*
    Function which makes post request to given [url] with [data] (using [router] for unauthenticated users to navigate to '/login' page) with observer callbacks
  */
  makeRequest(url: string,data: Object,router: Router,callbackObject: CallbackObject){
    
    this.http.post(url,data,{observe: 'response',responseType: 'json',withCredentials: true}).subscribe(
      {
        next: callbackObject.next,
        error: (response) => {
          
          this.updateToken().then((succeeded) => {
            if (succeeded)
              this.http.post(url,data,{observe: 'response',responseType: 'json',withCredentials: true}).subscribe(callbackObject);
            else{
              this.logout();
              router.navigate(["/login"],{queryParams: {redirect: router.url}});
            }
          });
        },
        complete: callbackObject.complete
        });

  }

  tokenExpired(): boolean{
    const reservedTime = 100;
    if (this.tokenDataPresent()){
      let d = new Date();

      let secondsSinceEpoch = d.getTime()/ 1000;

      return (secondsSinceEpoch >= Number(localStorage.getItem("exp")) + reservedTime);
    }

    return false;
  }

  setToken(token: Token){
    if (token == null)
      return;
    if (token.value == null || token.exp == null)
      return;
    localStorage.setItem("token",token.value);
    localStorage.setItem("exp",String(token.exp));
  }

  tokenDataPresent(): boolean{
    return (localStorage.getItem("token") != null && localStorage.getItem("exp") != null);
  }

  /* updates token if necessary if updating of token fails returns false else returns true */
  async updateToken(){

    if (!this.tokenDataPresent()){
      return false;
    }

    if (!this.tokenExpired()){

      let responseVerify = await firstValueFrom(this.verify());

      if (responseVerify.status == 200)
        return true;

      return false;
    }

    let responseRefresh = await firstValueFrom(this.refresh());

    if ((responseRefresh.status >= 200 && responseRefresh.status < 300 )){
      this.setToken((responseRefresh.body as TokenServer).token);
      return true;
    }

    return false;
    
  }
}
