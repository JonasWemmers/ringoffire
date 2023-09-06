import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, doc, getDoc, addDoc, collection, setDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
//import { addDoc, collection, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Game = new Game();
  Firestore: Firestore = inject(Firestore);
  item$: Observable<{}[]>;
  itemSubscription: Subscription | null = null;
  gameId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {
    this.item$ = new Observable<{}[]>();

    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
  
      if (this.gameId) {
        this.loadGame(this.gameId);
      }
    });

    const itemCollection = collection(this.firestore, 'games');

    if(this.gameId) {
      const gameRef = doc(itemCollection, this.gameId);

      onSnapshot(gameRef, (gameSnap) => {
        if(gameSnap.exists()) {
          const gameData = gameSnap.data() as Game;
          
           // Aktualisiere die local `this.game` mit den neuesten Daten aus der Datenbank
           this.game.players = gameData.players.concat();
           this.game.playedCards = gameData.playedCards.concat();
           this.game.pickCardAnimation = gameData.pickCardAnimation;
           this.game.currentCard = gameData.currentCard;

          console.log(gameData)
          console.log('Spiel wird automatisch aktualisiert', this.game);
          
        } else {
          console.log('Spiel nicht gefunden');
        }
      });
    }
  }

  ngOnInit(): void {
    
  }
  

  async loadGame(gameId: string | undefined) {
    if (!gameId) {
      console.log('Spiel-ID ist nicht definiert');
      return;
    }

    // Verwende die Firestore-Instanz und den Namen der Collection
    const itemCollection = collection(this.firestore, 'games');

    // Erstelle eine Referenz auf das spezifische Spiel-Dokument
    const gameRef = doc(itemCollection, gameId);

    // Holen Sie die Daten des spezifischen Spiels
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      
      console.log('Spiel Infos', gameData);
    } else {
      console.log('Spiel nicht gefunden');
    }
  }

  newGame() {
    this.game = new Game();
  }

  async takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() as string;
      await this.saveGame();
      this.game.pickCardAnimation = true;
  
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      
      // Fügen Sie die gezogene Karte zur gespielten Kartenliste hinzu
      this.game.playedCards.push(this.game.currentCard);
  
      setTimeout(() => {
        this.game.pickCardAnimation = false;
      }, 1000);

      // Speichern Sie das aktualisierte Spiel
      await this.saveGame();
    }
  }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
      this.game.players.push(name);
      this.saveGame();
    }
    });
  }

  async saveGame() {
    if (!this.gameId) {
      console.error('Spiel-ID ist nicht definiert');
      return;
    }
  
    try {
      // Verweise auf die Firestore-Collection 'games'
      const itemCollection = collection(this.firestore, 'games');
  
      // Erstelle eine Referenz auf das spezifische Spiel-Dokument
      const gameRef = doc(itemCollection, this.gameId);
  
      // Holen Sie die aktuellen Daten des spezifischen Spiels
      const gameSnap = await getDoc(gameRef);
  
      if (gameSnap.exists()) {
        
        // Aktualisieren Sie die JSON-Daten des Spiels mit den neuen Spielinformationen
        const updatedGameData = {
          ...gameSnap.data(),
          // Aktualisieren Sie die Spielerliste hier entsprechend
          players: this.game.players,
          // Aktualisieren Sie die gespielten Karten hier entsprechend
          playedCards: this.game.playedCards, 
          // Fügen Sie andere aktualisierte Spielinformationen hinzu
          pickCardAnimation: this.game.pickCardAnimation, 
          currentCard: this.game.currentCard, 
          
        };
        const gameData = gameSnap.data();
        console.log('Spiel Infos', gameData);
        
  
        // Aktualisieren Sie das Dokument in der Firestore-Collection
        await setDoc(gameRef, updatedGameData);
  
        console.log('Spiel erfolgreich aktualisiert');
      } else {
        console.log('Spiel nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Spiels:', error);
    }
  }
  
}
