import * as THREE from './three.module.js';
import { PointerLockControls } from './PointerLockControls.js';

class CaveExplorationGame {
    constructor() {
        console.log('Initializing game'); // Check if the script is loaded
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = null;
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 2, 15);  // Start position
        this.scene.add(new THREE.AmbientLight(0x404040));

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 10, 0);
        this.scene.add(light);

        this.generateCave();

        // Set up controls
        this.controls = new PointerLockControls(this.camera, document.body);

        // Add click event to start controls
        document.addEventListener('click', () => {
            console.log('Canvas clicked, attempting to lock pointer');
            this.controls.lock();
        });

        this.controls.addEventListener('lock', () => {
            console.log('Pointer Lock: Locked');
        });

        this.controls.addEventListener('unlock', () => {
            console.log('Pointer Lock: Unlocked');
        });

        document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
        document.addEventListener('keyup', (event) => this.onKeyUp(event), false);

        this.animate();
    }

    generateCave() {
        // Add floor
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3933 });  // Dark brown color
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // Add ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(100, 100);
        const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x3d3d3d });  // Dark gray color
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 20;
        this.scene.add(ceiling);

        // Generate stalagmites and stalactites
        for (let i = 0; i < 50; i++) {
            this.generateStalagmite();
            this.generateStalactite();
        }
    }

    generateStalagmite() {
        const height = Math.random() * 5 + 1;  // Random height between 1 and 6
        const radiusTop = 0.1;
        const radiusBottom = Math.random() * 0.5 + 0.5;  // Random radius between 0.5 and 1
        const geometry = new THREE.ConeGeometry(radiusBottom, height, 8);
        const material = new THREE.MeshStandardMaterial({ color: this.getRandomEarthColor() });
        const stalagmite = new THREE.Mesh(geometry, material);

        // Random position
        stalagmite.position.x = Math.random() * 80 - 40;
        stalagmite.position.z = Math.random() * 80 - 40;

        this.scene.add(stalagmite);
    }

    generateStalactite() {
        const height = Math.random() * 5 + 1;  // Random height between 1 and 6
        const radiusTop = Math.random() * 0.5 + 0.5;  // Random radius between 0.5 and 1
        const radiusBottom = 0.1;
        const geometry = new THREE.ConeGeometry(radiusTop, height, 8);
        const material = new THREE.MeshStandardMaterial({ color: this.getRandomEarthColor() });
        const stalactite = new THREE.Mesh(geometry, material);

        // Random position
        stalactite.position.x = Math.random() * 80 - 40;
        stalactite.position.y = 20;  // At ceiling level
        stalactite.position.z = Math.random() * 80 - 40;
        stalactite.rotation.x = Math.PI;  // Flip it upside down

        this.scene.add(stalactite);
    }

    getRandomEarthColor() {
        const earthColors = [
            0x8B4513,  // Saddle Brown
            0xD2691E,  // Chocolate
            0xCD853F,  // Peru
            0xDEB887,  // Burlywood
            0xD2B48C,  // Tan
            0x5C4033,  // Dark Brown
        ];
        return earthColors[Math.floor(Math.random() * earthColors.length)];
    }

    onKeyDown(event) {
        console.log(`Key down: ${event.code}`);
        switch (event.code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'KeyD':
                this.moveRight = true;
                break;
        }
    }

    onKeyUp(event) {
        console.log(`Key up: ${event.code}`);
        switch (event.code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls.isLocked === true) {
            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);

            this.direction.normalize(); // this ensures consistent movements in all directions

            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 0.1;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 0.1;

            this.controls.moveRight(-this.velocity.x);
            this.controls.moveForward(-this.velocity.z);

            this.velocity.x -= this.velocity.x * 0.08;
            this.velocity.z -= this.velocity.z * 0.08;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new CaveExplorationGame();
});
