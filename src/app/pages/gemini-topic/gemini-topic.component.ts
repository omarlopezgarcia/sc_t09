import { Component, AfterViewInit, OnInit } from '@angular/core';
import { GeminiTopicResponse, GeminiTopicService } from './gemini-topic.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-gemini-topic',
  templateUrl: './gemini-topic.component.html',
  styleUrls: ['./gemini-topic.component.css']
})
export class GeminiTopicComponent implements OnInit {

  topics: GeminiTopicResponse[] = [];
  filteredTopics: GeminiTopicResponse[] = [];
  selectedQuestion: GeminiTopicResponse | null = null;
  searchTerm: string = '';
  formTopic: { topic: string; question: string; } | undefined;

  constructor(private geminiTopicService: GeminiTopicService) { }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.geminiTopicService.getAllResponses().subscribe(
      (responses) => {
        this.topics = responses;
        this.filteredTopics = responses;
      },
      (error) => console.error(error)
    );
  }

  toggleExpand(index: number): void {
    const element = document.getElementById(`item${index}-ctrld`);
    if (element) {
      const expanded = element.getAttribute('aria-hidden') === 'true' ? 'false' : 'true';
      element.setAttribute('aria-hidden', expanded);
    }
  }

  expandAll(): void {
    this.topics.forEach((_, index) => {
      const element = document.getElementById(`item${index}-ctrld`);
      if (element) {
        element.setAttribute('aria-hidden', 'false');
      }
    });
  }

  collapseAll(): void {
    this.topics.forEach((_, index) => {
      const element = document.getElementById(`item${index}-ctrld`);
      if (element) {
        element.setAttribute('aria-hidden', 'true');
      }
    });
  }

  filterTopics(): void {
    this.filteredTopics = this.topics.filter(topic =>
      topic.topic.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  cancelEdit(): void {
    this.selectedQuestion = null;
  }

  /*CRUD*/

  insertQuestion(formData: NgForm): void {
    const newQuestion: GeminiTopicResponse = {
      id: '',
      topic: formData.value.topic,
      question: formData.value.question,
      answer: ''
    };

    this.geminiTopicService.addQuestion(newQuestion).subscribe(
      (response) => {
        alert(response);
        this.loadTopics();
      },
      (error) => {
        alert('Respuesta de inserción de la pregunta: ' + error);
        this.loadTopics();
        this.resetForm(formData);
      }
    );
  }

  resetForm(newQuestion: NgForm): void {
    this.formTopic = {
      topic: '',
      question: '',
    };
    newQuestion.resetForm();
  }

  selectQuestion(question: GeminiTopicResponse): void {
    this.selectedQuestion = { ...question };
  }

  editQuestion(updatedQuestion: { topic: string, question: string }): void {
    if (this.selectedQuestion) {
      const questionToUpdate: GeminiTopicResponse = {
        ...this.selectedQuestion,
        topic: updatedQuestion.topic,
        question: updatedQuestion.question
      };
      this.geminiTopicService.updateQuestion(this.selectedQuestion.id, questionToUpdate).subscribe(
        (response) => {
          alert('Pregunta actualizada correctamente');
          this.loadTopics();
          this.selectedQuestion = null;
        },
        (error) => alert('Error al actualizar la pregunta: ' + error)
      );
    }
  }

  deleteQuestion(id: string): void {
    this.geminiTopicService.deleteQuestion(id).subscribe(
      (response) => {
        alert('Pregunta eliminada correctamente');
        this.loadTopics();
      },
      (error) => alert('Error al eliminar la pregunta: ' + error)
    );
  }
}