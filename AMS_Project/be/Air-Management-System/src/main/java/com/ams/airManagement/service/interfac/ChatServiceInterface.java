package com.ams.airManagement.service.interfac;

import java.util.List;
import java.util.Map;

public interface ChatServiceInterface {
    String getChatResponse(List<Map<String, Object>> chatHistory);

}
