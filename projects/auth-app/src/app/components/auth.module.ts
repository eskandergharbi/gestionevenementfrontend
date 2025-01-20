import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../auth.service';
import { RoleGuard } from '../guards/role.guard';
import { AuthRoutingModule } from './auth-routing.module';
import {  RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import {  HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card'; // Import CardModule
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenubarModule,
    LoginComponent,
    RegisterComponent,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CardModule, // Ensure CardModule is imported

       ],
     providers: [AuthService,RoleGuard]// add it here


})
export class AuthModule {}