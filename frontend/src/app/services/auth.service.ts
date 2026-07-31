import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export interface CredencialesSesion {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(this.obtenerTokenLocal());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarSesionGuardada();
  }

  registrar(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { nombre, email, password });
  }

  login(email: string, password: string): Observable<CredencialesSesion> {
    return this.http.post<CredencialesSesion>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        this.tokenSubject.next(respuesta.token);
        this.usuarioActualSubject.next(respuesta.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.tokenSubject.next(null);
    this.usuarioActualSubject.next(null);
  }

  private obtenerTokenLocal(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    return !!this.tokenSubject.value;
  }

  private cargarSesionGuardada(): void {
    const token = this.obtenerTokenLocal();
    const usuarioJson = localStorage.getItem('usuario');

    if (token && usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);
        this.tokenSubject.next(token);
        this.usuarioActualSubject.next(usuario);
      } catch (error) {
        console.error('Error al cargar sesión guardada:', error);
        this.logout();
      }
    }
  }

  obtenerToken(): string | null {
    return this.tokenSubject.value;
  }
}
