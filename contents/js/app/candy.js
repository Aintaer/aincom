import "three";
import module from "module";

const masks = document.querySelectorAll('.js-mask');
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = 0;
renderer.domElement.style.left = 0;
renderer.domElement.style.zIndex = -1;
document.body.appendChild(renderer.domElement);

function load(name, req, done, config) {
	let width, height;

	function setSize() {
		width = window.innerWidth;
		height = window.innerHeight;
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	function getElemCoords(el) {
		// Transform to 0,0 as left bottom
		return [el.offsetLeft, height - el.offsetTop - el.offsetHeight, el.offsetWidth, el.offsetHeight];
	}

	req([`${module.id}/${name}`], function(plugin) {
		setSize();
		if (masks.length) renderer.enableScissorTest(true);

		if (plugin.init) {
			plugin.init(width, height);
		}

		(function animate() {
			requestAnimationFrame(animate);

			if (plugin.draw) {
				plugin.draw();
			}

			// Only pain the masked areas
			for (let mask of masks) {
				renderer.setScissor.apply(renderer, getElemCoords(mask));
				plugin.render(renderer);
			}
			// Otherwise, paint whole
			if (!masks.length) plugin.render(renderer);
		})();

		done(plugin);
	});
}

export { load };
