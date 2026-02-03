package com.stock.smartstock.service;

import com.stock.smartstock.entity.Batch;
import com.stock.smartstock.repository.BatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Optional<Batch> getBatchById(Long id) {
        return batchRepository.findById(id);
    }

    public List<Batch> getBatchesByProductId(Long productId) {
        return batchRepository.findByProductId(productId);
    }

    // Süresi dolmak üzere olanlar (30 gün içinde)
    public List<Batch> getExpiringBatches(int daysAhead) {
        LocalDate now = LocalDate.now();
        LocalDate futureDate = now.plusDays(daysAhead);
        return batchRepository.findExpiringBatches(now, futureDate);
    }

    // Süresi dolmuş partiler
    public List<Batch> getExpiredBatches() {
        return batchRepository.findByIsExpiredTrue();
    }

    public Batch saveBatch(Batch batch) {
        return batchRepository.save(batch);
    }

    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }
}