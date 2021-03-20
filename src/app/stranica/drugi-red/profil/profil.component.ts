import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KorisniciService } from 'src/app/korisnici.service';
import { AuthService } from 'src/app/auth.service';
import { Subscription } from 'rxjs';
import { Porudzbina } from 'src/app/porudzbina.model';
import { PorudzbinaService } from 'src/app/porudzbina.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profilForm: FormGroup;
  korisnikSub: Subscription;
  greskakSub: Subscription;
  cuvanjeUToku = false;
  prikazUspesnogAzuriranja = false;
  prikazGreske = false;
  porudzbineSub: Subscription;
  porudzbine = [] as Porudzbina[];

  ukupnoPorudzbina = 0; // ukupnoProizvoda - totalProducts
  porudzbinaPoStrani = 10; // proizvodaPoStrani - productsPerPage
  trenutnaStrana = 1; // trenutnaStrana - currentPage

  ucitavanje: boolean;

  constructor(
    private korisnikService: KorisniciService,
    private authService: AuthService,
    private porudzbinaService: PorudzbinaService
  ) {}

  ngOnInit() {
    document.title = 'Moj profil | STAR computers';

    this.profilForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      ime: new FormControl(null, { validators: [Validators.required] }),
      prezime: new FormControl(null, { validators: [Validators.required] }),
      telefon: new FormControl(null, { validators: [Validators.required] }),
      grad: new FormControl(null, { validators: [Validators.required] }),
      ulica: new FormControl(null, { validators: [Validators.required] }),
      postanskiBroj: new FormControl(null, { validators: [Validators.required, Validators.max(100000), Validators.max(0)] })
    });
    this.profilForm.reset();

    this.korisnikService.getKorisnik(this.authService.getUserId());
    this.korisnikSub = this.korisnikService
    .getKorisnikUpdateListener()
    .subscribe(korisnik => {
      this.profilForm.setValue({
        email: korisnik.email,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        telefon: korisnik.telefon,
        grad: korisnik.grad,
        ulica: korisnik.ulica,
        postanskiBroj: korisnik.postanskiBroj
      });
      if (this.cuvanjeUToku) {
        this.prikazUspesnogAzuriranja = true;
      }
      this.cuvanjeUToku = false;
    });
    this.greskakSub = this.korisnikService
    .getGreskaStatusUpdateListener()
    .subscribe(greska => {
      this.prikazGreske = greska.status;
    });
    this.porudzbinaService.getPorudzbineUpdateListener().subscribe(data => {
      this.porudzbine = data.porudzbine;
    });
    this.porudzbinaService.getPorudzbineUpdateListener().subscribe(data => {
      this.ucitavanje = false;
      this.porudzbine = data.porudzbine;
      this.ukupnoPorudzbina = data.ukupnoPorudzbina;
    });
    this.ucitavanje = true;
    this.porudzbinaService.getPorudzbineZaKorisnika(
      this.authService.getUserId(),
      this.porudzbinaPoStrani,
      this.trenutnaStrana
    );
  }

  sacuvaj() {
    this.korisnikService.updateKorisnik(
      this.authService.getUserId(),
      this.profilForm.get('email').value,
      this.profilForm.get('ime').value,
      this.profilForm.get('prezime').value,
      this.profilForm.get('telefon').value,
      this.profilForm.get('grad').value,
      this.profilForm.get('ulica').value,
      this.profilForm.get('postanskiBroj').value
    );
    this.cuvanjeUToku = true;
  }

  promenaStrane(param: string) {
    if (param === 'sledeca') {
      if (!(this.trenutnaStrana * this.porudzbinaPoStrani < this.ukupnoPorudzbina)) {
        return;
      }
      this.trenutnaStrana++;
    } else if (param === 'prethodna') {
      if (this.trenutnaStrana === 1) {
        return;
      }
      this.trenutnaStrana--;
    }
    this.ucitavanje = true;
    this.porudzbinaService.getPorudzbineZaKorisnika(
      this.authService.getUserId(),
      this.porudzbinaPoStrani,
      this.trenutnaStrana
    );
  }
}
