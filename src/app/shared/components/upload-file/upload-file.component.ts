import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, signal, ViewChild } from '@angular/core';
import { BadgeModule } from "primeng/badge";
import { FileUpload, FileUploadModule } from "primeng/fileupload";
import { ToastModule } from "primeng/toast";
import { NotificationService } from '../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-upload-file',
  imports: [
    FileUploadModule,
    BadgeModule,
    ToastModule 
  ],
  providers: [NotificationService],
  template: `
    <section class="flex gap-4 justify-content-between align-items-center">
  @if (fileStatus() === "UNSET") {
    <div
      class="card border-1 border-dashed flex justify-content-between align-items-center p-3 w-8"
      (drop)="onDrop($event)"
      (dragover)="onDragOver($event)"
    >
      <i class="fa fa-cloud-upload text-primary-500 text-7xl"></i>
      <div class="text-center">
        <span class="font-bold">Selecione ou arraste um arquivo <strong class="text-red-500">*</strong></span>
        <div class="font-light mt-2 text-sm">
          <span>Tipo: RTN</span><br/>
          <span>O Tamanho do arquivo não pode ser maior que 10MB.</span>
        </div>
      </div>
      <p-fileUpload
        #fileUpload
        name="file"
        accept=".rtn"
        [maxFileSize]="10485760"
        chooseLabel="Selecione"
        mode="basic"
        [auto]="false"
        (onSelect)="onFileSelect($event)"
      ></p-fileUpload>
    </div>
  } @else if (fileStatus() === "UPLOADING") {
    <div
      class="card border-1 border-dashed flex justify-content-between align-items-center p-3 w-8 gap-4"
    >
      <i class="fa fa-file-image-o text-primary-500 text-7xl"></i>
      <div class="text-center w-full">
        <div class="flex justify-content-between">
          @if (selectedFile) {
            <span>{{ selectedFile.name }}</span>
            <span>{{ getFileSize(selectedFile.size) }}</span>
          }
        </div>
        <p-progressBar
          [value]="uploadProgress()"
          styleClass="w-full mt-2"
          [showValue]="false"
          [style]="{'height': '6px'}"
        />
      </div>

    </div>
  } @else if (fileStatus() === "SELECTED" ) {
    <div
      class="card border-1 border-dashed flex justify-content-between align-items-center p-3 w-8 gap-4"
    >
      <i class="fa fa-file-image-o text-primary-500 text-7xl"></i>
      <div class="text-center w-full">
        <div class="flex justify-content-between">
          @if (selectedFile) {
            <span>{{ selectedFile.name }}</span>
            <span>{{ getFileSize(selectedFile.size) }}</span>
          }
        </div>
      </div>
      <p-button
        icon="fa fa-trash"
        severity="danger"
        [rounded]="true"
        [text]="true"
        size="large"
        (click)="removeFile()"
      />

    </div>
  } @else if (fileStatus() === "UPLOADED") {
    <div
      class="card border-1 border-dashed flex justify-content-between align-items-center p-3 w-8 gap-4"
    >
      <i class="fa fa-check-circle text-primary-500 text-7xl"></i>
      <div class="text-center w-full">
        <div class="flex justify-content-between">
          @if (selectedFile) {
            <span>{{ selectedFile.name }}</span>
            <span>{{ getFileSize(selectedFile.size) }}</span>
          }
        </div>
      </div>
      <p-button
        label="Enviar outro arquivo"
        severity="secondary"
        [text]="true"
        [raised]="true"
        (click)="removeFile()"
      />

    </div>
  }

  <p-button
    label="Processar arquivo"
    [disabled]="fileStatus() !== 'SELECTED'"
    (click)="processFile()"
  />
</section>
  `
})
export class UploadFileComponent {
  
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  fileStatus = signal<"UNSET" | "SELECTED" | "UPLOADING" | "UPLOADED">("UNSET");
  uploadProgress = signal<number>(0);
  selectedFile: File | null = null;

  constructor(private http: HttpClient,private notificationService: NotificationService) {}

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file && file.name.endsWith('.rtn')) {
      this.selectedFile = file;
      this.fileStatus.set("SELECTED");
    } else {
      this.notificationService.errorMessage("Arquivo Inválido", "Somente arquivos .rtn são permitidos.");
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      const validFiles = files.filter(file => file.name.endsWith('.rtn'));

      if (validFiles.length !== files.length) {
        this.notificationService.errorMessage("Arquivo Inválido", "Somente arquivos .rtn são permitidos.");
      }

      if (validFiles.length > 0) {
        this.selectedFile = validFiles[0];
        this.fileStatus.set("SELECTED");
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onProgress(event: any) {
    console.log(event)
    this.uploadProgress.set(Math.round((event.loaded / event.total) * 100));
    console.log(event.loaded, event.total);
    if (this.uploadProgress() === 100) {
      this.fileStatus.set("UPLOADED");
    }
  }

  getFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1024 / 1024).toFixed(2) + ' MB';
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileStatus.set("UNSET");
    this.uploadProgress.set(0);
  }

  processFile() {
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile);
    }
  }

  uploadFile(file: File | null): void {
    if (!file) {
      this.notificationService.errorMessage('Erro ao enviar arquivo', 'Selecione um arquivo antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:8080/api/alugueis/processar-arquivo', formData)
      .subscribe({
        next: (response) => {
          console.log(response);
          const notificationData = response as { totalRegistro: number, mensagem : string };
          this.notificationService.successMessage('Arquivo enviado com sucesso', notificationData.mensagem);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.notificationService.errorMessage('Erro ao enviar arquivo', 'Erro ao enviar arquivo.');
        }
      });
  }
}

