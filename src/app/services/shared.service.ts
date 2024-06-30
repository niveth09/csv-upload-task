import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  send_data = new BehaviorSubject<any>([]);
  recordsData: any = [];
  errorList: any[] = [];
  errorCount = 0;
  correctCount = 0;
  constructor(private httpClient: HttpClient) {}

  setData(data: any) {
    this.send_data.next(data);
    // this.send_data.complete();
  }
  getData() {
    return this.send_data.asObservable();
  }
  getCSV(studentData: string) {
    console.log(this.httpClient.get(studentData, { responseType: 'json' }));
    return this.httpClient.get(studentData, { responseType: 'text' });
  }
}
