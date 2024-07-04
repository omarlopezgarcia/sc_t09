package pe.edu.vallegrande.app.service;

import pe.edu.vallegrande.app.model.GeminiLanguages;
import reactor.core.publisher.Flux;


public interface GeminiLanguagesService {

    Flux<GeminiLanguages> getAll();

}