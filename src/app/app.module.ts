import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslatorComponent } from './pages/translator/translator.component';
import { ImageAnalyzerComponent } from './pages/image-analyzer/image-analyzer.component';
import { GeminiTopicComponent } from './pages/gemini-topic/gemini-topic.component';
import { PanelComponent } from './pages/panel/panel.component';
import { TranslationService } from './services/translation.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    TranslatorComponent,
    ImageAnalyzerComponent,
    GeminiTopicComponent,
    PanelComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgxPaginationModule
  ],
  providers: [TranslationService],
  bootstrap: [AppComponent]
})
export class AppModule { }