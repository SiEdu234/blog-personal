import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ServiceContentService, BlogPost } from '../../../../modules/form/services/service-content.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [ButtonModule, TableModule, RouterModule, CommonModule, DropdownModule, FormsModule, CardModule, TagModule, ChipModule, DialogModule],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit {
  todasPublicaciones: BlogPost[] = [];
  publicaciones: BlogPost[] = [];
  autores: string[] = [];
  opcionesAutor: { label: string; value: string }[] = [];
  autorSeleccionado: string | null = null;
  publicacionMostrada: BlogPost | null = null;
  mostrarDialogo = false;

  constructor(private servicioPublicaciones: ServiceContentService) {}

  ngOnInit(): void {
    this.autores = this.servicioPublicaciones.autores;
    this.opcionesAutor = this.autores.map(autor => ({ label: autor, value: autor }));
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.todasPublicaciones = this.servicioPublicaciones.obtenerPublicaciones();
    this.filtrarPublicaciones();
  }

  filtrarPublicaciones(): void {
    if (this.autorSeleccionado) {
      this.publicaciones = this.todasPublicaciones.filter(publicacion => publicacion.author === this.autorSeleccionado);
    } else {
      this.publicaciones = this.todasPublicaciones;
    }
  }

  eliminarPublicacion(id: number): void {
    if (confirm('Seguro que deseas eliminar este post?')) {
      this.servicioPublicaciones.eliminarPublicacion(id);
      this.cargarPublicaciones();
    }
  }

  get totalPublicaciones(): number {
    return this.publicaciones.length;
  }

  get fechaUltimaPublicacion(): Date | null {
    if (!this.todasPublicaciones.length) {
      return null;
    }
    const ordenadas = [...this.todasPublicaciones].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return ordenadas[0].date ? new Date(ordenadas[0].date) : null;
  }

  abrirPublicacion(publicacion: BlogPost): void {
    this.publicacionMostrada = publicacion;
    this.mostrarDialogo = true;
  }

  cerrarDialogo(): void {
    this.mostrarDialogo = false;
    this.publicacionMostrada = null;
  }
}
