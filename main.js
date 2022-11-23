import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Will always need a scene, camera and renderer to get everything started

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

//sets width and height of screen. will need to reload, does not scale
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//inital scene render
renderer.render(scene, camera);

//adding geometry to the scene
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

//adding objects to the scene
const torus = new THREE.Mesh(geometry, material);

const cubeTexture = new THREE.TextureLoader().load("Cube3.jpg");
const cubeNormalTexture = new THREE.TextureLoader().load("CubeMap.jpg");
const cCube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({
    map: cubeTexture,
    normalMap: cubeNormalTexture,
  })
);

const moonTexture = new THREE.TextureLoader().load("Cheese.jpg");
const moonNormalTexture = new THREE.TextureLoader().load("MoonMap.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture,
  })
);

scene.add(torus, cCube, moon);

//Adding lighting to the scene
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//helpers to provide direction to see where lights and shapes are going
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

//To add nav controls to any scene for testing the look
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(controls);

//Animate random stars with math
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//To add those stars
Array(200).fill().forEach(addStar);

//To add a background to the scene
const spaceTexture = new THREE.TextureLoader().load("bg.jpg");
scene.background = spaceTexture;

//Scroll Effect Section to move in 3D with Scroll
moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cCube.rotation.y += 0.01;
  cCube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//Infinite loop for animaiton
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.003;
  torus.rotation.z += 0.002;

  moon.rotation.x += 0.005;

  controls.update();
  renderer.render(scene, camera);
}

animate();
