class ChesseElement {
  x = 0;
  y = 0;
  divElement = null
  type = null;
  chesseField = null;

  static EMPTY_FIELD = 'emptyField';
  static PEOPLE_FIELD = 'peopleField';
  static OBSTACLE_FIELD = 'obstacleField';
  static DOOR_FIELD = 'doorField';

  static PATH_FINDING_MAX_STEPS = 1000;

  static checkIfTypeIsCorrect(type) {
    if( type === ChesseElement.EMPTY_FIELD ||
        type === ChesseElement.PEOPLE_FIELD ||
        type === ChesseElement.OBSTACLE_FIELD ||
        type === ChesseElement.DOOR_FIELD
      )
      return true; 
        else
      return false;
  }

  constructor(x, y, type) {
    if(!Number.isInteger(x) || !Number.isInteger(y) || !ChesseElement.checkIfTypeIsCorrect(type)) {
      console.log("Nieprawidłowe parametry elementu");
      return false;
    }

    this.x = x;
    this.y = y;
    this.type = type;

    //Znajdujemy pole które znajduje się pod podanymi w konstruktorze koordynatami
    const _chessField = getChesseFieldByCoordinates(x, y);

    if(_chessField !== null &&_chessField.chesseElement === null) {
        //Po sprawdzeniu, że pole istnieje, oraz, że pole nie ma przypisanego elementu lecimy dalej
        //Przypisujemy pole do naszego elementu
        this.chesseField = _chessField;

        //Tworzymy wizualną część naszego elementu
        this.divElement = document.createElement("div");
        //Klasa na podstawie rodzaju elementu
        this.divElement.classList.add('field', type);
        this.divElement.onclick = this.outputCords;

        //Wrzucamy diva wizualizującego nasz element do diva wizualizującego docelowe pole
        this.chesseField.divElement.appendChild(this.divElement);
        //Zaznaczamy na polu, że posiada ono ten element
        this.chesseField.chesseElement = this;
    } else {
        //W sumie w tym przypadku nie powinniśmy dodawać elementu do tablicy
        console.error(`Pole ${this.x} | ${this.y} zawiera już element lub jest ono nieprawidłowe`)
    }
  }

  outputCords = function() {
    console.log(`${this.x} | ${this.y}`);
  }

  move = function(x, y) {
    if(this.type !== ChesseElement.PEOPLE_FIELD) {
      console.error('Ruch jest dozwolony tylko dla elementów typu człowiek.');
      return false;
    }
    //TODO: dodać sprawdzenie, czy pole na które chcemy przesunąć element jest dostępne dla danego elementu
    //tip: z pomocą przychodzi funkcja getAvailableMoves

    const destChesseField = getChesseFieldByCoordinates(x, y);

    if(!destChesseField.checkIfEmpty()) {
        console.error("Pole docelowe jest zajęte");
        return false;
    }

    this.x = x;
    this.y = y;

    //Uciekamy z obecnego pola, zatem będzie ono puste
    this.chesseField.chesseElement = null;
    //Deklarujemy, że nasz chessElement będzie podlegał pod nowe pole
    this.chesseField = destChesseField;

    //Przenosimy element do nowego rodzica (z jednego pola na drugie)
    this.chesseField.divElement.appendChild(this.divElement);
  }

  findPathToClosestDoor = function() {
    let paths = new Array();
    const doors = getDoors();
    //Tworzymy historię ruchów dla każdych ruchów
    doors.forEach((door) => {
      paths.push({door, moveHistory: new Array()});
    })

    let counter = 0;

    doors.forEach((door, index) => {
      //Nie chcemy przesuwać elementów podczas ustalania najkrótszej drogi - przypisujemy pozycje do zmiennych lokalnych
      let currentX = this.x;
      let currentY = this.y;
      while(true) {
        let finish = false;
        const currentField = getChesseFieldByCoordinates(currentX, currentY);
        const currentMoves = currentField.getAvailableMoves();

        let closestMove = { move: null, distance: 0 };

        currentMoves.forEach((move) => {
          const g = Math.abs(currentX - move.x) + Math.abs(currentY - move.y);
          const h = Math.abs(move.x - door.x) + Math.abs(move.y - door.y);
          const distance = g + h;

          if(closestMove.move === null || closestMove.distance > distance)
            closestMove = { move, distance };

          //Drzwi znajdują się w dostępnych ruchach - kończymy zabawę
          if(move.x === door.x && move.y === door.y)
            finish = true;
        });
        
        //Dodajemy najkorzystniejszy ruch do historii ścieżek dla danych drzwi
        paths[index].moveHistory.push(closestMove);
        //Wirtualnie "poruszamy" naszym elementem
        currentX = closestMove.move.x, currentY = closestMove.move.y;

        //Koniec pętli dla danych drzwi - lecimy ze znalezieniem ścieżki dla kolejnych
        if(finish)
          return;

        //Zabezpieczenie na wypadek błędów i wpadnięcia w pętle bez końca
        counter++;
        if(counter > ChesseElement.PATH_FINDING_MAX_STEPS) {
          console.log("1000 ruchów .. coś jest nie tak");
          return false;
        }
      }
    });

    //Mamy już wszystkie ścieżki dla wszystkich drzwi - szukamy która ma najmniej ruchów
    //poprzez sortowanie od najmniejszej ilości ruchów do największej
    //To można by ładniej napisać :c Franek zrób coś z tym!
    paths.sort((pathA, pathB) => {
      if(pathA.moveHistory.length < pathB.moveHistory.length)
        return -1;
      else if (pathA.moveHistory.length > pathB.moveHistory.length)
        return 1;
      else
        return 0;
    });

    //To też brzydkie
    console.log(`Drzwi znajdujące się najbliżej pola ${this.x} | ${this.y} 
               znajdują się na polu ${paths[0].door.x} | ${paths[0].door.y}
               dystans wynosi ${paths[0].moveHistory.length} ruchów`);
    console.log(paths[0].moveHistory);
  }
}
