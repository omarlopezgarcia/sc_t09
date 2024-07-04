package pe.edu.vallegrande.app.rest;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pe.edu.vallegrande.app.model.GeminiImageAnalysis;
import pe.edu.vallegrande.app.service.impl.GeminiAnalysisServiceImpl;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/gemini")
public class GeminiRest {

    private final GeminiAnalysisServiceImpl geminiAnalysisService;

    public GeminiRest(GeminiAnalysisServiceImpl geminiAnalysisService) {
        this.geminiAnalysisService = geminiAnalysisService;
    }

    @PostMapping("/upload/image")
    public Mono<GeminiImageAnalysis> uploadFile(@RequestParam("file") MultipartFile file,
                                                @RequestParam("language") String language) {
        return geminiAnalysisService.processImage(file, language);
    }

    @GetMapping("/images/enabled")
    public Flux<GeminiImageAnalysis> getAllEnabledImages() {
        return geminiAnalysisService.getAllEnabled();
    }

    @GetMapping("/images/disabled")
    public Flux<GeminiImageAnalysis> getAllDisabledImages() {
        return geminiAnalysisService.getAllDisabled();
    }

    @PutMapping("/images/{id}")
    public Mono<GeminiImageAnalysis> updateImage(@PathVariable String id,
                                                 @RequestParam("file") MultipartFile file,
                                                 @RequestParam("language") String language) {
        return geminiAnalysisService.updateAnalysis(id, file, language);
    }


    @PutMapping("/images/disable/{id}")
    public Mono<GeminiImageAnalysis> disableImage(@PathVariable String id) {
        return geminiAnalysisService.disableAnalysis(id);
    }

    @PutMapping("/images/enable/{id}")
    public Mono<GeminiImageAnalysis> enableImage(@PathVariable String id) {
        return geminiAnalysisService.enableAnalysis(id);
    }
}
