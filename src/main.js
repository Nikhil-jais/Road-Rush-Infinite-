import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   ROAD RUSH: INFINITE
   STAGE 5
   Traffic + Steering + Pedestrians + VFX + Audio
========================================================= */


/* =========================================================
   BASIC SETUP
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050914);

scene.fog = new THREE.FogExp2(
    0x050914,
    0.006
);


const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
);

camera.position.set(
    0,
    5,
    10
);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.7)
);

renderer.shadowMap.enabled = true;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

document
    .getElementById("game")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const hemisphere = new THREE.HemisphereLight(
    0x6c8cff,
    0x090b12,
    1.5
);

scene.add(hemisphere);


const moon = new THREE.DirectionalLight(
    0xb8c9ff,
    2
);

moon.position.set(
    -50,
    100,
    50
);

moon.castShadow = true;

scene.add(moon);


/* =========================================================
   GAME STATE
========================================================= */

const STATE = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER"
};

let gameState = STATE.MENU;

let speed = 0;

let maxSpeed = 82;

let score = 0;

let coins = 0;

let nitro = 100;

let steering = 0;

let accelerate = false;

let brake = false;

let nitroPressed = false;

let audioStarted = false;


/* =========================================================
   ROAD
========================================================= */

const ROAD_WIDTH = 15;

const ROAD_LENGTH = 2400;

const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x151820,
    roughness: .92
});

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(
        ROAD_WIDTH,
        ROAD_LENGTH
    ),
    roadMaterial
);

road.rotation.x = -Math.PI / 2;

road.position.z = -1100;

road.receiveShadow = true;

scene.add(road);


/* =========================================================
   CITY GROUND
========================================================= */

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x101b17,
        roughness: 1
    });

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        160,
        ROAD_LENGTH
    ),
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.position.y = -.08;

ground.position.z = -1100;

scene.add(ground);


/* =========================================================
   SIDEWALKS
========================================================= */

const sidewalkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3b3e45
    });


for (const x of [-8.6, 8.6]) {

    const sidewalk = new THREE.Mesh(
        new THREE.BoxGeometry(
            2.2,
            .18,
            ROAD_LENGTH
        ),
        sidewalkMaterial
    );

    sidewalk.position.set(
        x,
        .08,
        -1100
    );

    scene.add(sidewalk);
}


/* =========================================================
   LANE MARKERS
========================================================= */

const laneMarkers = [];

const markerMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });


for (
    let z = 40;
    z > -2300;
    z -= 11
) {

    for (const x of [-2.5, 2.5]) {

        const marker = new THREE.Mesh(
            new THREE.BoxGeometry(
                .18,
                .03,
                5
            ),
            markerMaterial
        );

        marker.position.set(
            x,
            .03,
            z
        );

        scene.add(marker);

        laneMarkers.push(marker);
    }
}


/* =========================================================
   STREET LIGHTS
========================================================= */

const worldObjects = [];

function createStreetLight(x, z) {

    const group = new THREE.Group();

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(
            .07,
            .1,
            7
        ),
        new THREE.MeshStandardMaterial({
            color: 0x292d36
        })
    );

    pole.position.y = 3.5;

    group.add(pole);


    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.4,
            .08,
            .08
        ),
        new THREE.MeshStandardMaterial({
            color: 0x292d36
        })
    );

    arm.position.set(
        x < 0 ? .65 : -.65,
        6.8,
        0
    );

    group.add(arm);


    const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(
            .13,
            8,
            8
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffe8a0
        })
    );

    lamp.position.set(
        x < 0 ? 1.25 : -1.25,
        6.7,
        0
    );

    group.add(lamp);


    const light = new THREE.PointLight(
        0xffdd99,
        4,
        22
    );

    light.position.copy(
        lamp.position
    );

    group.add(light);


    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);

    worldObjects.push(group);
}


for (
    let z = 20;
    z > -2200;
    z -= 35
) {

    createStreetLight(-9.4, z);

    createStreetLight(9.4, z - 17);
}


/* =========================================================
   BUILDINGS
========================================================= */

const buildingColors = [
    0x182238,
    0x202838,
    0x26253a,
    0x182b34,
    0x2b2638
];


