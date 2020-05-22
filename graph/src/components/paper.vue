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


  const jsonData = []
  export default {
    data(){
      return{
        msg: '333333',
        data: {'zzz': '22'}
      }
    },
    methods:{
      getData() {
            for (let j in jsonData) {
                let item = jsonData[j]
            }
      }
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
    z-index: 200;
  }
</style>