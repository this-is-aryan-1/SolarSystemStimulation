
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
scene.add(ambientLight);

let isPaused = false;

const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 50; // Move the camera back

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('solarCanvas'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === 2. Add light source ===
const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(0, 0, 0); // Place light at the center (Sun's position)
scene.add(light);

// === 3. Create the Sun ===
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// === Earth ===
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshLambertMaterial({ color: 0x3399ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

let earthAngle = 0; // Initial orbit angle (in radians)
let earthSpeed = 0.01; // Speed of orbit
const earthOrbitRadius = 20; // Distance from the Sun

function addStars(count = 500) {
  const geometry = new THREE.SphereGeometry(0.1, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < count; i++) {
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000
    );
    scene.add(star);
  }
}

// === Planet System ===
const planets = [];

const planetData = [
  { name: 'Mercury', color: 0xbfb8aa, size: 0.5, distance: 8, speed: 0.04 },
  { name: 'Venus',   color: 0xe0c084, size: 0.9, distance: 11, speed: 0.015 },
  { name: 'Earth',   color: 0x3399ff, size: 1.0, distance: 14, speed: 0.01 },
  { name: 'Mars',    color: 0xff3300, size: 0.8, distance: 17, speed: 0.008 },
  { name: 'Jupiter', color: 0xf5deb3, size: 2.5, distance: 22, speed: 0.005 },
  { name: 'Saturn',  color: 0xf7c873, size: 2.0, distance: 28, speed: 0.003 },
  { name: 'Uranus',  color: 0x66ffff, size: 1.7, distance: 34, speed: 0.002 },
  { name: 'Neptune', color: 0x6666ff, size: 1.6, distance: 39, speed: 0.0015 }
];

planetData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

 // Create DOM label for the planet
const label = document.createElement('div');
label.className = 'planet-label';
label.textContent = data.name;
document.getElementById('labels').appendChild(label);

// Attach the label to the planet object
planets.push({
  name: data.name,
  mesh: mesh,
  angle: Math.random() * Math.PI * 2,
  distance: data.distance,
  speed: data.speed,
  label: label // attach label
});
  

});

addStars();

// === Create Speed Control Sliders ===
const slidersContainer = document.getElementById('sliders');

planets.forEach((planet, index) => {
  const group = document.createElement('div');
  group.classList.add('slider-group');

  const label = document.createElement('label');
  label.textContent = `${planet.name} Speed:`;

  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0;
  input.max = 0.05;
  input.step = 0.001;
  input.value = planet.speed;

  // When slider changes, update the planet's speed
  input.addEventListener('input', () => {
    planet.speed = parseFloat(input.value);
  });

  group.appendChild(label);
  group.appendChild(input);
  slidersContainer.appendChild(group);
});

// === 4. Animate the scene ===
function animate() {
  requestAnimationFrame(animate);
  if (isPaused) return;

  // Optional: Slowly rotate the Sun
  sun.rotation.y += 0.001;

 // Animate all planets
planets.forEach(planet => {
  planet.angle += planet.speed;
  planet.angle += planet.speed;
planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
planet.mesh.position.z = planet.distance * Math.sin(planet.angle);

// Label positioning
const vector = planet.mesh.position.clone().project(camera);
const x2d = (vector.x * 0.5 + 0.5) * window.innerWidth;
const y2d = (-vector.y * 0.5 + 0.5) * window.innerHeight;
planet.label.style.left = `${x2d}px`;
planet.label.style.top = `${y2d}px`;
});

  renderer.render(scene, camera);
}
animate();

// === 5. Handle window resizing ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

const toggleTheme = document.getElementById('toggleTheme');
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  toggleTheme.textContent = document.body.classList.contains('light-mode')
    ? 'Dark Mode'
    : 'Light Mode';
});