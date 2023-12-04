import * as THREE from "three";
export default class Light {
  constructor(scene) {
    this.scene = scene;
  }

  createLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // une spotlight
    this.spotLight = new THREE.SpotLight(0xffffff, 20);
    this.spotLight.position.set(3, 5, 0);
    // gérer les ombres
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;

    this.scene.add(this.spotLight);
    //helper
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(this.spotLightHelper);
  }

  update() {
    this.spotLightHelper.update();
  }

  gui(gui) {
    const folder = gui.addFolder("Light");
    folder.add(this.spotLight, "intensity", 0, 100, 0.01);
    // controle de l'angle du spotlight
    folder.add(this.spotLight, "angle", 0, Math.PI / 3, 0.01);
    // controle des positions
    folder.add(this.spotLight.position, "x", -10, 10, 0.01);
    folder.add(this.spotLight.position, "y", -10, 10, 0.01);
    folder.add(this.spotLight.position, "z", -10, 10, 0.01);
    // controle de la pénombre
    folder.add(this.spotLight, "penumbra", 0, 1, 0.01);
    //control de la distance
    // folder.add(this.spotLight, "distance", 0, 100, 0.01);

    folder.open();
  }
}
