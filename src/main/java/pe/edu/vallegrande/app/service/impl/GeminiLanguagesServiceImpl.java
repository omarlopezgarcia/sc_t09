package pe.edu.vallegrande.app.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.app.model.GeminiLanguages;
import pe.edu.vallegrande.app.repository.GeminiLanguagesRepository;
import pe.edu.vallegrande.app.service.GeminiLanguagesService;
import reactor.core.publisher.Flux;

@Service
public class GeminiLanguagesServiceImpl implements GeminiLanguagesService {

    private final GeminiLanguagesRepository repository;

    @Autowired
    public GeminiLanguagesServiceImpl(GeminiLanguagesRepository repository) {
        this.repository = repository;
    }

    @Override
    public Flux<GeminiLanguages> getAll() {
        return repository.findAll();
    }
}