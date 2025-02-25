import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TaskFormComponent } from '../../../../task-app/src/app/components/task-form/task-form.component';
import { ProjectFormComponent } from '../../../../project-app/src/app/components/project-form/project-form.component';
import { FileUploadComponent } from '../../../../collaboration-app/src/app/components/file-upload/file-upload.component';
import { CommentComponent } from '../../../../comment-app/src/app/components/comment/comment.component';
import { CreateComponent } from '../../../../member-app/src/app/components/create/create.component';
import { DashboardComponent } from '../../../../report-app/src/app/components/dashboard/dashboard.component';
import { ProjectListComponent } from '../../../../project-app/src/app/components/project-list/project-list.component';
import { ProjectDetailComponent } from '../../../../project-app/src/app/components/project-detail/project-detail.component';

export const MFE1_ROUTES: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'task', component: TaskFormComponent },
  { path: 'project', component: ProjectFormComponent },
   { path: 'upload', component:FileUploadComponent  },
  { path: 'task', component: TaskFormComponent },
    { path: 'comment', component: CommentComponent },
  { path: 'create', component: CreateComponent },
   { path: 'dashboards', component:DashboardComponent  },
     { path: 'list', component: ProjectListComponent },
     { path: 'create', component: ProjectFormComponent },
     { path: 'details', component: ProjectDetailComponent },
     { path: 'menu', component: MenuComponent } 
]

@NgModule({
  imports: [RouterModule.forChild(MFE1_ROUTES),ReactiveFormsModule],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
