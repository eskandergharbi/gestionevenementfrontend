import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './comment/comment.component';
import { CommentListComponent } from './comment-list/comment-list.component';


export const MFE1_ROUTES: Routes = [
  { path: 'comment', component: CommentComponent },
  { path: 'comment-list', component: CommentListComponent }

]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
