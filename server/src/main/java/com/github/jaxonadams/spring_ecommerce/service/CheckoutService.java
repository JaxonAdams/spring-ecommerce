package com.github.jaxonadams.spring_ecommerce.service;

import com.github.jaxonadams.spring_ecommerce.dto.Purchase;
import com.github.jaxonadams.spring_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
