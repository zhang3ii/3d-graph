<template>
  <div>
      <div id="largerGraph"></div>
  </div>
</template>


<script>
  /* eslint-disable */
  import ForceGraph3D from '3d-force-graph';
  import * as THREE from 'three'
  import SpriteText from 'three-spritetext'
  import axios from 'axios'

  // let hoveNode = null;
  // const highlightNodes = new Set();
  // const highlightLinks = new Set();
  // var Graph = ForceGraph3D()


  export default {
    data(){
      return{
        result: {},
        msg: '',
        nodeResult: [],
        linkResult: [],
        relationship: {},
        linkRelation: {}
        
      }
    },
    methods:{
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
        const elem = document.getElementById('largerGraph');
        const Graph = ForceGraph3D()(elem)
          .graphData(res)
          .nodeAutoColorBy('group')
          .linkThreeObjectExtend(true)
          .linkWidth(2)
          .nodeLabel('id')
          .linkDirectionalParticles(3)
          .linkDirectionalParticleSpeed(d => 5 * 0.001)
          .nodeThreeObject(node => {
            const obj = new THREE.Mesh(
              new THREE.SphereBufferGeometry(10),
              new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
            );
            // add text sprite as child
            const sprite = new SpriteText(node.id);
            sprite.color = node.color;
            sprite.textHeight = 3;
            obj.add(sprite);
            return obj;
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
          // .onLinkHover(link => {
          //   if (link) {

          //   }
          // })
        },

    },
    mounted() {
    },
    created(){
      this.getData()
    }
  }
</script>

<style scoped lang="css">
  #largerGraph {
    position: fixed;
  }
  #left_room {
    background-color: cornsilk;
    z-index: 999;
    top: 0px;
    right: 0px;
    width: 200px;
    position: absolute;
  }
</style>