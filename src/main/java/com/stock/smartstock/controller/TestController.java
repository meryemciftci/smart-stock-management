package com.stock.smartstock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Merhaba! Smart Stock Management çalışıyor! 🚀";
    }

    @GetMapping("/status")
    public String status() {
        return "Sistem Aktif ✅";
    }
}