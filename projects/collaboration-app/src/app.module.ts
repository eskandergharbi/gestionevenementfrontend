import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
      SidebarModule,
        MenubarModule,
        InputTextModule,
        ButtonModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [HttpClient],

})
export class AppModule {}