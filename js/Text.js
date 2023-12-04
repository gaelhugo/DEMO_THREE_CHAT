import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export default class Text {
  constructor(scene) {
    this.scene = scene;
  }

  loadFont() {
    const loader = new FontLoader();
    return new Promise((resolve, reject) => {
      loader.load("./brown.json", (font) => {
        resolve(font);
      });
    });
  }

  createText(_text, font) {
    const geometry = new TextGeometry(_text, {
      font: font,
      size: 1,
      height: 0.5,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 0.1,
      // bevelSize: 0.1,
      // bevelOffset: 0,
      // bevelSegments: 5,
    });
    const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const text = new THREE.Mesh(geometry, material);
    text.rotateX(-Math.PI / 2);
    text.castShadow = true;
    text.receiveShadow = true;

    // Calculer la boîte englobante
    const boiteEnglobante = new THREE.Box3().setFromObject(text);
    const tailleBoite = new THREE.Vector3();
    boiteEnglobante.getSize(tailleBoite);

    // Ajuster la position du mesh en fonction du centre de la boîte englobante
    text.position.x -= tailleBoite.x / 2;
    text.position.y -= tailleBoite.y / 2;
    text.position.z -= tailleBoite.z / 2;

    this.scene.add(text);
    return text;
  }
}
