import { Karakteristika } from './karakteristika.model';
import { Komentar } from './komentar.model';

export interface Proizvod {
  _id: string;
  naziv: string;
  proizvodjac: string;
  slika: string;
  sazetOpis: string;
  detaljanOpis: string;
  cena: number;
  kolicina: number;
  prodato: number;
  kategorija: string;
  karakteristike: Karakteristika[];
  komentari: Komentar[];
}

export interface ProizvodMin {
  _id: string;
  naziv: string;
  proizvodjac: string;
  slika: string;
  cena: number;
  sazetOpis: string;
}
