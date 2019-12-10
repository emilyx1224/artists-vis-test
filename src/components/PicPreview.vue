<template>
    
        <!-- <el-col >
            <p> {{this.img_name}} ({{this.img_year}}) </p>
            <p>{{this.artist_name}}</p>
        </el-col> -->

        <!-- <el-col>
            <svg class="colorBar"></svg>
        </el-col>
        
        <el-col>
            <img :src="this.img_path">
        </el-col> -->
    <div id="pic-preview">
        <el-row :gutter="0">
            <el-col :span="22"> 
                <div class="preview-container">
                    <div class="img-container">
                        <img :src="this.img_path" class="img-preview">
                        <div class="text-bg">
                            <div class="preview-text line1">{{this.img_name}} ({{this.img_year}})</div>
                            <div class="preview-text line2">{{this.artist_name}}</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="2"> 
                    <!-- <el-col> -->
                <div class="colorBar-container">
                    <svg class="colorBar"></svg>
                </div>
                    <!-- </el-col> -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
import eventHub from '@/eventHub'
import * as d3 from 'd3'

export default {
    data() {
        return {
            img_name: '',
            img_year: 'Please hover over the color squares on the right to preview paintings',
            img_path: '',
            artist_name: '',
        }
    },
    computed: {
        img_info: function() {
            if (this.img_name == '') {
                return '';
            } else {
                return this.img_name + ' (' + this.img_year + ')';
            }
        }
    },
    mounted() {
        var self = this;
        eventHub.$on('previewPic', pic_info => {
            self.img_name = pic_info['name_of_pic'];
            self.img_year = pic_info['year_of_pic'];
            self.artist_name = pic_info['artist_name'];
            self.img_path = './sampled_images/' + pic_info['artist_name'].split(' ').join('_') + '/' + pic_info['filename'];
            // console.log(self.img_path);
            this.renderColorBar(pic_info);
        })
    },
    methods: {
        renderColorBar(pic_info) {
            var svg = d3.select('.colorBar');
            var height = 175;
            var width = 16;
            var prev = 0;
            for (var i = 1; i < 11; i++) {
                var str = pic_info['color' + i.toString()];
                var percent = parseFloat(str.split(":")[1]);
                svg.append("rect")
                    .attr("height", Math.ceil(height*percent))
                    .attr("width", width)
                    .attr('x', 0)
                    .attr('y', prev)
                    .attr('fill', str.slice(0, 7));
                prev = prev + height*percent;
            }
        }
    }
}
</script>

<style>
/* style the whole component */
#pic-preview{
    background: #2e2e2e;
    border-top: white 1px solid;
}

.preview-container {
  position: relative;
  text-align: center;
  color: white;
  /* height: 180px; */
  width: 300px;
  display:inline-block;
}
.img-container{
  height: 180px;
  width: 250px;
  display: inline-block;
  vertical-align: top;

}
.colorBar-container{
  /* height: 180px;
  width: 50px;
  */
  display: inline-block;
  vertical-align:top;
  position: absolute;
  left:280px;
  height:180px;
 
}
.colorBar{
    width: 16px;
    height: 180px;
   
}
.preview-container .text-bg{
  position:absolute;
  background:rgba(0, 0, 0, 0.61);
  top:80%;
  left:50%;
  transform:translate(-50%,-50%);
  padding:30px 150px;
  text-align:center;
}
.preview-text {
  font-family:'Roboto',sans-serif;
  font-size: 10px;
  position: absolute;
  /* background-color:hotpink; */
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}
.line1{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.line2{
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.img-preview{
    display:inline-block;
    max-width: 100%;
    max-height: 100%;
}
/* .colorBar{
    display:inline-block;
} */
</style>