package com.stock.smartstock.service;

import com.stock.smartstock.entity.Stock;
import com.stock.smartstock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findById(id);
    }

    public List<Stock> getStocksByProductId(Long productId) {
        return stockRepository.findByProductId(productId);
    }

    public List<Stock> getStocksByWarehouseId(Long warehouseId) {
        return stockRepository.findByWarehouseId(warehouseId);
    }

    public List<Stock> getLowStockItems() {
        return stockRepository.findLowStockItems();
    }

    public Stock saveStock(Stock stock) {
        return stockRepository.save(stock);
    }

    // Stok güncelleme (giriş/çıkış)
    public Stock updateStockQuantity(Long stockId, Integer quantityChange) {
        return stockRepository.findById(stockId)
                .map(stock -> {
                    stock.setQuantity(stock.getQuantity() + quantityChange);
                    stock.setLastRestockDate(LocalDateTime.now());
                    return stockRepository.save(stock);
                })
                .orElseThrow(() -> new RuntimeException("Stok bulunamadı: " + stockId));
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }
}