import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { CommentComponent } from './components/comment/comment.component';


@NgModule({
  imports: [
    CommentComponent,
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    ButtonModule,
    SidebarModule,
    BrowserAnimationsModule,
    MenubarModule, // Add this
    HttpClientModule,
    RouterModule, 
    DropdownModule,
    CardModule// Import RouterModule 
  ],
  declarations: [],
  providers: [MessageService],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { }