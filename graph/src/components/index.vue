    
<template>
  <div id="app">
    <div id="3d-graph"></div>
  </div>
</template>


<script>
import ForceGraph3D from '3d-force-graph';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as THREE from 'three'
import data from '../data/save.json'

 import SpriteText from 'three-spritetext'
let hoverNode = null;
const highlightNodes = new Set();
const highlightLinks = new Set();
var Graph = ForceGraph3D();


export default {
  name: "Home",
  computed: {
  },
  data() {
    return {
        result: {},
        msg: '',
        nodeResult: [],
        linkResult: [],
        relationship: {},
        linkRelation: {}
    }
  },
  mounted() {
    // this.draw()
  },
  created(){
    this.getData()
  },
  methods: {
      updateHighlight() {
      // trigger update of highlighted objects in scene
        Graph
            .nodeColor(Graph.nodeColor())
            .linkWidth(Graph.linkWidth())
            .linkDirectionalParticles(Graph.linkDirectionalParticles());
    },
      getData() {
        axios({
          method: 'get',
          url: 'http://192.168.1.100:5000/person'
        }).then(res =>{
          this.result = res.data.person_relationship
          this.draw(res.data.person_relationship)
        })
      },
      getDataFromP2P(p1, p2){
        axios({
          method: 'get',
          url: 'http://192.168.1.100:5000/p2p?p1='+p1.trim()+'&'+'p2='+p2.trim(),
        }).then(res =>{
          let nodes = res.data.p2p.nodes
          let links = res.data.p2p.links
          if (nodes) {
            for (let index in nodes) {
              if (!this.relationship[nodes[index].id]) {
                this.relationship[nodes[index].id] = nodes[index].property
                this.nodeResult.push(nodes[index])
              }
            }
          }
          for (let index in links) {
              this.linkResult.push(links[index])
          }
        })
      },
      open() {
        this.$notify.info({
          title: '详细信息',
          message: this.msg,
          duration: 6000
        })
      },
      alertMessage() {
        this.$message('点击展开关系');
      },
      draw(res) {
        Graph(document.getElementById('3d-graph')) //.graphData('../assets/dataset.json')
        .graphData(res)
        .linkDirectionalParticleSpeed(d => 5)
        .nodeColor(node => highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(0,255,255,0.6)')
        .linkWidth(link => highlightLinks.has(link) ? 4 : 1)
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 4 : 2)
        .linkDirectionalParticleWidth(4)
        .onNodeHover(node => {
          // no state change
          if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
          }
          hoverNode = node || null;
          this.updateHighlight();
        })
        .onLinkHover(link => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
          this.updateHighlight();
        })

        .nodeThreeObject(node => {
            const sprite = new SpriteText(node.id);
            sprite.color = '#fff';
            sprite.textHeight = 3;
            sprite.position.set(0,12,0)
            return sprite
          })
        .onNodeDragEnd(node => {
            node.fx =  node.x;
            node.fy = node.y;
            node.fz = node.z;
          })
          .onLinkClick(link => {
            this.alertMessage()
            let source = link.source.id
            let target = link.target.id
            let catche = this.getDataFromP2P(source, target)
            for (let index in this.nodeResult) {
              const {nodes, links} = Graph.graphData();
              let id = this.nodeResult[index].id
              Graph.graphData({
                nodes: [...nodes, { id }],
                links: [...links]
              })  
          }
          for (let index in this.linkResult) {
            const {nodes, links} = Graph.graphData();
              let source = this.linkResult[index].source
              let target = this.linkResult[index].target
              Graph.graphData({
                nodes: [...nodes],
                links: [...links, { source: source, target: target}]
              })  
          }
          }
          )
          .onNodeClick(node => {
              let reg = /\\/g
              let datas = this.relationship[node.id]
              if (datas) {
                let message = ''
                for (let index in datas) {
                  message  = message + index + ':' + datas[index] + ' \n'
                }
                this.msg = message
                this.open()
              }
          })

          var helper = new THREE.GridHelper(2000, 10)
          helper.position.y = -500
          helper.material.opacity = 0.7
          helper.material.transparent = true
          // helper.material.color = 0x0f00f0
          Graph.scene().add(helper)
          helper = new THREE.GridHelper(2000, 5)
          helper.position.y = 20
          helper.material.opacity = 1
          helper.material.transparent = true
          // Graph.scene().add(helper)
          const bloomPass = new UnrealBloomPass();
          bloomPass.strength = 2;
          bloomPass.radius = 1;
          bloomPass.threshold = 0.1;
          Graph.postProcessingComposer().addPass(bloomPass);
          const geometry = new THREE.BoxGeometry(30, 30, 30)
          var wireframe = new THREE.WireframeGeometry(geometry)
          var cube = new THREE.LineSegments(wireframe)
          // cube = new THREE.Mesh(wireframe)
          cube.material.depthTest = true
          cube.material.opacity = 1
          cube.material.transparent = true
          Graph.scene().add(cube)
          document.addEventListener('dblclick', () => document.documentElement.requestFullscreen());
      }
  }
};
  </script>