import ISolicitation from 'interfaces/models/solicitation';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class SolicitationService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<ISolicitation>> {
    return this.apiService.get('/solicitation', params);
  }

  public save(data: Partial<ISolicitation>): Observable<ISolicitation> {
    return this.apiService.post('/solicitation', data);
  }

  public index(id: number): Observable<ISolicitation | null> {
    return this.apiService.get(`/solicitation/${id}`);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/solicitation/${id}`);
  }
}

const solicitationService = new SolicitationService(apiService);
export default solicitationService;