function createBuilding(x, z) {

    const width =
        THREE.MathUtils.randFloat(
            5,
            10
        );

    const depth =
        THREE.MathUtils.randFloat(
            8,
            16
        );

    const height =
        THREE.MathUtils.randFloat(
            9,
            32
        );

    const material =
        new THREE.MeshStandardMaterial({
            color:
                buildingColors[
                    Math.floor(
                        Math.random() *
                        buildingColors.length
                    )
                ],
            roughness: .9
        });

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        material
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);

    worldObjects.push(building);


    /* WINDOWS */

    for (
        let row = 0;
        row < Math.floor(height / 2);
        row++
    ) {

        for (
            let col = 0;
            col < 3;
            col++
        ) {

            const windowMesh =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .45,
                        .3,
                        .04
                    ),
                    new THREE.MeshBasicMaterial({
                        color:
                            Math.random() > .35
                                ? 0xffd66b
                                : 0x23334c
                    })
                );

            windowMesh.position.set(
                x - width * .25 +
                col * width * .25,
                1.5 + row * 2,
                z - depth / 2 - .03
            );

            scene.add(windowMesh);

            worldObjects.push(windowMesh);
        }
    }
}


for (
    let z = 10;
    z > -2200;
    z -= 32
) {

    createBuilding(
        -15 - Math.random() * 5,
        z
    );

    createBuilding(
        15 + Math.random() * 5,
        z - 16
    );
}


/* =========================================================
   PLAYER CAR
========================================================= */

const player = new THREE.Group();

scene.add(player);

player.position.set(
    0,
    .5,
    4
);


const carBodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xd71930,
        metalness: .55,
        roughness: .28
    });


const carDarkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x11151d,
        metalness: .7,
        roughness: .2
    });


/* body */

const body = new THREE.Mesh(
    new THREE.BoxGeometry(
        2.5,
        .55,
        4.5
    ),
    carBodyMaterial
);

body.position.y = .65;

body.castShadow = true;

player.add(body);


/* hood */

const hood = new THREE.Mesh(
    new THREE.BoxGeometry(
        2.1,
        .18,
        1.4
    ),
    carBodyMaterial
);

hood.position.set(
    0,
    .98,
    -1.15
);

player.add(hood);


/* cabin */

const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(
        1.75,
        .65,
        1.7
    ),
    carDarkMaterial
);

cabin.position.set(
    0,
    1.18,
    .55
);

player.add(cabin);


/* wheels */

const wheels = [];

for (const x of [-1.2, 1.2]) {

    for (const z of [-1.45, 1.45]) {

        const wheel =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    .42,
                    .42,
                    .28,
                    16
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x090909
                })
            );

        wheel.rotation.z =
            Math.PI / 2;

        wheel.position.set(
            x,
            .45,
            z
        );

        wheel.castShadow = true;

        player.add(wheel);

        wheels.push(wheel);
    }
}


/* headlights */

const headlights = [];

for (const x of [-.75, .75]) {

    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .13,
                8,
                8
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    lamp.position.set(
        x,
        .78,
        -2.2
    );

    player.add(lamp);


    const beam =
        new THREE.SpotLight(
            0xffffff,
            8,
            55,
            .45,
            .5
        );

    beam.position.set(
        x,
        .9,
        -2
    );

    beam.target.position.set(
        x,
        0,
        -30
    );

    player.add(beam);

    player.add(beam.target);

    headlights.push(beam);
}


/* =========================================================
   TRAFFIC CARS
========================================================= */

const traffic = [];

const trafficColors = [
    0x2468ff,
    0xffc928,
    0xffffff,
    0x25b87b,
    0xa44cff,
    0xff6b25,
    0xb7bcc7
];


