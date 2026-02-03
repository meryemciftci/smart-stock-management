package com.stock.smartstock.repository;

import com.stock.smartstock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    List<Stock> findByProductId(Long productId);

    List<Stock> findByWarehouseId(Long warehouseId);

    Optional<Stock> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    // Düşük stoktakiler (AI için önemli)
    @Query("SELECT s FROM Stock s WHERE s.availableQuantity <= s.reorderPoint")
    List<Stock> findLowStockItems();
}