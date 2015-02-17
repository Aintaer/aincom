import "three";

const scene = new THREE.Scene();
let camera, cube;

function init(width, height) {
	camera = new THREE.PerspectiveCamera(80, width/height, 1, 1000);
	camera.position.z = 300;
	scene.add(camera);

	const light = new THREE.DirectionalLight(0x666666, 5);
	light.position.z = 3;
	scene.add(light);

	cube = new THREE.Mesh(
		new THREE.BoxGeometry(200, 200, 200),
		new THREE.MeshLambertMaterial({ color: 0x666666 })
	);
	scene.add(cube);
}

function draw() {
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;
}

function render(renderer) {
	renderer.render(scene, camera);
}

export { init, draw, render };
