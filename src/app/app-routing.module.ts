import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageAnalyzerComponent } from '../app/pages/image-analyzer/image-analyzer.component';
import { TranslatorComponent } from './pages/translator/translator.component';
import { GeminiTopicComponent } from './pages/gemini-topic/gemini-topic.component';
import { PanelComponent } from './pages/panel/panel.component';

const routes: Routes = [
  { path: 'panel', component: PanelComponent },
  { path: 'traductor', component: TranslatorComponent },
  { path: 'analizador-imagenes', component: ImageAnalyzerComponent },
  { path: 'gemini-roles', component: GeminiTopicComponent },
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  { path: '**', redirectTo: '/panel' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
