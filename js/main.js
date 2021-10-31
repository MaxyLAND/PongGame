//VIDEO: https://www.youtube.com/watch?v=nl0KXCa5pJk

//Dificultad del bot (después explico mejor)
var computerLevel = 0.03;
var angleRad = 0;

var paddleUser = new Image(50, 200);
paddleUser.src = "./img/paddleUser.png";
var paddleBot = new Image(50, 200);
paddleBot.src = "./img/paddleBot.png";
var paddleUserShadow = new Image(50, 200);
paddleUserShadow.src = "./img/paddleUserShadow.png";
var paddleBotShadow = new Image(50, 200);
paddleBotShadow.src = "./img/paddleBotShadow.png";
var background = new Image(500, 500);
background.src = "./img/background.png";
var gameShadow = new Image(1280, 720);
gameShadow.src = "./img/gameShadow.png";
var bg_01 = new Image(600, 150);
bg_01.src = "./img/bg_01.png";
var bg_02 = new Image(600, 150);
bg_02.src = "./img/bg_02.png";
var bg_03 = new Image(600, 150);
bg_03.src = "./img/bg_03.png";

var ballTrailInt = 0;
var ballTrails = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
var bTints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var bTx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var bTy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var bg1x = -465;
var bg2x = 0;
var bg3x = 465;

var bg_01_01x = -1700;
var bg_01_02x = -100;
var bg_01_03x = 1500;
var bg_02_01x = -1700;
var bg_02_02x = -100;
var bg_02_03x = 1500;
var bg_03_01x = -1700;
var bg_03_02x = -100;
var bg_03_03x = 1500;

var mouseBool = false;

/*                              IMAGEN:
base_image = new Image();
base_image.src = 'img/base.png';
base_image.onload = () => ctx.drawImage(base_image, 0, 0);
*/

//Coger elemento Canvas del HTML
const canvas = document.getElementById("pong"); //pasarlo a variable const
const ctx = canvas.getContext("2d"); //method returns a drawing context on the canvas

const canvasUserPU = document.getElementById("UserPowerUpBar");
const canvasBotPU = document.getElementById("BotPowerUpBar");

const ctxUser = canvasUserPU.getContext("2d");
const ctxBot = canvasBotPU.getContext("2d");

const canvasBG = document.getElementById("BG");
const ctxBG = canvasBG.getContext("2d");

const drawButt = document.getElementById("S_Button");
const drawScroll = document.getElementById("ScrollButton");
var pos = 0;

//Funciones de dibujo (Draw Functions)

//RECTÁNGULO O CUADRADO
function drawRect(x, y, w, h, color, ctx) { // Dibujar con: Eje X Eje Y (TopLeft corner), Weith, Height, color
    ctx.fillStyle = color; //Pintarlo de color
    ctx.fillRect(x, y, w, h) //Rellenar el rectángulo para que sea visible y no solo líneas
}

//CÍRCULO U ÓVALO                           (el eje (donde X e Y es 0) de la bola es el centro, y no la esquina superior izquierda)
function drawCircle(x, y, r, color, ctx) {
    ctx.fillStyle = color; //Pintarlo de color
    ctx.beginPath(); //Comenzar la creación del radio del círculo
    ctx.arc(x, y, r, 0, Math.PI * 2 /*360º*/ , false); //X, Y, radius, start angle, end angle, direction (false: left, true: right)
    ctx.closePath(); //Terminar la creación del radio del círculo
    ctx.fill(); //Rellenar el círculo para que sea visible y no solo líneas
}

//TEXTO
function drawText(text, x, y, color, ctx) {
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
    "width": 40,
    "height": 100,
    "color": "black",
    "score": 0,
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
}

//La pala del bot
const bot = {
    "x": canvas.width - 60,
    "y": (canvas.height / 2 - 100 / 2) + 80,
    "width": 40,
    "height": 100,
    "color": "black",
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
    "width": 6,
    "height": 25,
    "color": "gray"
}

//Funcion para dibujar la red
function drawRed(ctx) {
    for (let i = 0; i < canvas.height; i += red.height * 1.5) {
        drawRect(red.x, red.y + i, red.width, red.height, "#78E076", ctx);
    }
}

//La bola
const ball = {
    "x": canvas.width / 2,
    "y": canvas.height / 2,
    "radius": 15,
    "speed": 15,
    "velocityX": 10,
    "velocityY": 10,
    "color": "white",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
}

//PowerUp User bar
const UserPU = {
    "x": 0,
    "y": 0,
    "width": canvasUserPU.width,
    "height": canvasUserPU.height,
    "color": "black"
}

