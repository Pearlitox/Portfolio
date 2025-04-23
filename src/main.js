import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

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
const texture2 = new THREE.TextureLoader().load('./matcap-chrome.png' );
const texture3 = new THREE.TextureLoader().load('./matcap-iridescent.png' );  
const material = new THREE.MeshMatcapMaterial( { matcap:texture } );
const material2 = new THREE.MeshMatcapMaterial( { matcap:texture2 } );
let model;



var activeTheme = localStorage.getItem("theme");
if(activeTheme) {
  document.body.setAttribute("data-theme", activeTheme);
}


const loader = new GLTFLoader();
loader.load('./star-web.gltf', function (gltf) {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
        child.material = material;
    }
  });
  const darkmodebtn = document.querySelector('.darkmode');
  darkmodebtn.addEventListener('click', themeSelect);
  function themeSelect() {
    var currentMode = document.body.getAttribute("data-theme");
    var systemThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//mettre dans des fonctions séparée et fair eau chargeùent 
    if((!currentMode && systemThemeDark) || currentMode == "dark") {
        scene.background = new THREE.Color().setHex(0xe3e0ef);
        darkmodebtn.innerText = "darkmode"
        document.body.setAttribute('data-theme', "light");
        localStorage.setItem("theme", "light");
        child.material = material;
    } else {
        scene.background = new THREE.Color().setHex(0x000000);
        darkmodebtn.innerText = "lightmode"
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        
        child.material = material2;
    }
  }
  model.scale.set(160,160,160)
  model.rotation.z = 120
  scene.add(model);


gsap.registerPlugin(ScrollTrigger);
  const tl = gsap.timeline({
    scrollTrigger:{
      trigger: '.landing',
      start : 'top top',
      scrub: true,

    }

  });
  const tl1 = gsap.timeline({
    scrollTrigger:{
      trigger: '.aboutme',
      start : 'center top',
      scrub: true,

    }

  });
  const tl2 = gsap.timeline({
    scrollTrigger:{
      trigger: '.projets',
      start : 'center top',
      scrub: true,

    }

  });

  tl.to(model.position,{
    y : -2,
    x:10,
    z:15,
    duration: 9
  });

  tl1.to(model.position,{
    y :-20,
    x:0,
    z:-5,
    duration: 9
  });

  tl2.to(model.position,{
    y :0,
    x:-15,
    z:0,
    duration: 9
  });
  tl2.to(model.rotation,{
    y :3,
    duration: 9,
    

  },"-=9");

  animate(); // Lancer l'animation après chargement du modèle

}, undefined, function (error) {
  console.error(error);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  //model.rotation.y += 0.01;
  model.rotation.z += 0.01;
  
  renderer.render(scene, camera);
}


animate();