package com.stock.smartstock.service;

import com.stock.smartstock.entity.Warehouse;
import com.stock.smartstock.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Optional<Warehouse> getWarehouseById(Long id) {
        return warehouseRepository.findById(id);
    }

    public Warehouse saveWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, Warehouse updatedWarehouse) {
        return warehouseRepository.findById(id)
                .map(warehouse -> {
                    warehouse.setCode(updatedWarehouse.getCode());
                    warehouse.setName(updatedWarehouse.getName());
                    warehouse.setAddress(updatedWarehouse.getAddress());
                    warehouse.setCity(updatedWarehouse.getCity());
                    warehouse.setTotalCapacity(updatedWarehouse.getTotalCapacity());
                    warehouse.setCurrentUsage(updatedWarehouse.getCurrentUsage());
                    warehouse.setManagerName(updatedWarehouse.getManagerName());
                    warehouse.setPhone(updatedWarehouse.getPhone());
                    warehouse.setIsActive(updatedWarehouse.getIsActive());
                    return warehouseRepository.save(warehouse);
                })
                .orElseThrow(() -> new RuntimeException("Depo bulunamadı: " + id));
    }

    public void deleteWarehouse(Long id) {
        warehouseRepository.deleteById(id);
    }
}