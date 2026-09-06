import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   ROAD RUSH: INFINITE
   CLEAN STABLE VERSION
========================================================= */


/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const game = $("game");

const loadingScreen = $("loading-screen");
const loadingText = $("loading-text");
const loadingProgress = $("loading-progress");

const mainMenu = $("main-menu");
const pauseScreen = $("pause-screen");
const gameOverScreen = $("game-over");

const scoreEl = $("score");
const speedEl = $("speed");
const coinsEl = $("coins");
const finalScoreEl = $("final-score");


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


/* =========================================================
   GAME VARIABLES
========================================================= */

let speed = 0;
let score = 0;
let coins = 0;
let nitro = 100;

const MAX_SPEED = 82;
const NITRO_MAX_SPEED = 115;

let steering = 0;
let nitroHeld = false;


/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x050914);

scene.fog =
    new THREE.FogExp2(
        0x050914,
        0.007
    );


const camera =
    new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
        window.innerHeight,
        0.1,
        3000
    );

camera.position.set(
    0,
    5,
    11
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio || 1,
        1.5
    )
);

renderer.shadowMap.enabled = true;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

game.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const ambient =
    new THREE.HemisphereLight(
        0x8aa4ff,
        0x111111,
        1.8
    );

scene.add(ambient);


const moon =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

moon.position.set(
    -40,
    80,
    30
);

moon.castShadow = true;

scene.add(moon);


/* =========================================================
   ROAD
========================================================= */

const ROAD_WIDTH = 15;
const WORLD_LENGTH = 2200;

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x151820,
        roughness: .9
    });


const road =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            ROAD_WIDTH,
            WORLD_LENGTH
        ),
        roadMaterial
    );

road.rotation.x =
    -Math.PI / 2;

road.position.z =
    -1050;

road.receiveShadow = true;

scene.add(road);


/* =========================================================
   GROUND
========================================================= */

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x101817,
        roughness: 1
    });


const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            150,
            WORLD_LENGTH
        ),
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.position.y =
    -.08;

ground.position.z =
    -1050;

scene.add(ground);


/* =========================================================
   SIDEWALKS
========================================================= */

for (const x of [-8.7, 8.7]) {

    const sidewalk =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                .18,
                WORLD_LENGTH
            ),
            new THREE.MeshStandardMaterial({
                color: 0x393c43
            })
        );

    sidewalk.position.set(
        x,
        .08,
        -1050
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
    let z = 30;
    z > -2200;
    z -= 12
) {

    for (
        const x of [-2.5, 2.5]
    ) {

        const marker =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    .18,
                    .035,
                    5
                ),
                markerMaterial
            );

        marker.position.set(
            x,
            .025,
            z
        );

        scene.add(marker);

        laneMarkers.push(marker);
    }
}


/* =========================================================
   BUILDINGS
========================================================= */

const movingObjects = [];

const buildingColors = [
    0x182238,
    0x202838,
    0x25243a,
    0x182b34,
    0x30253a
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
            30
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


    const building =
        new THREE.Mesh(
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

    movingObjects.push(building);


    /* WINDOWS */

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffd76a
        });


    const rows =
        Math.floor(
            height / 2
        );


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < 3;
            col++
        ) {

            if (
                Math.random() < .25
            ) {
                continue;
            }

            const window =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .5,
                        .3,
                        .04
                    ),
                    windowMaterial
                );

            window.position.set(
                x - width * .28 +
                col * width * .28,
                1.5 + row * 2,
                z - depth / 2 - .03
            );

            scene.add(window);

            movingObjects.push(
                window
            );
        }
    }
}


for (
    let z = 0;
    z > -2200;
    z -= 34
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
   STREET LIGHTS
========================================================= */

function createStreetLight(x, z) {

    const group =
        new THREE.Group();


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .07,
                .1,
                7,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x292d36
            })
        );

    pole.position.y = 3.5;

    group.add(pole);


    const arm =
        new THREE.Mesh(
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


    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .14,
                8,
                8
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffe6a0
            })
        );

    lamp.position.set(
        x < 0 ? 1.25 : -1.25,
        6.7,
        0
    );

    group.add(lamp);


    const light =
        new THREE.PointLight(
            0xffdd99,
            4,
            24
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

    movingObjects.push(group);
}


