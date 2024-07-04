package pe.edu.vallegrande.app.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.app.model.GeminiTranslate;
import pe.edu.vallegrande.app.service.impl.GeminiTranslateServiceImpl;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin
@RequestMapping("/gem")
public class GeminiTranslateRest {

    private final GeminiTranslateServiceImpl geminiTranslateService;

    public GeminiTranslateRest(GeminiTranslateServiceImpl geminiTranslateService) {
        this.geminiTranslateService = geminiTranslateService;
    }

    @GetMapping("/translations")
    public Flux<GeminiTranslate> getAllTranslations(@RequestParam(required = false) String status) {
        return geminiTranslateService.getAll(status);
    }

    @PostMapping("/translate")
    public Mono<GeminiTranslate> translateText(@RequestBody GeminiTranslate request) {
        return geminiTranslateService.translateText(request.getEntered_text(), request.getLanguages());
    }

    @PutMapping("/edit/{id}")
    public Mono<ResponseEntity<String>> editTranslation(
            @PathVariable Long id,
            @RequestBody GeminiTranslate requestBody) {

        String newLanguages = requestBody.getLanguages();
        String newEnteredText = requestBody.getEntered_text();

        return geminiTranslateService.editTranslation(id, newLanguages, newEnteredText)
                .map(updatedText -> ResponseEntity.ok().body("Traducción actualizada exitosamente"));
    }

    @DeleteMapping("/inactive/{id}")
    public Mono<ResponseEntity<GeminiTranslate>> changeStatusToInactive(@PathVariable Long id) {
        return geminiTranslateService.inactive(id)
                .map(updatedTranslation -> ResponseEntity.ok(updatedTranslation))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
