import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  requestPasswordReset(email: string): Observable<any> {
    // Server returns plain text; request as text to avoid JSON parse errors in HttpClient
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' as 'json' });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { password }, { responseType: 'text' as 'json' });
  }
}
