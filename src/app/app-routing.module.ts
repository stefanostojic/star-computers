import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PocetnaComponent } from './stranica/drugi-red/pocetna/pocetna.component';
import { ProizvodComponent } from './stranica/drugi-red/proizvod/proizvod.component';
import { ProizvodiComponent } from './stranica/drugi-red/administracija/proizvodi/proizvodi.component';
import { PonudaComponent } from './stranica/drugi-red/ponuda/ponuda.component';
import { RegistracijaComponent } from './stranica/drugi-red/registracija/registracija.component';
import { PrijavaComponent } from './stranica/drugi-red/prijava/prijava.component';
import { KorisniciComponent } from './stranica/drugi-red/administracija/korisnici/korisnici.component';
import { PorudzbineComponent } from './stranica/drugi-red/administracija/porudzbine/porudzbine.component';
import { ProfilComponent } from './stranica/drugi-red/profil/profil.component';
import { KorpaComponent } from './stranica/drugi-red/korpa/korpa.component';
import { GreskaComponent } from './stranica/drugi-red/greska/greska.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path: '', component: PocetnaComponent, pathMatch: 'full' },
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'proizvodi', component: PonudaComponent },
  { path: 'proizvodi/:id', component: ProizvodComponent },
  { path: 'administracija/proizvodi', component: ProizvodiComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'administracija/proizvodi/:id', component: ProizvodiComponent, canActivate: [AuthGuard] },
  { path: 'administracija/korisnici', component: KorisniciComponent, canActivate: [AuthGuard] },
  { path: 'administracija/porudzbine', component: PorudzbineComponent, canActivate: [AuthGuard] },
  { path: 'administracija/porudzbine/:id', component: PorudzbineComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'korpa', component: KorpaComponent, canActivate: [AuthGuard] },
  { path: '**', component: GreskaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
