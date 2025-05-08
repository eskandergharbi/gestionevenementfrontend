import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { ChatComponent } from './chat/chat.component';
import { AnnouncementComponent } from './announcement/announcement.component';



export const MFE1_ROUTES: Routes = [
   { path: 'menu', component: MenuComponent },
   { path: 'chat', component: ChatComponent },
   { path: 'annoucement', component: AnnouncementComponent }
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