for (
    let z = 10;
    z > -2200;
    z -= 38
) {

    createStreetLight(
        -9.5,
        z
    );

    createStreetLight(
        9.5,
        z - 19
    );
}


/* =========================================================
   PLAYER CAR
========================================================= */

const player =
    new THREE.Group();

player.position.set(
    0,
    .5,
    4
);

scene.add(player);


const playerBodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe51d38,
        metalness: .55,
        roughness: .28
    });


const darkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x11151d,
        metalness: .65,
        roughness: .2
    });


/* BODY */

const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.5,
            .55,
            4.5
        ),
        playerBodyMaterial
    );

body.position.y = .65;

body.castShadow = true;

player.add(body);


/* HOOD */

const hood =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.1,
            .18,
            1.4
        ),
        playerBodyMaterial
    );

hood.position.set(
    0,
    .98,
    -1.15
);

player.add(hood);


/* CABIN */

const cabin =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.75,
            .65,
            1.7
        ),
        darkMaterial
    );

cabin.position.set(
    0,
    1.18,
    .55
);

player.add(cabin);


/* WHEELS */

const wheels = [];

for (
    const x of [-1.2, 1.2]
) {

    for (
        const z of [-1.45, 1.45]
    ) {

        const wheel =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    .42,
                    .42,
                    .28,
                    16
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x070707
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


/* HEADLIGHTS */

for (
    const x of [-.75, .75]
) {

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


    const light =
        new THREE.SpotLight(
            0xffffff,
            8,
            55,
            .45,
            .5
        );

    light.position.set(
        x,
        .9,
        -2
    );

    light.target.position.set(
        x,
        0,
        -30
    );

    player.add(light);

    player.add(
        light.target
    );
}


/* =========================================================
   TRAFFIC
========================================================= */

const traffic = [];

const trafficColors = [
    0x2468ff,
    0xffc928,
    0xffffff,
    0x25b87b,
    0xa44cff,
    0xff6b25
];


const lanes = [
    -5,
    -2.5,
    0,
    2.5,
    5
];


function createTrafficCar() {

    const car =
        new THREE.Group();


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
            darkMaterial
        );

    roof.position.set(
        0,
        1.05,
        .35
    );

    car.add(roof);


    for (
        const x of [-1.1, 1.1]
    ) {

        for (
            const z of [-1.3, 1.3]
        ) {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        .4,
                        .4,
                        .25,
                        12
                    ),
                    new THREE.MeshStandardMaterial({
                        color: 0x050505
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


    car.userData.relativeSpeed =
        THREE.MathUtils.randFloat(
            .35,
            .8
        );


    resetTrafficCar(
        car,
        true
    );


    scene.add(car);

    traffic.push(car);
}


function resetTrafficCar(
    car,
    initial = false
) {

    car.position.x =
        lanes[
            Math.floor(
                Math.random() *
                lanes.length
            )
        ];


    car.position.y = .45;


    car.position.z =
        initial
            ? -80 -
              Math.random() * 600
            : -250 -
              Math.random() * 650;
}


for (
    let i = 0;
    i < 16;
    i++
) {

    createTrafficCar();
}


/* =========================================================
   PEDESTRIANS
========================================================= */

const pedestrians = [];


function createPerson(x, z) {

    const person =
        new THREE.Group();


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
                color: 0xd49b78
            })
        );

    head.position.y = 1.25;

    person.add(head);


    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x202431
        });


    const leftLeg =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .1,
                .55,
                .12
            ),
            legMaterial
        );

    leftLeg.position.set(
        -.09,
        .28,
        0
    );


    const rightLeg =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .1,
                .55,
                .12
            ),
            legMaterial
        );

    rightLeg.position.set(
        .09,
        .28,
        0
    );


    person.add(leftLeg);
    person.add(rightLeg);


    person.position.set(
        x,
        0,
        z
    );


    person.userData.phase =
        Math.random() *
        Math.PI *
        2;


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
    z -= 25
) {

    createPerson(
        -8.15,
        z
    );

    createPerson(
        8.15,
        z - 12
    );
}


/* =========================================================
   SPEED PARTICLES
========================================================= */

const particleCount = 160;

const particlePositions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    particlePositions[
        i * 3
    ] =
        THREE.MathUtils.randFloatSpread(
            18
        );

    particlePositions[
        i * 3 + 1
    ] =
        THREE.MathUtils.randFloat(
            .2,
            5
        );

    particlePositions[
        i * 3 + 2
    ] =
        THREE.MathUtils.randFloat(
            -100,
            10
        );
}


