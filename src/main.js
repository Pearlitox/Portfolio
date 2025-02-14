import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(30);

renderer.render( scene, camera );

const texture = new THREE.TextureLoader().load('./matcap-iridescent.png' ); 

const material = new THREE.MeshMatcapMaterial( { matcap:texture } );

let model;

const loader = new GLTFLoader();
loader.load('./star-web.gltf', function (gltf) {
  model = gltf.scene;

  // Appliquer le matcap à tous les meshes
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });
  model.scale.set(100,100,100)
  model.rotation.x = 0
  scene.add(model);

  
  animate(); // Lancer l'animation après chargement du modèle

}, undefined, function (error) {
  console.error(error);
});




// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  model.rotation.y += 0.01;
  
}

animate();