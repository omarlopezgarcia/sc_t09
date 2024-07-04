import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiTopicComponent } from './gemini-topic.component';

describe('GeminiTopicComponent', () => {
  let component: GeminiTopicComponent;
  let fixture: ComponentFixture<GeminiTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeminiTopicComponent]
    });
    fixture = TestBed.createComponent(GeminiTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