const particleGeometry =
    new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        particlePositions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0xaec5ff,
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
   NITRO
========================================================= */

const nitroFlame =
    new THREE.Mesh(
        new THREE.ConeGeometry(
            .3,
            1.6,
            12
        ),
        new THREE.MeshBasicMaterial({
            color: 0x4aaaff,
            transparent: true,
            opacity: .9
        })
    );


nitroFlame.rotation.x =
    Math.PI / 2;

nitroFlame.position.set(
    0,
    .55,
    2.5
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

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            keys.space = true;
        }


        if (
            event.key === "Escape"
        ) {

            if (
                gameState ===
                STATE.PLAYING
            ) {

                pauseGame();

            }
            else if (
                gameState ===
                STATE.PAUSED
            ) {

                resumeGame();
            }
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;


        if (
            event.code === "Space"
        ) {

            keys.space = false;
        }
    }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

function holdButton(
    element,
    start,
    end
) {

    if (!element) return;


    element.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            element.setPointerCapture(
                event.pointerId
            );

            start();
        }
    );


    element.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            end();
        }
    );


    element.addEventListener(
        "pointercancel",
        end
    );


    element.addEventListener(
        "lostpointercapture",
        end
    );
}


holdButton(
    $("left-control"),
    () => steering = -1,
    () => {
        if (steering < 0)
            steering = 0;
    }
);


holdButton(
    $("right-control"),
    () => steering = 1,
    () => {
        if (steering > 0)
            steering = 0;
    }
);


holdButton(
    $("brake-control"),
    () => keys.s = true,
    () => keys.s = false
);


holdButton(
    $("nitro-control"),
    () => nitroHeld = true,
    () => nitroHeld = false
);


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

let engineOscillator = null;
let engineGain = null;

let musicOscillator = null;
let musicGain = null;


function startAudio() {

    if (
        audioContext
    ) {

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();
        }

        return;
    }


    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


    if (
        !AudioContextClass
    ) {
        return;
    }


    audioContext =
        new AudioContextClass();


    engineOscillator =
        audioContext.createOscillator();

    engineGain =
        audioContext.createGain();


    engineOscillator.type =
        "sawtooth";

    engineOscillator.frequency.value =
        55;

    engineGain.gain.value =
        .015;


    engineOscillator.connect(
        engineGain
    );

    engineGain.connect(
        audioContext.destination
    );

    engineOscillator.start();


    musicOscillator =
        audioContext.createOscillator();

    musicGain =
        audioContext.createGain();


    musicOscillator.type =
        "sine";

    musicOscillator.frequency.value =
        110;

    musicGain.gain.value =
        .006;


    musicOscillator.connect(
        musicGain
    );

    musicGain.connect(
        audioContext.destination
    );

    musicOscillator.start();
}


function updateAudio() {

    if (
        !audioContext ||
        !engineOscillator
    ) {
        return;
    }


    const ratio =
        speed /
        MAX_SPEED;


    const now =
        audioContext.currentTime;


    engineOscillator.frequency
        .setTargetAtTime(
            55 +
            ratio * 160,
            now,
            .04
        );


    engineGain.gain
        .setTargetAtTime(
            .015 +
            ratio * .04,
            now,
            .06
        );
}


/* =========================================================
   GAME START
========================================================= */

function startGame() {

    startAudio();


    gameState =
        STATE.PLAYING;


    speed = 0;
    score = 0;
    coins = 0;
    nitro = 100;
    steering = 0;
    nitroHeld = false;


    player.position.x = 0;

    player.position.y = .5;

    player.position.z = 4;

    player.rotation.set(
        0,
        0,
        0
    );


    resetAllTraffic();


    mainMenu.classList.add(
        "hidden"
    );

    pauseScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );


    updateHUD();
}


/* =========================================================
   RESET TRAFFIC
========================================================= */

function resetAllTraffic() {

    traffic.forEach(
        car => {

            resetTrafficCar(
                car,
                true
            );
        }
    );
}


/* =========================================================
   PAUSE
========================================================= */

function pauseGame() {

    if (
        gameState !==
        STATE.PLAYING
    ) {
        return;
    }


    gameState =
        STATE.PAUSED;


    pauseScreen.classList.remove(
        "hidden"
    );
}


