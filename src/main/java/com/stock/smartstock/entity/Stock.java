package com.stock.smartstock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stocks", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "warehouse_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity = 0;  // Miktar

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;  // Rezerve edilmiş

    @Column(name = "available_quantity")
    private Integer availableQuantity = 0;  // Kullanılabilir

    @Column(name = "reorder_point")
    private Integer reorderPoint;  // Dinamik hesaplanacak (AI)

    @Column(name = "last_restock_date")
    private LocalDateTime lastRestockDate;  // Son stok girişi

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateAvailableQuantity();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateAvailableQuantity();
    }

    private void calculateAvailableQuantity() {
        availableQuantity = quantity - reservedQuantity;
    }
}