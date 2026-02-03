package com.stock.smartstock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String batchNumber;  // Parti/Lot Numarası

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    private Integer quantity;  // Parti miktarı

    @Column(name = "remaining_quantity")
    private Integer remainingQuantity;  // Kalan miktar

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;  // Üretim tarihi

    @Column(name = "expiry_date")
    private LocalDate expiryDate;  // Son kullanma tarihi

    @Column(name = "received_date")
    private LocalDate receivedDate;  // Teslim alma tarihi

    @Column(name = "is_expired")
    private Boolean isExpired = false;

    @Column(name = "expiry_warning_sent")
    private Boolean expiryWarningSent = false;  // Uyarı gönderildi mi?

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        remainingQuantity = quantity;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        checkExpiry();
    }

    private void checkExpiry() {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            isExpired = true;
        }
    }
}