<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import {OBJLoader2} from '../../node_modules/three/examples/jsm/loaders/OBJLoader2';
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";

export default {
  name: "ThreeTest",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    };
  },
  methods: {
    scene_init() {
      const canvas = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({antialias: true});

      const fov = 45;
      const aspect = 2; // the canvas default
      const near = 0.1;
      const far = 100;
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
      this.camera.position.set(0, 12, 15);
      this.camera.lookAt(0, 0, 0);

      const controls = new OrbitControls(this.camera, canvas);
      controls.target.set(0, 0, 0);
      controls.update();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("black");
    },
    // 底面初始化
    plane_init() {
      const planeSize = 15;
      const loader = new THREE.TextureLoader();
      const texture = loader.load("../resources/checker.png");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;  
      texture.repeat.set(repeats, repeats);
      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      this.mesh = new THREE.Mesh(planeGeo, planeMat);
      this.mesh.rotation.x = Math.PI * -0.5;
      this.scene.add(this.mesh);
    },

    // 灯光初始化
    light_init() {
        // 环境灯光
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this.scene.add(light);
        }
        // 灯光
        {
            const color = 0xABABAB;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 5);
            light.target.position.set(-5, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }
    },

  // 房屋模型初始化
    house_init() {
      const objLoader = new OBJLoader2();
      objLoader.load('../resources/3d_house.obj', (root) => {
          this.house = root;
          // house.position.set(0,0,8);
          this.scene.add(root);
      });
  },

  mouse_init() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    document.addEventListener('click', function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, camera);
        let objs = [];
        for (let name in objects.obj_map) {
            let item = objects.obj_map[name];
            objs.push(item);
        }
        let intersects = this.raycaster.intersectObjects(objs);
        // console.log(intersects);
        if (intersects.length !== 0) {
            cube.onclick_callback(intersects[0].object);
        }
    }, false);
},

    animate() {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
    // this.init();
    this.scene_init();
    this.plane_init();
    this.light_init();
    this.house_init();
    this.animate();
  }
};
</script>
<style scoped>
#container {
  height: 400px;
}
</style>