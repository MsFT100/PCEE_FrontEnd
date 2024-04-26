import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  private apiUrl = 'https://pcee.xyz/api/vehicles/';

  constructor(private http: HttpClient) { }

  getGpsData(vehicleId: string, token: string): Observable<any> {
    const url = `${this.apiUrl}${vehicleId}/request-gps`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(url, { headers: headers });
  }
}
