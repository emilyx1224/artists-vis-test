<template>
  <div id="app">
    <el-container>
      <el-aside width='300px'>
        <nav-menu></nav-menu>
        <Filters></Filters>
        <PicPreview></PicPreview>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as d3 from 'd3'

import NavMenu from '@/components/NavMenu.vue'
import Filters from '@/components/Filters.vue'
import PicPreview from '@/components/PicPreview.vue'
import Header from '@/components/Header.vue'
import eventHub from '@/eventHub'

export default {
  name: 'app',
  components: {
    NavMenu,
    Filters,
    PicPreview,
    Header
  },
  data() {
    return {
    }
  },
  // mounted() {
  //   console.log('App loaded');
  //   this.fetchData();
  // },
  // methods: {
  //   async fetchData() {
  //     let data = await d3.csv('artists_pics.csv');
  //     console.log(data);
  //   }
  // }
  mounted() {    
    this.loadArtistInfo();
  },
  methods: {
    async loadArtistInfo() {
      let data = await d3.csv('artists_info_final.csv');
      eventHub.$emit('loadArtistInfo', data);
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat|Roboto|Roboto+Slab&display=swap');

#app {
  font-family: 'Roboto Slab','Montserrat', 'Roboto', Helvetica,  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
  margin-left: 0px;
  background-color: #343434;
}
body {
  margin: 0px;
  background-color: #343434;
}

</style>
