<template>
  <div>
      <div>{{msg}}</div>
      <div id="largerGraph"></div>
  </div>
</template>


<script>
  /* eslint-disable */
  import ForceGraph3D from '3d-force-graph';
  import miserables from '../data/miserables.json'
  import save from '../data/save.json'

  const initData = {
    nodes:[ {id:"zhang"} ],
    links:[]
  }


  export default {
    data(){
      return{
        msg: ''
      }
    },
    methods:{
      getData() {},
      detail(){
      },
      draw() {
        const elem = document.getElementById('largerGraph');
        const Graph = ForceGraph3D()(elem)
          .graphData(initData)
          .nodeLabel('id')
          .onNodeClick(addNode)
          function addNode() {
            const { nodes, links } = Graph.graphData()
            console.log(nodes)
            console.log(links)
            const id = 'wen'
              Graph.graphData({
                nodes: [...nodes, { id }],
                links: [...links, {source: id,target: 'zhang' }]
              })
          }

        }
    },
    mounted() {
        this.draw()
    },
    created(){
    //   this.getData()
    }
  }
</script>

<style scoped lang="css">
  #largerGraph {
    position: fixed;
    z-index: 200;
  }
</style>