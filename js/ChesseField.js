class ChesseField {
  x = 0;
  y = 0;
  divElement = null;
  chesseElement = null;

  static FIELD_START = 1;
  static FIELD_END = 8;

  constructor(x, y, divElement) {
    if(!Number.isInteger(x) || !Number.isInteger(y) || divElement == null) {
      console.log("Nieprawidłowe parametry pola");
      return false;
    }
    this.x = x;
    this.y = y;
    this.divElement = divElement;
  }

  checkIfEmpty() {
    if(this.chesseElement !== null && this.chesseElement.type !== ChesseElement.DOOR_FIELD) {
      //chesseElement nie jest puste, oraz nie jest DRZWIAMI - nie można w to pole przenieść żadnego elementu
      //console.error("Pole docelowe jest zajęte");
      return false;
  } else
      return true;
  }
}
