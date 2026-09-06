import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
   ROAD RUSH: INFINITE
   STAGE 2 - BASIC DRIVING SYSTEM
========================================================= */

const game = document.getElementById("game");

const loadingScreen =
    document.getElementById("loading-screen");

const loadingProgress =
    document.getElementById("loading-progress");

const loadingText =
    document.getElementById("loading-text");

const scoreElement =
    document.getElementById("score");

const speedElement =
    document.getElementById("speed");

const coinsElement =
    document.getElementById("coins");


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87ceeb);


/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        62,
        window.innerWidth /
            window.innerHeight,
        0.1,
        2000
    );

camera.position.set(
    0,
    5.5,
    10
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

game.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const skyLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x445566,
        2.2
    );

scene.add(skyLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    30,
    50,
    20
);

sun.castShadow = true;

scene.add(sun);


/* =========================================================
   ROAD
========================================================= */

const roadWidth = 14;

const roadLength = 2000;


const roadGeometry =
    new THREE.PlaneGeometry(
        roadWidth,
        roadLength
    );


const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x292d33,
        roughness: 0.95
    });


const road =
    new THREE.Mesh(
        roadGeometry,
        roadMaterial
    );

road.rotation.x =
    -Math.PI / 2;

road.position.set(
    0,
    0,
    -900
);

road.receiveShadow = true;

scene.add(road);


/* =========================================================
   GRASS
========================================================= */

const grassGeometry =
    new THREE.PlaneGeometry(
        200,
        roadLength
    );


const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3f7d3a,
        roughness: 1
    });


const grass =
    new THREE.Mesh(
        grassGeometry,
        grassMaterial
    );

grass.rotation.x =
    -Math.PI / 2;

grass.position.set(
    0,
    -0.03,
    -900
);

grass.receiveShadow = true;

scene.add(grass);


/* =========================================================
   ROAD LANE MARKINGS
========================================================= */

const laneMarkers = [];

const markerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffffff
    });


function createLaneMarker(x) {

    const geometry =
        new THREE.BoxGeometry(
            0.12,
            0.025,
            4
        );

    const marker =
        new THREE.Mesh(
            geometry,
            markerMaterial
        );

    marker.position.set(
        x,
        0.025,
        0
    );

    scene.add(marker);

    laneMarkers.push(marker);
}


/* Three lanes */

createLaneMarker(-2.3);
createLaneMarker(2.3);


/* =========================================================
   ROAD EDGE LINES
========================================================= */

function createRoadEdge(x) {

    const geometry =
        new THREE.BoxGeometry(
            0.15,
            0.03,
            roadLength
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xf5f5f5
        });

    const edge =
        new THREE.Mesh(
            geometry,
            material
        );

    edge.position.set(
        x,
        0.03,
        -900
    );

    scene.add(edge);
}

createRoadEdge(-6.8);
createRoadEdge(6.8);


/* =========================================================
   PLAYER CAR
========================================================= */

const car =
    new THREE.Group();

scene.add(car);


/* Main body */

const bodyGeometry =
    new THREE.BoxGeometry(
        1.8,
        0.55,
        3.8
    );


const bodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe53935,
        metalness: 0.45,
        roughness: 0.3
    });


const body =
    new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

body.position.y =
    0.55;

body.castShadow = true;

car.add(body);


/* Cabin */

const cabinGeometry =
    new THREE.BoxGeometry(
        1.35,
        0.5,
        1.65
    );


const cabinMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x111820,
        metalness: 0.2,
        roughness: 0.15
    });


const cabin =
    new THREE.Mesh(
        cabinGeometry,
        cabinMaterial
    );

cabin.position.set(
    0,
    0.95,
    -0.15
);

cabin.castShadow = true;

car.add(cabin);


/* =========================================================
   WHEELS
========================================================= */

const wheels = [];


function createWheel(x, z) {

    const geometry =
        new THREE.CylinderGeometry(
            0.34,
            0.34,
            0.25,
            20
        );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8
        });


    const wheel =
        new THREE.Mesh(
            geometry,
            material
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        x,
        0.35,
        z
    );

    wheel.castShadow = true;

    car.add(wheel);

    wheels.push(wheel);
}


createWheel(-0.95, -1.2);
createWheel(0.95, -1.2);
createWheel(-0.95, 1.2);
createWheel(0.95, 1.2);


/* =========================================================
   PLAYER POSITION
========================================================= */

car.position.set(
    0,
    0,
    0
);


/* =========================================================
   INPUT
========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] =
            true;

    }
);


window.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] =
            false;

    }
);


/* =========================================================
   DRIVING PARAMETERS
========================================================= */

let speed = 0;

const maxSpeed = 75;

const reverseSpeed = 18;

const acceleration = 28;

const braking = 55;

const friction = 15;

const steeringSpeed = 7;

const maxRoadX = 5.6;


/* =========================================================
   GAME STATS
========================================================= */

let score = 0;

let coins = 0;


