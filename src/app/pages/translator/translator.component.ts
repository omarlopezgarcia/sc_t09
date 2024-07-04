import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';
import { Translation} from 'src/app/pages/interfaces/translation.interface';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  @ViewChild('editTranslationModal') editTranslationModal: any;

  textToTranslate: string = '';
  translatedText: string = '';
  translations: Translation[] = [];
  nameLanguages: { language: string }[] = [];
  selectedFromLanguage: string = 'Español';
  selectedToLanguage: string = 'English';
  dropdownState: { from: boolean; to: boolean } = { from: false, to: false };
  filteredLanguages: { from: { language: string }[]; to: { language: string }[] } = { from: [], to: [] };
  originalEnteredText: string = '';


editedTranslation: Translation = { id: 0, languages: '', entered_text: '', translated_text: '', status: '' };
page: number = 1;
showInactive: boolean = false;

  constructor(private translationService: TranslationService,  public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('Se inicio la lista de estudiantes');
    this.getTranslations();
    this.getLenguages();
  }

  getTranslations(): void {
    if (this.showInactive) {
      this.translationService.findAllInactive().subscribe(res => {
        console.log('Datos recibidos del servicio:', res);
        this.translations = res;
      });
    } else {
      this.translationService.findAll().subscribe(res => {
        console.log('Datos recibidos del servicio:', res);
        this.translations = res;
      });
    }
  }

  toggleActiveStatus(showInactive: boolean): void {
    this.showInactive = showInactive;
    this.getTranslations();
  }

  translate() {
    if (this.textToTranslate.trim() !== '') {
      console.log('Texto a traducir:', this.textToTranslate);
    } else {
      console.error('El texto a traducir está vacío');
    }
  }

  translateAndDisplay(): void {
    if (this.textToTranslate.trim() !== '') {
      const newTranslation: Translation = {
        languages: `${this.selectedToLanguage}`,
        entered_text: this.textToTranslate,
        id: 0,
        translated_text: '',
        status: 'A'
      };
  
      this.translationService.createTranslation(newTranslation).subscribe(
        (createdTranslation: Translation) => {
          console.log('Traducción creada:', createdTranslation);
          this.translatedText = createdTranslation.translated_text;
        },
        (error) => {
          console.error('Error al crear la traducción:', error);
        }
      );
    } else {
      console.error('El texto a traducir está vacío');
    }
  }
  
  saveTranslation(): void {
    if (this.textToTranslate.trim() !== '') {
      this.textToTranslate = '';
      this.getTranslations();
    } else {
      console.error('El texto a traducir está vacío');
    }
  }

  openEditModal(translation: Translation): void {
    this.editedTranslation = translation;
    this.originalEnteredText = translation.entered_text;
    this.dialog.open(this.editTranslationModal);
  }
  
editTranslation(translation: Translation) {
  this.translationService.updateTranslation(translation).subscribe(
    (response: string) => {
      console.log('Traducción actualizada exitosamente:', response);
      const index = this.translations.findIndex(t => t.id === translation.id);
      if (index !== -1) {
        this.translations[index] = translation;
        console.log('Traducción actualizada en la lista local:', translation);
      } else {
        console.error('No se encontró la traducción en la lista local');
      }
      this.getTranslations();
      this.closeEditModal();
    },
    (error) => {
      console.error('Error al actualizar la traducción:', error);
    }
  );
}

closeEditModal(): void {
  this.editedTranslation.entered_text = this.originalEnteredText;
  this.dialog.closeAll();
}

  deleteTranslation(translationId: number) {
    this.translationService.deleteTranslation(translationId).subscribe(
      () => {
        const index = this.translations.findIndex(translation => translation.id === translationId);
        if (index !== -1) {
          this.translations.splice(index, 1);
          console.log('Traducción eliminada exitosamente');
        } else {
          console.error('No se encontró la traducción en la lista local');
        }
      },
      (error) => {
        console.error('Error al eliminar la traducción:', error);
      }
    );
  }

  swapLanguages() {
    [this.selectedFromLanguage, this.selectedToLanguage] = [this.selectedToLanguage, this.selectedFromLanguage];
    this.translate();
  }

  toggleDropdown(type: 'from' | 'to') {
    this.dropdownState[type] = !this.dropdownState[type];
  }

  isDropdownOpen(type: 'from' | 'to'): boolean {
    return this.dropdownState[type];
  }

  filterLanguages(query: string, type: 'from' | 'to') {
    const lowercaseQuery = query.toLowerCase();
    this.filteredLanguages[type] = this.nameLanguages.filter(language =>
      language.language.toLowerCase().includes(lowercaseQuery)
    );
  }

  selectLanguage(name: string, type: 'from' | 'to') {
    if (type === 'from') {
      this.selectedFromLanguage = name;
    } else {
      this.selectedToLanguage = name;
    }
    this.toggleDropdown(type);
    this.translate();
  }

  getLenguages() {
    this.translationService.getLanguages().subscribe(languages => {
      console.log('Lenguajes recibidos del servicio:', languages);
      this.nameLanguages = languages;
    });
  }
}