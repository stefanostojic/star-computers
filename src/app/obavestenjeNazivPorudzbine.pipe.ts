import { Pipe, PipeTransform } from '@angular/core';
import { Obavestenje } from './obavestenje.model';

@Pipe({
  name: 'obavestenjeNazivPorudzbine'
})
export class ObavestenjeNazivPorudzbine implements PipeTransform {
  transform(obavestenjeNaziv: string, deo: string): string {

    // Lazarevac, Dula Karaklajica 47
    const delovi = obavestenjeNaziv.split(', ');
    if (deo === 'grad') {
      return delovi[0];
    } else {
      return delovi[1];
    }

  }
}
