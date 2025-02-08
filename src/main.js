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

const material = new THREE.MeshBasicMaterial( { map:texture } );

const loader = new GLTFLoader();
loader.load('./star-web.gltf', function ( gltf ){
  
  scene.add( gltf.scene );
  console.log('done')

}, undefined, function ( error ) {

	console.error( error );

} );
