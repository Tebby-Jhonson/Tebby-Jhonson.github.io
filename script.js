// Controla si el juego ha comenzado
let gameStarted = false;
let currentPlayer = 'player1'; // Controla quién es el jugador actual
let player1QueensCount = 0; // Cuenta las reinas colocadas por el jugador 1
let player2QueensCount = 0; // Cuenta las reinas colocadas por el jugador 2
let queenPlacedThisTurn = false; // Controla si se ha colocado una reina en el turno actual

// Lista de soluciones predefinidas para el problema de las 8 reinas
const solutions = [
    [0, 4, 7, 5, 2, 6, 1, 3],
    [0, 4, 7, 5, 1, 3, 6, 2],
    [0, 5, 7, 2, 6, 3, 1, 4],
    [0, 6, 2, 7, 1, 4, 5, 3],
    [0, 6, 3, 5, 7, 1, 4, 2],
    [1, 3, 0, 6, 2, 7, 5, 4],
    [1, 4, 7, 5, 0, 2, 6, 3],
    [1, 5, 7, 2, 0, 3, 6, 4],
    [1, 6, 2, 7, 5, 3, 0, 4],
    [1, 6, 3, 0, 4, 7, 5, 2],
    [2, 0, 6, 4, 7, 1, 3, 5],
    [2, 0, 7, 5, 1, 4, 6, 3],
    [2, 1, 7, 5, 3, 6, 0, 4],
    [2, 4, 6, 0, 7, 1, 3, 5],
    [2, 4, 7, 1, 6, 0, 3, 5],
    [2, 5, 7, 1, 4, 0, 6, 3],
    [3, 0, 4, 7, 1, 6, 2, 5],
    [3, 1, 4, 7, 5, 0, 2, 6],
    [3, 1, 6, 0, 4, 7, 5, 2],
    [3, 2, 6, 0, 5, 7, 1, 4],
    [3, 5, 0, 7, 2, 6, 1, 4],
    [3, 5, 7, 1, 6, 0, 2, 4],
    [4, 1, 5, 0, 2, 7, 3, 6],
    [4, 1, 7, 0, 3, 5, 2, 6],
    [4, 2, 0, 6, 1, 7, 5, 3],
    [4, 2, 7, 3, 0, 6, 1, 5],
    [4, 6, 0, 7, 1, 3, 5, 2],
    [4, 7, 0, 2, 5, 1, 3, 6],
    [5, 0, 4, 7, 1, 3, 6, 2],
    [5, 1, 7, 0, 2, 4, 6, 3],
    [5, 2, 0, 6, 3, 7, 1, 4],
    [5, 2, 7, 1, 4, 0, 6, 3],
    [5, 3, 0, 4, 7, 1, 6, 2],
    [5, 3, 6, 0, 7, 1, 4, 2],
    [5, 4, 0, 6, 3, 1, 7, 2],
    [6, 1, 4, 7, 0, 3, 5, 2],
    [6, 1, 5, 7, 4, 2, 0, 3],
    [6, 2, 7, 1, 4, 0, 3, 5],
    [6, 3, 0, 7, 5, 1, 4, 2],
    [6, 3, 5, 0, 7, 1, 4, 2],
    [6, 4, 0, 7, 1, 3, 5, 2],
    [6, 4, 7, 1, 3, 0, 2, 5],
    [6, 5, 1, 7, 0, 3, 4, 2],
    [7, 1, 3, 0, 6, 4, 2, 5],
    [7, 1, 4, 0, 2, 5, 3, 6],
    [7, 2, 0, 5, 1, 4, 6, 3],
    [7, 2, 4, 0, 6, 1, 3, 5],
    [7, 3, 0, 6, 1, 4, 2, 5],
    [7, 4, 1, 3, 0, 6, 2, 5],
    [7, 4, 2, 0, 5, 1, 3, 6]
];

// Agrega eventos a los botones y maneja la carga del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Configura los eventos para los campos de nombre de los jugadores
    document.getElementById('player1Name').addEventListener('input', updatePlayer1Name);
    document.getElementById('player2Name').addEventListener('input', updatePlayer2Name);

    // Agrega eventos a los botones
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('endButton').addEventListener('click', endTurn);
    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('runSolutionButton').addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * solutions.length); // Selecciona una solución aleatoria
        const solution = solutions[randomIndex]; // Obtiene la solución seleccionada
        console.log('Mostrando solución:', solution); // Agrega un log para verificar la solución
        showSolution(solution); // Muestra la solución en el tablero
    });

    // Configura eventos de clic en las celdas del tablero
    const cells = document.querySelectorAll('#board td');
    cells.forEach(cell => {
        const row = cell.parentElement.rowIndex;
        const col = cell.cellIndex;
        cell.addEventListener('click', () => toggleQueen(cell, row, col));
    });
});

