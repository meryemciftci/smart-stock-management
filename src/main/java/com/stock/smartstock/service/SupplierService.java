package com.stock.smartstock.service;

import com.stock.smartstock.entity.Supplier;
import com.stock.smartstock.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        return supplierRepository.findById(id)
                .map(supplier -> {
                    supplier.setCode(updatedSupplier.getCode());
                    supplier.setName(updatedSupplier.getName());
                    supplier.setContactPerson(updatedSupplier.getContactPerson());
                    supplier.setAddress(updatedSupplier.getAddress());
                    supplier.setCity(updatedSupplier.getCity());
                    supplier.setPhone(updatedSupplier.getPhone());
                    supplier.setEmail(updatedSupplier.getEmail());
                    supplier.setTaxNumber(updatedSupplier.getTaxNumber());
                    supplier.setIsActive(updatedSupplier.getIsActive());
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new RuntimeException("Tedarikçi bulunamadı: " + id));
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}