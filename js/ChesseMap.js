
chesseFields = new Array();
chesseMapElements = new Array();

initChesseFields();

function initChesseFields() {
  //Stworzenie obiektów odpowiadającym divom na szachownicy
  let counter = 1;

  const chesseFieldsDivs = document.querySelectorAll('#szachownica div');

  for (var i = 1; i <= 64; i++) {
      const _chesseField = new ChesseField(i - ((counter - 1) * 8), counter, chesseFieldsDivs[i - 1]);
      chesseFields.push(_chesseField);
      if (i % 8 === 0)
          counter++;
  }

  chesseMapElements = [
    new ChesseElement(1, 1, ChesseElement.OBSTACLE_FIELD), //0
    new ChesseElement(3, 6, ChesseElement.OBSTACLE_FIELD), //1
    new ChesseElement(2, 4, ChesseElement.OBSTACLE_FIELD), //2
    new ChesseElement(7, 4, ChesseElement.OBSTACLE_FIELD), //3
    new ChesseElement(3, 3, ChesseElement.OBSTACLE_FIELD), //4
    new ChesseElement(4, 2, ChesseElement.OBSTACLE_FIELD), //5
    new ChesseElement(6, 3, ChesseElement.OBSTACLE_FIELD), //6
    new ChesseElement(5, 2, ChesseElement.OBSTACLE_FIELD), //7
    new ChesseElement(2, 1, ChesseElement.DOOR_FIELD), //8
    new ChesseElement(8, 8, ChesseElement.DOOR_FIELD), //9
    new ChesseElement(2, 8, ChesseElement.DOOR_FIELD), //10
    new ChesseElement(4, 3, ChesseElement.PEOPLE_FIELD), //11
    new ChesseElement(4, 4, ChesseElement.PEOPLE_FIELD), //12
    new ChesseElement(4, 5, ChesseElement.PEOPLE_FIELD), //13
    new ChesseElement(1, 4, ChesseElement.PEOPLE_FIELD), //14
  ]
}

function getChesseFieldByCoordinates(x, y) {
  const index = x + ((y - 1) * 8) - 1;
  return chesseFields[index];
}

function getDoors() {
  return chesseMapElements.filter((chesseElement) => {
    if(chesseElement.type === ChesseElement.DOOR_FIELD)
      return true;
  })
}