// Actualiza el nombre del jugador 1 en la interfaz
function updatePlayer1Name() {
    const player1Name = document.getElementById('player1Name').value.trim() || 'Jugador 1';
    document.getElementById('player1QueensLabel').textContent = `Reinas Posicionadas de ${player1Name}:`;
}

// Actualiza el nombre del jugador 2 en la interfaz
function updatePlayer2Name() {
    const player2Name = document.getElementById('player2Name').value.trim() || 'Jugador 2';
    document.getElementById('player2QueensLabel').textContent = `Reinas Posicionadas de ${player2Name}:`;
}

// Maneja el cambio de estado de las reinas en el tablero
function toggleQueen(cell, row, col) {
    if (!gameStarted) {
        document.getElementById('status').textContent = 'Por favor, inicie el juego primero.';
        return;
    }

    if (cell.classList.contains('disabled')) {
        document.getElementById('status').textContent = 'No se puede colocar una reina aquí.';
        return;
    }
    // Solo se puede colocar una reina por turno
    const existingImage = cell.querySelector('img');
    if (existingImage) {
        cell.removeChild(existingImage); // Elimina la reina existente
        if (currentPlayer === 'player1') {
            player1QueensCount--;
        } else if
 (currentPlayer === 'player2') {
            player2QueensCount--;
        }
        updateDisabledCells(row, col, false); // Habilita las celdas afectadas
        queenPlacedThisTurn = false;
    } else {
        if (queenPlacedThisTurn) {
            document.getElementById('status').textContent = 'Solo se puede colocar una reina por turno.';
            return;
        }
        
        if (currentPlayer === 'player1') {
            if (player1QueensCount >= 4) {
                document.getElementById('status').textContent = 'El jugador 1 ya ha colocado 4 reinas. Termine el turno antes de colocar más.';
                return;
            }
            const img = document.createElement('img');
            img.src = 'img/Reina-Blanca.png'; // Ruta local a la imagen
            cell.appendChild(img); // Coloca la reina en la celda
            player1QueensCount++;
        } else if (currentPlayer === 'player2') {
            if (player2QueensCount >= 4) {
                document.getElementById('status').textContent = 'El jugador 2 ya ha colocado 4 reinas. Termine el turno antes de colocar más.';
                return;
            }
            const img = document.createElement('img');
            img.src = 'img/Reina-Negra.png'; // Ruta local a la imagen
            cell.appendChild(img); // Coloca la reina en la celda
            player2QueensCount++;
        }
        updateDisabledCells(row, col, true); // Deshabilita las celdas afectadas
        queenPlacedThisTurn = true;
        document.getElementById('endButton').disabled = false; // Habilita el botón Terminar Turno
    }
    updateCounters(); // Actualiza los contadores de reinas
}

// Actualiza el estado de las celdas del tablero (habilitadas o deshabilitadas)
function updateDisabledCells(row, col, disable) {
    const cells = document.querySelectorAll('#board td');
    cells.forEach(cell => {
        const cellRow = cell.parentElement.rowIndex;
        const cellCol = cell.cellIndex;
        if (disable) {
            if (cellRow === row || cellCol === col || Math.abs(cellRow - row) === Math.abs(cellCol - col)) {
                cell.classList.add('disabled'); // Deshabilita las celdas afectadas
                cell.onclick = null; // Elimina el evento de clic
            }
        } else {
            cell.classList.remove('disabled'); // Habilita las celdas
            cell.onclick = function() { toggleQueen(this, cellRow, cellCol); }; // Añade el evento de clic
        }
    });
}

// Inicia el juego y establece el primer jugador
function startGame() {
    gameStarted = true;
    document.getElementById('startButton').disabled = true; // Deshabilita el botón Iniciar Juego
    document.getElementById('endButton').disabled = false; // Habilita el botón Terminar Turno
    document.getElementById('resetButton').disabled = false; // Habilita el botón Reiniciar Partida
    currentPlayer = 'player1'; // Comienza con el jugador 1
    document.getElementById('status').textContent = 'Juego iniciado. ' + getCurrentPlayerName() + ' debe colocar una reina.';
}

