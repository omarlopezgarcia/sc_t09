package pe.edu.vallegrande.app.rest;

import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.app.model.GeminiLanguages;
import pe.edu.vallegrande.app.service.impl.GeminiLanguagesServiceImpl;
import reactor.core.publisher.Flux;

@RestController
@CrossOrigin
@RequestMapping("/languages")
public class GeminiLanguagesRest {

    private final GeminiLanguagesServiceImpl geminiLanguagesService;

    public GeminiLanguagesRest(GeminiLanguagesServiceImpl geminiLanguagesService) {
        this.geminiLanguagesService = geminiLanguagesService;
    }

    @GetMapping()
    public Flux<GeminiLanguages> getAllLenguages() {
        return geminiLanguagesService.getAll();
    }

}