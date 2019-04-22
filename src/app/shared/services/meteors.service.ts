import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class MeteorsService {
  public url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  public get(): any {
    return this.http.get(this.url);
  }
}
