import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProizvodService } from '../../../proizvod.service';
import { Proizvod } from 'src/app/proizvod.model';
import { Komentar } from 'src/app/komentar.model';
import { PorudzbinaService } from 'src/app/porudzbina.service';
import { AuthService } from 'src/app/auth.service';
import { StavkaKorpe } from 'src/app/stavka-korpe.model';

@Component({
  selector: 'app-proizvod',
  templateUrl: './proizvod.component.html',
  styleUrls: [ './proizvod.component.css' ]
})


export class ProizvodComponent implements OnInit {

  noviKomentar: Komentar = {
    _id: '',
    autor: '',
    tekst: '',
    odgovor: ''
  };
  linkKaKategoriji = 'kategorija proizvoda';
  proizvod: Proizvod = {
    _id: '',
    naziv: '',
    proizvodjac: '',
    slika: '',
    sazetOpis: '',
    detaljanOpis: '',
    cena: 0,
    kolicina: 0,
    prodato: 0,
    kategorija: '',
    karakteristike: [],
    komentari: []
  };
  kolicina = 1;
  ulogovanost = false;
  prikazUpozorenja = '';
  komentarUpozorenje = '';
  komBr = 0;

  constructor(
    private proizvodService: ProizvodService,
    private porudzbinaService: PorudzbinaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
    ) {}

  ngOnInit() {
    this.getProizvod();
    this.ulogovanost = this.authService.getIsAuth();
    console.log('DA LI JE KORISNIK PRIJAVLJEN: ' + this.ulogovanost);
  }

  getProizvod() {
    console.log('Angular: getProizvod(): id: ' + this.route.snapshot.paramMap.get('id'));
    const id = this.route.snapshot.paramMap.get('id');

    this.proizvodService.getProizvod(id.toString())
      .subscribe(proizvod => {
        document.title = `${proizvod.proizvodjac} ${proizvod.naziv} | STAR computers`;

        this.proizvod = proizvod;
        console.log('Angular: getProizvod(): ' + JSON.stringify(proizvod));
        // switch (proizvod.kategorija) {
        //   case 'Računar':
        //     this.linkKaKategoriji = 'racunari';
        //     break;
        //   case 'Laptop':
        //     this.linkKaKategoriji = 'laptopovi';
        //     break;
        //   case 'Telefon':
        //     this.linkKaKategoriji = 'telefoni';
        //     break;
        //   default:
        //     this.linkKaKategoriji = 'svi-proizvodi';
        //     break;
        // }
      });
  }

  addKomentar() {
    console.log('Angular: addKomentar(): ' + this.proizvod._id + ', ' + this.noviKomentar.autor + ', ' + this.noviKomentar.tekst);
    if (this.noviKomentar.autor === '') {
      this.komentarUpozorenje += 'Komentar mora imati autora. ';
    }
    if (this.noviKomentar.tekst === '') {
      this.komentarUpozorenje += 'Komentar mora sadržati tekst. ';

    }
    if (this.noviKomentar.autor !== '' && this.noviKomentar.tekst !== '') {
      this.proizvodService.addKomentar(this.proizvod._id, this.noviKomentar);
      this.proizvod.komentari.push({
        _id: (this.komBr++).toString(),
        autor: this.noviKomentar.autor,
        tekst: this.noviKomentar.tekst,
        odgovor: ''
      });
      this.noviKomentar.autor = '';
      this.noviKomentar.tekst = '';
    }
  }

  dodajUKorpu() {
    console.log('Angular: dodajUKorpu(): ...');
    if (!this.ulogovanost) {
      this.router.navigate(['/prijava']);
    } else {
      if (this.kolicina <= 0) {
        this.prikazUpozorenja = 'U korpu možete dodati najmanje 1 proizvod.';
        return;
      }

      const korpaStr = localStorage.getItem('korpa');
      if (korpaStr) {
        // korpa postoji
        const korpaObj: StavkaKorpe[] = JSON.parse(korpaStr);
        const indexStarogZapisa = korpaObj.findIndex(s => s.proizvodId === this.proizvod._id);
        if (indexStarogZapisa !== -1) {
          if (this.proizvod.kolicina >= this.kolicina + korpaObj[indexStarogZapisa].kolicina) {
            const stavkaKor = korpaObj[indexStarogZapisa];
            stavkaKor.kolicina += this.kolicina;
            korpaObj[indexStarogZapisa] = stavkaKor;
            localStorage.setItem('korpa', JSON.stringify(korpaObj));
            this.router.navigate(['/korpa']);
          } else {
            this.prikazUpozorenja = 'Pokušavate da poručite ' + this.kolicina + ' proizvoda, a dostupno je samo ' +
            this.proizvod.kolicina;
          }
        } else {
          korpaObj.push({
            proizvodId: this.proizvod._id,
            naziv: this.proizvod.naziv,
            slika: this.proizvod.slika,
            cena: this.proizvod.cena,
            kolicina: this.kolicina
          });
          localStorage.setItem('korpa', JSON.stringify(korpaObj));
          this.router.navigate(['/korpa']);
        }
      } else {
        if (this.proizvod.kolicina >= this.kolicina) {
          const korpaObj = [];
          korpaObj.push({
            proizvodId: this.proizvod._id,
            naziv: this.proizvod.naziv,
            slika: this.proizvod.slika,
            cena: this.proizvod.cena,
            kolicina: this.kolicina
          });
          localStorage.setItem('korpa', JSON.stringify(korpaObj));
          this.router.navigate(['/korpa']);
        } else {
          this.prikazUpozorenja = 'Pokušavate da poručite ' + this.kolicina + ' proizvoda, a dostupno je samo ' +
          this.proizvod.kolicina;
        }
      }
    }
  }
}
