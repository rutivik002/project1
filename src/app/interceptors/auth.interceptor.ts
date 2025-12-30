import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userid = this.cookieService.get('userid');
    const entryBy = this.cookieService.get('entryBy');
    const token = this.cookieService.get('token');

    let headers: any = {
      userid
    };

    if (entryBy) headers.entryBy = entryBy;
    if (token) headers.Authorization = `Bearer ${token}`;

    const authReq = req.clone({
      setHeaders: headers,
      withCredentials: true
    });

    return next.handle(authReq);
  }
}