function createTrafficCar() {

    const car = new THREE.Group();

    const color =
        trafficColors[
            Math.floor(
                Math.random() *
                trafficColors.length
            )
        ];


    const material =
        new THREE.MeshStandardMaterial({
            color,
            metalness: .35,
            roughness: .35
        });


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                .55,
                4.1
            ),
            material
        );

    body.position.y = .62;

    car.add(body);


    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.65,
                .55,
                1.7
            ),
            new THREE.MeshStandardMaterial({
                color: 0x11151c,
                metalness: .5
            })
        );

    roof.position.set(
        0,
        1.05,
        .35
    );

    car.add(roof);


    for (const x of [-1.1, 1.1]) {

        for (const z of [-1.3, 1.3]) {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        .4,
                        .4,
                        .25,
                        12
                    ),
                    new THREE.MeshStandardMaterial({
                        color: 0x080808
                    })
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                x,
                .42,
                z
            );

            car.add(wheel);
        }
    }


    const lane =
        [-5, -2.5, 0, 2.5, 5][
            Math.floor(
                Math.random() * 5
            )
        ];


    car.position.set(
        lane,
        .45,
        -Math.random() * 500 - 80
    );


    car.userData.speed =
        THREE.MathUtils.randFloat(
            .35,
            .7
        );


    scene.add(car);

    traffic.push(car);
}


for (let i = 0; i < 13; i++) {
    createTrafficCar();
}


/* =========================================================
   PEDESTRIANS
========================================================= */

const pedestrians = [];


function createPerson(x, z) {

    const person = new THREE.Group();


    const shirtColors = [
        0xff453a,
        0x3478ff,
        0xffc928,
        0x24b878,
        0xa15cff,
        0xffffff
    ];


    const shirt =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .35,
                .65,
                .25
            ),
            new THREE.MeshStandardMaterial({
                color:
                    shirtColors[
                        Math.floor(
                            Math.random() *
                            shirtColors.length
                        )
                    ]
            })
        );

    shirt.position.y = .75;

    person.add(shirt);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .19,
                8,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd6a078
            })
        );

    head.position.y = 1.25;

    person.add(head);


    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x202431
        });


    for (const xOffset of [-.09, .09]) {

        const leg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    .1,
                    .55,
                    .12
                ),
                legMaterial
            );

        leg.position.set(
            xOffset,
            .28,
            0
        );

        person.add(leg);
    }


    person.position.set(
        x,
        0,
        z
    );

    person.userData.walkOffset =
        Math.random() * Math.PI * 2;

    person.userData.walkSpeed =
        THREE.MathUtils.randFloat(
            1.5,
            2.5
        );


    scene.add(person);

    pedestrians.push(person);
}


for (
    let z = 0;
    z > -1800;
    z -= 24
) {

    createPerson(
        -8.1,
        z
    );

    createPerson(
        8.1,
        z - 10
    );
}


/* =========================================================
   SPEED PARTICLES
========================================================= */

const particleGeometry =
    new THREE.BufferGeometry();

const particleCount = 180;

const positions =
    new Float32Array(
        particleCount * 3
    );


for (let i = 0; i < particleCount; i++) {

    positions[i * 3] =
        THREE.MathUtils.randFloatSpread(18);

    positions[i * 3 + 1] =
        THREE.MathUtils.randFloat(
            .2,
            6
        );

    positions[i * 3 + 2] =
        THREE.MathUtils.randFloat(
            -100,
            10
        );
}


particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x9dbaff,
        size: .08,
        transparent: true,
        opacity: .5
    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =========================================================
   NITRO FLAME
========================================================= */

const nitroFlame =
    new THREE.Mesh(
        new THREE.ConeGeometry(
            .3,
            1.6,
            12
        ),
        new THREE.MeshBasicMaterial({
            color: 0x47aaff,
            transparent: true,
            opacity: .9
        })
    );

nitroFlame.rotation.x =
    Math.PI / 2;

nitroFlame.position.set(
    0,
    .55,
    2.4
);

nitroFlame.visible = false;

player.add(nitroFlame);


/* =========================================================
   INPUT
========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    event => {

        keys[event.key.toLowerCase()] =
            true;

        if (
            event.key === "Escape" &&
            gameState === STATE.PLAYING
        ) {
            pauseGame();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key.toLowerCase()] =
            false;
    }
);


/* =========================================================
   MOBILE BUTTON HELPER
========================================================= */

function holdButton(
    element,
    onStart,
    onEnd
) {

    element.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            onStart();
        }
    );


    element.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            onEnd();
        }
    );


    element.addEventListener(
        "pointerleave",
        onEnd
    );

    element.addEventListener(
        "pointercancel",
        onEnd
    );
}


