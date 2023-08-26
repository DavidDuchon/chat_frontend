import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { GroupListComponent } from './group-list/group-list.component';

const routes: Routes = [
  {path: '',component:HomeComponent },
  {path: 'login',component:LoginComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'chat',component:GroupListComponent},
  {path:'chat/:groupId',component:ChatComponent},
  {path: '**',component:HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
