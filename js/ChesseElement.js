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

  static PATH_FINDING_MAX_STEPS = 10000;

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
    if(this.type !== ChesseElement.PEOPLE_FIELD) {
      console.error('Szukanie ścieżki jest dozwolone tylko dla elementów typu człowiek.');
      return false;
    }
    let paths = new Array();
    const doors = getDoors();
    //Tworzymy historię ruchów dla każdych ruchów
    doors.forEach((door) => {
      paths.push({door, open: new Array(), closed: new Array(), finalPath: new Array()});
    })

    let counter = 0;

    //Nie chcemy przesuwać elementów podczas ustalania najkrótszej drogi - przypisujemy pozycje do zmiennych lokalnych
    let currentX = this.x;
    let currentY = this.y;
    doors.forEach((door, index) => {
      paths[index].open.push({x: currentX, y: currentY, fCost: 0, gCost: 0, hCost: 0, parent: {x: currentX, y: currentY}});
      while(true) {
        //Sortujemy otwarte tak, aby znaleźc ruch z najmniejszą wartośćią fCost
        paths[index].open.sort((moveA, moveB) => {
          if(moveA.fCost < moveB.fCost)
            return -1;
          else  
            return 1;
        });

        //Ruch z otwartych z najmniejszą wartością fCost
        let current = paths[index].open[0];

        //Usuwamy nasz ruch z otwartych
        paths[index].open = paths[index].open.filter((move) => {
          if(move.x !== current.x && move.y !== current.Y)
            return true;
          else
            return false;
        });

        //Przenosimy ten ruch do zamkniętych
        paths[index].closed.push({x: current.x, y: current.y, fCost: current.fCost, gCost: current.gCost, hCost: current.hCost, parent: {x: current.parent.x, y: current.parent.y}});

        //Jesteśmy na docelowym polu - kończymy zabawę
        if(current.x === door.x && current.y === door.y) {
          do {
            current = paths[index].closed.find(closedMove => closedMove.x === current.parent.x && closedMove.y === current.parent.y);
            paths[index].finalPath.push(current);
          } while(!(current.parent.x === currentX && current.parent.y === currentY))
          return;
        }


        const currentField = getChesseFieldByCoordinates(current.x, current.y);
        const currentMoves = currentField.getAvailableMoves();

        currentMoves.forEach((move) => {
          if(paths[index].closed.find(closedMove => closedMove.x === move.x && closedMove.y === move.y) !== undefined)
            return;

          //currentX, currentY - pozycja startowa. Node to punkt startowy.
          //current.x, current.y - obecnie sprawdzana pozycja
          //neighbour (albo move.x, move.y) - obecnie sprawdzany ruch dla powyższej pozycji
          const nodeGCost = Math.abs(currentX - current.x) + Math.abs(currentY - current.y);
          const nodeHCost = Math.abs(current.x - move.x) + Math.abs(current.y - move.y);
          const neighbourGCost = Math.abs(currentX - move.x) + Math.abs(currentY - move.y);
          const newCostToNeighbour = nodeGCost + nodeHCost;
          if(newCostToNeighbour < neighbourGCost || 
            paths[index].open.find(openMove => openMove.x === move.x && openMove.y === move.y) === undefined) {
              if(paths[index].open.find(openMove => openMove.x === move.x && openMove.y === move.y) === undefined) {
                const hFinalCost = Math.abs(move.x - door.x) + Math.abs(move.y - door.y);
                const fCost = newCostToNeighbour + hFinalCost;
                paths[index].open.push({x: move.x, y: move.y, fCost: fCost, gCost: newCostToNeighbour, hCost: hFinalCost, parent: {x: current.x, y: current.y}})
              } else {
                paths[index].open = paths[index].open.map((_move) => {
                  if(_move.x === move.x && _move.y === move.y)
                    return {x: move.x, y: move.y, fCost: fCost, gCost: newCostToNeighbour, hCost: hFinalCost, parent: {x: current.x, y: current.y}};
                  else
                    return _move;
                })
              }
            }
        });

        //Zabezpieczenie na wypadek błędów i wpadnięcia w pętle bez końca
        counter++;
        if(counter > ChesseElement.PATH_FINDING_MAX_STEPS) {
          console.log("10000 ruchów .. coś jest nie tak");
          return false;
        }
      }
    });

    //Mamy już wszystkie ścieżki dla wszystkich drzwi - szukamy która ma najmniej ruchów
    //poprzez sortowanie od najmniejszej ilości ruchów do największej
    paths.sort((pathA, pathB) => {
      if(pathA.finalPath.length < pathB.finalPath.length)
        return -1;
      else if (pathA.finalPath.length > pathB.finalPath.length)
        return 1;
      else
        return 0;
    });

    //Kolorowanie ścieżki do najbliższych drzwi
    paths[0].finalPath.forEach((move) => {
      const pathField = getChesseFieldByCoordinates(move.x, move.y);
      pathField.divElement.style.backgroundColor = '#99ccff';
    });

    console.log(paths);
  }
}
