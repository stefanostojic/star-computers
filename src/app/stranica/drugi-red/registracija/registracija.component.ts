import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html'
})
export class RegistracijaComponent implements OnInit {
  registracijaForm: FormGroup;
  errorStatusSub: Subscription;
  korisnickoImeError: boolean;
  lozinkaError: boolean;
  ucitavanje = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    document.title = 'Registracija | STAR computers';

    this.registracijaForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      lozinka: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
      lozinkaPonovljena: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
      ime: new FormControl(null, { validators: [Validators.required] }),
      prezime: new FormControl(null, { validators: [Validators.required] }),
      telefon: new FormControl(null, { validators: [Validators.required] }),
      grad: new FormControl(null, { validators: [Validators.required] }),
      ulica: new FormControl(null, { validators: [Validators.required] }),
      postanskiBroj: new FormControl(null, { validators: [Validators.required] }),
    });
    this.registracijaForm.reset();
    this.errorStatusSub = this.authService.getErrorStatusListener()
    .subscribe(data => {
      this.ucitavanje = false;
      console.log('prijava.component: data.error: ', data.message);
      if (data.message === 'email zauzet') {
        this.korisnickoImeError = true;
      }
    });
  }

  registracija() {
    this.registracijaForm.markAllAsTouched();
    if (this.registracijaForm.invalid) {
      console.log('invalid form');
      return;
    }
    console.log('nastavak registracije...');
    this.ucitavanje = true;
    this.authService.registracija(
      this.registracijaForm.get('email').value,
      this.registracijaForm.get('lozinka').value,
      this.registracijaForm.get('ime').value,
      this.registracijaForm.get('prezime').value,
      this.registracijaForm.get('telefon').value,
      this.registracijaForm.get('grad').value,
      this.registracijaForm.get('ulica').value,
      this.registracijaForm.get('postanskiBroj').value
    );
  }
}
