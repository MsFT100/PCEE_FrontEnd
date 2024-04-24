import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceData {

  constructor(private http: HttpClient) { }

  getFuelData(year: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any>(`https://pcee.xyz/api/vehicles/fuel-h?year=${year}`, { headers });
  }
  getFuelD(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any>(`https://pcee.xyz/api/vehicles/fuel-h`, { headers });
  }
  getRepairData(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any>(`https://pcee.xyz/service/repair-costs/`, { headers });
  }
}