holdButton(
    document.getElementById(
        "left-control"
    ),
    () => steering = -1,
    () => {
        if (steering < 0) steering = 0;
    }
);


holdButton(
    document.getElementById(
        "right-control"
    ),
    () => steering = 1,
    () => {
        if (steering > 0) steering = 0;
    }
);


holdButton(
    document.getElementById(
        "brake-control"
    ),
    () => brake = true,
    () => brake = false
);


holdButton(
    document.getElementById(
        "nitro-control"
    ),
    () => nitroPressed = true,
    () => nitroPressed = false
);


/* =========================================================
   AUDIO
========================================================= */

let audioContext;

let engineOscillator;

let engineGain;

let musicOscillator;

let musicGain;


function startAudio() {

    if (audioStarted) return;

    audioStarted = true;

    audioContext =
        new AudioContext();


    /* engine */

    engineOscillator =
        audioContext.createOscillator();

    engineGain =
        audioContext.createGain();

    engineOscillator.type =
        "sawtooth";

    engineOscillator.frequency.value =
        65;

    engineGain.gain.value =
        .025;

    engineOscillator.connect(
        engineGain
    );

    engineGain.connect(
        audioContext.destination
    );

    engineOscillator.start();


    /* background tone */

    musicOscillator =
        audioContext.createOscillator();

    musicGain =
        audioContext.createGain();

    musicOscillator.type =
        "sine";

    musicOscillator.frequency.value =
        110;

    musicGain.gain.value =
        .008;

    musicOscillator.connect(
        musicGain
    );

    musicGain.connect(
        audioContext.destination
    );

    musicOscillator.start();
}


function updateAudio() {

    if (!audioStarted) return;

    const speedRatio =
        speed / maxSpeed;

    engineOscillator.frequency.setTargetAtTime(
        55 + speedRatio * 150,
        audioContext.currentTime,
        .04
    );

    engineGain.gain.setTargetAtTime(
        .018 + speedRatio * .045,
        audioContext.currentTime,
        .06
    );
}


/* =========================================================
   COLLISION
========================================================= */

function checkCollision() {

    for (const car of traffic) {

        const dx =
            Math.abs(
                player.position.x -
                car.position.x
            );

        const dz =
            Math.abs(
                player.position.z -
                car.position.z
            );


        if (
            dx < 2.05 &&
            dz < 3
        ) {

            gameOver();

            return true;
        }
    }

    return false;
}


/* =========================================================
   RESET TRAFFIC
========================================================= */

function resetTraffic() {

    for (const car of traffic) {

        car.position.x =
            [-5, -2.5, 0, 2.5, 5][
                Math.floor(
                    Math.random() * 5
                )
            ];

        car.position.z =
            -Math.random() * 1000 - 100;

        car.userData.speed =
            THREE.MathUtils.randFloat(
                .35,
                .7
            );
    }
}


/* =========================================================
   GAME START
========================================================= */

function startGame() {

    gameState =
        STATE.PLAYING;

    score = 0;

    coins = 0;

    speed = 0;

    nitro = 100;

    steering = 0;

    player.position.x = 0;

    player.rotation.set(
        0,
        0,
        0
    );

    resetTraffic();

    document
        .getElementById("main-menu")
        .classList.add("hidden");

    document
        .getElementById("pause-screen")
        .classList.add("hidden");

    document
        .getElementById("game-over")
        .classList.add("hidden");

    startAudio();

    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {
        audioContext.resume();
    }
}


/* =========================================================
   PAUSE
========================================================= */

function pauseGame() {

    if (
        gameState !== STATE.PLAYING
    ) {
        return;
    }

    gameState =
        STATE.PAUSED;

    document
        .getElementById("pause-screen")
        .classList.remove("hidden");
}


function resumeGame() {

    if (
        gameState !== STATE.PAUSED
    ) {
        return;
    }

    gameState =
        STATE.PLAYING;

    document
        .getElementById("pause-screen")
        .classList.add("hidden");
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    if (
        gameState === STATE.GAME_OVER
    ) {
        return;
    }

    gameState =
        STATE.GAME_OVER;

    speed = 0;

    document
        .getElementById("final-score")
        .textContent =
        Math.floor(score);

    document
        .getElementById("game-over")
        .classList.remove("hidden");
}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    document
        .getElementById("game-over")
        .classList.add("hidden");

    startGame();
}