// Termina el turno actual y cambia al siguiente jugador
function endTurn() {
    if (!gameStarted) {
        document.getElementById('status').textContent = 'El juego no ha comenzado.';
        return;
    }

    if (!queenPlacedThisTurn) {
        document.getElementById('status').textContent = 'Debe colocar una reina antes de terminar el turno.';
        return;
    }

    if (currentPlayer === 'player1') {
        if (player1QueensCount === 0) {
            document.getElementById('status').textContent = 'El jugador 1 aún no ha colocado una reina.';
            return;
        }
        currentPlayer = 'player2'; // Cambia al jugador 2
        document.getElementById('status').textContent = 'Turno terminado. Ahora ' + getCurrentPlayerName() + ' debe colocar una reina.';
    } else if (currentPlayer === 'player2') {
        if (player2QueensCount === 0) {
            document.getElementById('status').textContent = 'El jugador 2 aún no ha colocado una reina.';
            return;
        }
        currentPlayer = 'player1'; // Cambia al jugador 1
        document.getElementById('status').textContent = 'Turno terminado. Ahora ' + getCurrentPlayerName() + ' debe colocar una reina.';
    }

    queenPlacedThisTurn = false;
    document.getElementById('endButton').disabled = true; // Deshabilita el botón Terminar Turno

    // Verifica si el juego ha terminado
    if (player1QueensCount === 4 && player2QueensCount === 4) {
        document.getElementById('status').textContent = 'Juego terminado. Ambos jugadores han colocado 4 reinas.';
        document.getElementById('endButton').disabled = true; // Deshabilita el botón Terminar Turno
    }
}

// Actualiza los contadores de reinas en la interfaz
function updateCounters() {
    document.getElementById('player1Queens').textContent = player1QueensCount;
    document.getElementById('player2Queens').textContent = player2QueensCount;
}

// Reinicia el juego y establece los valores predeterminados
function resetGame() {
    gameStarted = false;
    currentPlayer = 'player1';
    player1QueensCount = 0;
    player2QueensCount = 0;
    queenPlacedThisTurn = false;
    
    document.getElementById('startButton').disabled = false; // Habilita el botón Iniciar Juego
    document.getElementById('endButton').disabled = true; // Deshabilita el botón Terminar Turno
    document.getElementById('resetButton').disabled = true; // Deshabilita el botón Reiniciar Partida

    const cells = document.querySelectorAll('#board td');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Limpia las celdas
        cell.classList.remove('disabled'); // Habilita todas las celdas
        cell.onclick = function() { toggleQueen(this, cell.parentElement.rowIndex, cell.cellIndex); }; // Restaura el evento de clic
    });

    document.getElementById('status').textContent = 'Juego reiniciado. Presione Iniciar Juego para comenzar.';
    updateCounters(); // Actualiza los contadores de reinas
}

// Obtiene el nombre del jugador actual para mostrar en el estado
function getCurrentPlayerName() {
    return currentPlayer === 'player1' ? (document.getElementById('player1Name').value.trim() || 'Jugador 1') : (document.getElementById('player2Name').value.trim() || 'Jugador 2');
}

// Muestra una solución en el tablero y la oculta después de un tiempo
function showSolution(solution) {
    const cells = document.querySelectorAll('#board td');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Limpia el contenido de las celdas
        cell.classList.remove('disabled'); // Asegúrate de que todas las celdas estén habilitadas
    });

    // Coloca las reinas en el tablero según la solución
    solution.forEach((col, row) => {
        const cell = document.querySelector(`#board tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
        if (cell) { // Verifica que la celda exista
            const img = document.createElement('img');
            img.src = row % 2 === 0 ? 'img/Reina-Blanca.png' : 'img/Reina-Negra.png';
            img.classList.add('queen'); // Añade la clase CSS
            cell.appendChild(img); // Coloca la reina en la celda
        } else {
            console.error(`No se encontró la celda para fila ${row + 1}, columna ${col + 1}`);
        }
    });

    // Establece un temporizador para ocultar la solución después de un tiempo
    setTimeout(() => {
        cells.forEach(cell => {
            cell.innerHTML = ''; // Limpia el contenido de las celdas después de mostrar la solución
        });
    }, 1000); // Tiempo en milisegundos (1000 ms = 1 segundo)
}

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('queen-counter');
    let isDragging = false;
    let offsetX, offsetY;

    counter.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - counter.getBoundingClientRect().left;
        offsetY = e.clientY - counter.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            counter.style.left = `${e.clientX - offsetX}px`;
            counter.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});


// 01000101 01101101 01101101 01100001 01101110 01110101 01100101 01101100 00100000 01010000 01100101 01110010 01100101 01111010 00100000 01010101 01101110 01101001 01101011 01101001 01101110 01101111  
