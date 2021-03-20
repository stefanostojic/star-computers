import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-greska',
  templateUrl: './greska.component.html',
  styleUrls: ['./greska.component.css']
})
export class GreskaComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    document.title = 'Greška | STAR computers';
  }
}
