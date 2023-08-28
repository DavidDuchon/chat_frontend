import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  register(data: UserCredentials): Observable<any>{
    return this.http.post("https://localhost:7298/Authentication/register",data,{observe: "response",responseType: "json",withCredentials: true});
  }

  login(data: UserCredentials): Observable<any>{
    return this.http.post("https://localhost:7298/Authentication/login",data,{observe: "response",responseType: "json",withCredentials: true});
  }

  refresh(): Observable<any>{
    let token = `Bearer ${this.getTokenValue()}`
    return this.http.post("https://localhost:7298/Authentication/refresh",{},{observe: "response",responseType: "json",withCredentials: true,headers: {"Authorization": `${token}`}});
  }

  verify(): Observable<any>{
    let token = `Bearer ${this.getTokenValue()}`
    return this.http.post("https://localhost:7298/Authentication/verify",{},{observe: "response",responseType: "json",withCredentials: true,headers: {"Authorization": `${token}`}});
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
  }

  getTokenValue() {
    return localStorage.getItem("token");
  }
  /*
    Function which makes post request to given [url] with [data] (using [router] for unauthenticated users to navigate to '/login' page) with observer callbacks
  */
  makeRequest(url: string,data: Object,router: Router,callbackObject: CallbackObject){
    
    let token =  `Bearer ${this.getTokenValue()}`;
    this.http.post(url,data,{observe: 'response',responseType: 'json',withCredentials: true,headers: {"Authorization": token}}).subscribe(
      {
        next: callbackObject.next,
        error: (response) => {
          
          if (!this.tokenDataPresent()){
            this.logout();
            router.navigate(['/login']);
          }

          if (this.tokenExpired()){
            this.refresh().subscribe({
              next: (res)=> {
                console.log("Refresh route succeeded");
                this.setToken(res.body.token as Token);
                let token =  `Bearer ${this.getTokenValue()}`;

                this.http.post(url,data,{observe: 'response',responseType: 'json',withCredentials: true,headers: {"Authorization": token}}).subscribe(callbackObject);
              },
              error:(error) => {
                  console.log("Refresh route did not succeeded");
                  this.logout();
                  router.navigate(['/login']);
                }
            });
          }
          else{

            this.verify().subscribe({
              next: (res)=>{
                if (callbackObject.error != null)
                  callbackObject.error(response);
                
              },
              error: (res) => {
                this.logout();
                router.navigate(['/login']);
              }
            })
          }
        },
        complete: callbackObject.complete
        });

  }

  tokenExpired(): boolean{
    if (this.tokenDataPresent()){
      let d = new Date();

      let secondsSinceEpoch = d.getTime()/ 1000;

      return (secondsSinceEpoch >= Number(localStorage.getItem("exp")))
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

  async updateToken(){

    if (!this.tokenDataPresent())
      return "failed";

    let responseVerify = await firstValueFrom(this.verify());

    if (responseVerify.status >= 200 && responseVerify.status < 300){
      console.log("Access token is valid");
      return this.getTokenValue()!;
    }

    let responseRefresh = await firstValueFrom(this.refresh());

    if ((responseRefresh.status >= 200 && responseRefresh.status < 300 )){
      console.log("Tokens refreshed successfully");
      this.setToken(responseRefresh.body as Token);
      return this.getTokenValue()!;
    }

    return "failed";
    
  }
}
