package com.ams.airManagement.service.implement;

import com.ams.airManagement.entity.Flights;
import com.ams.airManagement.entity.Locations;
import com.ams.airManagement.entity.Provinces;
import com.ams.airManagement.repository.FlightsRepository;
import com.ams.airManagement.repository.LocationsRepository;
import com.ams.airManagement.service.interfac.ChatServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.json.JSONArray;
import org.json.JSONObject;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service("chatServiceImplement")
@Primary
public class ChatServiceImpl implements ChatServiceInterface {

    @Autowired
    private FlightsRepository flightsRepository;

    @Autowired
    private LocationsRepository locationsRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private final String systemPrompt = """
            Bạn là một tiếp viên hàng không thân thiện, chuyên nghiệp và chỉ tập trung vào việc cung cấp thông tin chính xác.
            Hãy trả lời ngắn gọn, lịch sự, dễ hiểu và sử dụng định dạng HTML với:<br/>
        - Xuống dòng bằng thẻ &lt;br/&gt;<br/>
        - Đánh dấu đầu dòng bằng dấu ➤<br/>
        - In đậm tiêu đề bằng thẻ &lt;b&gt;<br/>
        - Luôn trả lời bằng tiếng Việt.<br/>
        Nếu câu hỏi liên quan đến chính sách, hãy trả lời theo các chính sách được quy định sẵn.<br/>
        Nếu không tìm thấy chuyến bay, hãy gợi ý khách thử lại với điều kiện khác.<br/>
        Khi bạn nhận được kết quả từ chức năng tìm kiếm chuyến bay (searchFlights), hãy hiển thị chi tiết các chuyến bay đó TRỰC TIẾP trong câu trả lời của bạn. TUYỆT ĐỐI KHÔNG thêm bất kỳ văn bản giới thiệu, chào mừng, hoặc thông báo tìm kiếm nào khác ngoài kết quả được cung cấp từ tool. Ví dụ: KHÔNG nói "Hệ thống đang tìm kiếm..." hoặc "Chào mừng bạn!". Chỉ trả lời trực tiếp kết quả.<br/>
        Luôn sử dụng thẻ &lt;br/&gt; để xuống dòng thay vì ký tự \\n.
        """;


