import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <p-table [value]="reports" [paginator]="true" [rows]="10" [responsiveLayout]="'scroll'">
      <ng-template pTemplate="header">
        <tr>
          <th>DATA</th>
          <th>MODELO</th>
          <th>KM</th>
          <th>CLIENTE</th>
          <th>TELEFONE</th>
          <th>DEVOLUÇÃO</th>
          <th>PAGO</th>
          <th>VALOR</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-report>
        <tr>
          <td>{{ report?.dataAluguel || 'N/A' }}</td>
          <td>{{ report?.modeloCarro || 'N/A' }}</td>
          <td>{{ report?.kmCarro || 'N/A' }}</td>
          <td>{{ report?.nomeCliente || 'N/A' }}</td>
          <td>{{ report?.telefoneCliente || 'N/A' }}</td>
          <td>{{ report?.dataDevolucao || 'N/A' }}</td>
          <td>
            <span 
              [ngClass]="{'badge-success': report?.pago, 'badge-danger': !report?.pago}"
              class="badge">
              {{ report?.pago ? 'SIM' : 'NÃO' }}
            </span>
          </td>
          <td>{{ report?.valor ? (report.valor | currency: 'BRL') : 'N/A' }}</td>
        </tr>
      </ng-template>
    </p-table>
    <div class="footer">
      <p>Total de Débitos: {{ totalNaoPago | currency: 'BRL' }}</p>
    </div>
  `,
  styles: [`
    .footer {
      text-align: right;
      margin-top: 10px;
      font-weight: bold;
    }
    .badge-success {
      color: white;
      background-color: green;
      padding: 5px;
      border-radius: 5px;
    }
    .badge-danger {
      color: white;
      background-color: red;
      padding: 5px;
      border-radius: 5px;
    }
  `]
})
export class ReportTableComponent implements OnChanges {
  @Input() reports: any[] = [];
  totalNaoPago: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    
      this.totalNaoPago = this.reports
        .filter(report => report?.pago === "Não")
        .reduce((sum, report) => sum + parseFloat(report.valor.replace(',', '.')), 0);
    
  }
}
