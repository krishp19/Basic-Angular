import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private messageSource = new BehaviorSubject<string>('Hello from Service!');
  currentMessage = this.messageSource.asObservable();

  updateMessage(newMessage: string) {
    this.messageSource.next(newMessage);
  }
}
