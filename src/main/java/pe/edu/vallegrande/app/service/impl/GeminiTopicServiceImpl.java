package pe.edu.vallegrande.app.service.impl;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.app.model.GeminiTopicResponse;
import pe.edu.vallegrande.app.repository.GeminiTopicRepository;
import pe.edu.vallegrande.app.service.GeminiTopicService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import static pe.edu.vallegrande.app.util.Constant.GEMINI_API_URL;

@Service
public class GeminiTopicServiceImpl implements GeminiTopicService {

    private final OkHttpClient client;

    @Autowired
    private GeminiTopicRepository responseRepository;

    public GeminiTopicServiceImpl() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    @Override
    public Mono<String> askQuestion(String topic, String question) {
        if (relatedQuestion(topic, question)) {
            return getGeminiResponse(question)
                    .flatMap(answer -> saveResponse(topic, question, answer).thenReturn(answer))
                    .onErrorResume(e -> Mono.just("Error al obtener respuesta: " + e.getMessage()));
        } else {
            return Mono.just("La pregunta no está relacionada con el tema proporcionado.");
        }
    }

    @Override
    public Flux<GeminiTopicResponse> getAllResponses() {
        return responseRepository.getAll();
    }

    @Override
    public Mono<GeminiTopicResponse> updateResponse(String id, GeminiTopicResponse request) {
        return responseRepository.findById(id)
                .flatMap(existingResponse -> {
                    String newTopic = request.getTopic() != null ? request.getTopic() : existingResponse.getTopic();
                    String newQuestion = request.getQuestion() != null ? request.getQuestion() : existingResponse.getQuestion();

                    if (relatedQuestion(newTopic, newQuestion)) {
                        return getGeminiResponse(newQuestion)
                                .flatMap(newAnswer -> {
                                    existingResponse.setTopic(newTopic);
                                    existingResponse.setQuestion(newQuestion);
                                    existingResponse.setAnswer(newAnswer);
                                    return responseRepository.save(existingResponse);
                                });
                    } else {
                        return Mono.error(new IllegalArgumentException("La pregunta no está relacionada con el tema proporcionado."));
                    }
                })
                .switchIfEmpty(Mono.error(new IllegalArgumentException("No se encontró la respuesta con el ID proporcionado.")));
    }

    @Override
    public Mono<String> deleteResponse(String id) {
        return responseRepository.findById(id)
                .flatMap(existingResponse ->
                        responseRepository.delete(existingResponse)
                                .then(Mono.just("Pregunta eliminada correctamente.")))
                .switchIfEmpty(Mono.error(new IllegalArgumentException("No se encontró la respuesta con el ID proporcionado.")));
    }

    private boolean relatedQuestion(String topic, String question) {
        String[] topicWords = topic.toLowerCase().split(" ");
        String[] questionWords = question.toLowerCase().split(" ");

        for (String wordTopic : topicWords) {
            for (String wordQuestion : questionWords) {
                if (wordQuestion.contains(wordTopic) || wordTopic.contains(wordQuestion)) {
                    return true;
                }
            }
        }
        return false;
    }

    private Mono<String> getGeminiResponse(String question) {
        return Mono.create(sink -> {
            try {
                MediaType mediaType = MediaType.parse("application/json");
                String jsonBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + question + "\"}]}]}";
                RequestBody body = RequestBody.create(jsonBody, mediaType);
                Request request = new Request.Builder()
                        .url(GEMINI_API_URL)
                        .post(body)
                        .addHeader("Content-Type", "application/json")
                        .build();

                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        sink.error(e);
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (!response.isSuccessful()) {
                            sink.error(new IOException("Error en la solicitud: " + response));
                        } else {
                            try {
                                String responseBody = response.body().string();
                                sink.success(parseResponse(responseBody));
                            } catch (JSONException e) {
                                sink.error(e);
                            }
                        }
                    }
                });
            } catch (Exception e) {
                sink.error(e);
            }
        });
    }

    private String parseResponse(String responseBody) throws JSONException {
        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray candidates = jsonResponse.getJSONArray("candidates");
        JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");
        JSONObject textObj = parts.getJSONObject(0);
        return textObj.getString("text");
    }

    private Mono<Void> saveResponse(String topic, String question, String answer) {
        GeminiTopicResponse response = new GeminiTopicResponse();
        response.setTopic(topic);
        response.setQuestion(question);
        response.setAnswer(answer);
        return responseRepository.save(response).then();
    }
}
