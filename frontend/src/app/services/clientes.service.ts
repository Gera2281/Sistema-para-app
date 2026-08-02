import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  estado?: string; // Propiedad opcional para el estado del cliente
}

export interface BorrarCliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  estado?: string;
} 


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000/api/clientes'; // Cambia esto según tu configuración

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  borrarCliente(cliente: BorrarCliente): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cliente.id}`, { headers: this.getHeaders() });
  }
}