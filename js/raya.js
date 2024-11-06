const estadoTablero = Array(9).fill(null); // Estado del tablero
const casillas = document.querySelectorAll('.casilla');
let turnoActual = 'X'; // Jugador es 'X', la máquina es 'O'
const fichaJugador = document.getElementById('ficha-jugador');

// Configurar eventos de arrastre
fichaJugador.addEventListener('dragstart', iniciarArrastre);
casillas.forEach(casilla => {
    casilla.addEventListener('dragover', permitirArrastre);
    casilla.addEventListener('drop', manejarSoltar);
});

function iniciarArrastre(evento) {
    evento.dataTransfer.setData('text', 'X'); // Marca del jugador
}

function permitirArrastre(evento) {
    evento.preventDefault(); // Permitir que la casilla reciba el drop
}

function manejarSoltar(evento) {
    evento.preventDefault();
    const indiceCasilla = evento.target.getAttribute('data-indice');

    // Verificar si la casilla está vacía y es el turno del jugador
    if (!estadoTablero[indiceCasilla] && turnoActual === 'X') {
        estadoTablero[indiceCasilla] = 'X';
        evento.target.textContent = 'X';

        turnoActual = 'O';

        // Añadimos un pequeño retardo antes de verificar el resultado para mostrar el último movimiento
        setTimeout(() => {
            if (verificarGanador()) {
                alert('¡Hassssss ganaooooooo 🎉!');
                reiniciarJuego();
                return;
            } else if (esEmpate()) {
                alert('¡Empate, como puedes empartar ante la maquina 🤨!');
                reiniciarJuego();
                return;
            }

            setTimeout(turnoMaquina, 500); // Después de otro retardo, la máquina mueve
        }, 200);
    }
}

function turnoMaquina() {
    let casillasLibres = estadoTablero.map((valor, indice) => valor === null ? indice : null).filter(valor => valor !== null);

    if (casillasLibres.length > 0) {
        const indiceAleatorio = casillasLibres[Math.floor(Math.random() * casillasLibres.length)];
        estadoTablero[indiceAleatorio] = 'O';
        casillas[indiceAleatorio].textContent = 'O';

        turnoActual = 'X';

        // Añadimos un retardo antes de verificar el ganador tras el movimiento de la máquina
        setTimeout(() => {
            if (verificarGanador()) {
                alert('¡La máquina ganó 😥!');
                reiniciarJuego();
            } else if (esEmpate()) {
                alert('¡Empate, como puedes empartar ante la maquina 🤨!');
                reiniciarJuego();
            }
        }, 200);
    }
}

// Función para verificar si hay un ganador
function verificarGanador() {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return combinacionesGanadoras.some(combinacion => {
        const [a, b, c] = combinacion;
        return estadoTablero[a] && estadoTablero[a] === estadoTablero[b] && estadoTablero[a] === estadoTablero[c];
    });
}

// Función para verificar si hay un empate
function esEmpate() {
    return estadoTablero.every(casilla => casilla !== null);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    estadoTablero.fill(null);
    casillas.forEach(casilla => casilla.textContent = '');
    turnoActual = 'X';
}

document.getElementById('boton-reiniciar').addEventListener('click', reiniciarJuego);
