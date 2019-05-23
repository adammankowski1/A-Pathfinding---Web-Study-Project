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
    if (type === ChesseElement.EMPTY_FIELD ||
      type === ChesseElement.PEOPLE_FIELD ||
      type === ChesseElement.OBSTACLE_FIELD ||
      type === ChesseElement.DOOR_FIELD
    )
      return true;
    else
      return false;
  }

  constructor(x, y, type) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !ChesseElement.checkIfTypeIsCorrect(type)) {
      console.log("Nieprawidłowe parametry elementu");
      return false;
    }

    this.x = x;
    this.y = y;
    this.type = type;

    //Znajdujemy pole które znajduje się pod podanymi w konstruktorze koordynatami
    const _chessField = getChesseFieldByCoordinates(x, y);

    if (_chessField !== null && _chessField.chesseElement === null) {
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
      console.error(`Pole ${this.x} | ${this.y} zawiera już element lub jest ono nieprawidłowe`);
      return [];
    }
  }

  outputCords = function () {
    console.log(`${this.x} | ${this.y}`);
  }

  move = function (x, y) {
    if (this.type !== ChesseElement.PEOPLE_FIELD) {
      console.error('Ruch jest dozwolony tylko dla elementów typu człowiek.');
      return false;
    }

    const destChesseField = getChesseFieldByCoordinates(x, y);

    if (!destChesseField.checkIfEmpty()) {
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

  moveByPath = function (path, index) {

  }

  findPathToClosestDoor = function () {
    if (this.type !== ChesseElement.PEOPLE_FIELD) {
      console.error('Szukanie ścieżki jest dozwolone tylko dla elementów typu człowiek.');
      return false;
    }
    let paths = new Array();
    const doors = getDoors();
    //Tworzymy historię ruchów dla każdych ruchów
    doors.forEach((door) => {
      paths.push({
        door,
        open: new Array(),
        closed: new Array(),
        finalPath: new Array()
      });
    })

    let counter = 0;

    //Nie chcemy przesuwać elementów podczas ustalania najkrótszej drogi - przypisujemy pozycje do zmiennych lokalnych
    let currentX = this.x;
    let currentY = this.y;
    doors.forEach((door, index) => {

      chesseFields = chesseFields.map((field) => {
        field.fCost = 0;
        field.gCost = 0;
        field.hCost = 0;
        field.parent = {
          x: field.x,
          y: field.y
        };
        return field;
      });

      const startNode = this.chesseField;
      paths[index].open.push(startNode);
      while (paths[index].open.length > 0) {
        let current = paths[index].open[0];
        for (let i = 1; i < paths[index].open.length; i++) {
          if (paths[index].open[i].fCost < current.fCost || paths[index].open[i].fCost == current.fCost)
            if (paths[index].open[i].hCost < current.hCost)
              //Ruch z otwartych z najmniejszą wartością fCost
              current = paths[index].open[i];
        }

        //Usuwamy nasz ruch z otwartych
        paths[index].open = paths[index].open.filter((move) => {
          if (move.x === current.x && move.y === current.y)
            return false;
          else
            return true;
        });

        //Przenosimy ten ruch do zamkniętych
        paths[index].closed.push(current);

        //Jesteśmy na docelowym polu - kończymy zabawę
        if (current.x === door.x && current.y === door.y) {
          do {
            current = paths[index].closed.find(closedMove => closedMove.x === current.parent.x && closedMove.y === current.parent.y);
            paths[index].finalPath.push(current);
          } while (!(current.parent.x === currentX && current.parent.y === currentY))
          return;
        }

        const currentField = getChesseFieldByCoordinates(current.x, current.y);
        const currentMoves = currentField.getAvailableMoves();

        currentMoves.forEach((move) => {
          if (paths[index].closed.find(closedMove => closedMove.x === move.x && closedMove.y === move.y) !== undefined)
            return;

          const newCostToNeighbour = current.gCost + getDistance(current, move);
          if (newCostToNeighbour < move.gCost ||
            paths[index].open.find(openMove => openMove.x === move.x && openMove.y === move.y) === undefined) {
            if (paths[index].open.find(openMove => openMove.x === move.x && openMove.y === move.y) === undefined) {
              move.gCost = newCostToNeighbour;
              move.hCost = getDistance(move, door);
              move.fCost = move.gCost + move.hCost;
              move.parent.x = current.x;
              move.parent.y = current.y;

              paths[index].open.push(move);
            } else {
              paths[index].open = paths[index].open.map((_move) => {
                if (_move.x === move.x && _move.y === move.y) {
                  _move.gCost = newCostToNeighbour;
                  _move.hCost = getDistance(move, door);
                  _move.fCost = move.gCost + move.hCost;
                  _move.parent.x = current.x;
                  _move.parent.y = current.y;
                  return _move;
                } else
                  return _move;
              })
            }
          }
        });

        //Zabezpieczenie na wypadek błędów i wpadnięcia w pętle bez końca
        counter++;
        if (counter > ChesseElement.PATH_FINDING_MAX_STEPS) {
          console.log("10000 ruchów .. coś jest nie tak");
          return false;
        }
      }
    });


    //Usuwamy ścieżki do drzwi przy których nie udało się ustalić trasy (bo nie istnieje taka trasa) 
    paths = paths.filter(path => {
      return path.finalPath.length !== 0;
    });
    //Mamy już wszystkie ścieżki dla wszystkich drzwi - szukamy która ma najmniej ruchów
    //poprzez sortowanie od najmniejszej ilości ruchów do największej
    paths.sort((pathA, pathB) => {
      if (pathA.finalPath.length < pathB.finalPath.length)
        return -1;
      else if (pathA.finalPath.length > pathB.finalPath.length)
        return 1;
      else
        return 0;
    });


    if (paths.length === 0)
      alert(`Dla człowieka z pozycji X: ${currentX} | Y: ${currentY} nie ma już ratunku. Nie istnieje ścieżka ewakuacyjna :(`);
    else {
      //Kolorowanie ścieżki do najbliższych drzwi
      paths[0].finalPath.forEach((move) => {
        const pathField = getChesseFieldByCoordinates(move.x, move.y);
        pathField.divElement.style.backgroundColor = '#99ccff';
      });
      return paths[0].finalPath;
    }
  }
}