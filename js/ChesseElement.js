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
    const _chessField = findChesseFieldIndexByCoordinates(x, y);

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

    const destChesseField = findChesseFieldIndexByCoordinates(x, y);

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
    //TODO TODO
  }

  getAvailableMoves = function() {
    if(this.type !== ChesseElement.PEOPLE_FIELD) {
        console.error('Ruch jest dozwolony tylko dla elementów typu człowiek.');
        return false;
    }

    let possibleMoves = new Array();

    //Ruch w górę może być możliwy
    if(this.y !== ChesseField.FIELD_START)
        possibleMoves.push(findChesseFieldIndexByCoordinates(this.x, this.y - 1));
    //Ruch w dół może być możliwy
    if(this.y !== ChesseField.FIELD_END)
        possibleMoves.push(findChesseFieldIndexByCoordinates(this.x, this.y + 1));
    //Ruch w prawo może być możliwy
    if(this.x !== ChesseField.FIELD_START)
        possibleMoves.push(findChesseFieldIndexByCoordinates(this.x - 1, this.y));
    //Ruch w lewo może być możliwy
    if(this.x !== ChesseField.FIELD_END)
        possibleMoves.push(findChesseFieldIndexByCoordinates(this.x + 1, this.y));

    //Ostateczna weryfikacja czy pola są puste i jest możliwy ruch w ich miejsce
    return possibleMoves.filter(function(possibleMove) {
        return possibleMove.checkIfEmpty();
    });
  }
}
