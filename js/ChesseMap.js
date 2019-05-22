chesseFields = new Array();
chesseMapElements = new Array();

const btnAddObstacles = document.querySelector('.form-obstacles button');
const btnAddPerson = document.querySelector('.form-person button');
const btnAddDoors = document.querySelector('.form-doors button');

const createObstacles = (e) => {
  e.preventDefault() //stopowanie odświeżenia strony
  //pobranie inputów przeszkód i sprawdzenie czy nie są puste
  const obstaclesList = [...document.querySelectorAll('.form-obstacles input')];
  const isEmpty = obstaclesList.filter(item => !item.value)
  if (isEmpty.length > 0) return alert('wypełnij wszystkie pola!')
  //wszystkie inputy idą w jednym formularzu więc po kolei z nich otrzymujemy x i y
  const obstaclesCoordX = []
  const obstaclesCoordY = []
  let counter = 0
  //tutaj rozdzielamy z jednej tablocy x i y na oddzielną tab dla xy i dla y
  obstaclesList.forEach((item) => {
    if (counter % 2 === 0) {
      obstaclesCoordX.push(item.value)
      counter++
    } else {
      obstaclesCoordY.push(item.value)
      counter++
    }
  })
  //tworzymy liste koordynatów przeszkód
  const obstaclesCoord = [];
  for (let i = 0; i < obstaclesCoordX.length; i++) {
    obstaclesCoord.push({
      x: obstaclesCoordX[i],
      y: obstaclesCoordY[i]
    })

  }
  console.log(obstaclesCoord)
}
btnAddObstacles.addEventListener('click', createObstacles)




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