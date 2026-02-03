package com.stock.smartstock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;  // Tedarikçi Kodu

    @Column(nullable = false, length = 100)
    private String name;  // Firma Adı

    @Column(name = "contact_person", length = 100)
    private String contactPerson;  // İrtibat Kişisi

    @Column(length = 200)
    private String address;

    @Column(length = 50)
    private String city;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "tax_number", length = 20)
    private String taxNumber;  // Vergi Numarası

    @Column(name = "performance_score")
    private Double performanceScore = 0.0;  // AI hesaplayacak

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