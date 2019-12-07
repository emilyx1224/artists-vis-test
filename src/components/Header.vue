<template>
    <el-row :gutter="0"> 
        <el-col :span="16">
            <p class="title">Paintings ({{amount_of_painting}})</p>
        </el-col>
        <!-- <el-col :span="4" v-show="view === 'artist-view' || view === 'color-view'">
            <el-row>
                <h5 class="sort-title"> BACKGROUND COLOR </h5>
            </el-row>
            <el-row  :gutter="0"> 
                <el-col :span="3">
                    <p class="slider-mark white">white</p>
                </el-col>
                <el-col :span="13">
                    <el-slider
                        v-model="bg_color"
                        @change="bgColorChange">
                    </el-slider>
                </el-col>
                <el-col :span="3">
                    <p class="slider-mark white">black</p>
                </el-col>
            </el-row>
        </el-col> -->

        <el-col :span="4" v-show="view === 'artist-view'" class="" >
            <el-row :gutter="0">
                <h5 class="sort-title"> SORT COLOR </h5>
            </el-row>
            <el-row :gutter="0">
                <el-select size="mini" v-model="sort_color" placeholder="Select" @change="sortColorChange" id="header-dropdown1">
                    <el-option
                    v-for="item in sort_color_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
        </el-col>

        <el-col :span="6" v-show="view === 'color-view'">
            <el-row :gutter="0">
                <h5 class="sort-title"> SORT COLOR </h5>
            </el-row>
            <el-row>
                <el-select size="mini" v-model="sort_color" placeholder="Select" @change="sortColorChange" id="header-dropdown2">
                    <el-option
                    v-for="item in sort_color_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
        </el-col>

        <el-col :span="4" v-show="view === 'artist-view'">
            <el-row>
                <h5 class="sort-title"> SORT ARTIST </h5>
            </el-row>
            <el-row>
                <el-select size="mini" v-model="sort_artist" placeholder="Select" @change="sortArtistChange" id="header-dropdown3">
                    <el-option
                    v-for="item in sort_artist_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import eventHub from '@/eventHub'

export default {
    data() {
        return {
            view: '',
            amount_of_painting: 0,
            bg_color: 0,
            sort_color: 'HEX',
            sort_color_options: [{
                    value: 'HEX',
                    label: 'HEX'
                    }, {
                    value: 'HSV',
                    label: 'HSV'
                    }, {
                    value: 'RGB',
                    label: 'RGB'
                    }, {
                    value: 'Year',
                    label: 'Year'
                }],
            sort_artist: 'Name',
            sort_artist_options: [{
                value: 'Name',
                label: 'Name'
                }, {
                value: 'Painting Amount',
                label: 'Painting Amount'
                }, {
                value: 'Year Born',
                label: 'Year Born'
                }, {
                value: 'Genre',
                label: 'Genre'
                }, {
                value: 'Country',
                label: 'Country'
                }]
        }
    },
    mounted() {
        var self = this;
        eventHub.$on('picAmountChanged', (amount) => {
            self.amount_of_painting = amount;
        }),
        eventHub.$on('viewChanged', (view) => {
            self.view = view;
            // console.log(self.view);
        })
    },
    methods: {
        bgColorChange() {
            console.log(this.bg_color);
            eventHub.$emit('bgColorChanged', this.bg_color);
        },
        sortColorChange() {
            console.log(this.sort_color);
            eventHub.$emit('sortColorChanged', this.sort_color);
        },
        sortArtistChange() {
            console.log(this.sort_artist);
            eventHub.$emit('sortArtistChanged', this.sort_artist);
        }
    }
}
</script>

<style>
.title{
color: white;
text-align: left;
margin-left: 36px;
}
#header-dropdown1{
    width: 160px !important;
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    
}

#header-dropdown2{
    width: 160px !important;
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    
}
.sort-title{
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    color: #d9d9d9;
}

#header-dropdown3{
    width: 160px !important;
    font-family: 'Roboto', sans-serif;
    font-size: 10px;    
    
}
.el-slider__runway #header-slider{
    width: 120px !important;
    font-family: 'Roboto', sans-serif;
}

</style>