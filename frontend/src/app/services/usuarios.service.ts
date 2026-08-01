import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UsuarioListado {
  id: number;
  nombre: string;
  correo: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerUsuarios(): Observable<UsuarioListado[]> {
    const token = this.authService.obtenerToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get<UsuarioListado[]>(this.apiUrl, { headers });
  }
}
