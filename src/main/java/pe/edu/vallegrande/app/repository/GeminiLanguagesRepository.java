package pe.edu.vallegrande.app.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import pe.edu.vallegrande.app.model.GeminiLanguages;
import reactor.core.publisher.Flux;

public interface GeminiLanguagesRepository extends ReactiveCrudRepository<GeminiLanguages, String> {
    @Query("SELECT * FROM gemini_languages ORDER BY nombrelanguage DESC")
    Flux<GeminiLanguages> getAll();

}