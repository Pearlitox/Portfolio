import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blur, element } from "three/tsl";

//Page transition

const transition = document.querySelector(".transition");
const star = document.querySelector(".transition__star");
const star2 = document.querySelector(".transition__star2");
const links = document.querySelectorAll(".link");
if (star && star2 && links && transition) {
  links.forEach((element) => {
    element.addEventListener("click", (event) => {
      gsap.to(star, {
        y: -450,
        duration: 0.75,
        rotate: 60,
        ease: "circ.out",

        onComplete: () => {
          gsap.to(star, {
            scale: 60,
            duration: 1,
            rotate: 70,
            yoyo: true,
          });
        },
      });
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
  duration: 1,
  rotate: 70,
});
//gallery

gsap.registerPlugin(ScrollTrigger);

gsap.to(".projets__2", {
  scrollTrigger: {
    trigger: ".projets__2",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
  yPercent: -10,
});

gsap.to(".projets__3", {
  scrollTrigger: {
    trigger: ".projets__3",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
  yPercent: -120,
});

//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".bg"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);
scene.background = new THREE.Color().setHex(0xe3e0ef);
//objet
const texture = new THREE.TextureLoader().load(
  "./assets/images/matcap-iridescent.png"
);
const texture2 = new THREE.TextureLoader().load(
  "./assets/images/matcap-chrome.png"
);
const material = new THREE.MeshMatcapMaterial({ matcap: texture });
const material2 = new THREE.MeshMatcapMaterial({ matcap: texture2 });
//path
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, -0.01),
  new THREE.Vector3(0.02, -0.02, 0.15),
  new THREE.Vector3(0.08, -0.01, 0.1),
  new THREE.Vector3(0.1, -0.04, 0),
  new THREE.Vector3(-0.15, 0.01, -0.07),
  new THREE.Vector3(0, 0, 0.10),

]);
let model;

// Je prépare une let pour
// contenir le mesh de l'étoile.
let starMesh;

var activeTheme = localStorage.getItem("theme");
if (activeTheme) {
  document.body.setAttribute("data-theme", activeTheme);
}
const loader = new GLTFLoader();
loader.load(
  "./assets/meshes/star-web.gltf",
  function (gltf) {
    model = gltf.scene;
    //centrer le mesh
    model.traverse((child) => {
      if (child.isMesh) {
        // Je mets à jour la let starWeb
        // pour avoir la référence du mesh.
        starMesh = child;
        child.material = material;

        //dark mode
        const darkmodebtn = document.querySelector(".darkmode");
        const nav = document.querySelector(".nav");
        darkmodebtn.addEventListener("click", themeSelect);
        let darkorlight = true;
        function themeSelect() {
          darkorlight = !darkorlight;
          if (darkorlight === false) {
            scene.background = new THREE.Color().setHex(0x000000);
            darkmodebtn.innerText = "lightmode";
            child.material = material2;
            document.body.style.color = "white";
            nav.style.color = "black";
          } else {
            scene.background = new THREE.Color().setHex(0xe3e0ef);
            darkmodebtn.innerText = "darkmode";
            document.body.style.color = "black";
            child.material = material;
          }
        }
        //follow path
        const o = { progress: 0 };
        gsap.to(o, {
          progress: 1,
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: () => {
              const point = curve.getPoint(o.progress);
              child.position.copy(point);
              child.lookAt(curve.getPointAt(0.99));
            },
          },
        });
      }
    });

    model.scale.set(160, 160, 160);

    scene.add(model);

    animate();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Animation
function animate() {
  requestAnimationFrame(animate);

  // On vérifie que la "let model" n'est pas null
  // Comme tu lances directement l'animation directement
  // pendant quelques secondes le temps de charger ton
  // star-web.gltf il y avait des erreurs.
  if (model) {
    // On update la rotation du mesh de l'étoile.
    // La 'let model' contient plusieurs éléments,
    // sans doute un groupe qui contient ta courbe
    // et ton étoile.
    starMesh.rotation.z -= 0.01;
    renderer.render(scene, camera);
  }
}

animate();
