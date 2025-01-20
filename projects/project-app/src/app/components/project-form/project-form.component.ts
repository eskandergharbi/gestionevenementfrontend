import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form',
  standalone:true,
  imports:[CommonModule,FormsModule,DropdownModule,ButtonModule,InputTextModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectFormComponent {
  newProject: Project = {
    name: '',
    description: '',
    members: [],
    status: 'not started',
    progress: 0,
  };

  @Output() projectCreated = new EventEmitter<Project>();

  constructor(private projectService: ProjectService) {}

  createProject(): void {
    this.projectService.createProject(this.newProject).subscribe((project: Project) => {
      this.resetForm();
    });
  }

  resetForm(): void {
    this.newProject = {
      name: '',
      description: '',
      members: [],
      status: 'not started',
      progress: 0,
    };
  }
}