package com.stock.smartstock.controller;

import com.stock.smartstock.entity.StockTransfer;
import com.stock.smartstock.service.StockTransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class StockTransferController {

    private final StockTransferService transferService;

    @GetMapping
    public List<StockTransfer> getAllTransfers() {
        return transferService.getAllTransfers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockTransfer> getTransferById(@PathVariable Long id) {
        return transferService.getTransferById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StockTransfer> createTransfer(@RequestBody StockTransfer transfer) {
        StockTransfer saved = transferService.saveTransfer(transfer);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransfer(@PathVariable Long id) {
        transferService.deleteTransfer(id);
        return ResponseEntity.noContent().build();
    }
}