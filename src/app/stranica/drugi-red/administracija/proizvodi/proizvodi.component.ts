import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from 'rxjs';

import { Proizvod } from '../../../../proizvod.model';
import { Karakteristika } from '../../../../karakteristika.model';
import { Komentar } from '../../../../komentar.model';
import { ProizvodService } from '../../../../proizvod.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { mimeType } from '../mime-type.validator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proizvodi',
  templateUrl: './proizvodi.component.html',
  styleUrls: ['./proizvodi.component.css']
})

export class ProizvodiComponent implements OnInit, OnDestroy {
  proizvodi: Proizvod[] = [];
  private proizvodiSub: Subscription;
  private proizvodjaciSub: Subscription;
  proizvodDodatIliAzuriranSub: Subscription;

  odabraniKriterijumPretrage = 'ID'; // ili 'Naziv' ili 'Sazet opis'
  pojamZaPretragu = '';

  rezim = 'dodavanje'; // ili 'izmena'

  tempKarakteristika: Karakteristika = {
    naziv: '',
    vrednost: ''
  };
  rezimKarakateristike = 'dodavanje'; // ili 'izmena'

  tempKomentar: Komentar = {
    _id: '',
    autor: '',
    tekst: '',
    odgovor: ''
  };
  tekstOdgovora: string;

  vidljivostFormeZaOdgovaranje = false;
  formaZaOdgovoranjeId = '';
  pretragaUToku = true;
  cuvanjeUToku = false;
  prikazUspesnogCuvanja = false;

  proizvodForm: FormGroup;
  karakteristikaForm: FormGroup;
  slikaPreview: string;
  listaKarakteristika = [] as Karakteristika[];
  listaKomentara = [] as Komentar[];

  trebaObraditiIdParam = true;

  ukupnoProizvoda = 0; // ukupnoProizvoda - totalProducts
  proizvodaPoStrani = 10; // proizvodaPoStrani - productsPerPage
  trenutnaStrana = 1; // trenutnaStrana - currentPage

  sortiranje: string;
  kategorija: string;

  proizvodjaci = [] as string[];

  odabraniProizvodjaci = [] as string[];

  filterForm: FormGroup;

  constructor(public proizvodService: ProizvodService, private route: ActivatedRoute) {}

