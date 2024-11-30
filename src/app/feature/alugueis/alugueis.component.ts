import { Component } from '@angular/core';
import { UploadFileComponent } from "../../shared/components/upload-file/upload-file.component";

@Component({
  selector: 'app-alugueis',
  standalone: true,
  imports: [UploadFileComponent],
  template: `
    <app-upload-file></app-upload-file>
  `
})
export class AlugueisComponent {

}
