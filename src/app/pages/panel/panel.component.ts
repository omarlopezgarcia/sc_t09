import { Component } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})


export class PanelComponent {
  descripcion: string = ''; 
  descripcionCompleta: string = `🚀 Este proyecto fusiona dos increíbles IA generativas: Computer Vision de Azure y Gemini. Computer Vision analiza imágenes desde URL y Gemini lo hace localmente. Además, Gemini responde preguntas y ofrece información útil. ¡Pero eso no es todo! Hemos integrado Gemini Translator para traducción instantánea y Gemini Topic para organizar tus ideas eficientemente.`;
  conclusion: string = '';
  conclusionCompleta: string = `🤔 Se tiene una demostración de cómo las API's de Servicios Cognitivos pueden ser utilizadas. A pesar de las desventajas que ofrecen estas tecnologías, es importante considerar las limitaciones y desafíos asociados, como la dependencia de servicios externos y límites de recursos en la nube.`;
  interval: any;

  constructor() {
    this.typingEffect();
  }

  typingEffect() {
    let index = 0;
    this.interval = setInterval(() => {
      this.descripcion += this.descripcionCompleta[index];
      this.conclusion += this.conclusionCompleta[index];
      index++;
      if (index === this.descripcionCompleta.length) {
        clearInterval(this.interval);
      } if (index === this.conclusionCompleta.length) {
        clearInterval(this.interval);
      }
    }, 50); 
  }
  url = {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/in/'
  }


  integrantes = [
    {
      foto: this.url.github +'MichaelQuispeChavez.png',
      nombre: 'Michael Quispe',
      github: this.url.github + 'MichaelQuispeChavez',
      linkedin: this.url.linkedin + 'michael-joseph-quispe-chavez-267185238',
      encargo: 'Analizador de imágenes con Gemini y Azure Computer Vision'
    },
    {
      foto: this.url.github +'omarlopezgarcia.png',
      nombre: 'Omar Lopez',
      github: this.url.github + 'omarlopezgarcia',
      linkedin: this.url.linkedin + 'omar-lópez-garcía-a88074235',
      encargo: 'Desarrollo de topic con Gemini'
    },
    {
      foto: this.url.github +'TrilaryDev.png',
      nombre: 'Trilary Quispe',
      github: this.url.github + 'TrilaryDev',
      linkedin: this.url.linkedin + 'trilary-misciel-quispe-luyo-372aa2239',
      encargo: 'Traductor con Gemini'
    }
  ];
}
