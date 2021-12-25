import mario from './assets/mario.png';
import poisonMushroom from './assets/poisonMushroom.png';
import level from './assets/level.jpg';
import theme from './assets/mario.mp3';
import { posix } from 'path';

const song = new Audio(theme);
song.loop = true;
song.volume = 0.2;

function stopSong() {
	song.pause();
}

const controls = document.createElement('div');
controls.className = 'controls';
const button = document.createElement('button');
button.onclick = stopSong;
button.textContent = 'Stop Song';
controls.appendChild(button);
document.body.appendChild(controls);

// Create Canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;
canvas.style = 'border: 1px solid black';

document.body.appendChild(canvas);

const image = new Image();
image.src = mario;

const poisonMushroomImage = new Image();
poisonMushroomImage.src = poisonMushroom;

const KEYS = {
	left: 37,
	up: 38,
	right: 39,
	down: 40
};

const STATES = {
	stand: 0,
	rightWalk: 1,
	leftWalk: 2,
	jumpLeft: 3,
	jumpRight: 4
};

let jumping = false;
let dirRight = true;

let state = STATES.stand;

const leftWalkSprite = [[0, 33, 22, 31], [22, 33, 22, 31], [44, 33, 22, 31], [66, 33, 22, 31], [90, 33, 19, 31], [110, 33, 17, 31], [127, 33, 19, 31]];
const leftWalkAnim = [5, 4, 3, 4, 5, 4, 6, 4];

const rightWalkSprite = [[148, 33, 19, 31], [167, 33, 18, 31], [185, 33, 18, 31], [208, 33, 18, 31], [230, 33, 18, 31]];
const rightWalkAnim = [0, 2, 1, 2, 3, 2, 1, 2];

const standLeftSprite = [[110, 33, 17, 31]];
const standLeftAnim = [0];

const jumpLeftSprite = [[127, 33, 19, 31]];
const jumpLeftAnim = [0];

const standRightSprite = [[167, 33, 18, 31]];
const standRightAnim = [0];

const jumpRightSprite = [[148, 33, 19, 31]];
const jumpRightAnim = [0];

let currSprite = standRightSprite;
let currAnim = standRightAnim;

function changeState(dir) {
	if (!jumping) {
		switch(dir) {
			case KEYS.left:
				// TODO: handle case
				dirRight = false;
				currSprite = leftWalkSprite;
				currAnim = leftWalkAnim;
				index = 0;
				break;
			case KEYS.up:
				// TODO: handle case
				index = 0;
				break;
			case KEYS.right:
				// TODO: handle case
				dirRight = true;
				currSprite = rightWalkSprite;
				currAnim = rightWalkAnim;
				index = 0;
				break;
			case KEYS.down:
				// TODO: handle case
				index = 0;
				break;
			case 'stop':
				if (dirRight) {
					currSprite = standRightSprite;
					currAnim = standRightAnim;
				} else {
					currSprite = standLeftSprite;
					currAnim = standLeftAnim;
				}

				index = 0;
				break;
		}
	} else {
		switch(dir) {
			case KEYS.right:
				currSprite = jumpRightSprite;
				currAnim = jumpRightAnim;
				index = 0;
				break;

			case KEYS.left:
				currSprite = jumpLeftSprite;
				currAnim = jumpLeftAnim;
				index = 0;
				break;
		}
	}
}

let pressing = 0;

const pos = {
	x: 0,
	y: 471
};

const speed = {
	x: 0,
	y: 0
};

let currDir = KEYS.right;

window.addEventListener('keydown', (evt) => {
	if (pressing != 0 && ![KEYS.up].includes(evt.keyCode)) return;

	switch(evt.keyCode) {
		case KEYS.left:
			pressing = evt.keyCode;
			changeState(evt.keyCode);
			
			speed.x = -5;

			currDir = KEYS.left;
			break;
		case KEYS.up:
			if (speed.y === 0) {
				speed.y = 10;
				jumping = true;
			}

			changeState(currDir);

			break;
		case KEYS.right:
			pressing = evt.keyCode;
			changeState(evt.keyCode);

			speed.x = 5;
			currDir = KEYS.right;
			break;
		case KEYS.down:
			// TODO: handle case
			break;
	}
});

window.addEventListener('keyup', (evt) => {
	if (pressing !== evt.keyCode) return;
	
	pressing = 0;
	speed.x = 0;
	
	if (Object.values(KEYS).includes(evt.keyCode)) {
		changeState('stop');
	}
});

const levelImg = new Image();
levelImg.src = level;

let mushroomPosition = 700;
let mushroomSpeed = 0;

let started = false;

let index = 0;
setInterval(() => {
	pos.x += speed.x;

	if (jumping) {
		pos.y -= speed.y;
		speed.y -= 1;

		if (pos.y >= 471) {
			pos.y = 471;
			speed.y = 0;
			jumping = false;
			changeState(currDir);
			if (speed.x === 0) changeState('stop');
		}
	}

	if (!started && pos.x >= 100) {
		started = true;
		song.play();
	}

	if (started) catchMario();

	if (pos.x > 780) pos.x = 760;
	else if (pos.x < 0) pos.x = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(levelImg, 0, 0, 340, 255, 0, 0, 800, 600);

	const place = currSprite[currAnim[index]];
	context.drawImage(image, place[0], place[1], place[2], place[3], pos.x, pos.y, place[2] * 2, place[3] * 2);

	mushroomPosition += mushroomSpeed;
	context.drawImage(poisonMushroomImage, mushroomPosition, 505, 25, 25);
}, 1000  / 30);

function calcMushroomSpeed() {
	if (pos.x - mushroomPosition > 5) mushroomSpeed = 2;
	else if (pos.x - mushroomPosition < 5) mushroomSpeed = -2;
	else mushroomSpeed = 0;

	calculating = false;
}

function catchSync() {
	for (let i = 0; i < 10e7; i ++) {}
	calcMushroomSpeed();
}

async function doNothing() {}

async function catchAsync() {
	for (let i = 0; i < 10e4; i ++) {
		await doNothing();
	}

	calcMushroomSpeed();
}

async function setImmediatePromise() {
	return new Promise((resolve) => {
		setImmediate(() => resolve());
	});
}

async function catchImmediatePromise() {
	for (let i = 0; i < 10e4; i ++) {
		await setImmediatePromise();
	}

	calcMushroomSpeed();
}

let calculating = false;
function catchMario() {
	if (calculating) return;

	calculating = true;
	calcMushroomSpeed();
	// catchSync();
	// catchAsync();
	// catchImmediatePromise();
}


setInterval(() => {
	index = (index + 1) % currAnim.length;
	if (song.currentTime > 45) song.currentTime = 0;
}, 1000 / 10);

const volume = document.getElementById('volume');

volume.onchange = () => {
	song.volume = volume.value / 100;
}
// document.body.appendChild(image);
