package pe.edu.vallegrande.app.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pe.edu.vallegrande.app.model.GeminiTopicResponse;
import pe.edu.vallegrande.app.service.GeminiTopicService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/gemini-topic")
@CrossOrigin("*")
public class GeminiTopicRest {

    @Autowired
    private GeminiTopicService geminiService;

    @PostMapping("/ask")
    public Mono<String> askQuestion(@RequestBody GeminiTopicResponse request) throws Exception {
        return geminiService.askQuestion(request.getTopic(), request.getQuestion());
    }

    @GetMapping("/all")
    public Flux<GeminiTopicResponse> getAllResponses() {
        return geminiService.getAllResponses();
    }

    @PutMapping("/update/{id}")
    public Mono<GeminiTopicResponse> updateResponse(@PathVariable String id, @RequestBody GeminiTopicResponse request) {
        return geminiService.updateResponse(id, request)
                .onErrorResume(e -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage())));
    }

    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<String>> deleteResponse(@PathVariable String id) {
        return geminiService.deleteResponse(id)
                .map(message -> ResponseEntity.ok(message))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al eliminar la pregunta: " + e.getMessage())));
    }
}
