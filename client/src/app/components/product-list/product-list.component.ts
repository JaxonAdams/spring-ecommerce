import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  inSearchMode: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

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

    this.productService.getProductList(this.currentCategoryId).subscribe(data => {
      this.products = data;
    });
  
  }

  handleSearchProducts() {
    
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // search for products using the given keyword
    this.productService.searchProducts(keyword).subscribe(data => {
      this.products = data;
    });
  
  }

}
