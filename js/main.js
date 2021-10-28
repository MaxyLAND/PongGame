//VIDEO: https://www.youtube.com/watch?v=nl0KXCa5pJk

//Dificultad del bot (después explico mejor)
var computerLevel = 0.03;
var angleRad = 0;


//Coger elemento Canvas del HTML
const canvas = document.getElementById("pong"); //pasarlo a variable const

const ctx = canvas.getContext("2d"); //method returns a drawing context on the canvas


//Funciones de dibujo (Draw Functions)

//RECTÁNGULO O CUADRADO
function drawRect(x, y, w, h, color) { // Dibujar con: Eje X Eje Y (TopLeft corner), Weith, Height, color
    ctx.fillStyle = color; //Pintarlo de color
    ctx.fillRect(x, y, w, h) //Rellenar el rectángulo para que sea visible y no solo líneas
}

//CÍRCULO U ÓVALO                           (el eje (donde X e Y es 0) de la bola es el centro, y no la esquina superior izquierda)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color; //Pintarlo de color
    ctx.beginPath(); //Comenzar la creación del radio del círculo
    ctx.arc(x, y, r, 0, Math.PI * 2 /*360º*/ , false); //X, Y, radius, start angle, end angle, direction (false: left, true: right)
    ctx.closePath(); //Terminar la creación del radio del círculo
    ctx.fill(); //Rellenar el círculo para que sea visible y no solo líneas
}

//TEXTO
function drawText(text, x, y, color) {
    ctx.fillStyle = color; //Pintarlo de color
    ctx.font = "75px fantasy"; //Asignarle una fuente
    ctx.fillText(text, x, y); //Crear el texto en los ejes X Y seleccionados
}

//Funciones de movimiento

//Mover cubos / rectángulos
/*let rectX = 0;

function render() {
    drawRect(0, 0, 600, 400, "black");
    drawRect(rectX, 100, 100, 100, "red");
    rectX += 1;
}*/

//setInterval(render, 5);


//Componentes del juego

//Tabla = El canvas cubierto de color negro

//La pala del jugador
const user = {
    "x": 20,
    "y": (canvas.height / 2 - 100 / 2) + 20,
    "width": 20,
    "height": 100,
    "color": "white",
    "score": 0,
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
}

//La pala del bot
const bot = {
    "x": canvas.width - 40,
    "y": (canvas.height / 2 - 100 / 2) + 80,
    "width": 20,
    "height": 100,
    "color": "white",
    "score": 0,
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
}

//la red central
const red = {
    "x": canvas.width / 2 - 2 / 2,
    "y": 0,
    "width": 3,
    "height": 10,
    "color": "gray"
}

//Funcion para dibujar la red
function drawRed() {
    for (let i = 0; i < canvas.height; i += 18) {
        drawRect(red.x, red.y + i, red.width, red.height, red.color);
    }
}

//La bola
const ball = {
    "x": canvas.width / 2,
    "y": canvas.height / 2,
    "radius": 10,
    "speed": 15,
    "velocityX": 10,
    "velocityY": 10,
    "color": "white",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
}

//Key detecter
document.onkeydown = checkKey;

//Detectar qué tecla estoy pulsando
function checkKey(e) {

    e = e || window.event;

    console.log(moveEff);
    if (!moveEff) {
        if (e.keyCode == "38" || e.keyCode == "87") { // up arrow / w

        } else if (e.keyCode == "40" || e.keyCode == "83") { // down arrow

        } else if (e.keyCode == "37" || e.keyCode == "65") { // left arrow

        } else if (e.keyCode == "39" || e.keyCode == "68") { // right arrow
            moveEff = true;
            effBool = false;
            eff2Bool = false;
            i = 0;
            f = 0;
            oldPos = user.x + 50;
            func1 = setInterval(playerMoveEff, 1000 / fps);
            func2 = setInterval(waitForPowerUp, 1000 / fps);
        }
    }
}

//Empuje efecto
let i = 0;
let f = 0;
let func1 = null;
let func2 = null;
let moveEff = false;
let effBool = false;
let eff2Bool = false;
let oldPos = 0;


//Funcion para ejecutar el movimiento de tu jugador
function playerMoveEff() {
    i++

    if (i > 120) {
        clearInterval(func1);
    } else if (i > 8) {
        user.x += (20 - user.x) * 0.05;
    } else {
        user.x += (oldPos - user.x) * 0.5;
        if (!effBool && i < 5 && (ball.bottom > user.top - 20 && ball.right > user.left - 50 && ball.left < user.right + 50 && ball.top < user.bottom + 20)) {
            effBool = true;
            eff2Bool = true;
            ball.speed += 15;
            console.log("EFFECT APPLIED.");
        }
    }
}

//Funcion para esperar cierto tiempo para volver a usar una habilidad
function waitForPowerUp() {
    if (f > 240) {
        moveEff = false;
        clearInterval(func2);
    }
    f++;
}


