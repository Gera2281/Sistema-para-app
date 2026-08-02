import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UsuarioListado {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado?: string;
}

export interface NuevoUsuario {
  nombre: string;
  correo: string;
  telefono?: string;
  rol: string;
  contrasena: string;
}

export interface BorrarUsuario {
  id: number;
  estado?: string;
  rol?: string;
  correo?: string;
  nombre?: string;
  telefono?: string;
  contrasena?: string;
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
  
    crearUsuario(usuario: NuevoUsuario): Observable<UsuarioListado> {
      return this.http.post<UsuarioListado>(this.apiUrl, usuario, { headers: this.getHeaders() });
    }

    borrarUsuario(usuario: BorrarUsuario): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${usuario.id}`, { headers: this.getHeaders() });
    }
}
