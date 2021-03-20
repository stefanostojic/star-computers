import { Korisnik } from './korisnik.model';

export interface Porudzbina {
  _id: string;
  kupac: string;
  datumVreme: Date;
  sadrzaj: { proizvodId: string, kolicina: number }[];
  napomena: string;
  obradjenost: string;
}

export interface PorudzbinaSaKorisnikom {
  _id: string;
  korisnik: Korisnik;
  datumVreme: Date;
  sadrzaj: { proizvodId: string, kolicina: number }[];
  napomena: string;
  obradjenost: string;
}
