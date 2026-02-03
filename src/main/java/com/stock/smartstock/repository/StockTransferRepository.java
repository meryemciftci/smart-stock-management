package com.stock.smartstock.repository;

import com.stock.smartstock.entity.StockTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> {

    List<StockTransfer> findByFromWarehouseId(Long warehouseId);

    List<StockTransfer> findByToWarehouseId(Long warehouseId);

    List<StockTransfer> findByProductId(Long productId);
}