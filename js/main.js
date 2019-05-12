const EMPTY_FIELD = 'emptyField';
const PEOPLE_FIELD = 'peopleField';
const OBSTACLE_FIELD = 'obstacleField';
const DOOR_FIELD = 'doorField';

const FIELD_START = 1;
const FIELD_END = 8;

function ChesseField(x, y, divElement) {
    this.x = x;
    this.y = y;
    this.divElement = divElement;
    this.chesseElement = null;

    this.checkIfEmpty = function() {
        if(this.chesseElement !== null && this.chesseElement.type !== DOOR_FIELD) {
            //chesseElement nie jest puste, oraz nie jest DRZWIAMI - nie można w to pole przenieść żadnego elementu
            //console.error("Pole docelowe jest zajęte");
            return false;
        } else
            return true;
    }
}

function ChesseElement(x, y, type) {
    //constructor start
    this.x = x;
    this.y = y;
    this.divElement = null
    this.type = type;
    this.chesseField = null;

    //Znajdujemy pole które znajduje się pod podanymi w konstruktorze koordynatami
    const _chessField = findChesseFieldIndexByCoordinates(x, y);

    if(_chessField !== null &&_chessField.chesseElement === null) {
        //Po sprawdzeniu, że pole istnieje, oraz, że pole nie ma przypisanego elementu lecimy dalej
        //Przypisujemy pole do naszego elementu
        this.chesseField = _chessField;

        //Tworzymy wizualną część naszego elementu
        this.divElement = document.createElement("div");
        //Klasa na podstawie rodzaju elementu
        this.divElement.classList.add('field', this.type);
        this.divElement.onclick = this.outputCords;

        //Wrzucamy diva wizualizującego nasz element do diva wizualizującego docelowe pole
        this.chesseField.divElement.appendChild(this.divElement);
        //Zaznaczamy na polu, że posiada ono ten element
        this.chesseField.chesseElement = this;
    } else {
        //W sumie w tym przypadku nie powinniśmy dodawać elementu do tablicy
        console.error(`Pole ${this.x} | ${this.y} zawiera już element lub jest ono nieprawidłowe`)
    }

    //constructor end

    const self = this;

    this.outputCords = function() {
        console.log(`${self.x} | ${self.y}`);
    }

    this.move = function(x, y) {
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

    this.findPathToClosestDoor = function() {
        //TODO TODO
    }

    this.getAvailableMoves = function() {
        if(this.type !== PEOPLE_FIELD) {
            console.error('Ruch jest dozwolony tylko dla elementów typu człowiek.');
            return false;
        }

        let possibleMoves = new Array();

        //Ruch w górę może być możliwy
        if(this.y !== FIELD_START)
            possibleMoves.push(findChesseFieldIndexByCoordinates(this.x, this.y - 1));
        //Ruch w dół może być możliwy
        if(this.y !== FIELD_END)
            possibleMoves.push(findChesseFieldIndexByCoordinates(this.x, this.y + 1));
        //Ruch w prawo może być możliwy
        if(this.x !== FIELD_START)
            possibleMoves.push(findChesseFieldIndexByCoordinates(this.x - 1, this.y));
        //Ruch w lewo może być możliwy
        if(this.x !== FIELD_END)
            possibleMoves.push(findChesseFieldIndexByCoordinates(this.x + 1, this.y));

        //Ostateczna weryfikacja czy pola są puste i jest możliwy ruch w ich miejsce
        return possibleMoves.filter(function(possibleMove) {
            console.log(possibleMove.checkIfEmpty());
            return possibleMove.checkIfEmpty();
        });
    }
}

let chesseFieldMap = new Array();

//Funkcja wyszukująca index obiektu pola na podstawie koordynat
function findChesseFieldIndexByCoordinates(x, y) {
    const index = x + ((y - 1) * 8) - 1;
    return chesseFieldMap[index];
}

//Stworzenie obiektów odpowiadającym divom na szachownicy

let counter = 1;

const chesseFieldsDivs = document.querySelectorAll('#szachownica div');

for (var i = 1; i <= 64; i++) {
    let _chesseField = new ChesseField(i - ((counter - 1) * 8), counter, chesseFieldsDivs[i - 1]);
    chesseFieldMap.push(_chesseField);
    if (i % 8 === 0)
        counter++;
}

//Utworzenie elementów na szachownicy

const chesseMapElements = [
    new ChesseElement(1, 1, OBSTACLE_FIELD), //0
    new ChesseElement(3, 6, OBSTACLE_FIELD), //1
    new ChesseElement(2, 4, OBSTACLE_FIELD), //2
    new ChesseElement(7, 4, OBSTACLE_FIELD), //3
    new ChesseElement(2, 1, DOOR_FIELD), //4
    new ChesseElement(8, 8, DOOR_FIELD), //5
    new ChesseElement(2, 8, DOOR_FIELD), //6
    new ChesseElement(4, 3, PEOPLE_FIELD), //7
    new ChesseElement(4, 4, PEOPLE_FIELD), //8
    new ChesseElement(4, 5, PEOPLE_FIELD), //9
    new ChesseElement(1, 4, PEOPLE_FIELD), //10
]

//chesseMapElements[7].move(3,1);

//console.log(chesseMap);
