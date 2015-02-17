import "three";

class Bird extends THREE.Geometry {
	constructor() {
		super(this);

		this._v(   5,   0,   0 );
		this._v( - 5, - 2,   1 );
		this._v( - 5,   0,   0 );
		this._v( - 5, - 2, - 1 );

		this._v(   0,   2, - 6 );
		this._v(   0,   2,   6 );
		this._v(   2,   0,   0 );
		this._v( - 3,   0,   0 );

		this._f3( 0, 2, 1 );
		// this._f3( 0, 3, 2 );

		this._f3( 4, 7, 6 );
		this._f3( 5, 6, 7 );

		this.computeFaceNormals();
	}

	_v(x, y, z) {
		this.vertices.push(new THREE.Vector3(x, y, z));
	}

	_f3(a, b, c) {
		this.faces.push(new THREE.Face3(a, b, c));
	}
}

// Based on http://www.openprocessing.org/visuals/?visualID=6910
class Boid {
	constructor() {
		this.vector = new THREE.Vector3();
		this._width = 500;
		this._height = 500;
		this._depth = 200;
		this._neighborhoodRadius = 100;
		this._maxSpeed = 4;
		this._maxSteerForce = 0.1;
		this._avoidWalls = false;

		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this._acceleration = new THREE.Vector3();
	}

	setGoal(target) {
		this._goal = target;
	}

	setAvoidWalls(value) {
		this._avoidWalls = value;
	}

	setWorldSize(width, height, depth) {
		this._width = width;
		this._height = height;
		this._depth = depth;
	}

	run(boids) {
		if (this._avoidWalls) {
			this.vector.set( - this._width, this.position.y, this.position.z );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );

			this.vector.set( this._width, this.position.y, this.position.z );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );

			this.vector.set( this.position.x, - this._height, this.position.z );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );

			this.vector.set( this.position.x, this._height, this.position.z );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );

			this.vector.set( this.position.x, this.position.y, - this._depth );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );

			this.vector.set( this.position.x, this.position.y, this._depth );
			this.vector = this.avoid( this.vector );
			this.vector.multiplyScalar( 5 );
			this._acceleration.add( this.vector );
		}
		if (Math.random() > 0.5) {
			this.flock(boids);
		}
		this.move();
	}

	flock(boids) {
		if (this._goal) {
			this._acceleration.add(this.reach(this._goal, 0.005));
		}
		this._acceleration.add(this.alignment( boids ));
		this._acceleration.add(this.cohesion( boids ));
		this._acceleration.add(this.separation( boids ));
	}

	move() {
		this.velocity.add(this._acceleration);

		let l = this.velocity.length();
		if (l > this._maxSpeed) {
			this.velocity.divideScalar(l / this._maxSpeed);
		}

		this.position.add(this.velocity);
		this._acceleration.set(0, 0, 0);
	}

	checkBounds() {
		if ( this.position.x >   this._width ) this.position.x = - this._width;
		if ( this.position.x < - this._width ) this.position.x =   this._width;
		if ( this.position.y >   this._height ) this.position.y = - this._height;
		if ( this.position.y < - this._height ) this.position.y =  this._height;
		if ( this.position.z >   this._depth ) this.position.z = - this._depth;
		if ( this.position.z < - this._depth ) this.position.z =  this._depth;
	}

	avoid(target) {
		let steer = new THREE.Vector3();

		steer.copy(this.position);
		steer.sub(target);

		steer.multiplyScalar(1 / this.position.distanceToSquared( target ));

		return steer;
	}

	repulse(target) {
		let distance = this.position.distanceTo(target);

		if (distance < 150) {
			let steer = new THREE.Vector3();

			steer.subVectors(this.position, target);
			steer.multiplyScalar(0.5 / distance);

			this._acceleration.add(steer);
		}
	}

	reach(target, amount) {
		let steer = new THREE.Vector3();

		steer.subVectors(target, this.position);
		steer.multiplyScalar(amount);

		return steer;
	}

	alignment(boids) {
		let velSum = new THREE.Vector3(),
		count = 0;

		for (let boid of boids) {
			if (Math.random() > 0.6) continue;
			let distance = boid.position.distanceTo(this.position);

			if (distance > 0 && distance <= this._neighborhoodRadius) {
				velSum.add(boid.velocity);
				count++;
			}
		}

		if (count > 0) {
			velSum.divideScalar(count);

			let l = velSum.length();
			if (l > this._maxSteerForce) {
				velSum.divideScalar(l / this._maxSteerForce);
			}
		}

		return velSum;
	}

	cohesion(boids) {
		let posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for (let boid of boids) {
			if (Math.random() > 0.6) continue;
			let distance = boid.position.distanceTo(this.position);

			if (distance > 0 && distance <= this._neighborhoodRadius) {
				posSum.add(boid.position);
				count++;
			}
		}

		if (count > 0) {
			posSum.divideScalar(count);
		}

		steer.subVectors(posSum, this.position);

		let l = steer.length();
		if (l > this._maxSteerForce) {
			steer.divideScalar(l / this._maxSteerForce);
		}

		return steer;
	}

	separation(boids) {
		let posSum = new THREE.Vector3(),
		repulse = new THREE.Vector3();

		for (let boid of boids) {
			if ( Math.random() > 0.6 ) continue;

			let distance = boid.position.distanceTo(this.position);

			if (distance > 0 && distance <= this._neighborhoodRadius) {
				repulse.subVectors(this.position, boid.position);
				repulse.normalize();
				repulse.divideScalar(distance);
				posSum.add(repulse);
			}
		}

		return posSum;
	}
}

let camera, scene;
let birds, boids;
function init(width, height) {
	camera = new THREE.PerspectiveCamera( 75, width/height, 1, 10000 );
	camera.position.z = 450;

	scene = new THREE.Scene();

	birds = [];
	boids = [];

	for (let i = 0; i < 200; i++) {
		let boid = boids[i] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls(true);
		boid.setWorldSize(500, 500, 400);

		let bird = birds[i] = new THREE.Mesh(
			new Bird(),
			new THREE.MeshBasicMaterial({ color:Math.random() * 0xffffff, side: THREE.DoubleSide } )
		);
		bird.phase = Math.floor(Math.random() * 62.83);
		scene.add(bird);
	}

	document.addEventListener('mousemove', function onMouseMove(event) {
		const vector = new THREE.Vector3(
			event.clientX - width/2,
			- event.clientY + height/2,
			0
		);

		for (let boid of boids) {
			vector.z = boid.position.z;
			boid.repulse( vector );
		}
	}, false);

}

function draw() {
	for (let i = 0; i < birds.length; i++) {
		let boid = boids[i];
		boid.run(boids);

		let bird = birds[i];
		bird.position.copy(boids[i].position);

		let color = bird.material.color;
		color.r = color.g = color.b = (500 - bird.position.z) / 1000;

		bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
		bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

		bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
		bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
	}
}

function render(renderer) {
	renderer.render(scene, camera);
}

export { init, draw, render };
