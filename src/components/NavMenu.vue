<template>
<div id='view-menu'>
   
    <el-menu   text-color="#fff"  class="menu" :router="true" :default-active="cur_view">
        <el-menu-item v-for="item in menu" :index="item.id" :key="item.id" :id="item.id" class="menu-item el-menu-vertical-demo" >
            <template slot="title" >
                <span v-if="item.id ==='color'"><img src='../../public/Asset_1-8.png' class="menu-icon"></span>
                <span v-else-if="item.id === 'artist'"><img src='../../public/Asset_2-8.png' class="menu-icon"></span>
                <span v-else><img src='../../public/Asset_3-8.png' class="menu-icon"></span>
                <span v-text="item.name" class="menu-text"></span>
            </template>
        </el-menu-item>
    </el-menu>
</div>
</template>

<script>
import menu from '@/config/menu-config'

import eventHub from '@/eventHub'  
import * as d3 from 'd3'

export default {
      data () {
          return {
              menu: menu,
              cur_view: null
          }
      },
      mounted() {
          var self = this;
          eventHub.$on('viewChanged', (view) => {
              self.cur_view = view.split('-')[0]
          })
      }
  }
</script>

<style scoped>
/* #app {
  font-family: 'Roboto Slab','Montserrat', Helvetica,  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

#view-menu {
    height: 136px;
    /* background-color:#2d2d2d; */
    background-color:#2e2e2e;

}
.menu-icon{
    width: 20px;
    height: 20px;
    margin-right: 8px;

}
.menu-text{
    text-transform:uppercase;
    font-weight: bold;
    font-size: 14px;
    /* color:white; */
    line-height:0px;
}
.menu {

    background: #2e2e2e;
    border-right: none;
    
    /* color:white; */
    padding-top:14px; 
    padding-bottom:14px; 
    /* margin-top:14px;     */
    /* margin-bottom: 14px; */
    /* margin-left:14px; */
}
.menu-item{
    height:36px;
     line-height:0px;
    /* margin:12px 0px; */
    padding:10px 0;
}
.menu-item:hover{
  
    background-color:#fc766a;
}
.menu-item:focus{
  
    background-color:#fc766a;
}
/* .menu-item:active{
    background-color:#fc766a;
} */

.el-menu-item.is-active{
    color: white !important;
    background-color:#fc766a;
}

text.artist{
    font-family: "Roboto", sans-serif;
}
</style>