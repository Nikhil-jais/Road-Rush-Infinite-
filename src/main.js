import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
   ROAD RUSH: INFINITE
   STAGE 3 - NIGHT CITY WORLD
========================================================= */

const game = document.getElementById("game");

const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");
const loadingText = document.getElementById("loading-text");

const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");
const coinsElement = document.getElementById("coins");


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050817);

scene.fog = new THREE.FogExp2(
    0x07101f,
    0.018
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
);

camera.position.set(
    0,
    4.6,
    9
);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.75)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

game.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const moonLight =
    new THREE.HemisphereLight(
        0x7d91c7,
        0x05060a,
        1.6
    );

scene.add(moonLight);


const moon =
    new THREE.DirectionalLight(
        0xa8bfff,
        2.2
    );

moon.position.set(
    -30,
    60,
    20
);

moon.castShadow = true;

moon.shadow.mapSize.width = 1024;
moon.shadow.mapSize.height = 1024;

scene.add(moon);


/* =========================================================
   CITY COLORS
========================================================= */

const roadColor = 0x171a22;
const sidewalkColor = 0x272b35;
const buildingColors = [
    0x101522,
    0x141927,
    0x191d2b,
    0x0d1420,
    0x202335
];


/* =========================================================
   ROAD
========================================================= */

const roadWidth = 15;
const roadLength = 2400;

const roadGeometry =
    new THREE.PlaneGeometry(
        roadWidth,
        roadLength
    );

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: roadColor,
        roughness: 0.55,
        metalness: 0.15
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
    -1100
);

road.receiveShadow = true;

scene.add(road);


/* =========================================================
   SIDEWALKS
========================================================= */

function createSidewalk(x) {

    const geometry =
        new THREE.BoxGeometry(
            2.2,
            0.16,
            roadLength
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: sidewalkColor,
            roughness: 0.8
        });

    const sidewalk =
        new THREE.Mesh(
            geometry,
            material
        );

    sidewalk.position.set(
        x,
        0.08,
        -1100
    );

    sidewalk.receiveShadow = true;

    scene.add(sidewalk);

    return sidewalk;
}

const leftSidewalk =
    createSidewalk(-8.5);

const rightSidewalk =
    createSidewalk(8.5);


/* =========================================================
   CITY GROUND
========================================================= */

const cityGroundGeometry =
    new THREE.PlaneGeometry(
        180,
        roadLength
    );

const cityGroundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x080c13,
        roughness: 1
    });

const cityGround =
    new THREE.Mesh(
        cityGroundGeometry,
        cityGroundMaterial
    );

cityGround.rotation.x =
    -Math.PI / 2;

cityGround.position.set(
    0,
    -0.08,
    -1100
);

cityGround.receiveShadow = true;

scene.add(cityGround);


/* =========================================================
   LANE MARKINGS
========================================================= */

const laneMarkers = [];

const markerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe9edf7,
        emissive: 0x252b44,
        emissiveIntensity: 0.35
    });


function createLaneMarker(x, z) {

    const geometry =
        new THREE.BoxGeometry(
            0.13,
            0.035,
            4.8
        );

    const marker =
        new THREE.Mesh(
            geometry,
            markerMaterial
        );

    marker.position.set(
        x,
        0.025,
        z
    );

    scene.add(marker);

    laneMarkers.push(marker);
}


/* Create many lane markers */

for (
    let z = -40;
    z > -2200;
    z -= 11
) {

    createLaneMarker(-2.5, z);
    createLaneMarker(2.5, z);
}


/* =========================================================
   ROAD EDGE LIGHTS
========================================================= */

const roadLights = [];


