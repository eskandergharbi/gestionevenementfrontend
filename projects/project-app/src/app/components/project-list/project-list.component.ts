import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule,ProjectFormComponent,ButtonModule,DialogModule,FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectListComponent implements OnInit{
  projects: Project[] = [];
  @Output() projectSelected = new EventEmitter<Project>();
  displayDetailsDialog: boolean = false; // Contrôle l'affichage du dialogue
  displayEditDialog: boolean = false; // For edit dialog
  selectedProject: Project | null = null; // Contient le projet sélectionné
  editableProject: Project | null = null; // For editing

  constructor(private projectService: ProjectService) {}
  ngOnInit(): void {
  this.loadProjects();
  }
  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects; // Assign the actual array of projects
      console.log(projects);
      
    });
  }
  deleteProject(id: string): void {
    if (!id) {
      console.error('Project ID is undefined or null.');
      return;
    }
    console.log('Deleting project with id:', id); // Debugging line
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(project => project._id !== id);
        console.log(`Project with id ${id} deleted successfully.`);
      },
      error: (err) => {
        console.error(`Failed to delete project with id ${id}:`, err);
      },
    });
  }
  
  
  viewProjectDetails(project: Project): void {
    this.selectedProject = project; // Stocke le projet sélectionné
    this.displayDetailsDialog = true; // Affiche la fenêtre popup
    console.log("this.displayDetailsDialog",this.displayDetailsDialog);
    
  }
  editProject(project: Project): void {
    this.editableProject = { ...project }; // Clone the project to avoid direct binding
    this.displayEditDialog = true;
  }
  saveProject(editForm: any): void {
    if (!this.editableProject) {
      console.error('No project to save.');
      return;
    }

    this.projectService.updateProject(this.editableProject._id!, this.editableProject).subscribe({
      next: (updatedProject: Project) => {
        // Update the local list of projects
        const index = this.projects.findIndex(p => p._id === updatedProject._id);
        if (index > -1) {
          this.projects[index] = updatedProject;
        }
        console.log('Project updated:', updatedProject);
        this.displayEditDialog = false; // Close the dialog
      },
      error: (err) => {
        console.error('Failed to update project:', err);
      },
    });}
}