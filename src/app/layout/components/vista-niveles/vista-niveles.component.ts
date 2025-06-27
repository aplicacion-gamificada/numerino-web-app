import { Component } from '@angular/core';
import { BloqueCardComponent } from '../../../learning/components/bloque-card/bloque-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-vista-niveles',
  imports: [BloqueCardComponent, NgFor],
  templateUrl: './vista-niveles.component.html',
  styleUrl: './vista-niveles.component.scss'
})
export class VistaNivelesComponent {
niveles = [
    {
      numero: '1',
      titulo: 'Bloque de Aprendizaje 1',
      subtexto: '8/8 Completados',
      completados: 8,
      total: 8,
      colorFondo: '#133b71',
      puntos: 200,
    },
    {
      numero: '2',
      titulo: 'Bloque de Aprendizaje 2',
      subtexto: '1/8 Completados',
      completados: 1,
      total: 8,
      colorFondo: '#10b981',
    },
    {
      numero: 'R',
      titulo: 'Bloque de Refuerzo',
      subtexto: 'Recomendado',
      colorFondo: '#f87171',
    },
    {
      numero: '3',
      titulo: 'Bloque de Aprendizaje 3',
      subtexto: '¡Desbloquea este módulo!',
      colorFondo: '#6b7280',
    },
    {
      numero: '4',
      titulo: 'Bloque de Aprendizaje 4',
      subtexto: '',
      colorFondo: '#6b7280',
    },
  ];
}
