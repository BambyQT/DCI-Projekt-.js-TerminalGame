// readline ermöglicht die Kommunikation mit der Benutzereingabe
const readline = require('readline');
const { stdin, stdout } = process;
const rl = readline.createInterface({ input: stdin, output: stdout });

// Breite und Höhe des Spielfelds
const width = 40; 
const height = 20;

// Initialposition der Schlange und Richtung
const snake = [{ x: 10, y: 10 }];
let direction = 'right';

// Zufällige Position des ersten Essens
let food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };

// Funktion zum Zeichnen des Spielfelds
function draw() {
  // Terminal löschen
  process.stdout.write('\x1Bc');
  
  // Zeichne oberen Rand
  process.stdout.write('-'.repeat(width + 2) + '\n');

  for (let y = 0; y < height; y++) {
    process.stdout.write('I'); // Linker Rand
    for (let x = 0; x < width; x++) {
      let char = ' ';
      if (x === food.x && y === food.y) {
        char = '#'; // Zeichne das Essen
      }
      snake.forEach(segment => {
        if (segment.x === x && segment.y === y) {
          char = '■'; // Zeichne die Schlange
        }
      });
      process.stdout.write(char);
    }
    process.stdout.write('I'); // Rechter Rand
    process.stdout.write('\n');
  }

  // Zeichne unteren Rand
  process.stdout.write('-'.repeat(width + 2) + '\n');
}

// Funktion zur Aktualisierung des Spiels
function update() {
  const head = Object.assign({}, snake[0]);
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  // Überprüfe, ob die Schlange den Spielfeldrand berührt
  if (head.x >= width || head.x < 0 || head.y >= height || head.y < 0) {
    rl.close(); // Schließe das Spiel
    console.log('Game over!');
    return; // Beende die Funktion, um weitere Prüfungen zu vermeiden
  }

  // Überprüfe, ob die Schlange das Essen eingesammelt hat
  if (head.x === food.x && head.y === food.y) {
    // Platziere neues Essen an zufälliger Position
    food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
    snake.push({}); // Füge ein Segment zur Schlange hinzu
  } else {
    snake.pop(); // Entferne das letzte Segment der Schlange
  }

  snake.unshift(head); // Setze den Kopf der Schlange an die neue Position

  // Überprüfe auf Kollision mit dem eigenen Körper
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      rl.close(); // Schließe das Spiel
      console.log('Game over!');
    }
  }
}

// Funktion, die das Spiel in Intervallen aktualisiert
function tick() {
  draw();
  update();
  setTimeout(tick, 100);
}

// Event-Handler für Benutzereingabe
rl.input.on('data', (key) => {
  switch (key.toString().trim()) {
    case 'w':
      if (direction !== 'down') direction = 'up'; // Ändere die Richtung nur wenn nicht in entgegengesetzter Richtung
      break;
    case 's':
      if (direction !== 'up') direction = 'down';
      break;
    case 'a':
      if (direction !== 'right') direction = 'left';
      break;
    case 'd':
      if (direction !== 'left') direction = 'right';
      break;
  }
});

// Starte das Spiel
tick();
