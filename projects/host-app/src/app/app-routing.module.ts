import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:1000/remoteEntry.js',
      remoteName: 'auth',
      exposedModule: './Module'
    })
    .then(m => m.AuthModule)
  },
  {
    path: 'task',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:3002/remoteEntry.js',
      remoteName: 'task',
      exposedModule: './Module'
    })
    .then(m => m.TaskModule)
  },
  {
    path: 'report',
    loadChildren: () => loadRemoteModule({
      type: 'manifest',
      remoteName: 'report',
      exposedModule: './Module'
    })
    .then(m => m.ReportModule)
  },
  {
    path: 'collaboration',
    loadChildren: () => loadRemoteModule({
      type: 'manifest',
      remoteName: 'collaboration',
      exposedModule: './Module'
    })
    .then(m => m.CollaborationModule)
  },
  {
    path: 'project',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:3001/remoteEntry.js',
      remoteName: 'project',
      exposedModule: './Module'
    })
    .then(m => m.ProjectModule)
  },
  {
    path: 'event',
    loadChildren: () => loadRemoteModule({
      type: 'manifest',
      remoteName: 'event',
      exposedModule: './Module'
    })
    .then(m => m.EventModule)
  },
  {
    path: 'member',
    loadChildren: () => loadRemoteModule({
      type: 'manifest',
      remoteName: 'member',
      exposedModule: './Module'
    })
    .then(m => m.MemberModule)
  },
  {
    path: 'tasks', // Ensure unique paths
    loadChildren: () => loadRemoteModule({
      type: 'manifest',
      remoteName: 'task',
      exposedModule: './Module'
    })
    .then(m => m.TaskModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
