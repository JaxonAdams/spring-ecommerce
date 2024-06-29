import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  
  inSearchMode: boolean = false;
  previousKeyword: string = "";

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.inSearchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.inSearchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
    
    // check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(
      this.currentCategoryId,
      this.pageNumber - 1,  // ngbootstrap component: 1-indexed; spring backend: 0-indexed
      this.pageSize
    ).subscribe(this.processPaginationResult());
  
  }

  handleSearchProducts() {
    
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (keyword != this.previousKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    // search for products using the given keyword
    this.productService.searchProductsPaginate(
      keyword,
      this.pageNumber - 1,
      this.pageSize
    ).subscribe(this.processPaginationResult());
  
  }

  updatePageSize(newPageSize: string) {
    this.pageSize = +newPageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processPaginationResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
