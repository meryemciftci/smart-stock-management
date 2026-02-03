package com.stock.smartstock.service;

import com.stock.smartstock.entity.Product;
import com.stock.smartstock.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Tüm ürünleri getir
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ID'ye göre ürün getir
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Yeni ürün kaydet
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Ürün güncelle
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setSku(updatedProduct.getSku());
                    product.setName(updatedProduct.getName());
                    product.setDescription(updatedProduct.getDescription());
                    product.setUnitPrice(updatedProduct.getUnitPrice());
                    product.setUnit(updatedProduct.getUnit());
                    product.setMinimumStockLevel(updatedProduct.getMinimumStockLevel());
                    product.setCurrentStock(updatedProduct.getCurrentStock());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
    }

    // Ürün sil
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}