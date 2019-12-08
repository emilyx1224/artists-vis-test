<template>
    <div id="filter">
        <el-row :gutter="0">
          
            <el-col :span="14"> 
                Filter

            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                    <!-- <el-button size="mini" class="btn-style"> Reset All</el-button> -->
                    <el-button @click="reset" size="mini" class="btn-style">Reset All</el-button>
                </div>
                
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="14">
                <h5>Artist</h5>
                
            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" @click="clearArtist" size="mini">Clear</el-button>
                </div>

            </el-col>
            <el-col>
                 <el-select v-model="artist_value" multiple :multiple-limit="4" placeholder="Select" @change="artistChange" size="small" id="wider-dropdown">
                    <el-option
                    v-for="item in artists_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
                <!-- <el-checkbox-group v-model="default_artist" size="mini" class="checkbox">
                    <el-checkbox-button class="
                    checkbox" fill="#b7c90a"
                    v-for="artist in artists" 
                    :label="artist" 
                    :key="artist" 
                    border>
                        {{artist}}
                    </el-checkbox-button>
                </el-checkbox-group> -->
                <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all
                </el-checkbox>
                <div style="margin: 10px 0;"> </div>
                <el-checkbox-group v-model="default_artist" size="mini" >
                      <el-checkbox-button  class="my-checkbox" 
                    v-for="artist in artists" 
                    :label="artist" 
                    :key="artist" 
                    >
                       <p class="my-checkbox-inner"> {{artist}}</p>
                     </el-checkbox-button>
               
                </el-checkbox-group> -->


                        
               
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <hr class="divider">
            <el-col :span="14" class="ver-align">
                <h5> Number of main colors </h5>
                <!-- <img src="../../public/info-outline-2x.png" class="info-icon"> -->
                <div class="tooltip">
                    <img src="../../public/info-outline-2x.png" class="info-icon">
                    <span class="tooltiptext">The number of colors with large area in a painting. </span>
                </div>

            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" size="mini" @click="clearColorAmount">Clear</el-button>
                </div>

            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="3">
                <p class="slider-mark">1</p>
            </el-col>
            <el-col :span="17">
                
                <el-slider
                    v-model="color_num_values"
                    range
                    :min="1"
                    :max="10"
                    @change="colorAmountChange">
                </el-slider>
                
            </el-col>
            <el-col :span="3">
                <p class="slider-mark">10</p>
            </el-col>
        </el-row>
        

        <el-row :gutter="0">
            <hr class="divider">
            <el-col :span="14">
                <h5> Painting Year </h5>
<!-- ======= -->
        <!-- <el-row>
            <el-col>
                Painting Year
                <el-button type="text" @click="clearPaintingYear">Clear</el-button> -->
<!-- >>>>>>> a18a5eb5360656b6bbad2ccede7453fa70b6ab82 -->
            </el-col>
            <el-col :span="10">
               <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" size="mini" @click="clearPaintingYear">Clear</el-button>
                </div>
            </el-col>
            <el-col :span="3">
                <p class="slider-mark">1267</p>
            </el-col>
            
            <el-col :span="17">

                <el-slider 
                    v-model="year_values"
                    range
                    :min="1290"
                    :max="1990"
                    @change="paintingYearChange">
                </el-slider>
                

            </el-col>
            <el-col :span="3">
                <p class="slider-mark">1987</p>
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <hr class="divider">
            <el-col :span="14" class="ver-align">
                <h5> Color Theory </h5>
                <div class="tooltip">
                    <img src="../../public/info-outline-2x.png" class="info-icon">
                    <span class="tooltiptext">Filter paintings using specific colors. </span>
                </div>
                <!-- <img src="../../public/info-outline-2x.png" class="info-icon"> -->
            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" size="mini" v-on:click="clearColorTheory">Clear</el-button>
                </div>

            </el-col>
           
            <el-col>

                <el-select size="mini" v-model="color_theory_value" placeholder="Select" @change="colorTheoryChange">

                    <el-option
                    v-for="item in color_theory_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" class="dropdown-option">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row :gutter="0" >
            <hr class="divider">
           
            <el-col :span="14" class="ver-align">
                <h5> Color Intensity </h5>
                <div class="tooltip">
                    <img src="../../public/info-outline-2x.png" class="info-icon">
                    <span class="tooltiptext">The average color saturation of a painting. </span>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" size="mini" @click="clearColorIntensity">Clear</el-button>
                </div>

            </el-col>
             <el-col :span="3">
                <p class="slider-mark">0%</p>
            </el-col>
            <el-col :span="17">
                
                <el-slider
                    v-model="intensity_values"
                    range
                    :min="0"
                    :max="100"
                    @change="colorIntensityChange">
                </el-slider>
                
                
            </el-col>
             <el-col :span="3">
                <p class="slider-mark">100%</p>
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <hr class="divider">
            <el-col :span="14">
                <h5> Genre </h5>

            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style" type="text" size="mini" @click="clearGenre">Clear</el-button>
                </div>
            </el-col>
            
            <el-col>

                <el-select v-model="genre_value" placeholder="Select" @change="genreChange" size="mini">

                    <el-option
                    v-for="item in genre_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <hr class="divider">
            <el-col :span="14">
                <h5> Country </h5>
            </el-col>
            <el-col :span="10">
                <div class="btn-wrapper" align="right"> 
                <el-button class="text-btn-style"  type="text" size="mini" @click="clearCountry">Clear</el-button>
                </div>