    private JSONArray getToolDeclarations() {
        JSONArray tools = new JSONArray();

        JSONObject searchFlightsTool = new JSONObject();
        searchFlightsTool.put("function_declarations", new JSONObject()
                .put("name", "searchFlights")
                .put("description", "Tìm kiếm các chuyến bay có sẵn dựa trên điểm khởi hành, điểm đến, ngày, giờ hoặc hãng hàng không. Công cụ này PHẢI được sử dụng khi người dùng hỏi về tình trạng chuyến bay, lịch bay hoặc giá vé giữa hai địa điểm, vào một ngày cụ thể hoặc cho một hãng hàng không cụ thể.(Ví dụ: có chuyến bay nào từ Hồ Chí Minh (hoặc HCM) đến Đà Lạt (hoặc DL) vào ngày 1/4/2021 không?")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("departureProvince", new JSONObject().put("type", "STRING").put("description", "Mã IATA 3 chữ cái hoặc tên đầy đủ của tỉnh/thành phố khởi hành (ví dụ:'HN' for Hà Nội, 'HCM' for Hồ Chí Minh, 'DN' for Đà Nẵng, 'HP' for Hải Phòng, 'PQ' for Phú Quốc, 'NT' for Nha Trang, 'DL' for Đà Lạt, 'TH' for Thanh Hóa, 'VINH' for Vinh (Nghệ An), 'HUE' for Huế, 'QNAM' for Quảng Nam, 'QN' for Quy Nhơn , 'CT' for Cần Thơ))"))
                                .put("destinationProvince", new JSONObject().put("type", "STRING").put("description", "Mã IATA 3 chữ cái hoặc tên đầy đủ của tỉnh/thành phố điểm đến."))
                                .put("takeoffDate", new JSONObject().put("type", "STRING").put("description", "The specific date of the flight in DD/MM/YYYY or D/M/YYYY format."))
                                .put("takeoffTime", new JSONObject().put("type", "STRING").put("description", "The specific time of the flight in HH:MM or H:MM format."))
                                .put("airline", new JSONObject().put("type", "STRING").put("description", "The name of the airline (e.g., 'Vietnam Airlines', 'Vietjet', 'Bamboo Airways', 'Pacific Airlines')."))
                        )
                        .put("required", new JSONArray())
                )
        );
        tools.put(searchFlightsTool);


        JSONObject getPolicyTool = new JSONObject();
        getPolicyTool.put("function_declarations", new JSONObject()
                .put("name", "getPolicy")
                .put("description", "Truy xuất thông tin về các chính sách khác nhau như chính sách hoàn vé, giá vé, hành lý, đổi vé hoặc chính sách trẻ em. Công cụ này PHẢI được sử dụng khi người dùng hỏi về bất kỳ chính sách nào liên quan đến chuyến bay hoặc du lịch. (Ví dụ: chính sách hoàn trả vé (hoặc gửi hành lí...) thế nào?)")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("policyType", new JSONObject().put("type", "STRING").put("description", "Loại chính sách cần truy xuất (ví dụ: 'hoàn vé', 'giá vé', 'hành lý', 'đổi vé', 'trẻ em')."))
                        )
                        .put("required", new JSONArray().put("policyType"))
                )
        );
        tools.put(getPolicyTool);

        JSONObject searchLocationsTool = new JSONObject();
        searchLocationsTool.put("function_declarations", new JSONObject()
                .put("name", "searchLocations")
                .put("description", "Tìm kiếm các địa điểm du lịch trong một tỉnh cụ thể theo một hoặc nhiều loại địa điểm (ví dụ: 'historical' - lịch sử, 'cultural' - văn hóa, 'religious' - tôn giáo, 'urban' - đô thị, 'beach' - bãi biển, 'nature' - thiên nhiên, 'amusement' - vui chơi giải trí, công viên giải trí, khu vui chơi). Công cụ này PHẢI được sử dụng khi người dùng hỏi về các địa điểm để ghé thăm, điểm tham quan, hoặc các điểm đáng chú ý trong một tỉnh nhất định hoặc thuộc một loại nhất định.(Ví dụ: ở Hà Nội (hoặc HN) có địa điểm vui chơi giải trí nào không? (nếu không có thì trả lời là không có, nhưng có một số địa điểm khác (thể loại lịch sử, văn hóa....))")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("provinceId", new JSONObject().put("type", "STRING").put("description", "Mã ID 2 chữ cái của tỉnh (ví dụ: 'HN' cho Hà Nội, 'HCM' cho Hồ Chí Minh, 'DN' cho Đà Nẵng, 'HP' cho Hải Phòng, 'PQ' cho Phú Quốc, 'NT' cho Nha Trang, 'DL' cho Đà Lạt, 'TH' cho Thanh Hóa, 'VINH' cho Vinh (Nghệ An), 'HUE' cho Huế, 'QNAM' cho Quảng Nam, 'CT' cho Cần Thơ). Tham số này là bắt buộc."))
                                .put("locationTypes", new JSONObject()
                                        .put("type", "ARRAY")
                                        .put("description", "Một danh sách các loại địa điểm (ví dụ: 'historical' - lịch sử, 'cultural' - văn hóa, 'religious' - tôn giáo, 'urban' - đô thị, 'beach' - bãi biển, 'nature' - thiên nhiên, 'amusement' - vui chơi giải trí, công viên giải trí, khu vui chơi).")
                                        .put("items", new JSONObject().put("type", "STRING"))
                                )
                        )
                        .put("required", new JSONArray().put("provinceId"))
                )
        );
        tools.put(searchLocationsTool);

        JSONObject getLocationDetailsTool = new JSONObject();
        getLocationDetailsTool.put("function_declarations", new JSONObject()
                .put("name", "getLocationDetails")
                .put("description", "Truy xuất thông tin chi tiết về một địa điểm du lịch cụ thể, bao gồm mô tả, khoảng cách từ sân bay, thời gian tham quan ước tính và thời gian di chuyển từ sân bay chính của tỉnh. Công cụ này PHẢI được sử dụng khi người dùng hỏi thêm chi tiết về một địa điểm cụ thể, chẳng hạn như mô tả, khoảng cách hoặc thời gian cần thiết cho chuyến thăm.(Ví dụ: khoảng cách từ Dinh Độc Lập đến sân bay ở HCM là bao xa (không hỏi lại sân bay nào vì trong database mỗi tỉnh chỉ có 1 sân bay))")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("locationName", new JSONObject().put("type", "STRING").put("description", "Tên đầy đủ của địa điểm du lịch (ví dụ: 'Hoàn Kiếm', 'Dinh Độc Lập'). Tham số này là bắt buộc."))
                                .put("provinceId", new JSONObject().put("type", "STRING").put("description", "Mã ID 2 chữ cái của tỉnh nơi địa điểm đó thuộc về (ví dụ: 'HN', 'HCM'). Điều này rất quan trọng để phân biệt nếu các địa điểm có tên tương tự trên các tỉnh và là bắt buộc."))
                        )
                        .put("required", new JSONArray().put("locationName").put("provinceId"))
                )
        );
        tools.put(getLocationDetailsTool);

        JSONObject recommendDestinationTool = new JSONObject();
        recommendDestinationTool.put("function_declarations", new JSONObject()
                .put("name", "recommendDestination")
                .put("description", "Đề xuất các tỉnh/thành phố (điểm đến) dựa trên loại địa điểm du lịch mà người dùng muốn trải nghiệm (ví dụ: bãi biển, khu vui chơi, địa điểm lịch sử, văn hóa, thiên nhiên...). Công cụ này PHẢI được sử dụng khi người dùng hỏi 'nên đi đâu', 'đặt vé máy bay đi đâu' để trải nghiệm một loại hình du lịch cụ thể.(Ví dụ: tôi muốn đi biển (hoặc núi (thiên nhiên)...) thì đi đâu?")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("locationType", new JSONObject().put("type", "STRING").put("description", "Loại địa điểm du lịch mà người dùng muốn tìm (ví dụ: 'beach' - bãi biển, 'amusement' - vui chơi giải trí, 'historical' - lịch sử, 'cultural' - văn hóa, 'religious' - tôn giáo, 'urban' - đô thị, 'nature' - thiên nhiên). Tham số này là bắt buộc."))
                        )
                        .put("required", new JSONArray().put("locationType"))
                )
        );
        tools.put(recommendDestinationTool);

        return tools;
    }

    @Override
    public String getChatResponse(List<Map<String, Object>> chatHistory) {
        try {
            JSONObject geminiResponse = callGeminiApi(chatHistory);

            if (geminiResponse.has("candidates")) {
                JSONObject candidate = geminiResponse.getJSONArray("candidates").getJSONObject(0);

                if (candidate.has("content") && candidate.getJSONObject("content").has("parts")) {
                    JSONArray parts = candidate.getJSONObject("content").getJSONArray("parts");
                    for (int i = 0; i < parts.length(); i++) {
                        JSONObject part = parts.getJSONObject(i);
                        if (part.has("functionCall")) {
                            JSONObject functionCall = part.getJSONObject("functionCall");
                            String functionName = functionCall.getString("name");
                            JSONObject args = functionCall.getJSONObject("args");

                            String toolOutput = executeTool(functionName, args);

                            //recommendDestination là "muốn đi biển... thì đi đến đâu" => ra sân bay
                            //searchLocatiion là "các địa điểm (gì cũng search ra hết nên tắt equal để chatbot lấy result xong tự đưa ra cái phù hợp"
                            //searchFlight => có chuyến bay nào từ X đến Y không => hỏi lại ngày giờ hãng => chọn nào cũng đc, hoặc hỏi cụ thể
                            //getLocationDetail => chi tiết về điểm X nào đó (chi tiết về chùa thiên mụ đi (dinh độc lập....)
                            //getPolicy => chính sách + X (X = hoàn vé, ký gửi, trẻ em, trả vé đổi vé hành lý.....)
                            if ("searchFlights".equals(functionName) || "getPolicy".equals(functionName) || "getLocationDetails".equals(functionName) || "recommendDestination".equals(functionName)) {
                                return cleanGeminiResponse(toolOutput);
                            }

                            List<Map<String, Object>> updatedChatHistory = new ArrayList<>(chatHistory);
                            updatedChatHistory.add(createMessagePart("model", functionCall));
                            updatedChatHistory.add(createToolResponsePart(functionName, toolOutput));

                            JSONObject finalGeminiResponse = callGeminiApi(updatedChatHistory);

                            if (finalGeminiResponse.has("candidates")) {
                                String finalReply = finalGeminiResponse.getJSONArray("candidates")
                                        .getJSONObject(0)
                                        .getJSONObject("content")
                                        .getJSONArray("parts")
                                        .getJSONObject(0)
                                        .getString("text");

                                return cleanGeminiResponse(finalReply);
                            }
                        } else if (part.has("text")) {
                            String directReply = part.getString("text");
                            return cleanGeminiResponse(directReply);
                        }
                    }
                }
            }
            return "Xin lỗi, tôi không hiểu yêu cầu của bạn. Vui lòng thử lại với câu hỏi rõ ràng hơn.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Đã xảy ra lỗi trong quá trình xử lý yêu cầu. Vui lòng thử lại sau.";
        }
    }

    private Map<String, Object> createMessagePart(String role, Object content) {
        Map<String, Object> messagePart = new HashMap<>();
        messagePart.put("role", role);
        List<Map<String, Object>> parts = new ArrayList<>();
        if (content instanceof String) {
            parts.add(new HashMap<String, Object>() {{ put("text", (String) content); }});
        } else if (content instanceof JSONObject) {
            parts.add(new HashMap<String, Object>() {{ put("functionCall", (JSONObject) content); }});
        }
        messagePart.put("parts", parts);
        return messagePart;
    }

    private Map<String, Object> createToolResponsePart(String functionName, String output) {
        Map<String, Object> messagePart = new HashMap<>();
        messagePart.put("role", "tool");
        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(new HashMap<String, Object>() {{
            put("functionResponse", new HashMap<String, Object>() {{
                put("name", functionName);
                put("response", new HashMap<String, String>() {{
                    put("content", output);
                }});
            }});
        }});
        messagePart.put("parts", parts);
        return messagePart;
    }


    private JSONObject callGeminiApi(List<Map<String, Object>> chatHistory) throws Exception {
        JSONObject payload = new JSONObject();

        // payload.put("system_instruction", new JSONObject().put("parts", new JSONArray().put(new JSONObject().put("text", systemPrompt))));

        JSONArray contents = new JSONArray();

        for (Map<String, Object> message : chatHistory) {
            contents.put(new JSONObject(message));
        }
        payload.put("contents", contents);

        payload.put("tools", getToolDeclarations());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Gemini Response Body: " + response.body());
        return new JSONObject(response.body());
    }

    private String executeTool(String functionName, JSONObject args) {
        try {
            switch (functionName) {
                case "searchFlights":
                    String departure = args.optString("departureProvince", null);
                    String destination = args.optString("destinationProvince", null);
                    String date = args.optString("takeoffDate", null);
                    String time = args.optString("takeoffTime", null);
                    String airline = args.optString("airline", null);
                    return handleFlightSearch(departure, destination, date, time, airline);
                case "getPolicy":
                    String policyType = args.optString("policyType", null);
                    return getPolicyResponse(policyType);
                case "searchLocations":
                    String provinceId = args.optString("provinceId", null);
                    String locationType = args.optString("locationType", null);
                    return handleLocationSearch(provinceId, locationType);
                case "getLocationDetails":
                    String locName = args.optString("locationName", null);
                    String provId = args.optString("provinceId", null);
                    return handleLocationDetails(locName, provId);
                case "recommendDestination":
                    String recLocationType = args.optString("locationType", null);
                    return handleRecommendDestination(recLocationType);
                default:
                    return "Error: Unknown function " + functionName;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error executing tool: " + e.getMessage();
        }
    }


    private String handleRecommendDestination(String locationType) {
        if (locationType == null || locationType.isEmpty()) {
            return "Vui lòng cho tôi biết bạn muốn trải nghiệm loại hình du lịch nào (ví dụ: bãi biển, khu vui chơi, lịch sử).";
        }

        locationType = locationType.toLowerCase(Locale.ROOT);
        List<Provinces> recommendedProvinces = locationsRepository.findDistinctProvincesByLocationType(locationType);

        if (recommendedProvinces.isEmpty()) {
            return "Xin lỗi, tôi không tìm thấy tỉnh nào có loại hình du lịch '" + locationType + "'. <br/> ➤ Vui lòng thử loại hình khác.";
        }

        StringBuilder sb = new StringBuilder("➤ Nếu bạn muốn trải nghiệm loại hình '" + locationType + "', tôi đề xuất bạn nên đến các tỉnh/thành phố sau:<br/><br/>");
        int count = 0;
        for (Provinces province : recommendedProvinces) {
            if (count >= 5) break;

            sb.append("<b>➤ ").append(province.getProvinceName()).append(" (").append(province.getProvinceId()).append(")</b><br/>")
                    .append("   Sân bay chính: ").append(province.getAirport()).append("<br/><br/>");
            count++;
        }
        sb.append("Bạn có muốn tôi tìm kiếm các địa điểm cụ thể thuộc loại này ở một trong các tỉnh trên không?");
        return sb.toString();
    }


    private String handleLocationDetails(String locationName, String provinceId) {
        if (locationName == null || locationName.isEmpty()) {
            return "Vui lòng cung cấp tên địa điểm bạn muốn biết chi tiết.";
        }
        if (provinceId == null || provinceId.isEmpty()) {
            return "Vui lòng cung cấp ID tỉnh của địa điểm để tôi có thể tìm kiếm chính xác hơn (ví dụ: 'HN', 'HCM').";
        }

        provinceId = provinceId.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");

        Optional<Locations> locationOptional = locationsRepository.findByLocationNameAndProvince_ProvinceId(locationName, provinceId);

        if (locationOptional.isPresent()) {
            Locations loc = locationOptional.get();
            StringBuilder sb = new StringBuilder("<b>➤ Thông tin chi tiết về ").append(loc.getLocationName()).append(":</b><br/><br/>");
            sb.append("<b>   Mô tả:</b> ").append(loc.getLocationDescription()).append("<br/>");
            sb.append("<b>   Loại hình:</b> ").append(loc.getLocationType()).append("<br/>");
            sb.append("<b>   Thời gian tham quan dự kiến:</b> ").append(loc.getTourTime()).append(" phút<br/>");
            sb.append("<b>   Thời gian di chuyển từ sân bay ").append(loc.getProvince().getAirport()).append(" đến địa điểm:</b> ").append(loc.getTravelTime()).append(" phút<br/>");
//            sb.append("<b>   Khoảng cách từ sân bay ").append(loc.getProvince().getAirport()).append(" đến địa điểm:</b> ").append(loc.getDistanceAirport()).append(" km<br/><br/>");
            return sb.toString();
        } else {
            return "Xin lỗi, tôi không tìm thấy thông tin chi tiết cho địa điểm '" + locationName + "' ở tỉnh '" + provinceId + "'. <br/> ➤ Vui lòng kiểm tra lại tên địa điểm hoặc ID tỉnh.";
        }
    }

    private String handleLocationSearch(String provinceId, String locationType) {
        List<Locations> locations = new ArrayList<>();

        if (provinceId != null) {
            provinceId = provinceId.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");
        }
        if (locationType != null) {
            locationType = locationType.toLowerCase(Locale.ROOT);
        }

        if (provinceId != null) {
            if (locationType != null && !locationType.isEmpty()) {
                locations = locationsRepository.findByProvince_ProvinceIdAndLocationType(provinceId, locationType);
            } else {
                locations = locationsRepository.findByProvince_ProvinceId(provinceId);
            }
        } else {
            return "Vui lòng cung cấp ID tỉnh để tìm kiếm địa điểm (ví dụ: 'HN', 'HCM').";
        }

        if (locations.isEmpty()) {
            return "Hiện tại không tìm thấy địa điểm phù hợp với yêu cầu của bạn. <br/> ➤ Vui lòng thử loại địa điểm khác hoặc tỉnh khác.";
        }

        StringBuilder sb = new StringBuilder("➤ Các địa điểm tìm được:<br/><br/>");
        int count = 0;
        for (Locations loc : locations) {
            if (count >= 5) break;

            sb.append("<b>➤ Tên địa điểm:</b> ").append(loc.getLocationName()).append("<br/>")
                    .append("<b>   Loại:</b> ").append(loc.getLocationType()).append("<br/>")
                    .append("<b>   Mô tả:</b> ").append(loc.getLocationDescription()).append("<br/>")
                    .append("<b>   Thời gian tham quan dự kiến:</b> ").append(loc.getTourTime()).append(" phút<br/>")
                    .append("<b>   Thời gian di chuyển từ sân bay:</b> ").append(loc.getTravelTime()).append(" phút<br/><br/>");
            count++;
        }
        return sb.toString();
    }


    private String handleFlightSearch(String departure, String destination, String dateStr, String timeStr, String airline) {
        // Chuẩn hóa đầu vào
        if (departure != null) departure = normalizeProvince(departure);
        if (destination != null) destination = normalizeProvince(destination);
        if (airline != null) airline = normalizeAirlineName(airline);
        if (dateStr != null) {
            dateStr = normalizeDateFormatForDB(dateStr);
        }
        if (timeStr != null) {
            timeStr = normalizeTimeFormatForDB(timeStr);
        }

        List<Flights> flights = new ArrayList<>();

        if (departure != null && destination != null) {
            if (dateStr != null) {
                if (timeStr != null) {
                    if (airline != null) {
                        flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndTakeoffTimeAndAirline(departure, destination, dateStr, timeStr, airline);
                    } else {
                        flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndTakeoffTime(departure, destination, dateStr, timeStr);
                    }
                } else {
                    if (airline != null) {
                        flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDateAndAirline(departure, destination, dateStr, airline);
                    } else {
                        flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffDate(departure, destination, dateStr);
                    }
                }
            } else if (timeStr != null) {
                if (airline != null) {
                    flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffTimeAndAirline(departure, destination, timeStr, airline);
                } else {
                    flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndTakeoffTime(departure, destination, timeStr);
                }
            } else if (airline != null) {
                flights = flightsRepository.findByDepartureProvince_ProvinceIdAndDestinationProvince_ProvinceIdAndAirline(departure, destination, airline);
            } else { // Chỉ có đi, đến (không ngày, không giờ, không hãng)
                return "Bạn muốn tìm chuyến bay từ " + departure + " đến " + destination + " vào ngày nào hoặc của hãng hàng không nào?";
            }
        } else if (airline != null) {
            if (dateStr != null) {
                if (timeStr != null) {
                    flights = flightsRepository.findByAirlineAndTakeoffDateAndTakeoffTime(airline, dateStr, timeStr);
                } else {
                    flights = flightsRepository.findByAirlineAndTakeoffDate(airline, dateStr);
                }
            } else if (timeStr != null) {
                flights = flightsRepository.findByAirlineAndTakeoffTime(airline, timeStr);
            } else {
                flights = flightsRepository.findByAirline(airline);
            }
        } else { // Không có đủ thông tin để tìm kiếm
            return "Vui lòng cung cấp thông tin về điểm đi, điểm đến hoặc hãng hàng không bạn muốn tìm.";
        }

        if (flights.isEmpty()) {
            return "Hiện tại không tìm thấy chuyến bay phù hợp với yêu cầu của bạn. <br/> ➤ Vui lòng thử ngày khác hoặc điều kiện tìm kiếm khác.";
        }

        StringBuilder sb = new StringBuilder("➤ Các chuyến bay tìm được (tối đa 5 chuyến):<br/><br/>");
        int count = 0;
        for (Flights f : flights) {
            if (count >= 5) break;

            sb.append("<b>➤ Mã chuyến bay:</b> ").append(f.getFlightId()).append("<br/>")
                    .append("<b>   Hãng:</b> ").append(f.getAirline()).append("<br/>")
                    .append("<b>   Ngày giờ bay:</b> ").append(f.getTakeoffDate()).append(" ").append(f.getTakeoffTime()).append("<br/>")
                    .append("<b>   Điểm đi:</b> ").append(f.getDepartureProvince().getProvinceId()).append("<br/>")
                    .append("<b>   Ngày giờ đến:</b> ").append(f.getLandingDate()).append(" ").append(f.getLandingTime()).append("<br/>")
                    .append("<b>   Điểm đến:</b> ").append(f.getDestinationProvince().getProvinceId()).append("<br/>")
                    .append("<b>   Giá vé:</b> ").append(f.getTotalPrice()).append(" VND<br/><br/>");
            count++;
        }
        return sb.toString();
    }

    private String normalizeProvince(String input) {
        if (input == null) return null;
        return input.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");
    }

    private String normalizeAirlineName(String input) {
        if (input == null) return null;
        String lowerCaseInput = input.toLowerCase(Locale.ROOT);
        if (lowerCaseInput.contains("vietjet")) return "Vietjet";
        if (lowerCaseInput.contains("vietnam airline")) return "Vietnam Airlines";
        if (lowerCaseInput.contains("bamboo")) return "Bamboo Airways";
        if (lowerCaseInput.contains("pacific")) return "Pacific Airlines";
        return input;
    }

    private String normalizeDateFormatForDB(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }

        DateTimeFormatter inputFormatter1 = DateTimeFormatter.ofPattern("d/M/yyyy");
        DateTimeFormatter inputFormatter2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            LocalDate date = LocalDate.parse(dateStr, inputFormatter2);
            return date.format(outputFormatter);
        } catch (DateTimeParseException e1) {
            try {
                LocalDate date = LocalDate.parse(dateStr, inputFormatter1);
                return date.format(outputFormatter);
            } catch (DateTimeParseException e2) {
                System.err.println("Lỗi parse ngày: " + dateStr + " - " + e2.getMessage());
                return null;
            }
        }
    }

    /**
     * Chuẩn hóa định dạng giờ từ HH:MM hoặc H:MM sang H:MM
     * để khớp với định dạng trong database (không có số 0 ở đầu cho giờ < 10).
     */

    private String normalizeTimeFormatForDB(String timeStr) {
        if (timeStr == null || timeStr.isEmpty()) {
            return null;
        }
        Pattern pattern = Pattern.compile("^(\\d{1,2}):(\\d{2})$");
        Matcher matcher = pattern.matcher(timeStr);

        if (matcher.matches()) {
            int hour = Integer.parseInt(matcher.group(1));
            int minute = Integer.parseInt(matcher.group(2));
            return String.format(Locale.ROOT, "%02d:%02d:00", hour, minute);
        }
        return timeStr;
    }

    // Hàm hậu xử lý để loại bỏ các văn bản giới thiệu không mong muốn từ Gemini
    private String cleanGeminiResponse(String response) {
        // Loại bỏ "Chào mừng bạn!" và các biến thể tương tự
        response = response.replaceAll("(?i)Chào mừng bạn!\\s*", "");
        // Loại bỏ "Hệ thống đang tìm kiếm chuyến bay từ ... Xin vui lòng chờ trong giây lát..."
        response = response.replaceAll("(?i)Hệ thống đang tìm kiếm chuyến bay từ.*?Xin vui lòng chờ trong giây lát\\.\\.\\.\\s*", "");
        // Loại bỏ các ký tự không mong muốn ở đầu như "...html"
        response = response.replaceAll("^\\s*\\.\\.\\.html\\s*", "");
        // Loại bỏ các ký tự xuống dòng thừa ở cuối
        response = response.replaceAll("\\s*\\n\\s*$", "");
        return response.trim(); // Cắt bỏ khoảng trắng ở đầu và cuối
    }


    private String getPolicyResponse(String policyType) {
        if (policyType == null) {
            return "Vui lòng chỉ rõ loại chính sách bạn muốn biết (ví dụ: hoàn vé, giá vé, hành lý, đổi vé, trẻ em).";
        }

        switch (policyType.toLowerCase(Locale.ROOT)) {
            case "hoàn vé":
            case "trả vé":
            case "hủy vé":
                return """
                <b>➤ CHÍNH SÁCH HOÀN VÉ/TRẢ VÉ</b><br/><br/>
                <b>1. Điều kiện hoàn vé:</b><br/>
                - Hoàn 100% phí vé nếu hủy trước 7 ngày so với ngày khởi hành.<br/>
                - Hoàn 70% phí vé nếu hủy từ 3-7 ngày trước ngày khởi hành.<br/>
                - Hoàn 50% phí vé nếu hủy từ 24h-72h trước giờ khởi hành.<br/>
                - Không hoàn vé nếu hủy trong vòng 24h trước giờ khởi hành.<br/><br/>
                
                <b>2. Thủ tục hoàn vé:</b><br/>
                - Vé mua tại website/ứng dụng: Hoàn tiền tự động trong 7-10 ngày làm việc.<br/>
                - Vé mua tại đại lý: Liên hệ trực tiếp nơi mua vé để làm thủ tục.<br/><br/>
                
                <b>3. Lưu ý:</b><br/>
                - Vé khuyến mãi không được hoàn trừ trường hợp chuyến bay bị hủy.<br/>
                - Phí dịch vụ không được hoàn lại.<br/>
                """;
            case "giá vé":
            case "giá cả":
            case "phí vé":
                return """
                <b>➤ CHÍNH SÁCH GIÁ VÉ</b><br/><br/>
                <b>1. Giá vé bao gồm:</b><br/>
                - Giá vé cơ bản<br/>
                - Thuế, phí sân bay<br/>
                - Phí nhiên liệu (nếu có)<br/><br/>
                
                <b>2. Yếu tố ảnh hưởng giá:</b><br/>
                - Thời điểm đặt vé (càng sớm càng rẻ)<br/>
                - Mùa cao điểm/thấp điểm<br/>
            - Hạng ghế (Phổ thông/Thương gia)<br/><br/>
                
                <b>3. Chính sách vé trẻ em:</b><br/>
                - Trẻ dưới 2 tuổi: 10% giá vé người lớn<br/>
                - Trẻ 2-12 tuổi: 75% giá vé người lớn<br/>
                """;
            case "hành lý":
            case "ký gửi":
            case "xách tay":
                return """
                <b>➤ CHÍNH SÁCH HÀNH LÝ</b><br/><br/>
                <b>1. Hành lý xách tay:</b><br/>
                - Tối đa 7kg/chỗ ngồi<br/>
                - Kích thước không quá 56x36x23cm<br/><br/>
                
                <b>2. Hành lý ký gửi:</b><br/>
                - Phổ thông: 20kg miễn phí<br/>
                - Thương gia: 30kg miễn phí<br/>
                - Phụ thu 5% giá vé/kg vượt quá<br/><br/>
                
                <b>3. Hàng cấm:</b><br/>
                - Chất lỏng quá 100ml<br/>
                - Vũ khí, chất dễ cháy<br/>
                - Đồ ăn có mùi đặc biệt<br/>
                """;
            case "đổi vé":
            case "thay đổi":
                return """
                <b>➤ CHÍNH SÁCH ĐỔI VÉ</b><br/><br/>
                <b>1. Điều kiện đổi vé:</b><br/>
                - Đổi trước 24h so với giờ khởi hành<br/>
                - Chỉ áp dụng cho cùng hành trình<br/>
                - Vé còn hạn sử dụng<br/><br/>
                
                <b>2. Phí đổi vé:</b><br/>
                - Đổi trước 7 ngày: Miễn phí<br/>
                - Đổi trước 3 ngày: 10% giá vé<br/>
                - Đổi trong vòng 24h: 20% giá vé<br/><br/>
                
                <b>3. Thủ tục:</b><br/>
                - Vé mua online: Đổi trực tiếp trên website<br/>
                - Vé mua tại đại lý: Liên hệ nơi mua vé<br/>
                """;
            case "trẻ em":
            case "em bé":
            case "trẻ sơ sinh":
                return """
                <b>➤ CHÍNH SÁCH TRẺ EM/EM BÉ</b><br/><br/>
                <b>1. Quy định độ tuổi:</b><br/>
                - Em bé: Dưới 2 tuổi (ngồi cùng người lớn)<br/>
                - Trẻ em: Từ 2-12 tuổi (chỗ ngồi riêng)<br/><br/>
                
                <b>2. Giấy tờ cần thiết:</b><br/>
                - Giấy khai sinh bản gốc hoặc bản sao công chứng<br/>
                - Hộ chiếu (đối với chuyến bay quốc tế)<br/><br/>
                
                <b>3. Tiện ích:</b><br/>
                - Ưu tiên lên máy bay trước<br/>
                - Suất ăn riêng cho trẻ em<br/>
                - Ghế ngồi an toàn theo yêu cầu<br/>
                """;
            default:
                return "Không tìm thấy chính sách cho loại yêu cầu này. Vui lòng thử lại với các từ khóa như 'hoàn vé', 'giá vé', 'hành lý', 'đổi vé', 'trẻ em'.";
        }
    }
}