function resumeGame() {

    if (
        gameState !==
        STATE.PAUSED
    ) {
        return;
    }


    gameState =
        STATE.PLAYING;


    pauseScreen.classList.add(
        "hidden"
    );
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    if (
        gameState ===
        STATE.GAME_OVER
    ) {
        return;
    }


    gameState =
        STATE.GAME_OVER;


    speed = 0;

    nitroFlame.visible =
        false;


    finalScoreEl.textContent =
        Math.floor(score)
            .toLocaleString();


    gameOverScreen.classList.remove(
        "hidden"
    );
}


/* =========================================================
   RETURN MENU
========================================================= */

function returnToMenu() {

    gameState =
        STATE.MENU;


    speed = 0;

    steering = 0;

    nitroHeld = false;


    pauseScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    mainMenu.classList.remove(
        "hidden"
    );
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer(delta) {

    const accelerating =
        keys.w ||
        keys.arrowup;


    const braking =
        keys.s ||
        keys.arrowdown;


    const usingNitro =
        (
            keys.space ||
            nitroHeld
        ) &&
        nitro > 0 &&
        speed > 10;


    /* ACCELERATION */

    if (
        accelerating
    ) {

        speed +=
            34 * delta;

    }
    else {

        speed -=
            8 * delta;
    }


    /* BRAKE */

    if (
        braking
    ) {

        speed -=
            55 * delta;
    }


    /* NITRO */

    if (
        usingNitro
    ) {

        speed +=
            65 * delta;

        nitro -=
            28 * delta;

        nitroFlame.visible =
            true;

    }
    else {

        nitro +=
            6 * delta;

        nitroFlame.visible =
            false;
    }


    const speedLimit =
        usingNitro
            ? NITRO_MAX_SPEED
            : MAX_SPEED;


    speed =
        THREE.MathUtils.clamp(
            speed,
            0,
            speedLimit
        );


    nitro =
        THREE.MathUtils.clamp(
            nitro,
            0,
            100
        );


    /* STEERING */

    let keyboardSteering = 0;


    if (
        keys.a ||
        keys.arrowleft
    ) {

        keyboardSteering -= 1;
    }


    if (
        keys.d ||
        keys.arrowright
    ) {

        keyboardSteering += 1;
    }


    const activeSteering =
        keyboardSteering !== 0
            ? keyboardSteering
            : steering;


    const steeringPower =
        7 +
        speed * .07;


    player.position.x +=
        activeSteering *
        steeringPower *
        delta;


    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -5.7,
            5.7
        );


    /* BODY LEAN */

    player.rotation.z =
        THREE.MathUtils.lerp(
            player.rotation.z,
            -activeSteering * .1,
            .12
        );


    /* WHEELS */

    for (
        const wheel of wheels
    ) {

        wheel.rotation.x +=
            speed *
            delta *
            .15;
    }


    /* SCORE */

    score +=
        speed *
        delta *
        .6;


    updateAudio();
}


/* =========================================================
   TRAFFIC UPDATE
========================================================= */

function updateTraffic(delta) {

    const worldMovement =
        speed *
        delta;


    for (
        const car of traffic
    ) {

        car.position.z +=
            worldMovement *
            car.userData.relativeSpeed;


        if (
            car.position.z >
            25
        ) {

            resetTrafficCar(
                car
            );

            coins++;
        }
    }
}


/* =========================================================
   WORLD UPDATE
========================================================= */

