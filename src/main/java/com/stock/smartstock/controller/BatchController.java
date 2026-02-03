package com.stock.smartstock.controller;

import com.stock.smartstock.entity.Batch;
import com.stock.smartstock.service.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @GetMapping
    public List<Batch> getAllBatches() {
        return batchService.getAllBatches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable Long id) {
        return batchService.getBatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public List<Batch> getBatchesByProduct(@PathVariable Long productId) {
        return batchService.getBatchesByProductId(productId);
    }

    @GetMapping("/expiring")
    public List<Batch> getExpiringBatches(@RequestParam(defaultValue = "30") int days) {
        return batchService.getExpiringBatches(days);
    }

    @GetMapping("/expired")
    public List<Batch> getExpiredBatches() {
        return batchService.getExpiredBatches();
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@RequestBody Batch batch) {
        Batch saved = batchService.saveBatch(batch);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }
}