"# projektstudia" 

Działanie obecnie jedynie można wykonywać przez konsolę przeglądarki.

chesseMapElements

X - indeks tablicy z elementami

od 0 do 3 - PRZESZKODA
od 4 do 6 - DRZWI
od 7 do 10 - CZŁOWIEK

PORUSZENIE ELEMENTEM

chesseMapElements[X].move(1, 1);

DOSTEPNE RUCHY ELEMENTU

chesseMapElements[X].getAvailableMoves();

ZNALEZIENIE NAJKRÓTSZEJ DROGI DO NAJBLIŻSZYCH DRZWI (TODO)

chesseMapElements[X].findPathToClosestDoor();