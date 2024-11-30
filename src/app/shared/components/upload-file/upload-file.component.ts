import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-upload-file',
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h2>Upload de arquivos</h2>
      <p>Selecione ou arraste um arquivo</p>
      <div class="file-upload">
        <label class="file-input">
          <input type="file" (change)="onFileSelect($event)" accept=".rtn" />
          <i class="pi pi-cloud-upload"></i> Selecionar arquivo
        </label>
        <p *ngIf="file">Arquivo selecionado:</p>
      </div>
      <button
        pButton
        label="Processar arquivo"
        (click)="uploadFile()"
        class="upload-button"
      ></button>
    </div>
  `,
  styles: [`
    .upload-container {
      text-align: center;
      max-width: 600px;
      margin: auto;
      border: 1px dashed #c0c0c0;
      padding: 20px;
      border-radius: 8px;
    }

    .file-upload {
      margin: 20px 0;
    }

    .file-input {
      display: inline-block;
      cursor: pointer;
      padding: 10px;
      border: 1px dashed #c0c0c0;
      border-radius: 4px;
      background: #f9f9f9;
    }

    .upload-button {
      background-color: #0056d2;
      color: white;
    }
    `]
})
export class UploadFileComponent {
  form: FormGroup;
  file: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      file: [null]
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  uploadFile(): void {
    if (!this.file) {
      alert('Selecione um arquivo antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post('http://localhost:8080/api/alugueis/processar-arquivo', formData)
      .subscribe({
        next: (response) => alert('Arquivo enviado com sucesso!'),
        error: (err) => alert('Erro ao enviar arquivo.')
      });
  }
}
