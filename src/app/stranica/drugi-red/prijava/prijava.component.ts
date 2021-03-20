import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {
  errorStatusSub: Subscription;
  korisnickoImeError: boolean;
  lozinkaError: boolean;
  ucitavanje = false;

  constructor(private authService: AuthService) { }

  prijavaForm: FormGroup;

  ngOnInit() {
    document.title = 'Prijava | STAR computers';
    this.prijavaForm = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      lozinka: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
    });
    this.errorStatusSub = this.authService.getErrorStatusListener()
    .subscribe(data => {
      this.ucitavanje = false;
      console.log('prijava.component: data.error: ', data.message);
      if (data.message === 'Korisničko ime nije pronađeno') {
        this.korisnickoImeError = true;
      } else if (data.message === 'Lozinka nije ispravna') {
        this.lozinkaError = true;
      }
    });
    this.prijavaForm.reset();
  }

  prijava() {
    if (this.prijavaForm.invalid) {
      console.log('invalid form');
      console.log('this.prijavaForm.get(email).invalid: ' + this.prijavaForm.get('email').invalid);
      console.log('this.prijavaForm.get(lozinka).invalid: ' + this.prijavaForm.get('lozinka').invalid);
      this.prijavaForm.markAllAsTouched();
      return;
    }
    this.ucitavanje = true;
    this.prijavaForm.markAsUntouched();
    console.log('nastavak prijave...');
    this.authService.prijava(this.prijavaForm.get('email').value, this.prijavaForm.get('lozinka').value);
  }
}
