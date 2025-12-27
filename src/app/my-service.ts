import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from './models/department.model';
import { City } from './models/city.model';
import { ApiResponse } from './models/api-responce.model';

@Injectable({
  providedIn: 'root',
}) export class MyService {

  private getApiUrl = 'http://192.168.10.248:81/api/department/getList';
  private addApiUrl = 'http://192.168.10.248:81/api/department/add';
  private deleteApiUrl = "http://192.168.10.248:81/api/department/remove";
  private updateApiUrl = "http://192.168.10.248:81/api/department/modify";

  private baseUrl = 'http://192.168.10.248:81/api/city';




  constructor(private http: HttpClient) { }

  // ✅ Common headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'userid': '1'
    });
  }

  // ✅ GET DATA (headers added)
   getData(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.getApiUrl, {
      headers: this.getHeaders()
    });
  }
  // ✅ ADD DATA (headers added)
  addData(payload: { name: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(this.addApiUrl, payload, {
      headers: this.getHeaders()
    });
  }

   updateData(payload: { id: number; name: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(this.updateApiUrl, payload, {
      headers: this.getHeaders()
    });
  }

  deleteData(id: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      this.deleteApiUrl,
      { id },
      { headers: this.getHeaders() }
    );
  }




  // GET LIST
 getCities(
    searchText = '',
    pageIndex = 1,
    pageSize = 10
  ): Observable<ApiResponse<City[]>> {

    const url = `${this.baseUrl}/getList?searchText=${searchText}`;

    return this.http.get<ApiResponse<City[]>>(url, {
      headers: {
        'userid': '1',
        'pageIndex': pageIndex.toString(),
        'pageSize': pageSize.toString()
      }
    });
  }


  getCity(id: number): Observable<ApiResponse<City>> {
    return this.http.get<ApiResponse<City>>(
      `${this.baseUrl}/get/${id}`,
      { headers: this.getHeaders() }
    );
  }

  addCity(data: { stateId: number; name: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/add`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateCity(data: { cityId: number; stateId: number; name: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/modify`,
      data,
      { headers: this.getHeaders() }
    );
  }

  deleteCity(cityId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/remove`,
      { cityId },
      { headers: this.getHeaders() }
    );
  }
}











