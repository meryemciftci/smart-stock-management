package com.stock.smartstock.repository;

import com.stock.smartstock.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {

    List<Batch> findByProductId(Long productId);

    List<Batch> findByWarehouseId(Long warehouseId);

    // Son kullanma tarihi yaklaşanlar
    @Query("SELECT b FROM Batch b WHERE b.expiryDate BETWEEN :startDate AND :endDate AND b.isExpired = false")
    List<Batch> findExpiringBatches(LocalDate startDate, LocalDate endDate);

    // Süresi dolmuş ürünler
    List<Batch> findByIsExpiredTrue();
}