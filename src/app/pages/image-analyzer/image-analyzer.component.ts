import { Component, ElementRef, ViewChild } from '@angular/core';
import { GeminiServiceService } from 'src/app/services/gemini-service.service';
import { GeminiImageAnalysis } from 'src/app/models/gemini-image-analysis';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-analyzer',
  templateUrl: './image-analyzer.component.html',
  styleUrls: ['./image-analyzer.component.css'],
})
export class ImageAnalyzerComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  file: File | null = null;
  language = '';
  response: GeminiImageAnalysis | null = null;
  imageAnalysisList: GeminiImageAnalysis[] = [];
  isLoading = false;
  previewUrl: string | ArrayBuffer | null = null;
  showDisabled = false;
  filteredImageAnalysisList: GeminiImageAnalysis[] = [];
  activeEditId: string | null = null;

  constructor(private geminiService: GeminiServiceService) {}

  ngOnInit() {
    this.loadAllEnabledImages();
    this.loadAllDisabledImages();
  }

  loadAllEnabledImages() {
    this.geminiService.getAllEnabledImages().subscribe(
      (data: GeminiImageAnalysis[]) => {
        this.imageAnalysisList = data.sort((a, b) => a.id - b.id);
        this.filterImages();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadAllDisabledImages() {
    this.geminiService.getAllDisabledImages().subscribe(
      (data: GeminiImageAnalysis[]) => {
        this.imageAnalysisList = data.sort((a, b) => a.id - b.id);
        this.filterImages();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  filterImages() {
    this.filteredImageAnalysisList = this.imageAnalysisList.filter(
      (imageAnalysis) => (this.showDisabled ? true : imageAnalysis.active)
    );
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.file = files.item(0);

    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.showChat();
        this.scrollToBottom();
      };
      reader.readAsDataURL(this.file);
    }
  }

  isFormValid(): boolean {
    return this.file !== null && this.language !== '';
  }

  onSubmit() {
    if (this.file && this.language) {
      this.isLoading = true;
      this.geminiService.uploadImage(this.file, this.language).subscribe(
        (response: GeminiImageAnalysis) => {
          console.log(response);
          this.response = response;
          this.loadAllEnabledImages();
          this.isLoading = false;
          this.clearForm();
        },
        (error) => {
          console.error(error);
          this.response = null;
          this.isLoading = false;
        }
      );
    }
  }

  clearForm() {
    this.file = null;
    this.language = '';
    this.previewUrl = null;
  }

  showChat() {
    const chatContainerElement = this.chatContainer.nativeElement;
    chatContainerElement.style.display = 'block';
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
  toggleDisplay() {
    this.showDisabled = !this.showDisabled;
    if (this.showDisabled) {
      this.loadAllDisabledImages();
    } else {
      this.loadAllEnabledImages();
    }
  }
  disableImage(id: string) {
    this.isLoading = true;
    this.geminiService.disableImage(id).subscribe(
      () => {
        this.loadAllEnabledImages();
        this.isLoading = false;
        Swal.fire(
          'Imagen Deshabilitada',
          'La imagen se ha deshabilitado exitosamente',
          'success'
        );
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        Swal.fire(
          'Error',
          'Se produjo un error al deshabilitar la imagen',
          'error'
        );
      }
    );
  }

  enableImage(id: string) {
    this.isLoading = true;
    this.geminiService.enableImage(id).subscribe(
      () => {
        this.loadAllDisabledImages();
        this.isLoading = false;
        Swal.fire(
          'Imagen Habilitada',
          'La imagen se ha habilitado exitosamente',
          'success'
        );
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        Swal.fire(
          'Error',
          'Se produjo un error al habilitar la imagen',
          'error'
        );
      }
    );
  }

  cancelEdit() {
    this.activeEditId = null;
  }

  updateImage(id: string) {
    if (this.file && this.language) {
      this.isLoading = true;
      this.geminiService.updateImage(id, this.file, this.language).subscribe(
        () => {
          this.loadAllEnabledImages();
          this.isLoading = false;
          this.clearForm();
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    }
  }
}
