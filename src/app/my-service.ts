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

  private documentbaseUrl = 'http://192.168.10.248:81/api/commonDocument';




  constructor(private http: HttpClient) { }


  // ✅ Common headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'userid': '1'
    });
  }

  // getdocumnet():Observable<ApiResponse<Document[]>> {
  //  return this.http.get<ApiResponse<Document[]>>(this.documentbaseUrl, {

  //   headers: this.getHeaders()
  //  });
  // }


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




  // ================= DOCUMENT APIs =================

  // 1️⃣ ADD CUSTOMER OTHER DOCUMENT (File Upload)
  addCustomerOtherDocument(
    data: {
      portfolioTypeId: number;
      clientId: number;
      trackingNumber: string;
      remark?: string;
    },
    file: File
  ): Observable<any> {

    const payload = {
      ...data,
      remark: data.remark ?? ''   // ✅ ALWAYS SEND
    };

    const formData = new FormData();
    formData.append('objJsonStr', JSON.stringify(payload));
    formData.append('file', file);

    // ✅ Correct headers
    const headers = new HttpHeaders({
      'userid': '1',
      'entryBy': '20028-Amaratbhai'
      // ❌ DO NOT set Content-Type
    });

    return this.http.post(
      `${this.documentbaseUrl}/addCustomerOtherDocument`,
      formData,
      { headers } // ✅ Use correct headers
    );
  }



  // 2️⃣ GET CUSTOMER DOCUMENT LIST
  getCustomerDocumentList(payload: {
    portfolioTypeId: number;
    clientId: number;
    trackingNo: string;
  }): Observable<any> {

    return this.http.post(
      `${this.documentbaseUrl}/getCustomerDocumentList`,
      payload,
      {
        headers: new HttpHeaders({
          'userid': '1',
          'Content-Type': 'application/json',
          'Accept': '*/*'
        })
      }
    );
  }


  // 3️⃣ GET CUSTOMER DOCUMENT BY ID
  getCustomerDocumentById(id: number): Observable<any> {

    return this.http.get(
      `${this.documentbaseUrl}/getCustomerDocument?id=${id}`,
      {
        headers: new HttpHeaders({
          'userid': '1',
          'Accept': '*/*'
        })
      }
    );
  }

  viewCustomerDocument(id: number) {
    return this.http.get(
      `http://192.168.10.248:81/api/commonDocument/getCustomerDocument?id=${id}`,
      { responseType: 'blob' } // important!
    );
  }







}











