import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private _HttpClient: HttpClient) { }

  headers = new HttpHeaders({
    'X-MASTER-KEY': '$2a$10$TD.fE44KojkZ3Ws.H6GFXeRQde7pDcNXbnxc33nSecsVTAW2mO66O',
    'X-ACCESS-KEY': '$2a$10$beT9a90Mbruqh1j3Bkxn0O7785oiNiD6wkTxNPKM9PwelZ7tpbnrC'
  });

  GetUsersData(): Observable<any> {
    return this._HttpClient.get(`https://api.jsonbin.io/v3/b/6692d125acd3cb34a865b368`,
      { headers: this.headers }
    );
  }
}
