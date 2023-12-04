import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Shape from "./Shape.js";
import Light from "./Light.js";
import * as dat from "dat.gui";
import Text from "./Text.js";
import Chat from "./Chat";
import AudioDetector from "./AudioDetector";
export default class App {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.gui = new dat.GUI();

    this.chat = new Chat();
    this.chat.addEventListener("word", this.addWord.bind(this));
    this.chat.addEventListener("speechEnd", this.speechEnd.bind(this));

    // init audio detector
    this.audioDetector = new AudioDetector();
    this.audioDetector.addEventListener(
      "transcriptReady",
      this.onTextReceived.bind(this)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        console.log("space");
        this.audioDetector.stopRecording();
      }
    });

    this.initTHREE();
  }

  async initTHREE() {
    // Create a scene
    this.scene = new THREE.Scene();
    // Create a camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Set camera position
    this.camera.position.z = 5;
    this.camera.position.y = 5;
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Create a renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Set shadow
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    document.body.appendChild(this.renderer.domElement);

    //create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Create a cube
    const shape = new Shape(this.scene);
    // this.cube = shape.createCube();

    // Create a light
    this.light = new Light(this.scene);
    this.light.createLight();
    this.light.gui(this.gui);

    // Create a floor
    shape.createFloor();

    // Create a text
    this.text = new Text(this.scene);
    this.font = await this.text.loadFont();
    console.log(this.font);
    // this.text.createText("Hello ECAL");

    // collection de mots
    // const phrase =
    //   "Les cookies nous permettent de personnaliser le contenu et les annonces";
    // this.words = phrase.split(" ");
    // this.positionDuMot = 0;
    // this.allMots = [];
    // this.interval = setInterval(() => {
    //   this.addWord();
    // }, 2000);
    this.allMots = [];
    // this.chat.call(this.chat.context);
    //
    this.draw();
  }

  addWord(word) {
    // const mot = this.words.shift();
    // if (this.words.length <= 0) clearInterval(this.interval);
    const text = this.text.createText(word, this.font);
    this.allMots.push(text);
    console.log(text);
    this.allMots.forEach((mot, index) => {
      mot.position.z = (this.allMots.length - 1 - index) * -1.5;
    });
  }

  speechEnd(data) {
    this.chat.messages.push({
      role: "assistant",
      content: data.choices[0].message.content,
    });
    this.audioDetector.startRecording();
  }

  onTextReceived(transcript) {
    this.chat.call(transcript.text);
  }

  draw() {
    this.controls.update();
    this.light.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw.bind(this));
  }
}