/* =========================================================
   MENU
========================================================= */

function returnToMenu() {

    gameState =
        STATE.MENU;

    speed = 0;

    document
        .getElementById("pause-screen")
        .classList.add("hidden");

    document
        .getElementById("game-over")
        .classList.add("hidden");

    document
        .getElementById("main-menu")
        .classList.remove("hidden");
}


/* =========================================================
   THEME
========================================================= */

const themes = [
    {
        name: "NIGHT CITY",
        sky: 0x050914,
        fog: 0x050914,
        road: 0x151820,
        ground: 0x101b17
    },

    {
        name: "NEON CITY",
        sky: 0x130521,
        fog: 0x130521,
        road: 0x100d18,
        ground: 0x180d20
    },

    {
        name: "MIDNIGHT BLUE",
        sky: 0x031326,
        fog: 0x031326,
        road: 0x111827,
        ground: 0x071c1c
    }
];


let currentTheme = 0;


function applyTheme() {

    const theme =
        themes[currentTheme];

    scene.background =
        new THREE.Color(theme.sky);

    scene.fog.color =
        new THREE.Color(theme.fog);

    roadMaterial.color =
        new THREE.Color(theme.road);

    groundMaterial.color =
        new THREE.Color(theme.ground);

    document
        .getElementById("theme-btn")
        .textContent =
        `THEME: ${theme.name}`;
}


applyTheme();


document
    .getElementById("theme-btn")
    .addEventListener(
        "click",
        () => {

            currentTheme++;

            if (
                currentTheme >=
                themes.length
            ) {
                currentTheme = 0;
            }

            applyTheme();
        }
    );


/* =========================================================
   BUTTON EVENTS
========================================================= */

document
    .getElementById("start-btn")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("pause-btn")
    .addEventListener(
        "click",
        pauseGame
    );


document
    .getElementById("resume-btn")
    .addEventListener(
        "click",
        resumeGame
    );


document
    .getElementById("restart-btn")
    .addEventListener(
        "click",
        restartGame
    );


document
    .getElementById("quit-btn")
    .addEventListener(
        "click",
        gameOver
    );


document
    .getElementById("game-restart-btn")
    .addEventListener(
        "click",
        restartGame
    );


document
    .getElementById("menu-btn")
    .addEventListener(
        "click",
        returnToMenu
    );


/* =========================================================
   GAME UPDATE
========================================================= */

const clock =
    new THREE.Clock();


function updatePlayer(delta) {

    accelerate =
        keys["w"] ||
        keys["arrowup"];

    brake =
        keys["s"] ||
        keys["arrowdown"];


    let keyboardSteering = 0;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        keyboardSteering -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        keyboardSteering += 1;
    }


    const activeSteering =
        keyboardSteering !== 0
            ? keyboardSteering
            : steering;


    /* acceleration */

    if (accelerate) {

        speed +=
            30 * delta;
    }
    else {

        speed -=
            7 * delta;
    }


    /* braking */

    if (brake) {

        speed -=
            50 * delta;
    }


    /* nitro */

    const usingNitro =
        nitroPressed &&
        nitro > 0 &&
        speed > 20;


    if (usingNitro) {

        speed +=
            60 * delta;

        nitro -=
            25 * delta;

        nitroFlame.visible = true;

    }
    else {

        nitroFlame.visible = false;

        nitro +=
            5 * delta;
    }


    speed =
        THREE.MathUtils.clamp(
            speed,
            0,
            usingNitro
                ? 110
                : maxSpeed
        );


    nitro =
        THREE.MathUtils.clamp(
            nitro,
            0,
            100
        );


    /* steering */

    const steeringPower =
        8 +
        speed * .055;


    player.position.x +=
        activeSteering *
        steeringPower *
        delta;


    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -5.9,
            5.9
        );


    /* body lean */

    player.rotation.z =
        THREE.MathUtils.lerp(
            player.rotation.z,
            -activeSteering * .08,
            .12
        );


    /* wheel rotation */

    for (const wheel of wheels) {

        wheel.rotation.x +=
            speed *
            delta *
            .12;
    }


    /* score */

    score +=
        speed *
        delta *
        .55;


    updateAudio();
}


