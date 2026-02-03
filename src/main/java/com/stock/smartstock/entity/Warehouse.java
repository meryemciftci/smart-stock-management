package com.stock.smartstock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;  // Depo Kodu (WHX001)

    @Column(nullable = false, length = 100)
    private String name;  // Depo Adı

    @Column(length = 200)
    private String address;  // Adres

    @Column(length = 50)
    private String city;  // Şehir

    @Column(name = "total_capacity")
    private Double totalCapacity;  // Toplam kapasite (m³)

    @Column(name = "current_usage")
    private Double currentUsage;  // Güncel kullanım

    @Column(name = "manager_name", length = 100)
    private String managerName;  // Depo Sorumlusu

    @Column(length = 20)
    private String phone;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}