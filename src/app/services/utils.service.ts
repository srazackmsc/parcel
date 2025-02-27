import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  URL = 'http://localhost:3100';

  constructor(private http: HttpClient) { }

  saveEmployee(data: any) {
    return this.http.post(`${this.URL}/employees`, data);
  }

  getExamTypes(){
    return this.http.get(`${this.URL}/exam_types`)
  }
}