/* =========================================================
   UPDATE TRAFFIC
========================================================= */

function updateTraffic(delta) {

    const movement =
        speed * delta;


    for (const car of traffic) {

        car.position.z +=
            movement *
            car.userData.speed;


        if (
            car.position.z > 20
        ) {

            car.position.z =
                -Math.random() *
                700 -
                100;

            car.position.x =
                [-5, -2.5, 0, 2.5, 5][
                    Math.floor(
                        Math.random() * 5
                    )
                ];

            car.userData.speed =
                THREE.MathUtils.randFloat(
                    .35,
                    .7
                );

            coins++;
        }
    }
}


/* =========================================================
   WORLD MOVEMENT
========================================================= */

function updateWorld(delta) {

    const movement =
        speed *
        delta;


    for (const marker of laneMarkers) {

        marker.position.z +=
            movement;

        if (
            marker.position.z > 30
        ) {
            marker.position.z -=
                2300;
        }
    }


    for (const object of worldObjects) {

        object.position.z +=
            movement;

        if (
            object.position.z > 35
        ) {

            object.position.z -=
                2300;
        }
    }


    /* particles */

    const particlePositions =
        particleGeometry
            .attributes
            .position
            .array;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        particlePositions[
            i * 3 + 2
        ] += movement * 2;


        if (
            particlePositions[
                i * 3 + 2
            ] > 15
        ) {

            particlePositions[
                i * 3 + 2
            ] = -100;
        }
    }


    particleGeometry
        .attributes
        .position
        .needsUpdate = true;
}


/* =========================================================
   PEOPLE ANIMATION
========================================================= */

function updatePeople(time) {

    for (const person of pedestrians) {

        const swing =
            Math.sin(
                time *
                person.userData.walkSpeed +
                person.userData.walkOffset
            ) * .08;

        person.children[2]
            .rotation.x = swing;

        person.children[3]
            .rotation.x = -swing;
    }
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    camera.position.x =
        THREE.MathUtils.lerp(
            camera.position.x,
            player.position.x * .55,
            .08
        );


    camera.position.y =
        THREE.MathUtils.lerp(
            camera.position.y,
            4.5 +
            speed * .006,
            .05
        );


    camera.position.z =
        THREE.MathUtils.lerp(
            camera.position.z,
            9.5,
            .08
        );


    camera.lookAt(
        player.position.x * .35,
        .7,
        -18
    );
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document
        .getElementById("score")
        .textContent =
        Math.floor(score)
            .toLocaleString();


    document
        .getElementById("speed")
        .textContent =
        Math.floor(
            speed * 3.6
        );


    document
        .getElementById("coins")
        .textContent =
        coins;
}


/* =========================================================
   MAIN LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            .05
        );


    const time =
        performance.now() * .001;


    if (
        gameState === STATE.PLAYING
    ) {

        updatePlayer(delta);

        updateTraffic(delta);

        updateWorld(delta);

        updatePeople(time);

        updateCamera();

        checkCollision();

        updateHUD();
    }
    else {

        updateCamera();
    }


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================================
   LOADING
========================================================= */

let loadingProgress = 0;

const loadingInterval =
    setInterval(
        () => {

            loadingProgress +=
                Math.random() * 18;

            if (
                loadingProgress >= 100
            ) {

                loadingProgress = 100;

                clearInterval(
                    loadingInterval
                );

                document
                    .getElementById(
                        "loading-text"
                    )
                    .textContent =
                    "READY TO RACE";

                setTimeout(
                    () => {

                        document
                            .getElementById(
                                "loading-screen"
                            )
                            .classList
                            .add("hidden");

                        document
                            .getElementById(
                                "main-menu"
                            )
                            .classList
                            .remove("hidden");

                    },
                    500
                );
            }


            document
                .getElementById(
                    "loading-progress"
                )
                .style.width =
                `${loadingProgress}%`;

        },
        180
    );


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
