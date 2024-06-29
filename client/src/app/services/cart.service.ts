import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // use Subject to publish events in our code
  // events will be sent to all subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    // publish the new values -- all subscribers will receive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

  addToCart(cartItem: CartItem) {

    // check if we already have the item in our cart
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      // find the cart item based on id
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
    }

    if (existingCartItem != undefined) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(item => item.id === cartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }

  }

}
