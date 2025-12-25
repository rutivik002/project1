import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  getData(): Observable<any> {
    return this.http.get<any>(this.getApiUrl, {
      headers: this.getHeaders()
    });
  }
  // ✅ ADD DATA (headers added)
  addData(payload: { name: string }): Observable<any> {
    return this.http.post<any>(this.addApiUrl, payload, {
      headers: this.getHeaders()
    });
  }

  updateData(payload: { id: number; name: string }): Observable<any> {
    return this.http.post<any>(
      this.updateApiUrl,
      payload,
      {
        headers: this.getHeaders()
      }
    );
  }

  deleteData(id: number): Observable<any> {
    return this.http.post<any>(`${this.deleteApiUrl}`, { id: id }, {
      headers: this.getHeaders(),
      observe: 'response',

    });
  }



  // GET LIST
getCities(searchText = '', pageIndex = 1, pageSize = 10): Observable<any> {
  const url = `${this.baseUrl}/getList?searchText=${searchText}`;
  return this.http.get(url, {
    headers : ({
      'userid': '1',
      'pageIndex': pageIndex.toString(),
      'pageSize': pageSize.toString()
    })
  });
}

  // GET BY ID
  getCity(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`, { headers: this.getHeaders() });
  }

  // ADD
  addCity(data: { stateId: number; name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data, { headers: this.getHeaders() });
  }

  // UPDATE
  updateCity(data: { cityId: number; stateId: number; name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/modify`, data, { headers: this.getHeaders() });
  }

  // DELETE
  deleteCity(cityId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, { cityId }, { headers: this.getHeaders() });
  }



}







