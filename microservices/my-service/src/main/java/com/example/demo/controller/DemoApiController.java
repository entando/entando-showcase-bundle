package com.example.demo.controller;

import java.util.Date;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DemoApiController {

    @GetMapping("/timestamp")
    public @ResponseBody Map<String, String> timestamp() {
        return Map.of("timestamp", new Date().toString());
    }
}