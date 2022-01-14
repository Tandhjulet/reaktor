import * as THREE from './build/three.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from './jsm/environments/RoomEnvironment.js';

let camera, scene, renderer, controls;
let rotate, i = 0, x, z;

init();
animate();

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 5000 );
	camera.position.set(800,600,800);

	rotate = setInterval(() => {
		if (i===360) i = 0

		x = 1200 * Math.cos(i)
		z = 1200 * Math.sin(i)

		camera.position.set(x,600,z)

		i += 0.005;
	}, 10)
	

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x666666, 1500, 2000 );
	
	const spotLight = new THREE.SpotLight( 0xf5a142 );

	spotLight.position.set( 300, 500, 0 );

	spotLight.castShadow = true
	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;

	spotLight.shadow.mapSize.width = 7500;
	spotLight.shadow.mapSize.height = 7500;

	scene.add( spotLight );
	
	new GLTFLoader()
		.setPath( 'models/gltf/' )
		.load( 'test.gltf', function ( gltf ) {

			scene.add( gltf.scene );
			gltf.scene.translateY(150)
		} );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	const environment = new RoomEnvironment();
	const pmremGenerator = new THREE.PMREMGenerator( renderer );

	scene.background = new THREE.Color( 0x666666 );

	const grid = new THREE.GridHelper( 10000, 100, 0xffffff, 0xffffff );
	grid.material.opacity = 1;
	grid.material.depthWrite = false;
	grid.material.transparent = false;
	scene.add( grid );

	scene.environment = pmremGenerator.fromScene( environment ).texture;

	controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.target.set( 0, 200, 0 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	controls.update(); // required if damping enabled

	render();

}

function render() {

	renderer.render( scene, camera );

}

let paused = false;
document.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		if (paused === false) {
			clearInterval(rotate)
			paused = true
		} else {
			rotate = setInterval(() => {
				if (i===360) i = 0
		
				x = 1200 * Math.cos(i)
				z = 1200 * Math.sin(i)
		
				camera.position.set(x,600,z)
		
				i += 0.005;
			}, 10)
			paused = false
		}

	}
})