<!-- ======= -->
        <!-- <el-row>
            <el-col>
                Country
                <el-button type="text" @click="clearCountry">Clear</el-button> -->
<!-- >>>>>>> a18a5eb5360656b6bbad2ccede7453fa70b6ab82 -->
            </el-col>
           
            <el-col>

                <el-select v-model="country_value"   placeholder="Select" @change="countryChange" size="mini" > 

                    <el-option
                    v-for="item in country_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
           
        </el-row>
        <el-row>
             <hr class="divider" id="bottom-divider">
        </el-row>
    </div>
</template>

<script>
import eventHub from '@/eventHub'

export default {
    data() {
        return {
            color_num_values: [0, 10],
            year_values: [1260, 1990],
            color_theory_options: [{
                value: 'warm',
                label: 'Warm'
                }, {
                value: 'cool',
                label: 'Cool'
                },{
                value: 'complementary',
                label: 'Complementary'
                }, {
                value: 'analogous',
                label: 'Analogous'
                }, {
                value: 'primary',
                label: 'Primary: all red blue yellow'
                }, {
                value: 'red',
                label: 'Primary: red'
                }, {
                value: 'yellow',
                label: 'Primary: yellow'
                }, {
                value: 'blue',
                label: 'Primary: blue'
                }],
            color_theory_value: '',
            value: '',
            intensity_values: [0, 100],
            genre_options: [],
            genre_value: '',
            country_options: [],
            country_value: '',
            artist_value: ['All'],
            artists_options: []
        }
    },
    created() {
    },
    methods: {
        reset() {
            this.artist_value = ['All'];
            this.year_values = [1260, 1990];
            this.intensity_values = [0, 100];
            this.color_num_values = [1, 10];
            this.color_theory_value = '';
            this.genre_value = '';
            this.country_value = '';

            var retValue = {
                'artist': this.artist_value,
                'year': this.year_values,
                'intensity': this.intensity_values,
                'amount': this.color_num_values,
                'theory': this.color_theory_value,
                'genre': this.genre_value,
                'country': this.country_value
            };
            eventHub.$emit('reset', retValue);
        },

        clearArtist() {
            this.artist_value = ['All'];
            eventHub.$emit('artistChanged', this.artist_value);
        },
        artistChange() {
            if (this.artist_value.includes('All')) {
                this.artist_value = ['All'];
            }
            eventHub.$emit('artistChanged', this.artist_value);
        },

        clearPaintingYear() {
            this.year_values = [1260, 1990];
            eventHub.$emit('paintingYearChanged', this.year_values);
        },
        paintingYearChange() {
            eventHub.$emit('paintingYearChanged', this.year_values);
        },

        clearColorIntensity() {
            this.intensity_values = [0, 100];
            eventHub.$emit('intensityChanged', this.intensity_values);
        },
        colorIntensityChange() {
            eventHub.$emit('intensityChanged', this.intensity_values);
        },

        clearColorAmount() {
            this.color_num_values = [1, 10];
            eventHub.$emit('colorAmountChanged', this.color_num_values);
        },
        colorAmountChange() {
            eventHub.$emit('colorAmountChanged', this.color_num_values);
        },

        clearColorTheory() {
            this.color_theory_value = '';
            eventHub.$emit('colorTheoryChanged', this.color_theory_value);
        },
        colorTheoryChange() {
            eventHub.$emit('colorTheoryChanged', this.color_theory_value);
        },

        clearGenre() {
            this.genre_value = '';
            eventHub.$emit('genreChanged', this.genre_value);
        },
        genreChange() {
            eventHub.$emit('genreChanged', this.genre_value);
        },

        clearCountry() {
            this.country_value = '';
            eventHub.$emit('countryChanged', this.country_value);
        },
        countryChange() {
            eventHub.$emit('countryChanged', this.country_value);
        },
    },
    mounted() {
        eventHub.$on('loadArtistInfo', (artistsInfo) => {
            var self = this;
            var artist_set = new Set();
            var country_set = new Set();
            var genre_set = new Set();
            artistsInfo.forEach(function(d) {
                artist_set.add(d['name']);
                
                country_set.add(d['nationality']);
                
                var arr = d['genre'].split(',');
                arr.forEach(function(ele) {
                    genre_set.add(ele);
                })
            });

            Array.from(artist_set).sort().forEach(function(d) {
                self.artists_options.push({
                    value: d,
                    label: d
                });
            });

            this.artists_options.unshift({
                value: 'All',
                label: 'All'
            });

            Array.from(country_set).sort().forEach(function(d) {
                self.country_options.push({
                    value: d,
                    label: d
                });
            });

            Array.from(genre_set).sort().forEach(function(d) {
                self.genre_options.push({
                    value: d,
                    label: d
                });
            });
        })
    }
}
</script>

