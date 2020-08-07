import IProduct from 'interfaces/models/product';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class ProductService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IProduct>> {
    return this.apiService.get('/product', params);
  }

  public save(data: Partial<IProduct>): Observable<IProduct> {
    return this.apiService.post('/product', data);
  }

  public index(id: number): Observable<IProduct | null> {
    return this.apiService.get(`/product/${id}`);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/product/${id}`);
  }
}

const productService = new ProductService(apiService);
export default productService;