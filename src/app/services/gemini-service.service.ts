import { GeminiImageAnalysis } from './../models/gemini-image-analysis';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeminiServiceService {
  private baseUrl = 'http://localhost:9090/api/v1/gemini';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, language: string): Observable<GeminiImageAnalysis> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    return this.http.post<GeminiImageAnalysis>(
      `${this.baseUrl}/upload/image`,
      formData
    );
  }

  getAllEnabledImages(): Observable<GeminiImageAnalysis[]> {
    return this.http.get<GeminiImageAnalysis[]>(
      `${this.baseUrl}/images/enabled`
    );
  }

  getAllDisabledImages(): Observable<GeminiImageAnalysis[]> {
    return this.http.get<GeminiImageAnalysis[]>(
      `${this.baseUrl}/images/disabled`
    );
  }

  updateImage(
    id: string,
    file: File,
    language: string
  ): Observable<GeminiImageAnalysis> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    return this.http.put<GeminiImageAnalysis>(
      `${this.baseUrl}/images/${id}`,
      formData
    );
  }

  disableImage(id: string): Observable<GeminiImageAnalysis> {
    return this.http.put<GeminiImageAnalysis>(
      `${this.baseUrl}/images/disable/${id}`,
      null
    );
  }

  enableImage(id: string): Observable<GeminiImageAnalysis> {
    return this.http.put<GeminiImageAnalysis>(
      `${this.baseUrl}/images/enable/${id}`,
      null
    );
  }
}
