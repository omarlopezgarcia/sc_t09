package pe.edu.vallegrande.app.model;

import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("gemini_languages")
public class GeminiLanguages {

    @Column("nombrelanguage")
    private String language;
}