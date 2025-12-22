import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ServiceContentService, BlogPost } from '../../services/service-content.service';

@Component({
  selector: 'app-form-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule, RouterModule, DropdownModule, FileUploadModule],
  templateUrl: './form-content.component.html',
  styleUrl: './form-content.component.css'
})
export class FormContentComponent implements OnInit {
  formularioPublicacion: FormGroup;
  modoEdicion = false;
  publicacionId: number | null = null;
  autores: string[] = [];
  opcionesAutor: { label: string; value: string }[] = [];
  imagenBase64Seleccionada: string | null = null;

  constructor(
    private fb: FormBuilder,
    private servicioPublicaciones: ServiceContentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formularioPublicacion = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.autores = this.servicioPublicaciones.autores;
    this.opcionesAutor = this.autores.map(autor => ({ label: autor, value: autor }));
    this.route.params.subscribe(parametros => {
      if (parametros['id']) {
        this.modoEdicion = true;
        this.publicacionId = +parametros['id'];
        this.cargarPublicacion(this.publicacionId);
      }
    });
  }

  cargarPublicacion(id: number): void {
    const publicacion = this.servicioPublicaciones.obtenerPublicacion(id);
    if (publicacion) {
      this.formularioPublicacion.patchValue(publicacion);
      this.imagenBase64Seleccionada = publicacion.image || null;
    }
  }

  alEnviar(): void {
    if (this.formularioPublicacion.valid) {
      const valoresFormulario = this.formularioPublicacion.value;
      const imagenFinal = this.imagenBase64Seleccionada || valoresFormulario.imageUrl || undefined;
      if (this.modoEdicion && this.publicacionId) {
        const publicacionActualizada: BlogPost = {
          ...valoresFormulario,
          id: this.publicacionId,
          date: new Date(),
          image: imagenFinal
        };
        this.servicioPublicaciones.actualizarPublicacion(publicacionActualizada);
      } else {
        this.servicioPublicaciones.agregarPublicacion({ ...valoresFormulario, image: imagenFinal } as Omit<BlogPost, 'id' | 'date'>);
      }
      this.router.navigate(['/home']);
    }
  }

  alCancelar(): void {
    this.router.navigate(['/home']);
  }

  alSeleccionarArchivo(evento: any): void {
    const archivo: File | undefined = evento?.files?.[0];
    if (!archivo) {
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      this.imagenBase64Seleccionada = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  }

  limpiarImagen(): void {
    this.imagenBase64Seleccionada = null;
    this.formularioPublicacion.patchValue({ imageUrl: '' });
  }
}