//PowerUp Bot bar
const BotPU = {
    "x": 0,
    "y": 0,
    "width": canvasBotPU.width,
    "height": canvasBotPU.height,
    "color": "black"
}


//Key detecter
document.onkeydown = checkKey;

//Detectar qué tecla estoy pulsando
function checkKey(e) {

    e = e || window.event;

    if (!moveEff) {
        if (e.keyCode == "32") { //Space
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

    if (e.keyCode == "38" || e.keyCode == "87") { // up arrow / w

    } else if (e.keyCode == "40" || e.keyCode == "83") { // down arrow

    } else if (e.keyCode == "37" || e.keyCode == "65") { // left arrow
        alert(bg_01_01x);
    } else if (e.keyCode == "39" || e.keyCode == "68") { // right arrow

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
    var i = (f / 240);
    UserPU.width = i * canvasUserPU.width;
    f++;
}


//Empuje efecto (BOT)
let i2 = 0;
let f2 = 0;
let func12 = null;
let func22 = null;
let moveEff2 = false;
let effBool2 = false;
let eff2Bool2 = false;
let oldPos2 = 0;

//Funcion para ejecutar el movimiento de tu jugador (BOT)               
function botMoveEff() {
    i2++

    if (i2 > 120) {
        clearInterval(func12);
    } else if (i2 > 8) {
        bot.x += ((canvas.width - 60) - bot.x) * 0.05;
    } else {
        bot.x += (oldPos2 - bot.x) * 0.5;
        if (!effBool2) {
            effBool2 = true;
            eff2Bool2 = true;
            ball.speed += 15;
            console.log("EFFECT APPLIED.");
        }
    }
}

//Funcion para esperar cierto tiempo para volver a usar una habilidad (BOT)
function waitForPowerUpBot() {
    if (f2 > 240) {
        moveEff2 = false;
        clearInterval(func22);
    }
    var i2 = (f2 / 240);
    BotPU.width = i2 * canvasBotPU.width;
    f2++;
}


//Render the game
function render() {
    //Fondo
    drawRect(0, 0, canvas.width, canvas.height, "#EDFF86", ctx);

    //BG lines
    ctx.drawImage(background, bg1x, 0, 500, 500);
    ctx.drawImage(background, bg2x, 0, 500, 500);
    ctx.drawImage(background, bg3x, 0, 500, 500);

    //Scores Shadow
    drawText(user.score, (canvas.width / 4) + 6, (canvas.height / 5) + 6, "rgba(0, 0, 0, 0.4)", ctx);
    drawText(bot.score, (3 * (canvas.width / 4)) + 6, (canvas.height / 5) + 6, "rgba(0, 0, 0, 0.4)", ctx);

    //Scores
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white", ctx);
    drawText(bot.score, 3 * (canvas.width / 4), canvas.height / 5, "white", ctx);

    //Red
    drawRed(ctx);

    //Bola Shadow
    drawCircle(ball.x + 8, ball.y + 8, ball.radius, "rgba(0, 0, 0, 0.25)", ctx);

    //Palas
    drawRect(user.x, user.y, user.width, user.height, "#00000000", ctx);
    drawRect(bot.x, bot.y, bot.width, bot.height, "#00000000", ctx);

    //Ball trail things
    for (let i = 0; i < ballTrails.length - 1; i++) {
        if (ballTrails[i] == true) {
            if (bTints[i] == 12) {
                bTx[i] = ball.x;
                bTy[i] = ball.y;
            }
            if (bTints[i] <= 11)
                drawCircle(bTx[i] + 8, bTy[i] + 8, ((bTints[i] / 12)) * ball.radius, "rgba(0, 0, 0, 0.25)", ctx); //Shadow
            bTints[i]--;
            if (bTints[i] <= 0) {
                ballTrails[i] = false;
                bTints[i] = 12;
                bTx[i] = 0;
                bTy[i] = 0;
            }
        }
    }


    //Bola
    drawCircle(ball.x, ball.y, ball.radius, "#62B9FF", ctx);

    //PowerUp Bars
    //User
    drawRect(0, 0, canvasUserPU.width, canvasUserPU.height, "#EDFF86", ctxUser);
    if (UserPU.width >= canvasUserPU.width) {
        drawRect(UserPU.x, UserPU.y, UserPU.width, UserPU.height, "#62B9FF", ctxUser);
        drawText("Space", (canvasUserPU.width / 6 * 1.15) + 6, 76, "rgba(0, 0, 0, 0.4)", ctxUser);
        drawText("Space", canvasUserPU.width / 6 * 1.15, 70, "white", ctxUser);
    } else {
        drawRect(UserPU.x, UserPU.y, UserPU.width, UserPU.height, "#b4deff", ctxUser);
    }
    ctxUser.drawImage(gameShadow, 0, 0, canvasUserPU.width, canvasUserPU.height);

    //Bot
    drawRect(0, 0, canvasBotPU.width, canvasBotPU.height, "#EDFF86", ctxBot);
    if (BotPU.width >= canvasBotPU.width) {
        drawRect(BotPU.x, BotPU.y, BotPU.width, BotPU.height, "#62B9FF", ctxBot);
        drawText("Space", (canvasBotPU.width / 6 * 1.15) + 6, 76, "rgba(0, 0, 0, 0.4)", ctxBot);
        drawText("Space", canvasBotPU.width / 6 * 1.15, 70, "white", ctxBot);
    } else {
        drawRect(BotPU.x, BotPU.y, BotPU.width, BotPU.height, "#b4deff", ctxBot);
    }
    ctxBot.drawImage(gameShadow, 0, 0, canvasBotPU.width, canvasBotPU.height);

    //IMAGENES

    //User/bot 3D shadows
    ctx.drawImage(paddleUserShadow, user.x + 8, user.y + 8, user.width, user.height);
    ctx.drawImage(paddleBotShadow, bot.x + 8, bot.y + 8, bot.width, bot.height);

    //User/bot paddle shadows
    //ctx.drawImage(fade, bot.x - 10, bot.y - 20, bot.width + 20, bot.height + 40);
    //ctx.drawImage(fade, user.x - 10, user.y - 20, user.width + 20, user.height + 40);

    //User/Bot paddles
    ctx.drawImage(paddleUser, user.x, user.y, user.width, user.height);
    ctx.drawImage(paddleBot, bot.x, bot.y, bot.width, bot.height);


    //Ball trail object
    for (let i = 0; i < ballTrails.length - 1; i++) {
        if (ballTrails[i] == true) {
            drawCircle(bTx[i], bTy[i], ((bTints[i] / 12)) * ball.radius, "#62B9FF", ctx); //Circle
        }
    }

    ctx.drawImage(gameShadow, 0, 0, canvas.width, canvas.height);


    //BG and FG things
    drawRect(0, 0, canvasBG.width, canvasBG.height, "#3ABEFC", ctxBG);

    //Bottom clouds
    ctxBG.drawImage(bg_03, bg_03_01x, canvasBG.height - (canvasBG.height / 1.25), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_03, bg_03_02x, canvasBG.height - (canvasBG.height / 1.25), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_03, bg_03_03x, canvasBG.height - (canvasBG.height / 1.25), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    drawRect(0, canvasBG.height - (canvasBG.height / 2), canvasBG.width, canvasBG.height / 2.5, "#99e3fe", ctxBG);

    //Middle clouds
    ctxBG.drawImage(bg_02, bg_02_01x, canvasBG.height - (canvasBG.height / 1.7), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_02, bg_02_02x, canvasBG.height - (canvasBG.height / 1.7), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_02, bg_02_03x, canvasBG.height - (canvasBG.height / 1.7), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    drawRect(0, canvasBG.height - (canvasBG.height / 4), canvasBG.width, canvasBG.height / 2.5, "#caf2fe", ctxBG);

    //Top clouds
    ctxBG.drawImage(bg_01, bg_01_01x, canvasBG.height - (canvasBG.height / 2.5), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_01, bg_01_02x, canvasBG.height - (canvasBG.height / 2.5), canvasBG.width / 9 * 8, canvasBG.height / 2.5);
    ctxBG.drawImage(bg_01, bg_01_03x, canvasBG.height - (canvasBG.height / 2.5), canvasBG.width / 9 * 8, canvasBG.height / 2.5);

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

    //Bot PowerUp collision
    if (!moveEff2 && (ball.bottom > bot.top + 10 && ball.right > bot.left - 40 && ball.left < bot.right + 40 && ball.top < bot.bottom - 10)) {
        if (BotPU.width >= canvasBotPU.width) {
            moveEff2 = true;
            effBool2 = false;
            eff2Bool2 = false;
            i2 = 0;
            f2 = 0;
            oldPos2 = bot.x - 50;
            func12 = setInterval(botMoveEff, 1000 / fps);
            func22 = setInterval(waitForPowerUpBot, 1000 / fps);
        }
    }

    //saber si b impacta con el p
    if (b.bottom > p.top && b.right > p.left && b.left < p.right && b.top < p.bottom) {

        //Saber la distancia del eje Y entre el centro del player y el centro de la ball (y saber un valor entre -1 y 1)
        let collidePoint = (b.y - (p.y + p.height / 2)) / (p.height / 2);

        //Calcular el ángulo por el nuevo en el que el círculo debería moverse (si collidePoint es 0, se moverá a 0 grados, si es 1, se moverá a 45, etc)
        angleRad = (Math.PI / 4) * collidePoint; //Math.PI / 4 son 45 grados. * 2 son 360.



        //Calcular ángulos depende de dónde impacte con el player devolviendo valores VelocityX y VelocityY
        if (ball.x < canvas.width / 2) { //Comprobar si la ball está en la izquierda o en la derecha de la pantalla para invertir el movimiento en X.
            if (eff2Bool2 == true) {
                eff2Bool2 = false;
                ball.speed -= 15;
            }
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
function resetBall(b) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 15;
    ball.velocityX = ball.velocityX * -1;
    eff2Bool = false;
    eff2Bool2 = false;
    console.log(ball.speed);

    //Update VelocityX VelocityY
    if (b)
        ball.velocityX = ball.speed * Math.cos(angleRad);
    else
        ball.velocityX = -1 * (ball.speed * Math.cos(angleRad));
    ball.velocityY = ball.speed * Math.sin(angleRad);
}


//Función para mover el player hacia la posición exacta 
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.y - rect.top - user.height / 2;
    mouseBool = true;
    return rect;
}

//Update the game
function update() {

    ball.x += ball.velocityX; //Sumar o restar valor en la X de la bola
    ball.y += ball.velocityY; //Sumar o restar valor en la Y de la bola

    //Comprobar si la bola está muy arriba o muy abajo para que rebote con las paredes
    if (ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        ball.velocityY -= 0.6;
        ball.y = canvas.height - ball.radius - 2;
    } else if (ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        ball.velocityY += 0.6;
        ball.y = ball.radius + 2;
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
        if (computerLevel > 0.01)
            computerLevel -= 0.002;
        resetBall(true);
    }
    if (ball.x > canvas.width) {
        user.score++;
        if (computerLevel < 0.99)
            computerLevel += 0.01;
        resetBall(false);
    }

    //Comprobar la posición del ratón y ejecutar la función "movePaddle"
    /*if (canvas.onmouseover) {
        canvas.addEventListener("mousemove", movePaddle);
        drawButt.style.bottom = (((-user.y + 50) / 410) + 0.75) * 300 + "px";

    } else {
        console.log("gay lol");
    }*/

    //mouseBool = false;
    //canvas.addEventListener("mousemove", movePaddle);
    //drawButt.style.bottom = (((-user.y + 50) / 410) + 0.75) * 410 + "px";
    user.y = -drawButt.value + 350;

    //Mover el bot haciendo uso de la posición de la ball y la suya propia, multiplicado por un nivel dinámico del bot.
    bot.y += (ball.y - (bot.y + bot.height / 2)) * computerLevel;
    //user.y += (ball.y - (user.y + user.height / 2)) * computerLevel;

    //Background things
    bg1x++;
    bg2x++;
    bg3x++;

    if (bg1x >= 930)
        bg1x = -450;
    else if (bg2x >= 930)
        bg2x = -450;
    else if (bg3x >= 930)
        bg3x = -450;

    //Ball trail things
    ballTrailInt++;

    ballTrails[ballTrailInt - 1] = true;
    if (ballTrailInt > 15) {
        ballTrailInt = 0;
    }

    //BG and FG things
    bg_01_01x += 3;
    if (bg_01_01x >= 1930)
        bg_01_01x = -1700;
    bg_01_02x += 3;
    if (bg_01_02x >= 1930)
        bg_01_02x = -1700;
    bg_01_03x += 3;
    if (bg_01_03x >= 1930)
        bg_01_03x = -1700;
    bg_02_01x += 2;
    if (bg_02_01x >= 1930)
        bg_02_01x = -1700;
    bg_02_02x += 2;
    if (bg_02_02x >= 1930)
        bg_02_02x = -1700;
    bg_02_03x += 2;
    if (bg_02_03x >= 1930)
        bg_02_03x = -1700;
    bg_03_01x++;
    if (bg_03_01x >= 1930)
        bg_03_01x = -1700;
    bg_03_02x++;
    if (bg_03_02x >= 1930)
        bg_03_02x = -1700;
    bg_03_03x++;
    if (bg_03_03x >= 1930)
        bg_03_03x = -1700;
}

//Game function
function game() {
    update(); //Movements, collisions, score updates, etc.
    render(); //Render the game
}

//Ejecutar el juego (game es la función del juego. 1000 son 1seg (milisegundos), y si lo dividimos entre los fps que queremos, conseguimos los frames)
const fps = 60;
setInterval(game, 1000 / fps);