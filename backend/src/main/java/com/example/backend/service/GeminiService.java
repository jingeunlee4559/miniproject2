// filepath: backend/src/main/java/com/example/backend/service/GeminiService.java
package com.example.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;


@Service
public class GeminiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.endpoint}")
    private String ENDPOINT;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String availablePlacesJson;

    public GeminiService() throws IOException {
        // 서비스 시작 시 resources 폴더의 JSON 파일 내용을 읽어옵니다.
        ClassPathResource resource = new ClassPathResource("places.json");
        byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());
        this.availablePlacesJson = new String(data, StandardCharsets.UTF_8);
    }

    public String callGemini(String userPreferencesJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 사용자 입력 (userPreferencesJson)과 JSON 파일에서 읽어온 여행지 목록을 조합하여 프롬프트를 만듭니다.
String prompt = "Given the user's detailed travel preferences and a list of available places categorized by region, " +
                "recommend the top 3 travel destinations. **You must only recommend places from the specified `travel_region` in `User Preferences`**. If no places match the other criteria within that region, still only provide recommendations from that region's list. If the user's `travel_region` is not found in the `Available Places` list, you must return an empty JSON array `[]`. Do not recommend places from any other region. Use Google Maps to verify the recommendations match the user's criteria.\n" +
                "\n" +
                "- **Available Places:** " + availablePlacesJson + "\n" +
                "- **User Preferences:** " + userPreferencesJson + "\n" +
                "\n" +
                "- **Output Format:**\n" +
                "Return a JSON array containing only the `place_name` of the top 3 recommendations. " +
                "If no places can be recommended, return `[]`. Do not include any additional text or explanations.\n" +
                "[\n" +
                "  {\"place_name\": \"추천1\"},\n" +
                "  {\"place_name\": \"추천2\"},\n" +
                "  {\"place_name\": \"추천3\"}\n" +
                "]\n" +
                "\n" +
                "- **Task:**\n" +
                "Based on the provided `User Preferences`, perform the following steps:\n" +
                " 1. **Strictly filter the `Available Places` list to include only the region specified in `User Preferences`'s `travel_region`**. This is a hard constraint. If the region doesn't exist, proceed to step 5 immediately.\n" +
                " 2. Filter the places from the selected region based on `travel_theme` (e.g., 'activity', 'nature', 'culture'). For an 'activity' theme, prioritize places like 케이블카, 해수욕장, or 공원.\n" +
                " 3. Consider `travel_season` ('여름') and `travel_people` ('2'). For summer, recommend places suitable for warm weather.\n" +
                " 4. From the filtered list, recommend the top 3 best-matching places.\n" +
                " 5. **Provide the final recommendations in the specified JSON format. If the initial region filter in step 1 resulted in no places, return an empty JSON array `[]`**.\n";


        String filledPrompt = String.format(prompt, availablePlacesJson, userPreferencesJson.replace("\"", "\\\""));
        String jsonData = String.format("{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}", filledPrompt.replace("\"", "\\\""));

        HttpEntity<String> request = new HttpEntity<>(jsonData, headers);
        String url = ENDPOINT + "?key=" + apiKey;

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
    
        // Here's the fix: wrap the parsing logic in a try-catch block
        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String extractedText = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
            return extractedText.replaceAll("```json|```", "").trim();
        } catch (IOException e) {
            e.printStackTrace();
            return "Error parsing Gemini response: " + e.getMessage();
        }
    }
}