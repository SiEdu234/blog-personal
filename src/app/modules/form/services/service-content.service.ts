import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceContentService {
  private claveAlmacenamiento = 'blog_posts';

  public readonly autores = [
    'ALAN JOSUE DIAZ GRACIA',
    'KLIUWHER ALDAHIR GRANDA JIMENEZ',
    'RAFAEL EDUARDO VERA GARCÍA',
    'JORDAN VELEZ'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  obtenerPublicaciones(): BlogPost[] {
    if (isPlatformBrowser(this.platformId)) {
      const publicaciones = localStorage.getItem(this.claveAlmacenamiento);
      return publicaciones ? JSON.parse(publicaciones) : [];
    }
    return [];
  }

  obtenerPublicacion(id: number): BlogPost | undefined {
    const publicaciones = this.obtenerPublicaciones();
    return publicaciones.find(p => p.id === id);
  }

  agregarPublicacion(publicacion: Omit<BlogPost, 'id' | 'date'>): void {
    const publicaciones = this.obtenerPublicaciones();
    const nuevaPublicacion: BlogPost = {
      ...publicacion,
      id: new Date().getTime(),
      date: new Date()
    };
    publicaciones.push(nuevaPublicacion);
    this.guardarPublicaciones(publicaciones);
  }

  actualizarPublicacion(publicacion: BlogPost): void {
    const publicaciones = this.obtenerPublicaciones();
    const indice = publicaciones.findIndex(p => p.id === publicacion.id);
    if (indice !== -1) {
      publicaciones[indice] = publicacion;
      this.guardarPublicaciones(publicaciones);
    }
  }

  eliminarPublicacion(id: number): void {
    let publicaciones = this.obtenerPublicaciones();
    publicaciones = publicaciones.filter(p => p.id !== id);
    this.guardarPublicaciones(publicaciones);
  }

  private guardarPublicaciones(publicaciones: BlogPost[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.claveAlmacenamiento, JSON.stringify(publicaciones));
    }
  }
}