/* =========================================================
   CLOCK
========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(delta) {

    const accelerating =
        keys["w"] ||
        keys["arrowup"];

    const brakingInput =
        keys["s"] ||
        keys["arrowdown"];

    const left =
        keys["a"] ||
        keys["arrowleft"];

    const right =
        keys["d"] ||
        keys["arrowright"];


    /* -------------------------
       ACCELERATION
    ------------------------- */

    if (accelerating) {

        speed +=
            acceleration * delta;

    }
    else {

        speed -=
            friction * delta;

    }


    /* -------------------------
       BRAKING
    ------------------------- */

    if (brakingInput) {

        speed -=
            braking * delta;

    }


    /* -------------------------
       REVERSE
    ------------------------- */

    if (speed < -reverseSpeed) {

        speed =
            -reverseSpeed;

    }


    /* -------------------------
       MAX SPEED
    ------------------------- */

    if (speed > maxSpeed) {

        speed =
            maxSpeed;

    }


    /* -------------------------
       STOP
    ------------------------- */

    if (
        !accelerating &&
        !brakingInput &&
        Math.abs(speed) < 1
    ) {

        speed = 0;

    }


    /* -------------------------
       STEERING
    ------------------------- */

    let steering = 0;


    if (left) {

        steering -= 1;

    }

    if (right) {

        steering += 1;

    }


    /* Steering becomes stronger
       as the car moves faster */

    const steeringStrength =
        THREE.MathUtils.lerp(
            0.35,
            1,
            Math.min(
                Math.abs(speed) / maxSpeed,
                1
            )
        );


    car.position.x +=
        steering *
        steeringSpeed *
        steeringStrength *
        delta;


    /* -------------------------
       KEEP CAR ON ROAD
    ------------------------- */

    car.position.x =
        THREE.MathUtils.clamp(
            car.position.x,
            -maxRoadX,
            maxRoadX
        );


    /* -------------------------
       CAR BODY TILT
    ------------------------- */

    const targetTilt =
        -steering * 0.08;


    body.rotation.z =
        THREE.MathUtils.lerp(
            body.rotation.z,
            targetTilt,
            8 * delta
        );


    cabin.rotation.z =
        body.rotation.z;


    /* -------------------------
       WHEEL ANIMATION
    ------------------------- */

    wheels.forEach(
        (wheel) => {

            wheel.rotation.x +=
                speed *
                delta *
                0.7;

        }
    );


    /* -------------------------
       SCORE
    ------------------------- */

    if (speed > 0) {

        score +=
            speed *
            delta *
            0.35;

    }


    /* -------------------------
       HUD
    ------------------------- */

    scoreElement.textContent =
        Math.floor(score);

    speedElement.textContent =
        Math.floor(
            Math.max(speed, 0) *
            3.6
        );

    coinsElement.textContent =
        coins;
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(delta) {

    const targetCameraX =
        car.position.x * 0.35;

    camera.position.x =
        THREE.MathUtils.lerp(
            camera.position.x,
            targetCameraX,
            4 * delta
        );


    const targetZ =
        car.position.z + 10;

    camera.position.z =
        THREE.MathUtils.lerp(
            camera.position.z,
            targetZ,
            4 * delta
        );


    camera.lookAt(
        car.position.x,
        0.7,
        car.position.z - 12
    );
}


/* =========================================================
   ROAD MOTION
========================================================= */

function updateRoad(delta) {

    /*
       We move the world toward the player
       instead of physically moving the car
       forward.

       This gives us the endless-road effect.
    */

    const movement =
        speed * delta;


    road.position.z += movement;

    grass.position.z += movement;


    laneMarkers.forEach(
        (marker) => {

            marker.position.z +=
                movement;

        }
    );


    /*
       Recycle road when it gets close.
    */

    if (road.position.z > 100) {

        road.position.z -=
            2000;

    }


    if (grass.position.z > 100) {

        grass.position.z -=
            2000;

    }


    laneMarkers.forEach(
        (marker) => {

            if (
                marker.position.z >
                100
            ) {

                marker.position.z -=
                    2000;

            }

        }
    );
}


/* =========================================================
   LOADING SCREEN
========================================================= */

let progress = 0;


const loadingTimer =
    setInterval(
        () => {

            progress += 10;

            loadingProgress.style.width =
                `${progress}%`;


            if (progress >= 30) {

                loadingText.textContent =
                    "BUILDING ROAD...";

            }


            if (progress >= 60) {

                loadingText.textContent =
                    "LOADING VEHICLE...";

            }


            if (progress >= 90) {

                loadingText.textContent =
                    "STARTING ENGINE...";

            }


            if (progress >= 100) {

                clearInterval(
                    loadingTimer
                );


                setTimeout(
                    () => {

                        loadingScreen.classList.add(
                            "hidden"
                        );

                    },
                    400
                );

            }

        },
        100
    );


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
            0.05
        );


    updatePlayer(
        delta
    );


    updateRoad(
        delta
    );


    updateCamera(
        delta
    );


    renderer.render(
        scene,
        camera
    );
}


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
   START
========================================================= */

animate();
