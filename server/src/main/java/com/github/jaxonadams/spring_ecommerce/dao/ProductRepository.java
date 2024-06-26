package com.github.jaxonadams.spring_ecommerce.dao;

import com.github.jaxonadams.spring_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}
