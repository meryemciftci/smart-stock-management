package com.stock.smartstock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;  // Stok Kodu (örn: PRD001)

    @Column(nullable = false, length = 200)
    private String name;  // Ürün Adı

    @Column(columnDefinition = "TEXT")
    private String description;  // Açıklama

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;  // Birim Fiyat

    @Column(length = 20)
    private String unit;  // Birim (adet, kg, litre)

    @Column(name = "minimum_stock_level")
    private Integer minimumStockLevel;  // Minimum stok seviyesi

    @Column(name = "current_stock")
    private Integer currentStock;  // Güncel stok

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