function createRoadLight(x, z) {

    const poleGeometry =
        new THREE.CylinderGeometry(
            0.045,
            0.07,
            4.2,
            8
        );

    const poleMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x555b67,
            metalness: 0.7,
            roughness: 0.35
        });

    const pole =
        new THREE.Mesh(
            poleGeometry,
            poleMaterial
        );

    pole.position.set(
        x,
        2.1,
        z
    );

    pole.castShadow = true;

    scene.add(pole);


    const lampGeometry =
        new THREE.SphereGeometry(
            0.13,
            12,
            12
        );

    const lampMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x8fb5ff,
            emissiveIntensity: 5
        });

    const lamp =
        new THREE.Mesh(
            lampGeometry,
            lampMaterial
        );

    lamp.position.set(
        x,
        4.15,
        z
    );

    scene.add(lamp);


    const light =
        new THREE.PointLight(
            0x8eb5ff,
            3.5,
            16,
            2
        );

    light.position.set(
        x,
        4,
        z
    );

    scene.add(light);

    roadLights.push({
        pole,
        lamp,
        light
    });
}


for (
    let z = -20;
    z > -2200;
    z -= 35
) {

    createRoadLight(-7.7, z);
    createRoadLight(7.7, z - 17);
}


/* =========================================================
   BUILDINGS
========================================================= */

const buildings = [];


function createBuilding(
    x,
    z,
    width,
    height,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
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
            roughness: 0.82,
            metalness: 0.1
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);

    buildings.push(building);


    /* Rooftop light */

    if (Math.random() > 0.55) {

        const roofGeometry =
            new THREE.BoxGeometry(
                width * 0.55,
                0.05,
                depth * 0.55
            );

        const roofMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x17223b,
                emissive: 0x17223b,
                emissiveIntensity: 1
            });

        const roof =
            new THREE.Mesh(
                roofGeometry,
                roofMaterial
            );

        roof.position.set(
            x,
            height + 0.04,
            z
        );

        scene.add(roof);
    }


    /* Windows */

    const windowMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffd98a,
            emissive: 0xffb84a,
            emissiveIntensity: 1.8
        });


    const rows =
        Math.max(
            2,
            Math.floor(height / 2.2)
        );

    const columns =
        Math.max(
            2,
            Math.floor(width / 1.8)
        );


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let column = 0;
            column < columns;
            column++
        ) {

            if (Math.random() > 0.42) {

                const windowGeometry =
                    new THREE.BoxGeometry(
                        0.48,
                        0.42,
                        0.04
                    );

                const window =
                    new THREE.Mesh(
                        windowGeometry,
                        windowMaterial
                    );

                window.position.set(
                    x -
                        width / 2 +
                        0.8 +
                        column * 1.6,
                    1.1 +
                        row * 2.1,
                    z -
                        depth / 2 -
                        0.03
                );

                scene.add(window);
            }
        }
    }
}


/* Generate city */

for (
    let z = -35;
    z > -2200;
    z -= 32
) {

    const leftHeight =
        8 +
        Math.random() * 24;

    const rightHeight =
        7 +
        Math.random() * 28;


    createBuilding(
        -17 -
            Math.random() * 8,
        z,
        8 +
            Math.random() * 6,
        leftHeight,
        10 +
            Math.random() * 10
    );


    createBuilding(
        17 +
            Math.random() * 8,
        z - 14,
        8 +
            Math.random() * 6,
        rightHeight,
        10 +
            Math.random() * 10
    );
}


/* =========================================================
   NEON SIGNS
========================================================= */

function createNeonSign(
    x,
    y,
    z,
    width,
    height,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            0.08
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 4
        });

    const sign =
        new THREE.Mesh(
            geometry,
            material
        );

    sign.position.set(
        x,
        y,
        z
    );

    scene.add(sign);
}


for (
    let z = -80;
    z > -2100;
    z -= 130
) {

    createNeonSign(
        -12,
        5 + Math.random() * 8,
        z,
        2.5,
        0.65,
        0xff1744
    );


    createNeonSign(
        12,
        7 + Math.random() * 7,
        z - 50,
        2.8,
        0.65,
        0x00e5ff
    );
}


/* =========================================================
   ROAD BARRIERS
========================================================= */

const barrierMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x626975,
        metalness: 0.55,
        roughness: 0.45
    });


