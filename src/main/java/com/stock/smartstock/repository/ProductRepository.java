package com.stock.smartstock.repository;

import com.stock.smartstock.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // SKU'ya göre ürün bul
    Optional<Product> findBySku(String sku);

    // İsme göre ürün bul
    Optional<Product> findByName(String name);
}