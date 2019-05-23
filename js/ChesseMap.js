chesseFields = new Array();
chesseMapElements = new Array();

const btnAddObstacle = document.querySelector('.form-obstacle button');
const btnAddPerson = document.querySelector('.form-person button');
const btnAddDoor = document.querySelector('.form-door button');
const btnClearBoard = document.querySelector('.clear');
const btnStart = document.querySelector('.start');

const clearBoard = () => {
  chesseMapElements.forEach(chesseElement => {
    chesseElement.chesseField.fCost = 0;
    chesseElement.chesseField.gCost = 0;
    chesseElement.chesseField.hCost = 0;
    chesseElement.chesseField.parent = {
      x: chesseElement.chesseField.x,
      y: chesseElement.chesseField.y
    };
    chesseElement.divElement.outerHTML = "";
    chesseElement.chesseField.chesseElement = null;
    delete(chesseElement);
  });
  chesseMapElements = new Array();
  console.log('obsługa czyszczenia tablicy')
}
const startTest = () => {
  //do napisania start gry
  console.log('obsługa rozpoczecia gry')
}

const addField = (action, e) => {
  e.preventDefault()
  switch (action) {
    case ChesseElement.OBSTACLE_FIELD:
      const obstacle = document.querySelectorAll('.form-obstacle input');
      if (obstacle[0].value && obstacle[1].value !== '') {
        if ((obstacle[0].value > 0 && obstacle[0].value < 9) && (obstacle[1].value > 0 && obstacle[1].value < 9)) {
          const chesseElement = new ChesseElement(+obstacle[0].value, +obstacle[1].value, ChesseElement.OBSTACLE_FIELD);
          if (chesseElement instanceof ChesseElement)
            chesseMapElements.push(chesseElement);
        } else {
          return alert('wproawdzane liczby musza być z zakresu 1-8')
        }
      } else {
        return alert('wypełnij pola!')
      }
      break;
    case ChesseElement.PEOPLE_FIELD:
      const person = document.querySelectorAll('.form-person input');
      if (person[0].value && person[1].value !== '') {
        if ((person[0].value > 0 && person[0].value < 9) && (person[1].value > 0 && person[1].value < 9)) {
          const chesseElement = new ChesseElement(+person[0].value, +person[1].value, ChesseElement.PEOPLE_FIELD)
          if (chesseElement instanceof ChesseElement)
            chesseMapElements.push(chesseElement);
        } else {
          return alert('wproawdzane liczby musza być z zakresu 1-8')
        }
      } else {
        return alert('wypełnij pola!')
      }
      break;
    case ChesseElement.DOOR_FIELD:
      const door = document.querySelectorAll('.form-door input');
      if (door[0].value && door[1].value !== '') {
        if ((door[0].value > 0 && door[0].value < 9) && (door[1].value > 0 && door[1].value < 9)) {
          const chesseElement = new ChesseElement(+door[0].value, +door[1].value, ChesseElement.DOOR_FIELD)
          if (chesseElement instanceof ChesseElement)
            chesseMapElements.push(chesseElement);
        } else {
          return alert('wproawdzane liczby musza być z zakresu 1-8')
        }
      } else {
        return alert('wypełnij pola!')
      }
      break;
    default:
      return alert('Wrong action')
  }
  console.log(chesseMapElements);
}
btnAddObstacle.addEventListener('click', addField.bind(this, ChesseElement.OBSTACLE_FIELD))
btnAddPerson.addEventListener('click', addField.bind(this, ChesseElement.PEOPLE_FIELD))
btnAddDoor.addEventListener('click', addField.bind(this, ChesseElement.DOOR_FIELD))
btnStart.addEventListener('click', startTest)
btnClearBoard.addEventListener('click', clearBoard)




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
    new ChesseElement(1, 3, ChesseElement.OBSTACLE_FIELD), //0
    new ChesseElement(3, 6, ChesseElement.OBSTACLE_FIELD), //1
    new ChesseElement(2, 4, ChesseElement.OBSTACLE_FIELD), //2
    new ChesseElement(7, 4, ChesseElement.OBSTACLE_FIELD), //3
    new ChesseElement(3, 3, ChesseElement.OBSTACLE_FIELD), //4
    new ChesseElement(4, 2, ChesseElement.OBSTACLE_FIELD), //5
    new ChesseElement(6, 3, ChesseElement.OBSTACLE_FIELD), //6
    new ChesseElement(5, 2, ChesseElement.OBSTACLE_FIELD), //7
    new ChesseElement(7, 5, ChesseElement.OBSTACLE_FIELD), //8
    new ChesseElement(7, 6, ChesseElement.OBSTACLE_FIELD), //9
    new ChesseElement(7, 7, ChesseElement.OBSTACLE_FIELD), //10
    new ChesseElement(6, 7, ChesseElement.OBSTACLE_FIELD), //11
    new ChesseElement(2, 1, ChesseElement.DOOR_FIELD), //12
    new ChesseElement(4, 3, ChesseElement.PEOPLE_FIELD), //13
    new ChesseElement(4, 4, ChesseElement.PEOPLE_FIELD), //14
    new ChesseElement(4, 5, ChesseElement.PEOPLE_FIELD), //15
    new ChesseElement(1, 4, ChesseElement.PEOPLE_FIELD), //16
    new ChesseElement(8, 8, ChesseElement.DOOR_FIELD), //12
    new ChesseElement(8, 2, ChesseElement.DOOR_FIELD), //12
  ]
}

function getChesseFieldByCoordinates(x, y) {
  const index = x + ((y - 1) * 8) - 1;
  return chesseFields[index];
}

function getDoors() {
  return chesseMapElements.filter((chesseElement) => {
    if (chesseElement.type === ChesseElement.DOOR_FIELD)
      return true;
  })
}

function getDistance(nodeA, nodeB) {
  const dstX = Math.abs(nodeA.x - nodeB.x);
  const dstY = Math.abs(nodeA.y - nodeB.y);

  if (dstX > dstY)
    return dstY + (dstX - dstY);
  return dstX + (dstY - dstX);
}