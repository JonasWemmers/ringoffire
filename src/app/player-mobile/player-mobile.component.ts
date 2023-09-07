import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-mobile',
  templateUrl: './player-mobile.component.html',
  styleUrls: ['./player-mobile.component.scss']
})
export class PlayerMobileComponent implements OnInit {

  @Input() name!: string; // Das Ausrufezeichen ("!") zeigt TypeScript an, dass du sicher bist, dass die Eigenschaft später zugewiesen wird.
  @Input() playerActive: boolean = false;


  constructor() {}

  ngOnInit(): void {
  }

}
