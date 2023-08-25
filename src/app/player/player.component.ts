import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() name!: string; // Das Ausrufezeichen ("!") zeigt TypeScript an, dass du sicher bist, dass die Eigenschaft später zugewiesen wird.

  constructor() {}

  ngOnInit(): void {
  }

}
