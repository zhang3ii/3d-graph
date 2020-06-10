<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import checker from "../resources/checker.png";
import circle from "../resources/circle.png";

export default {
  name: "ThreeTest",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      raycaster: null,
      obj_map: {},
      rotation_objs: {},
      onclick_callback: null
    };
  },
  methods: {
    init: function() {
      let container = document.getElementById("container");
      this.renderer = new THREE.WebGLRenderer({ antialias: true });

      this.camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      this.camera.position.set(0, 12, 15);
      this.camera.lookAt(0, 0, 0);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("black");

      const controls = new OrbitControls(this.camera, container);
      controls.target.set(0, 0, 0);
      controls.update();

      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.mouse_init(this.camera, this.scene);
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    // 底面初始化
    plane_init() {
      const planeSize = 15;
      const loader = new THREE.TextureLoader();
      const texture = loader.load(checker);
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
    //房屋模型初始化
    house_init() {
      const objLoader = new OBJLoader2();
      objLoader.load("/static/3d_house.obj", root => {
        this.house = root;
        this.scene.add(this.house);
      });
    },
    light_init() {
      // 环境灯光
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      this.scene.add(light);
      // // 灯光
      {
        const color = 0xababab;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 5);
        light.target.position.set(-5, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);
      }
    },
    mouse_init(camera, scene) {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      document.addEventListener("click", this.clickEvent);
    },
    add_obj(name, obj) {
      this.obj_map[name] = obj;
    },
    add_rotation(name, obj) {
      this.rotation_objs[name] = obj;
    },
    add_cube(position, scale, message, color) {
      let geometry = new THREE.BoxGeometry();
      let material = new THREE.MeshBasicMaterial({ color: color });
      let cube_x = new THREE.Mesh(geometry, material);

      cube_x.name = message;

      cube_x.position.set(position.x, position.y + scale / 2, position.z);
      cube_x.scale.set(scale, scale, scale);
      this.scene.add(cube_x);
      let cube_obj = {
        cube: cube_x,
        text: undefined
      };

      let inner_color = color;
      let loader = new THREE.FontLoader();
      var scene1 = this.scene;

      loader.load("/static/Microsoft YaHei_Regular.json", function(font) {
        var xMid, text;
        let color = new THREE.Color(inner_color);
        let matDark = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide
        });
        let matLite = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        });
        let shapes = font.generateShapes(message, 0.4);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        text = new THREE.Mesh(geometry, matLite);
        text.position.set(position.x, position.y + scale, position.z);
        scene1.add(text);
      });
      this.add_obj(cube_obj.cube.name, cube_obj.cube);
    },
    addPlane2Cube(cube_x) {
      if (cube_x.children.length !== 0) {
        this.removeAllPlane();
        return;
      }
      this.removeAllPlane();
      let loader = new THREE.TextureLoader();
      let texture = loader.load(circle);
      let plane = new THREE.PlaneGeometry(5, 5);
      let material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
      });
      let mesh = new THREE.Mesh(plane, material);
      mesh.rotation.x = Math.PI * -0.5;
      mesh.position.set(0, cube_x.scale.y / 2, 0);
      cube_x.add(mesh);
      this.add_rotation(cube_x.name, mesh);
    },
    remove(map) {
      this.scene.remove(map.cube);
      this.scene.remove(map.text);
    },
    clickEvent(event) {
      let container = document.getElementById("container");
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      let objs = [];
      for (let name in this.obj_map) {
        let item = this.obj_map[name];
        objs.push(item);
      }
      console.log(objs)
      let intersects = this.raycaster.intersectObjects(objs);
      if (intersects.length !== 0) {
        this.addPlane2Cube(intersects[0].object);
      }
    },
    removeAllPlane() {
      console.log('delete')
      for (let name in this.rotation_objs) {
        let item = this.rotation_objs[name];
        delete this.rotation_objs[name];
        for (let cube_name in this.obj_map) {
          let cube_item = this.obj_map[cube_name];
          if (name === cube_name) {
            cube_item.children.length = 0;
          }
        }
        item.remove();
      }
    }
  },
  mounted() {
    this.init();
    this.plane_init();
    this.animate();
    this.house_init();
    this.light_init();
    this.add_cube({ x: 0, y: 0, z: 0 }, 0.4, "原点", 0xff2222);
    this.add_cube({ x: -3,y: 2,z: -3.9}, 0.4, '摄像头01', 0xFF11FF)
    this.add_cube({x: 0,y: 0,z: 5}, 0.4, '测试01', 0xFF6611)
  },
  created() {}
};
</script>
<style scoped>
#container {
  height: 1080px;
  width: 100%;
  display: block;
}
body,
html {
  margin: 0px;
  height: 100%;
}
</style>