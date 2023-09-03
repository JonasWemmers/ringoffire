import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
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
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];

      if (this.gameId) {
        this.loadGame(this.gameId);
      }
    });
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
   
    // Verweise auf die Firestore-Collection 'games'
    const itemCollection = collection(this.firestore, 'games');
  
    // Holen Sie die JSON-Daten aus Ihrem Spielobjekt
    const gameData = this.game.toJson();
  
    // Füge die JSON-Daten zur Firestore-Collection hinzu
    //addDoc(itemCollection, gameData)
    // .then((docRef) => {
     //   console.log('Spiel wurde erfolgreich hinzugefügt mit ID:', docRef.id);
     // })
    //  .catch((error) => {
    //    console.error('Fehler beim Hinzufügen des Spiels:', error);
    //  });
  }

  takeCard() {
    if(!this.pickCardAnimation){
    this.currentCard = this.game.stack.pop() as string;
    this.pickCardAnimation = true;

    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    setTimeout(()=>{
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }
  }  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
      this.game.players.push(name);
    }
    });
  }
}
