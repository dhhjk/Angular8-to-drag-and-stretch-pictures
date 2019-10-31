import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from './list';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  getConfig() {
    return this.http.get("../assets/app.json");
  }
  constructor(private http: HttpClient) { }
}