//Render the game
function render() {
    //Fondo negro
    drawRect(0, 0, canvas.width, canvas.height, "black");

    //Scores
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(bot.score, 3 * (canvas.width / 4), canvas.height / 5, "white");

    //Red
    drawRed();

    //Palas
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(bot.x, bot.y, bot.width, bot.height, bot.color);

    //Bola
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}



//Detectar colisiones
function collision(b, p) { //B: ball   P: player

    p.top = p.y; //calcular el top de p
    p.bottom = p.y + p.height; //calcular el bottom de p
    p.left = p.x; //calcular el left de p
    p.right = p.x + p.width; //calcular el right de p

    b.top = b.y - b.radius; //calcular el top de b
    b.bottom = b.y + b.radius; //calcular el bottom de b
    b.left = b.x - b.radius; //calcular el left de b
    b.right = b.x + b.radius; //calcular el right de b



    //saber si b impacta con el p
    if (b.bottom > p.top && b.right > p.left && b.left < p.right && b.top < p.bottom) {

        //Saber la distancia del eje Y entre el centro del player y el centro de la ball (y saber un valor entre -1 y 1)
        let collidePoint = (b.y - (p.y + p.height / 2)) / (p.height / 2);

        //Calcular el ángulo por el nuevo en el que el círculo debería moverse (si collidePoint es 0, se moverá a 0 grados, si es 1, se moverá a 45, etc)
        angleRad = (Math.PI / 4) * collidePoint; //Math.PI / 4 son 45 grados. * 2 son 360.

        //Calcular ángulos depende de dónde impacte con el player devolviendo valores VelocityX y VelocityY
        if (ball.x < canvas.width / 2) { //Comprobar si la ball está en la izquierda o en la derecha de la pantalla para invertir el movimiento en X.
            b.velocityX = b.speed * Math.cos(angleRad); //Convertir la velocidad X de la ball en la velocidad de la ball * el coseno del angleRad.
        } else {
            if (eff2Bool) {
                eff2Bool = false;
                ball.speed -= 15;
            }
            b.velocityX = -1 * (b.speed * Math.cos(angleRad)); //Convertir la velocidad X de la ball en la velocidad de la ball * el seno del angleRad.
        }
        b.velocityY = b.speed * Math.sin(angleRad); //Convertir la velocidad Y de la ball en la velocidad de la ball * el seno del angleRad.

        b.speed += 0.5; //Aumentar un poquito el valor de speed para que vaya aumentando la dificultad.            
    }
}

//Función para reiniciar los valores de la ball e invertir su movimiento en el eje X
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 15;
    ball.velocityX = -ball.velocityX;
    eff2Bool = false;
    console.log(ball.speed);

    //Update VelocityX VelocityY
    if (ball.x < canvas.width / 2)
        ball.velocityX = ball.speed * Math.cos(angleRad);
    else
        ball.velocityX = -1 * (ball.speed * Math.cos(angleRad));
    ball.velocityY = ball.speed * Math.sin(angleRad);
}


//Función para mover el player hacia la posición exacta 
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.y - rect.top - user.height / 2;
}

//Update the game
function update() {

    ball.x += ball.velocityX; //Sumar o restar valor en la X de la bola
    ball.y += ball.velocityY; //Sumar o restar valor en la Y de la bola

    //Comprobar si la bola está muy arriba o muy abajo para que rebote con las paredes
    if (ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        ball.velocityY -= 0.3;
    } else if (ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        ball.velocityY += 0.3;
    }

    //Comprobar si la bola está en la izquierda o en la derecha para llamar a la función collision de user o bot.
    if (ball.x < canvas.width / 2) {
        collision(ball, user);
    } else {
        collision(ball, bot);
    }

    //Comprobar si la ball ha salido de los bordes del mapa. Si lo ha hecho, sumar la puntuación al contrincante y reiniciar la posición de esta.
    if (ball.x < 0) {
        bot.score++;
        computerLevel -= 0.002;
        resetBall();
    }
    if (ball.x > canvas.width) {
        user.score++;
        computerLevel += 0.01;
        resetBall();
    }

    //Comprobar la posición del ratón y ejecutar la función "movePaddle"
    canvas.addEventListener("mousemove", movePaddle);

    //Mover el bot haciendo uso de la posición de la ball y la suya propia, multiplicado por un nivel dinámico del bot.
    bot.y += (ball.y - (bot.y + bot.height / 2)) * computerLevel;
}

//Game function
function game() {
    update(); //Movements, collisions, score updates, etc.
    render(); //Render the game
}

//Ejecutar el juego (game es la función del juego. 1000 son 1seg (milisegundos), y si lo dividimos entre los fps que queremos, conseguimos los frames)
const fps = 60;
setInterval(game, 1000 / fps);