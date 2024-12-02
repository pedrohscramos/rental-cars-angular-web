import { NgStyle } from "@angular/common";
import { Component } from '@angular/core';
import { DividerModule } from "primeng/divider";
import { UploadFileComponent } from "../../shared/components/upload-file/upload-file.component";

@Component({
  selector: 'app-alugueis',
  standalone: true,
  imports: [UploadFileComponent,DividerModule,NgStyle],
  template: `
    <section class="flex flex-column gap-3 pl-3 pr-3">
  <div>
    <h2 [ngStyle]="{color: 'var(--primary-500)'}" class="text-5xl m-0">
      Alugueis
    </h2>
    <h3 [ngStyle]="{color: 'var(--primary-800)'}" class="mt-2 mb-0">
      Faça o upload do arquivo .rtn.
    </h3>

    <p-divider/>
  </div>

  <app-upload-file />
</section>
  `
})
export class AlugueisComponent {

}
