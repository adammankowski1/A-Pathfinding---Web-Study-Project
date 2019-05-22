class ChesseField {
  x = 0;
  y = 0;
  fCost = 0;
  gCost = 0;
  hCost = 0;
  parent = {
    x: this.x,
    y: this.y
  };
  divElement = null;
  chesseElement = null;

  static FIELD_START = 1;
  static FIELD_END = 8;

  constructor(x, y, divElement) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || divElement == null) {
      console.log("Nieprawidłowe parametry pola");
      return false;
    }
    this.x = x;
    this.y = y;
    this.divElement = divElement;
  }

  checkIfEmpty() {
    if (this.chesseElement !== null && this.chesseElement.type !== ChesseElement.DOOR_FIELD) {
      //chesseElement nie jest puste, oraz nie jest DRZWIAMI - nie można w to pole przenieść żadnego elementu
      //console.error("Pole docelowe jest zajęte");
      return false;
    } else
      return true;
  }

  getAvailableMoves = function () {
    let possibleMoves = new Array();

    //Ruch w górę może być możliwy
    if (this.y !== ChesseField.FIELD_START)
      possibleMoves.push(getChesseFieldByCoordinates(this.x, this.y - 1));
    //Ruch w dół może być możliwy
    if (this.y !== ChesseField.FIELD_END)
      possibleMoves.push(getChesseFieldByCoordinates(this.x, this.y + 1));
    //Ruch w prawo może być możliwy
    if (this.x !== ChesseField.FIELD_START)
      possibleMoves.push(getChesseFieldByCoordinates(this.x - 1, this.y));
    //Ruch w lewo może być możliwy
    if (this.x !== ChesseField.FIELD_END)
      possibleMoves.push(getChesseFieldByCoordinates(this.x + 1, this.y));

    //Ostateczna weryfikacja czy pola są puste i jest możliwy ruch w ich miejsce
    return possibleMoves.filter(function (possibleMove) {
      return possibleMove.checkIfEmpty();
    });
  }
}