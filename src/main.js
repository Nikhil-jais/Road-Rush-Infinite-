import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import "./style.css";

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


/* =========================
   THREE.JS SETUP
========================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x101722);


const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
            window.innerHeight,
        0.1,
        2000
    );

camera.position.set(
    0,
    5,
    10
);


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

game.appendChild(
    renderer.domElement
);


/* =========================
   LIGHTING
========================= */

const ambientLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x182030,
        2
    );

scene.add(
    ambientLight
);


const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sunLight.position.set(
    20,
    40,
    20
);

scene.add(
    sunLight
);


/* =========================
   TEST CAR
========================= */

const carGeometry =
    new THREE.BoxGeometry(
        2,
        0.8,
        4
    );

const carMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe53935,
        metalness: 0.4,
        roughness: 0.35
    });

const car =
    new THREE.Mesh(
        carGeometry,
        carMaterial
    );

car.position.set(
    0,
    0.5,
    0
);

scene.add(car);


/* =========================
   ROAD
========================= */

const roadGeometry =
    new THREE.PlaneGeometry(
        14,
        2000
    );

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x20242b
    });

const road =
    new THREE.Mesh(
        roadGeometry,
        roadMaterial
    );

road.rotation.x =
    -Math.PI / 2;

road.position.z =
    -900;

scene.add(road);


/* =========================
   GAME LOOP
========================= */

let score = 0;

let speed = 0;

let coins = 0;

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        clock.getDelta();

    car.rotation.y +=
        delta * 0.4;

    score +=
        delta * 10;

    speed =
        120 +
        Math.sin(
            performance.now() *
            0.001
        ) * 10;

    scoreElement.textContent =
        Math.floor(score);

    speedElement.textContent =
        Math.floor(speed);

    coinsElement.textContent =
        coins;

    renderer.render(
        scene,
        camera
    );
}


/* =========================
   LOADING
========================= */

let progress = 0;

const loadingTimer =
    setInterval(() => {

        progress += 10;

        loadingProgress.style.width =
            `${progress}%`;

        if (progress >= 30) {
            loadingText.textContent =
                "BUILDING WORLD...";
        }

        if (progress >= 60) {
            loadingText.textContent =
                "LOADING VEHICLES...";
        }

        if (progress >= 90) {
            loadingText.textContent =
                "STARTING ENGINE...";
        }

        if (progress >= 100) {

            clearInterval(
                loadingTimer
            );

            setTimeout(() => {

                loadingScreen.classList.add(
                    "hidden"
                );

            }, 400);
        }

    }, 100);


/* =========================
   RESIZE
========================= */

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


animate();
