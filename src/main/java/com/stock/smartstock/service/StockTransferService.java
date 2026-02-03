package com.stock.smartstock.service;

import com.stock.smartstock.entity.StockTransfer;
import com.stock.smartstock.repository.StockTransferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockTransferService {

    private final StockTransferRepository stockTransferRepository;

    public List<StockTransfer> getAllTransfers() {
        return stockTransferRepository.findAll();
    }

    public Optional<StockTransfer> getTransferById(Long id) {
        return stockTransferRepository.findById(id);
    }

    public StockTransfer saveTransfer(StockTransfer transfer) {
        return stockTransferRepository.save(transfer);
    }

    public void deleteTransfer(Long id) {
        stockTransferRepository.deleteById(id);
    }
}