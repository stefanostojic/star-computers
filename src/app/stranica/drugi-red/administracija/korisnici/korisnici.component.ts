import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Korisnik } from '../../../../korisnik.model';
import { KorisniciService } from '../../../../korisnici.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.css']
})

export class KorisniciComponent implements OnInit, OnDestroy {

  korisnici = [] as Korisnik[];
  korisnikForm: FormGroup;
  private korisniciSub: Subscription;

  constructor(public korisniciService: KorisniciService) {}

  ngOnInit() {
    document.title = 'Korisnici | STAR computers';
    this.korisnikForm = new FormGroup({
      id: new FormControl(null),
      email: new FormControl(null, { validators: [Validators.required] }),
      ime: new FormControl(null, { validators: [Validators.required] }),
      prezime: new FormControl(null, { validators: [Validators.required] }),
      telefon: new FormControl(null, { validators: [Validators.required] }),
      grad: new FormControl(null, { validators: [Validators.required] }),
      ulica: new FormControl(null, { validators: [Validators.required] }),
      postanskiBroj: new FormControl(null, { validators: [Validators.required] })
    });
    this.korisnikForm.reset();

    this.korisniciService.getKorisnici();
    this.korisniciSub = this.korisniciService.getKorisniciUpdateListener()
      .subscribe((korisnici: Korisnik[]) => {
        this.korisnici = korisnici;
      });
  }

  ngOnDestroy() {
    this.korisniciSub.unsubscribe();
  }

  sacuvaj() {
    console.log('Angular: sacuvaj(): ...');
    this.korisniciService.updateKorisnik(
      this.korisnikForm.get('id').value,
      this.korisnikForm.get('email').value,
      this.korisnikForm.get('ime').value,
      this.korisnikForm.get('prezime').value,
      this.korisnikForm.get('telefon').value,
      this.korisnikForm.get('grad').value,
      this.korisnikForm.get('ulica').value,
      this.korisnikForm.get('postanskiBroj').value
    );
    this.korisnikForm.reset();
  }

  odabirKorisnika(korisnik: Korisnik) {
    if (this.korisnikForm.get('id').value === null || this.korisnikForm.get('id').value !== korisnik._id) {
      console.log('Odabir korisnika: ' + korisnik._id);
      this.korisnikForm.setValue({
        id: korisnik._id,
        email: korisnik.email,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        telefon: korisnik.telefon,
        grad: korisnik.grad,
        ulica: korisnik.ulica,
        postanskiBroj: korisnik.postanskiBroj
      });
    } else {
      console.log('Odabir korisnika: ' + null);
      this.korisnikForm.reset();
    }
    // this.tempkorisnik = this.odabranikorisnik;
  }

  delete() {
    this.korisniciService.deleteKorisnik(this.korisnikForm.get('id').value);
    this.korisnikForm.reset();
  }
}
