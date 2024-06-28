import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(categoryId: number, page: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl: string = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`
                            + `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProductsPaginate(keyword: string, page: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl: string = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}`
                            + `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl: string = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    const categoryUrl: string = `${this.baseUrl}/product-category`;

    return this.httpClient.get<GetResponseProductCategory>(categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProduct(id: number): Observable<Product> {

    const productUrl: string = `${this.baseUrl}/products/${id}`;

    return this.httpClient.get<Product>(productUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