function createBarrier(x, z) {

    const geometry =
        new THREE.BoxGeometry(
            0.35,
            0.75,
            5
        );

    const barrier =
        new THREE.Mesh(
            geometry,
            barrierMaterial
        );

    barrier.position.set(
        x,
        0.37,
        z
    );

    barrier.castShadow = true;

    scene.add(barrier);
}


for (
    let z = -25;
    z > -2200;
    z -= 14
) {

    createBarrier(-7.25, z);
    createBarrier(7.25, z);
}


/* =========================================================
   PLAYER CAR
========================================================= */

const car =
    new THREE.Group();

scene.add(car);


/* Car body */

const bodyGeometry =
    new THREE.BoxGeometry(
        1.9,
        0.55,
        4
    );

const bodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xd7193f,
        metalness: 0.72,
        roughness: 0.22
    });

const body =
    new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

body.position.y =
    0.62;

body.castShadow = true;

car.add(body);


/* Hood */

const hoodGeometry =
    new THREE.BoxGeometry(
        1.72,
        0.18,
        1.35
    );

const hood =
    new THREE.Mesh(
        hoodGeometry,
        bodyMaterial
    );

hood.position.set(
    0,
    0.88,
    -1.15
);

car.add(hood);


/* Cabin */

const cabinGeometry =
    new THREE.BoxGeometry(
        1.42,
        0.58,
        1.65
    );

const cabinMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x07101c,
        metalness: 0.8,
        roughness: 0.12
    });

const cabin =
    new THREE.Mesh(
        cabinGeometry,
        cabinMaterial
    );

cabin.position.set(
    0,
    1.02,
    0.1
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
            0.36,
            0.36,
            0.28,
            20
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.9
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
        0.36,
        z
    );

    wheel.castShadow = true;

    car.add(wheel);

    wheels.push(wheel);
}


createWheel(-1, -1.3);
createWheel(1, -1.3);
createWheel(-1, 1.3);
createWheel(1, 1.3);


/* =========================================================
   HEADLIGHTS
========================================================= */

function createHeadlight(x) {

    const geometry =
        new THREE.SphereGeometry(
            0.16,
            12,
            12
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 8
        });

    const lamp =
        new THREE.Mesh(
            geometry,
            material
        );

    lamp.position.set(
        x,
        0.7,
        -2.02
    );

    car.add(lamp);


    const light =
        new THREE.SpotLight(
            0xd9e9ff,
            12,
            35,
            Math.PI / 8,
            0.55,
            1.5
        );

    light.position.set(
        x,
        0.8,
        -2
    );

    light.target.position.set(
        x,
        0,
        -20
    );

    car.add(light);
    car.add(light.target);
}


createHeadlight(-0.62);
createHeadlight(0.62);


/* =========================================================
   TAIL LIGHTS
========================================================= */

function createTailLight(x) {

    const geometry =
        new THREE.BoxGeometry(
            0.42,
            0.16,
            0.05
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff142f,
            emissive: 0xff142f,
            emissiveIntensity: 4
        });

    const light =
        new THREE.Mesh(
            geometry,
            material
        );

    light.position.set(
        x,
        0.72,
        2.02
    );

    car.add(light);
}


createTailLight(-0.62);
createTailLight(0.62);


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

        keys[
            event.key.toLowerCase()
        ] = true;

    }
);

