import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UsuarioListado {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private authService: AuthService) {}
  
    private getHeaders(): HttpHeaders {
      const token = this.authService.obtenerToken();
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
  
    obtenerUsuarios(): Observable<UsuarioListado[]> {
      return this.http.get<UsuarioListado[]>(this.apiUrl, { headers: this.getHeaders() });
    }
  
    crearUsuario(usuario: UsuarioListado): Observable<UsuarioListado> {
      return this.http.post<UsuarioListado>(this.apiUrl, usuario, { headers: this.getHeaders() });
    }
}
