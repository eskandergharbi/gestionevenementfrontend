import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../../auth-app/src/app/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProjectStats {
  name: string;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  projectStats: ProjectStats[] = [];
  taskStats: TaskStats = { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, notStartedTasks: 0 };
  token: string | null = null;
  @ViewChild('dashboardContent', { static: false }) dashboardContent!: ElementRef;

  projectChartsData: any[] = [];
  globalChartData: any = {};
  chartOptions: any = {};

  constructor(
    private reportService: ReportService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getToken().subscribe((token) => {
      this.token = token;
      if (!token) {
        console.warn('⚠️ Redirection vers la page de login...');
      } else {
        this.fetchProjectStats();
        this.fetchTaskStats();
      }
    });
  }

  fetchProjectStats() {
    this.reportService.getProjectStatistics().subscribe({
      next: (data) => {
        this.projectStats = data || [];
        this.updateProjectCharts();
      },
      error: (err) => console.error('❌ Erreur stats projets:', err)
    });
  }

  fetchTaskStats() {
    this.reportService.getTaskStatistics().subscribe({
      next: (data) => {
        this.taskStats = data || {};
        this.updateGlobalChart();
      },
      error: (err) => console.error('❌ Erreur stats tâches:', err)
    });
  }

  updateProjectCharts() {
    this.projectChartsData = this.projectStats
      .filter(proj => 
        proj && 
        (proj.completedTasks > 0 || proj.inProgressTasks > 0 || proj.notStartedTasks > 0) // Exclure les projets sans tâches
      )
      .map(proj => ({
        name: proj.name, 
        labels: ['Terminées', 'En cours', 'Non commencées'],
        datasets: [{
          data: [proj.completedTasks, proj.inProgressTasks, proj.notStartedTasks],
          backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384']
        }]
      }));
  
    console.log("Projets avec tâches:", this.projectChartsData);
  }
  
  

  updateGlobalChart() {
    this.globalChartData = {
      labels: ['Terminées', 'En cours', 'Non commencées'],
      datasets: [{
        data: [this.taskStats.completedTasks, this.taskStats.inProgressTasks, this.taskStats.notStartedTasks],
        backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384']
      }]
    };
    console.log( this.globalChartData);
    
  }

  exporterPDF() {
    const data = document.getElementById('dashboardContent');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190) / canvas.width);
        pdf.save('dashboard-statistiques.pdf');
      });
    }
  }
}