function updateWorld(delta) {

    const movement =
        speed *
        delta;


    /* ROAD MARKERS */

    for (
        const marker of laneMarkers
    ) {

        marker.position.z +=
            movement;


        if (
            marker.position.z >
            35
        ) {

            marker.position.z -=
                2250;
        }
    }


    /* BUILDINGS + LIGHTS */

    for (
        const object of movingObjects
    ) {

        object.position.z +=
            movement;


        if (
            object.position.z >
            40
        ) {

            object.position.z -=
                2250;
        }
    }


    /* PARTICLES */

    const positions =
        particleGeometry
            .attributes
            .position
            .array;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        positions[
            i * 3 + 2
        ] +=
            movement * 2.2;


        if (
            positions[
                i * 3 + 2
            ] > 15
        ) {

            positions[
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
   PEDESTRIAN ANIMATION
========================================================= */

function updatePeople(time) {

    for (
        const person of pedestrians
    ) {

        const swing =
            Math.sin(
                time *
                person.userData.walkSpeed +
                person.userData.phase
            ) * .35;


        person.children[2]
            .rotation.x =
            swing;


        person.children[3]
            .rotation.x =
            -swing;
    }
}


/* =========================================================
   COLLISION
========================================================= */

function checkCollision() {

    for (
        const car of traffic
    ) {

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
            dx < 2 &&
            dz < 3
        ) {

            gameOver();

            return;
        }
    }
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    camera.position.x =
        THREE.MathUtils.lerp(
            camera.position.x,
            player.position.x * .5,
            .08
        );


    camera.position.y =
        THREE.MathUtils.lerp(
            camera.position.y,
            4.7 +
            speed * .008,
            .06
        );


    camera.position.z =
        THREE.MathUtils.lerp(
            camera.position.z,
            10,
            .08
        );


    camera.lookAt(
        player.position.x * .25,
        .8,
        -20
    );
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    scoreEl.textContent =
        Math.floor(score)
            .toLocaleString();


    speedEl.textContent =
        Math.floor(
            speed * 3.6
        );


    coinsEl.textContent =
        coins;
}


/* =========================================================
   BUTTONS
========================================================= */

$("start-btn")
    .addEventListener(
        "click",
        startGame
    );


$("pause-btn")
    .addEventListener(
        "click",
        pauseGame
    );


$("resume-btn")
    .addEventListener(
        "click",
        resumeGame
    );


$("restart-btn")
    .addEventListener(
        "click",
        startGame
    );


$("game-restart-btn")
    .addEventListener(
        "click",
        startGame
    );


$("menu-btn")
    .addEventListener(
        "click",
        returnToMenu
    );


$("game-menu-btn")
    .addEventListener(
        "click",
        returnToMenu
    );


/* =========================================================
   THEMES
========================================================= */

const themes = [

    {
        name: "NIGHT CITY",
        sky: 0x050914,
        road: 0x151820,
        ground: 0x101817
    },

    {
        name: "NEON CITY",
        sky: 0x160522,
        road: 0x110d19,
        ground: 0x180d20
    },

    {
        name: "MIDNIGHT BLUE",
        sky: 0x031326,
        road: 0x111827,
        ground: 0x071c1c
    },

    {
        name: "DEEP PURPLE",
        sky: 0x10051c,
        road: 0x19121f,
        ground: 0x130c19
    }

];


let currentTheme = 0;


function applyTheme() {

    const theme =
        themes[currentTheme];


    scene.background =
        new THREE.Color(
            theme.sky
        );


    scene.fog.color =
        new THREE.Color(
            theme.sky
        );


    roadMaterial.color =
        new THREE.Color(
            theme.road
        );


    groundMaterial.color =
        new THREE.Color(
            theme.ground
        );


    $("theme-btn")
        .textContent =
        `THEME: ${theme.name}`;
}


$("theme-btn")
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


applyTheme();


/* =========================================================
   LOADING
========================================================= */

let loading =
    0;


const loadingTimer =
    setInterval(
        () => {

            loading +=
                Math.random() * 18 + 8;


            if (
                loading >= 100
            ) {

                loading = 100;

                clearInterval(
                    loadingTimer
                );


                loadingText.textContent =
                    "READY TO RACE";


                setTimeout(
                    () => {

                        loadingScreen
                            .classList
                            .add(
                                "hidden"
                            );


                        mainMenu
                            .classList
                            .remove(
                                "hidden"
                            );

                    },
                    400
                );
            }


            loadingProgress.style.width =
                `${loading}%`;

        },
        120
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


/* =========================================================
   MAIN GAME LOOP
========================================================= */

const clock =
    new THREE.Clock();


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
        performance.now() *
        .001;


    /*
       IMPORTANT:
       The game continuously renders.
       Gameplay updates only when PLAYING.
    */

    if (
        gameState ===
        STATE.PLAYING
    ) {

        updatePlayer(
            delta
        );

        updateTraffic(
            delta
        );

        updateWorld(
            delta
        );

        updatePeople(
            time
        );

        updateCamera();

        checkCollision();

        updateHUD();

    }
    else {

        /*
           Even menu/pause remains smoothly rendered.
        */

        updatePeople(
            time
        );

        updateCamera();
    }


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   START LOOP
========================================================= */

animate();

console.log(
    "ROAD RUSH: INFINITE loaded successfully."
);