window.addEventListener(
    "keyup",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   DRIVING
========================================================= */

let speed = 0;

let score = 0;

let coins = 0;

const maxSpeed = 82;

const acceleration = 30;

const braking = 62;

const friction = 13;

const steeringSpeed = 6.2;

const maxRoadX = 5.7;


/* =========================================================
   WORLD MOVEMENT
========================================================= */

const movingObjects = [
    road,
    leftSidewalk,
    rightSidewalk,
    cityGround,
    ...laneMarkers,
    ...roadLights.map(item => item.pole),
    ...roadLights.map(item => item.lamp),
    ...roadLights.map(item => item.light),
    ...buildings
];


/* =========================================================
   CLOCK
========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(delta) {

    const accelerate =
        keys["w"] ||
        keys["arrowup"];

    const brake =
        keys["s"] ||
        keys["arrowdown"];

    const left =
        keys["a"] ||
        keys["arrowleft"];

    const right =
        keys["d"] ||
        keys["arrowright"];


    if (accelerate) {

        speed +=
            acceleration * delta;

    }
    else {

        speed -=
            friction * delta;

    }


    if (brake) {

        speed -=
            braking * delta;

    }


    speed =
        THREE.MathUtils.clamp(
            speed,
            0,
            maxSpeed
        );


    let steering = 0;

    if (left) {
        steering = -1;
    }

    if (right) {
        steering = 1;
    }


    const steeringPower =
        THREE.MathUtils.lerp(
            0.45,
            1.15,
            speed / maxSpeed
        );


    car.position.x +=
        steering *
        steeringSpeed *
        steeringPower *
        delta;


    car.position.x =
        THREE.MathUtils.clamp(
            car.position.x,
            -maxRoadX,
            maxRoadX
        );


    const targetRotation =
        -steering * 0.11;


    car.rotation.z =
        THREE.MathUtils.lerp(
            car.rotation.z,
            targetRotation,
            8 * delta
        );


    car.rotation.y =
        THREE.MathUtils.lerp(
            car.rotation.y,
            steering * 0.04,
            5 * delta
        );


    wheels.forEach(
        wheel => {

            wheel.rotation.x +=
                speed *
                delta *
                0.9;

        }
    );


    score +=
        speed *
        delta *
        0.42;


    scoreElement.textContent =
        Math.floor(score).toLocaleString();

    speedElement.textContent =
        Math.floor(
            speed * 3.6
        );

    coinsElement.textContent =
        coins;
}


/* =========================================================
   ENDLESS WORLD
========================================================= */

function updateWorld(delta) {

    const movement =
        speed * delta;


    movingObjects.forEach(
        object => {

            object.position.z +=
                movement;

        }
    );


    if (
        road.position.z > 100
    ) {

        road.position.z -=
            2400;

    }


    if (
        leftSidewalk.position.z > 100
    ) {

        leftSidewalk.position.z -=
            2400;

    }


    if (
        rightSidewalk.position.z > 100
    ) {

        rightSidewalk.position.z -=
            2400;

    }


    if (
        cityGround.position.z > 100
    ) {

        cityGround.position.z -=
            2400;

    }


    laneMarkers.forEach(
        marker => {

            if (
                marker.position.z > 100
            ) {

                marker.position.z -=
                    2200;

            }

        }
    );


    buildings.forEach(
        building => {

            if (
                building.position.z > 100
            ) {

                building.position.z -=
                    2200;

            }

        }
    );


    roadLights.forEach(
        item => {

            if (
                item.pole.position.z > 100
            ) {

                item.pole.position.z -=
                    2200;

                item.lamp.position.z =
                    item.pole.position.z;

                item.light.position.z =
                    item.pole.position.z;

            }

        }
    );
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(delta) {

    const targetX =
        car.position.x * 0.38;


    camera.position.x =
        THREE.MathUtils.lerp(
            camera.position.x,
            targetX,
            5 * delta
        );


    camera.position.y =
        THREE.MathUtils.lerp(
            camera.position.y,
            4.7,
            3 * delta
        );


    camera.lookAt(
        car.position.x * 0.25,
        0.8,
        -18
    );
}


/* =========================================================
   LOADING
========================================================= */

let progress = 0;


const loadingTimer =
    setInterval(
        () => {

            progress += 8;

            loadingProgress.style.width =
                `${Math.min(progress, 100)}%`;


            if (progress < 25) {

                loadingText.textContent =
                    "BUILDING CITY...";

            }
            else if (progress < 50) {

                loadingText.textContent =
                    "LIGHTING HIGHWAY...";

            }
            else if (progress < 75) {

                loadingText.textContent =
                    "PREPARING VEHICLE...";

            }
            else if (progress < 100) {

                loadingText.textContent =
                    "STARTING ROAD RUSH...";

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
                    500
                );

            }

        },
        80
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


    updatePlayer(delta);

    updateWorld(delta);

    updateCamera(delta);


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