<style>
#filter {

    padding-left:20px;
    padding-right:20px;
    padding-top:8px;
    color:white;
    border-top: 1px solid white;
    background-color:#2e2e2e;

}
/* .right-button{
    text-align:right;
} */

h5 {
    font-size: 10px;
    font-family: 'Roboto',Helvetica,  sans-serif;
    margin-top:8px;
    margin-bottom: 6px;
    float:left;
}
/* .slider{
    -webkit-appearance: none;
    background: hotpink;
    width: 200px;
    height:2px;
    outline: none;
    
} */
 .el-slider{
    -webkit-appearance: none;
    /* background: hotpink; */
    width: 170px;
    height: 2px;
    outline: none;
    margin-bottom: 20px;
    margin-top:0px;     
}

/* .slider .el-slider .el-tooltip{
    -webkit-appearance: none;
    appearance: none;
    width:12px;
    height:12px;
    background:red;
    cursor:pointer;

} */
.btn-style{
    font-family:"Roboto Slab", sans-serif !important;
    font-size:12px !important;
    font-weight: bold !important;
    color:#4a4a4a !important;
    border:none !important;
} 
.btn-style:hover{
    background-color:#fc766a !important;
    color: white !important;
    border:none !important;
}
.text-btn-style{
    margin-top:0px;
    text-transform: uppercase;
    font-size:10px !important;
    font-family: 'Roboto',sans-serif;
    color:white !important;
    padding:0px;
}

.text-btn-style:hover{
    color: #fc766a !important;
}

.btn-wrapper{
    text-align: right;
    padding:0px;
    margin:0px;
}
.dropdown-option{
    font-family:'roboto',sans-serif;
    font-size:10px;
    color:#4a4a4a;
}
/* .dropdown-option:focus{
   
    color:hotpink;
} */

.divider{
    margin:8px 0 0 0;
    border: 1px solid rgba(255,255,255,0.3);
}
#bottom-divider{
    border: 0px solid rgba(255, 255, 255, 0);
}
.el-slider__button {
    width: 12px !important;
    height: 12px !important;
    border: none !important;
}
.el-slider__bar {
    height:2px !important;
    /* margin-left:12px !important; */
    background-color: #fc766a !important;
    /* margin: 16px 0 !important; */
}
.el-slider__runway{
    height:2px !important;
    margin-left:8px !important;
    /* margin-left:auto !important;
    margin-right:auto !important; */
    /* margin: 16px 0 !important; */

}
.el-slider__button-wrapper{
    height: 32px !important;
    width: 32px !important;
/* change the vertical order of the slider btn */
    z-index: 0 !important;
}
.slider-mark{
    margin-top:10px;
    font-size: 10px;
    font-family: "roboto",sans-serif;
    text-align:center;

}

/* .el-tooltip .el-slider__button{
    background-color:hotpink !important;
    color: hotpink !important;
} */

.el-input--mini .el-input__inner {
    height: 24px !important;
    line-height: 13px !important;
}
.el-select-dropdown__item{
    font-family:'Roboto', sans-serif !important;
    font-size: 11px !important;

}
.el-select-dropdown__item.selected{
    color:#fc766a !important;

}
/* change the font style in the first dropdown's tag */
.el-tag {
    font-family:'Roboto', sans-serif !important;
    font-size: 11px !important;
    font-weight: bold;
}

/* align dropdown icon vertically in the dropdown bar */
.el-input--mini .el-input__icon {
    line-height: 24px !important;
}
/* change dropdown icon style */
.el-select .el-input .el-select__caret {
    color: #6e6e6e !important;
    /* font-size: 14px; */
    font-weight: bold !important;
}
/* change border color of dropdown */
.el-select .el-input.is-focus .el-input__inner {
    border:none !important;
}
.el-input__inner {
    border:none !important;
    width: 200px !important;

}
#wider-dropdown{
    width:240px !important;
}
/* #last-dropdown{
    margin-bottom:8px !important;
} */
/* .el-select:hover .el-input__inner {
    border:none !important;
} */
/* .el-select{
    height: 24px;
} */
.info-icon{
    float:right;
    height:12px;
    margin-left:8px; 
    margin-top:2px;
    opacity: 0.7;
    /* vertical-align:middle; */

}
/* vertical align the h5 and the info-icon */
.ver-align{
     display: flex;
   align-items:center;

}
/* tooltip for info-icon */
.tooltip {
  position: relative;
  display: inline-block;
  /* border-bottom: 1px dotted black; */
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  /* text-align: center; */
  border-radius: 6px;
  padding: 6px 8px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 140%;
}

.tooltiptext {
    text-align: left;
    font-family:'Roboto',sans-serif;
    font-size: 10px;

    
}

.tooltip .tooltiptext::after {
  content: "";
    position: absolute;
    top: 14px;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #000 transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>