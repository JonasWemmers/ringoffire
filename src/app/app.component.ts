import { Component, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ringoffire';
  item$: Observable<{}[]>;
  firestore: Firestore = inject(Firestore);
  

  constructor() {
    const itemCollection = collection(this.firestore, 'games');
    this.item$ = collectionData(itemCollection);
  }
}
