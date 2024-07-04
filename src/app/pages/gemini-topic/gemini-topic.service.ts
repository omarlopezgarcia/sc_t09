import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

export interface GeminiTopicResponse {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiTopicService {
  private apiUrl = 'http://localhost:9090/api/v1/gemini-topic';

  constructor(private http: HttpClient) { }

  getAllResponses(): Observable<GeminiTopicResponse[]> {
    return this.http.get<GeminiTopicResponse[]>(`${this.apiUrl}/all`);
  }

  addQuestion(newQuestion: GeminiTopicResponse): Observable<GeminiTopicResponse> {
    return this.http.post<GeminiTopicResponse>(`${this.apiUrl}/ask`, newQuestion);
  }

  updateQuestion(id: string, updatedQuestion: GeminiTopicResponse): Observable<GeminiTopicResponse> {
    return this.http.put<GeminiTopicResponse>(`${this.apiUrl}/update/${id}`, updatedQuestion);
  }

  deleteQuestion(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, { responseType: 'text' as 'json' });
  }


  /*Java Script (No funciona xd)*/
  initializeCollapsibleTopic(selector: string): void {
    new CollapsibleTopic(selector);
  }
}

class CollapsibleTopic {
  private el: HTMLElement | null;

  constructor(el: string) {
    this.el = document.querySelector(el) as HTMLElement;
    if (this.el) {
      this.init();
    }
  }

  private init(): void {
    if (this.el) {
      this.el.addEventListener("click", this.itemAction.bind(this));
    }
  }

  private animateItemAction(button: HTMLElement, ctrld: HTMLElement, contentHeight: number, shouldCollapse: boolean): void {
    const expandedClass = "topic__item-body--expanded";
    const animOptions: KeyframeAnimationOptions = {
      duration: 300,
      easing: "cubic-bezier(0.65,0,0.35,1)"
    };

    if (shouldCollapse) {
      button.setAttribute("aria-expanded", "false");
      ctrld.setAttribute("aria-hidden", "true");
      ctrld.classList.remove(expandedClass);
      ctrld.animate([
        { height: `${contentHeight}px` },
        { height: `${contentHeight}px` },
        { height: "0px" }
      ], animOptions);
    } else {
      button.setAttribute("aria-expanded", "true");
      ctrld.setAttribute("aria-hidden", "false");
      ctrld.classList.add(expandedClass);
      ctrld.animate([
        { height: "0px" },
        { height: `${contentHeight}px` }
      ], animOptions);
    }
  }

  private itemAction(e: Event): void {
    const target = e.target as HTMLElement;
    const action = target?.getAttribute("data-action");
    const item = target?.getAttribute("data-item");

    if (this.el) {
      if (action) {
        const targetExpanded = action === "expand" ? "false" : "true";
        const buttons = Array.from(this.el.querySelectorAll(`[aria-expanded="${targetExpanded}"]`)) as HTMLElement[];
        const wasExpanded = action === "collapse";

        for (let button of buttons) {
          const buttonID = button.getAttribute("data-item");
          const ctrld = this.el.querySelector(`#item${buttonID}-ctrld`) as HTMLElement;
          const contentHeight = ctrld.firstElementChild?.clientHeight || 0;

          this.animateItemAction(button, ctrld, contentHeight, wasExpanded);
        }

      } else if (item) {
        const button = this.el.querySelector(`[data-item="${item}"]`) as HTMLElement;
        const expanded = button?.getAttribute("aria-expanded");

        if (!expanded) return;

        const wasExpanded = expanded === "true";
        const ctrld = this.el.querySelector(`#item${item}-ctrld`) as HTMLElement;
        const contentHeight = ctrld.firstElementChild?.clientHeight || 0;

        this.animateItemAction(button, ctrld, contentHeight, wasExpanded);
      }
    }
  }
}
