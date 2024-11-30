import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, DropdownModule, ButtonModule],
  template: `
    <div class="filter-bar">
      <p-calendar [(ngModel)]="filter.date" placeholder="Data do aluguel"></p-calendar>
      <p-dropdown 
        [options]="carModels" 
        [(ngModel)]="filter.model" 
        placeholder="Modelo do carro">
      </p-dropdown>
      <button pButton label="Buscar" (click)="onSearch()"></button>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
  `]
})
export class FilterBarComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  filter = { date: null, model: null };
  carModels: any[] = []; // Lista de modelos de carro

  constructor(private http: HttpClient) {}

  ngOnInit() {
    
    this.http.get<any[]>('http://localhost:8080/api/carros').subscribe({
      next: (response) => {
        
        this.carModels = response.map(car => ({
          label: car.modelo, 
          value: car.modelo  
        }));
        
        this.carModels.unshift({ label: 'Todos', value: null });
      },
      error: (err) => {
        console.error('Erro ao carregar a lista de carros:', err);
      }
    });
  }

  onSearch() {
    
    this.filterChange.emit(this.filter);
  }
}
