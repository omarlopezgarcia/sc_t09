package pe.edu.vallegrande.app.service;

import org.springframework.web.multipart.MultipartFile;
import pe.edu.vallegrande.app.model.GeminiImageAnalysis;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface GeminiImageAnalysisService {
    Mono<GeminiImageAnalysis> processImage(MultipartFile file, String language);

    Flux<GeminiImageAnalysis> getAllEnabled();
    Flux<GeminiImageAnalysis> getAllDisabled();

    Mono<GeminiImageAnalysis> updateAnalysis(String id, MultipartFile file, String language);

    Mono<GeminiImageAnalysis> disableAnalysis(String analysisId);

    Mono<GeminiImageAnalysis> enableAnalysis(String analysisId);
}
