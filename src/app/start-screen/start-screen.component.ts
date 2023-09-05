import { Component } from '@angular/core';
//import { addDoc, collection } from 'firebase/firestore';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, addDoc, collection } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  
  game: Game = new Game();
  

  constructor(private firestore: Firestore, private router: Router) {}
  async newGame() {
    try {
      // Erstellen Sie das Spiel
      this.game = new Game();
  
      // Verweise auf die Firestore-Collection 'games'
      const itemCollection = collection(this.firestore, 'games');
  
      // Holen Sie die JSON-Daten aus Ihrem Spielobjekt
      const gameData = this.game.toJson();
  
      // Fügen Sie die JSON-Daten zur Firestore-Collection hinzu
      const docRef = await addDoc(itemCollection, gameData);
  
      // Extrahieren Sie die ID des neu erstellten Dokuments
      const gameId = docRef.id;
  
      // Weiterleitung zur Seite '/game/id'
      this.router.navigateByUrl(`/game/${gameId}`);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Spiels:', error);
    }
  }
  

}