  ngOnInit() {
    document.title = 'Proizvodi | STAR computers';
    this.proizvodForm = new FormGroup({
      id: new FormControl(null),
      naziv: new FormControl(null, { validators: [Validators.required] }),
      proizvodjac: new FormControl(null, { validators: [Validators.required] }),
      kategorija: new FormControl(null, { validators: [Validators.required] }),
      cena: new FormControl(null, { validators: [Validators.required] }),
      kolicina: new FormControl(null, { validators: [Validators.required] }),
      prodato: new FormControl(0, { validators: [Validators.required] }),
      sazetOpis: new FormControl(null, { validators: [Validators.required] }),
      detaljanOpis: new FormControl(null, { validators: [Validators.required] }),
      slika: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.proizvodForm.reset();
    this.proizvodService.getProizvodi(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.proizvodaPoStrani,
      this.trenutnaStrana
    );
    this.proizvodiSub = this.proizvodService.getProizvodUpdateListener()
    .subscribe(data => {
      this.pretragaUToku = false;
      if (this.cuvanjeUToku) {
        this.prikazUspesnogCuvanja = true;
      }
      this.cuvanjeUToku = false;

      this.proizvodi = data.proizvodi;
      this.ukupnoProizvoda = data.brojProizvoda;
      const id = this.route.snapshot.paramMap.get('id');
      if (this.trebaObraditiIdParam && id) {
        this.trebaObraditiIdParam = false;
        const proizvodTemp = this.proizvodi.find(proizvod => proizvod._id === id);
        console.log('iz URL-a pronadjen proizvod');
        this.odabirProizvoda(proizvodTemp);
      }
    });

    this.filterForm = new FormGroup({
      naziv: new FormControl(null),
      cenaMin: new FormControl(null, { validators: [Validators.min(0)] }),
      cenaMax: new FormControl(null, { validators: [Validators.min(1)] }),
      prodatoMin: new FormControl(null, { validators: [Validators.min(0)] }),
      prodatoMax: new FormControl(null, { validators: [Validators.min(1)] }),
      kolicinaMin: new FormControl(null, { validators: [Validators.min(0)] }),
      kolicinaMax: new FormControl(null, { validators: [Validators.min(1)] })
    });

    this.proizvodService.getProizvodjaci();
    this.proizvodjaciSub = this.proizvodService.getProizvodjaciListener().subscribe(data => {
      this.proizvodjaci = data;
    });

    this.proizvodDodatIliAzuriranSub = this.proizvodService.getproizvodDodatIliAzuriranListener().subscribe(data => {
      if (this.cuvanjeUToku) {
        this.prikazUspesnogCuvanja = true;
      }
      this.cuvanjeUToku = false;
    });
  }

  proveriIspravnostSlike() {
    console.log('this.proizvodForm.get(slika).invalid: ' + this.proizvodForm.get('slika').invalid);
    console.log('this.slikaPreview: ' + this.slikaPreview);
  }

  ngOnDestroy() {
    this.proizvodiSub.unsubscribe();
    this.proizvodService.primeniFilter(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  onSubmit(formDirective: FormGroupDirective) {
    console.log('Angular: onSubmin()');
    if (this.proizvodForm.invalid) {
      console.log('Neka polja nisu ispravno popunjana.');
      this.proizvodForm.markAllAsTouched();
      return;
    }
    this.cuvanjeUToku = true;
    if (this.rezim === 'dodavanje') {
      console.log('Angular: Obavlja se dodavanje: ');
      this.proizvodService.addProizvod(
        this.proizvodForm.value.naziv,
        this.proizvodForm.value.proizvodjac,
        this.proizvodForm.value.slika,
        this.proizvodForm.value.sazetOpis,
        this.proizvodForm.value.detaljanOpis,
        this.proizvodForm.value.cena,
        this.proizvodForm.value.kolicina,
        this.proizvodForm.value.prodato,
        this.proizvodForm.value.kategorija,
        this.listaKarakteristika,
        this.listaKomentara
      );
    } else {
      console.log('Angular: Obavlja se azuriranje: ');
      this.proizvodService.updateProizvod(
        this.proizvodForm.value.id,
        this.proizvodForm.value.naziv,
        this.proizvodForm.value.proizvodjac,
        this.proizvodForm.value.slika,
        this.proizvodForm.value.sazetOpis,
        this.proizvodForm.value.detaljanOpis,
        this.proizvodForm.value.cena,
        this.proizvodForm.value.kolicina,
        this.proizvodForm.value.prodato,
        this.proizvodForm.value.kategorija,
        this.listaKarakteristika,
        this.listaKomentara
      );
    }
    this.proizvodForm.reset();
    formDirective.resetForm();
    this.proizvodForm.updateValueAndValidity();
    this.listaKarakteristika = [] as Karakteristika[];
    this.listaKomentara = [] as Komentar[];
    this.slikaPreview = '';
    this.tempKarakteristika = {
      naziv: '',
      vrednost: ''
    };
  }

  odabirKriterijumaID() {
    this.odabraniKriterijumPretrage = 'ID';
  }

  odabirKriterijumaNaziv() {
    this.odabraniKriterijumPretrage = 'Naziv';
  }

  odabirKriterijumaSazetOpis() {
    this.odabraniKriterijumPretrage = 'Sazet opis';
  }

  odabirProizvoda(proizvod: Proizvod) {
    // if (this.odabraniproizvod._id === '' || this.odabraniProizvod !== proizvod) {
    if (this.proizvodForm.get('id').value === null || this.proizvodForm.get('id').value !== proizvod._id) {
      console.log('Odabir proizvoda: ' + proizvod._id);
      this.proizvodForm.setValue({
        id: proizvod._id,
        naziv: proizvod.naziv,
        proizvodjac: proizvod.proizvodjac,
        slika: proizvod.slika,
        sazetOpis: proizvod.sazetOpis,
        detaljanOpis: proizvod.detaljanOpis,
        cena: proizvod.cena,
        kolicina: proizvod.kolicina,
        prodato: proizvod.prodato,
        kategorija: proizvod.kategorija
      });
      this.listaKarakteristika = proizvod.karakteristike;
      this.listaKomentara = proizvod.komentari;
      this.slikaPreview = proizvod.slika;
      this.rezim = 'izmena';
    } else {
      console.log('Odabir proizvoda: ' + null);
      this.proizvodForm.reset();
      this.listaKarakteristika = null;
      this.listaKomentara = null;
      this.rezim = 'dodavanje';
    }
    // this.tempProizvod = this.odabraniProizvod;
  }

  delete() {
    this.proizvodService.deleteProizvod(this.proizvodForm.get('id').value).subscribe(() => {
      console.log('proizvod.component: delete(): uspesno obrisano');
      this.pretragaUToku = true;
      this.proizvodService.getProizvodi(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.proizvodaPoStrani,
        1
      );
      this.proizvodService.getProizvodjaci();
    });
    this.proizvodForm.reset();
    this.listaKarakteristika = null;
    this.listaKomentara = null;
    this.rezim = 'dodavanje';
  }

  prikazDugmetaOdustani(): boolean {
    let odluka = false;

    if (3 < 2) {
      odluka = true;
    }
    // if (
    //   this.rezim === 'dodavanje' &&
    //   this.tempProizvod._id === '' && (
    //   this.tempProizvod.naziv !== '' ||
    //   this.tempProizvod.slika !== '' ||
    //   this.tempProizvod.sazetOpis !== '' ||
    //   this.tempProizvod.detaljanOpis !== '' ||
    //   this.tempProizvod.cena !== 0 ||
    //   this.tempProizvod.kolicina !== 0 ||
    //   this.tempProizvod.kategorija !== '' ||
    //   // this.tempProizvod.karakteristike !== [] || // null
    //   // this.tempProizvod.komentari !== [] // null
    //   this.tempProizvod.karakteristike.length !== 0 || // null
    //   this.tempProizvod.komentari.length !== 0 // null
    //   )) {
    //   odluka = true;
    // }
    return odluka;
  }

  odabirKarakteristike(karakteristika: { id: string, naziv: string, vrednost: string }) {
    if (this.tempKarakteristika.naziv !== karakteristika.naziv) {
      this.tempKarakteristika.naziv = karakteristika.naziv;
      this.tempKarakteristika.vrednost = karakteristika.vrednost;
      this.rezimKarakateristike = 'izmena';
      console.log('Selekcija karakteristike: ' + JSON.stringify(karakteristika));
    } else {
      this.tempKarakteristika.naziv = '';
      this.tempKarakteristika.vrednost = '';
      this.rezimKarakateristike = 'dodavanje';
      console.log('Deselekcija karakteristike: ' + JSON.stringify(karakteristika));
    }
  }

  saveKarakteristika() {
    console.log('Angular: saveKarakteristika(): ' + this.rezimKarakateristike + ': ' + JSON.stringify(this.tempKarakteristika));
    if (this.tempKarakteristika.naziv === '' || this.tempKarakteristika.vrednost === '') {
      return;
    }
    const kar = {
      naziv: this.tempKarakteristika.naziv,
      vrednost: this.tempKarakteristika.vrednost
    };
    if (this.rezimKarakateristike === 'dodavanje') {
      this.listaKarakteristika.push(kar);
    } else {
      const index = this.listaKarakteristika.findIndex(k => k.naziv === this.tempKarakteristika.naziv);
      if (index > -1) {
        this.listaKarakteristika[index] = kar;
      }
    }
    this.tempKarakteristika.naziv = '';
    this.tempKarakteristika.vrednost = '';
    this.rezimKarakateristike = 'dodavanje';
  }

  deleteKarakteristika() {
    console.log('Angular: deleteKarakteristika(): ' + JSON.stringify(this.tempKarakteristika));
    this.listaKarakteristika = this.listaKarakteristika.filter(
      karakteristika => karakteristika.naziv !== this.tempKarakteristika.naziv
    );
    this.tempKarakteristika.naziv = '';
    this.tempKarakteristika.vrednost = '';
    this.rezimKarakateristike = 'dodavanje';
  }

  odabirKomentara(komentar: Komentar) {
    if (this.tempKomentar._id !== komentar._id) {
      this.tempKomentar._id = komentar._id;
      this.tempKomentar.autor = komentar.autor;
      this.tempKomentar.tekst = komentar.tekst;
      this.tempKomentar.odgovor = komentar.odgovor;
      // this.tekstOdgovora = komentar.odgovor;
      console.log('Selekcija komentara: ' + JSON.stringify(this.tempKomentar));
    } else {
      this.tempKomentar._id = '';
      this.tempKomentar.autor = '';
      this.tempKomentar.tekst = '';
      this.tempKomentar.odgovor = '';
      this.vidljivostFormeZaOdgovaranje = false;
      console.log('Deselekcija komentara: ' + JSON.stringify(this.tempKomentar));
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.proizvodForm.patchValue({ slika: file });
    this.proizvodForm.get('slika').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // console.log(reader.result);
      this.slikaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  promenaStrane(param: string) {
    if (param === 'sledeca') {
      if (!(this.trenutnaStrana * this.proizvodaPoStrani < this.ukupnoProizvoda)) {
        alert('nema dalje');
        return;
      }
      this.trenutnaStrana++;
    } else if (param === 'prethodna') {
      if (this.trenutnaStrana === 1) {
        alert('ne moze nazad');
        return;
      }
      this.trenutnaStrana--;
    }
    this.pretragaUToku = true;
    this.proizvodService.getProizvodi(
      null,
      this.pojamZaPretragu,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.proizvodaPoStrani,
      this.trenutnaStrana
    );
  }

  addKomentar(idKomentara: string) {
    const index = this.listaKomentara.findIndex(k => k._id === idKomentara);
    this.listaKomentara[index].odgovor = this.tempKomentar.odgovor;
  }

  promenaKriterijumaSortiranja(kriterijum: string) {
    console.log('proizvodi.component: promenaKriterijumaSosrtiranja(): ', kriterijum);
    this.sortiranje = kriterijum;
  }

  promenaKategorije(kategorija: string) {
    console.log('proizvodi.component: promenaKriterijumaSosrtiranja(): ', kategorija);
    this.kategorija = kategorija;
  }

  postavljanjeProizvodjaca(proizvodjac: string) {
    console.log('proizvodi.component: promenaKriterijumaSortiranja(): ', proizvodjac);
    const index = this.odabraniProizvodjaci.findIndex(p => p === proizvodjac);
    if (index === -1) {
      this.odabraniProizvodjaci.push(proizvodjac);
      console.log('proizvodjac ' + proizvodjac + ' je odabran');
    } else {
      this.odabraniProizvodjaci = this.odabraniProizvodjaci.filter(p => p !== proizvodjac);
      console.log('proizvodjac ' + proizvodjac + ' nije odabran');
    }
  }

  primeniFilter() {
    console.log('proizvodi.component: primeniFilter(): naziv: ', this.pojamZaPretragu);
    this.proizvodService.primeniFilter(
      this.pojamZaPretragu,
      this.odabraniProizvodjaci,
      this.kategorija,
      this.filterForm.get('cenaMin').value,
      this.filterForm.get('cenaMax').value,
      this.filterForm.get('kolicinaMin').value,
      this.filterForm.get('kolicinaMax').value,
      this.filterForm.get('prodatoMin').value,
      this.filterForm.get('prodatoMax').value,
      this.sortiranje,
      this.proizvodaPoStrani
    );
    this.filterForm.markAsUntouched();
  }

  promenaBrojProizvodaPoStrani(kriterijum: number) {
    this.proizvodaPoStrani = kriterijum;
  }
}
