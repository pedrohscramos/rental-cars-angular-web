import { CommonModule, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from "primeng/divider";
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CalendarModule, 
    DropdownModule, 
    ButtonModule,
    NgStyle,
    DividerModule],
  template: `
  <section>
  <h2 [ngStyle]="{color: 'var(--primary-500)'}" class="text-5xl m-0">
    Relatórios
  </h2>
  <h3 [ngStyle]="{color: 'var(--primary-800)'}" class="mt-2 mb-0">
    Preencha o filtro para realizar uma pesquisa.
  </h3>

  <p-divider/>
  <div class="flex gap-4 mt-5 w-full">
    <div class="filter-bar">
      <p-calendar [(ngModel)]="filter.date" placeholder="Data do aluguel"></p-calendar>
      <p-dropdown 
        [options]="carModels" 
        [(ngModel)]="filter.model" 
        placeholder="Modelo do carro">
      </p-dropdown>
      <button pButton label="Buscar" (click)="onSearch()"></button>
    </div>
  </div>
  </section>
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
    console.log('Filtro:', this.filter);
    this.filterChange.emit(this.filter);
  }
}
