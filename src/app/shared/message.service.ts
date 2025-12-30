import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {

  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  show(message: string) {
    this.messageSubject.next(message);

    // auto hide after 2 sec
    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this.messageSubject.next('');
  }
}
