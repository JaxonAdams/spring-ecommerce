package com.github.jaxonadams.spring_ecommerce.dao;

import com.github.jaxonadams.spring_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {}
