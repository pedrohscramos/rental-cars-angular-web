import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { ReportTableComponent } from '../../shared/components/report-table/report-table.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [FilterBarComponent, ReportTableComponent],
  template: 
        `<app-filter-bar (filterChange)="loadReports($event)"></app-filter-bar>
        <app-report-table [reports]="reports"></app-report-table>`
})
export class RelatoriosComponent implements OnInit {

  reports: any[] = [];
  totalNaoPago: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports({});
  }

  loadReports(filter: any) {
    const params = {
      date: filter.date ? filter.date.toISOString().split('T')[0] : '',
      model: filter.model || ''
    };

    this.http.get<any>('http://localhost:8080/api/alugueis', { params }).subscribe({
      next: (response) => {
        this.reports = Array.isArray(response.alugueis) ? response.alugueis : [];
        this.totalNaoPago = response.totalNaoPago || 0;
      },
      error: (err) => {
        console.error('Erro ao carregar os relatórios:', err);
        this.reports = []; 
        this.totalNaoPago = 0;
      }
    });
  }
}

