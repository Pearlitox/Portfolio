import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blur, element } from 'three/tsl';


//Page transition


const transition = document.querySelector(".transition");
const star = document.querySelector(".transition__star");
const star2 = document.querySelector(".transition__star2");
const links = document.querySelectorAll(".link");
if (star && star2 && links && transition){

links.forEach(element => {

  element.addEventListener("click", (event) => {
    gsap.to(star, {
    y : -450,
    duration:0.75,
    rotate: 60,
    ease: "circ.out",

    onComplete: () => {
        gsap.to(star, {
            scale: 60,
            duration:1,
            rotate: 70
        });
          }
    })
    event.preventDefault();
    const link = event.currentTarget.href;
    setTimeout(() => {
      window.location.href = link;
    }, 2000);
  });
});
}
  gsap.to(star2, {
    scale: 0,
    duration:1,
    rotate: 70,
  });
//gallery

gsap.registerPlugin(ScrollTrigger);




gsap.to(".projets__2", {
  scrollTrigger: {
    trigger: ".projets__2",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  yPercent: -10
});

gsap.to(".projets__3", {
  scrollTrigger: {
    trigger: ".projets__3",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  yPercent: -120
});


//scene
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.bg'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
renderer.render( scene, camera );
scene.background = new THREE.Color().setHex(0xe3e0ef);
//objet
const texture = new THREE.TextureLoader().load('./assets/images/matcap-iridescent.png' );
const texture2 = new THREE.TextureLoader().load('./assets/images/matcap-chrome.png' ); 
const material = new THREE.MeshMatcapMaterial( { matcap:texture } );
const material2 = new THREE.MeshMatcapMaterial( { matcap:texture2 } );
let model;
let pictureframes;
var activeTheme = localStorage.getItem("theme");
if(activeTheme) {
  document.body.setAttribute("data-theme", activeTheme);
}
const loader = new GLTFLoader();
loader.load('./assets/meshes/star-web.gltf', function (gltf) {
  model = gltf.scene;
  model.traverse((child) => {
    if (child.isMesh) {
        child.material = material;
     const darkmodebtn = document.querySelector('.darkmode');
     darkmodebtn.addEventListener('click', themeSelect);
     let darkorlight = true;
     function themeSelect() {
    darkorlight = !darkorlight
    if( darkorlight === false ) {
        scene.background = new THREE.Color().setHex(0x000000);
        darkmodebtn.innerText = "lightmode"
        child.material = material2;
        document.body.style.color = "white";
    } else {
        scene.background = new THREE.Color().setHex(0xe3e0ef);
        darkmodebtn.innerText = "darkmode"
        document.body.style.color = "black";
        child.material = material;
    }
  }
    }
  });
  model.scale.set(160,160,160)
  model.rotation.z = 120
  scene.add(model);
  animate(); 
}, undefined, function (error) {
  console.error(error);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  model.rotation.z -= 0.01;
  
  renderer.render(scene, camera);
}


animate();

