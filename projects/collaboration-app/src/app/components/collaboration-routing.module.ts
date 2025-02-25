import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ChatComponent } from './chat/chat.component';



export const MFE1_ROUTES: Routes = [
   { path: 'menu', component: MenuComponent },
   { path: 'chat', component: ChatComponent },
   { path: 'upload', component:FileUploadComponent  }

]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
