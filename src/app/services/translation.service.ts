import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation } from 'src/app/pages/interfaces/translation.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  private baseUrl = 'http://localhost:9090/api/v1/gem';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${this.baseUrl}/translations?status=A`);
  }  

  findAllInactive(): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${this.baseUrl}/translations?status=I`);
  }  

  updateTranslation(translation: Translation): Observable<string> {
    const url = `${this.baseUrl}/edit/${translation.id}`;
    return this.http.put(url, translation, { responseType: 'text' });
  }

  deleteTranslation(translationId: number): Observable<void> {
    const url = `${this.baseUrl}/inactive/${translationId}`;
    return this.http.delete<void>(url);
  }

  createTranslation(translation: Translation): Observable<Translation> {
    return this.http.post<Translation>(`${this.baseUrl}/translate`, translation);
  }

  getLanguages(): Observable<any> {
    const languagesUrl = 'http://localhost:9090/api/v1/languages';
    return this.http.get(languagesUrl);
  }
}