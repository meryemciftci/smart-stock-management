package com.stock.smartstock.controller;

import com.stock.smartstock.entity.Stock;
import com.stock.smartstock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        return stockService.getStockById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public List<Stock> getStocksByProduct(@PathVariable Long productId) {
        return stockService.getStocksByProductId(productId);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public List<Stock> getStocksByWarehouse(@PathVariable Long warehouseId) {
        return stockService.getStocksByWarehouseId(warehouseId);
    }

    @GetMapping("/low-stock")
    public List<Stock> getLowStockItems() {
        return stockService.getLowStockItems();
    }

    @PostMapping
    public ResponseEntity<Stock> createStock(@RequestBody Stock stock) {
        Stock saved = stockService.saveStock(stock);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<Stock> updateStockQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantityChange) {
        try {
            Stock updated = stockService.updateStockQuantity(id, quantityChange);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}