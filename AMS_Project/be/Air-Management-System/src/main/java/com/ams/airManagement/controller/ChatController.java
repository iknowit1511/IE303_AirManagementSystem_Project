package com.ams.airManagement.controller;

import com.ams.airManagement.service.interfac.ChatServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    @Qualifier("chatServiceImplement")
    private ChatServiceInterface chatService;

    static class ChatRequest {
        private List<Map<String, Object>> chatHistory;

        public List<Map<String, Object>> getChatHistory() {
            return chatHistory;
        }

        public void setChatHistory(List<Map<String, Object>> chatHistory) {
            this.chatHistory = chatHistory;
        }
    }

    @PostMapping("/all")
    public ResponseEntity<Map<String, String>> getChatResponse(@RequestBody ChatRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String botReply = chatService.getChatResponse(request.getChatHistory());
            response.put("reply", botReply);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("reply", "Xin lỗi, đã có lỗi xảy ra ở phía máy chủ. Vui lòng thử lại sau.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
