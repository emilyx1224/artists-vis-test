<template>
    <div id="colorview">
		<div id="myModal" class="modal">
			<div class="modal-content">
			</div>
		</div>
        <svg id="colorsvg">
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import eventHub from '@/eventHub'

export default {
    data() {
        return {
            showingData: [],
			sortColor:  'HEX',
			artists_list: ['All'],
            paintingYear: [],
            genre: '',
            country: '',
            colorAmount: [],
            intensity: [],
            colorTheory: '',
            artist_info: [],
            partialData: [],
			hexcolor: [],
			hslcolor: [],
			rgbcolor: [],
			yearcolor: []
        }
    },
    mounted() {
        console.log('App loaded');
        this.fetchData();
		var self = this;
		eventHub.$on('sortColorChanged', (sort_color) => {
            self.sortColor = sort_color;
            this.renderChart();
        }),
		eventHub.$on('artistChanged', (artist_value) => {
            if (artist_value.length != 0) {
                self.artists_list = artist_value;
            } else {
                self.artists_list = [];
            }
            this.updateChartByFilter();
        }),
        eventHub.$on('genreChanged', (genre_value) => {
            self.genre = genre_value;
            this.updateChartByFilter();
        }),
        eventHub.$on('colorAmountChanged', (colorAmount) => {
            self.colorAmount = colorAmount;
            this.updateChartByFilter();
        }),
        eventHub.$on('paintingYearChanged', (paintingYear) => {
            self.paintingYear = paintingYear;
            this.updateChartByFilter();
        }),
        eventHub.$on('countryChanged', (country) => {
            self.country = country;
            this.updateChartByFilter();
        }),
        eventHub.$on('intensityChanged', (intensity) => {
            self.intensity = intensity;
            this.updateChartByFilter();
        }),
        eventHub.$on('colorTheoryChanged', (colorTheory) => {
            self.colorTheory = colorTheory;
            this.updateChartByFilter();
        }),
		eventHub.$on('reset', (retValue) => {
            self.artists_list = retValue['artist'];
            self.genre = retValue['genre'];
            self.colorTheory = retValue['theory'];
            self.intensity = retValue['intensity'];
            self.country = retValue['country'];
            self.paintingYear = retValue['year'];
            self.colorAmount = retValue['amount'];
            this.updateChartByFilter();
        })
	},
	created() {
		eventHub.$emit('viewChanged', 'color-view');
	},
    methods: {
        async fetchData() {
            let data = await d3.csv('pics_info_final.csv');
			let artistdata = await d3.csv('artists_info_final.csv');
			let hsldata = await d3.csv('color_info_kmeans_final_hsv_360.csv');
            this.showingData = data;
			this.showinghslData = hsldata;
			this.artistData = artistdata;
            
			function hexToRgb(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.slice(0, 7));
				return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
				} : null;
			}
			function hexToHSL(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.slice(0, 7));
				var r = parseInt(result[1], 16);
				var g = parseInt(result[2], 16);
				var b = parseInt(result[3], 16);
				r /= 255, g /= 255, b /= 255;
				var max = Math.max(r, g, b), min = Math.min(r, g, b);
				var h, s, l = (max + min) / 2;
				if(max == min){
				  h = s = 0; // achromatic
				}else{
				  var d = max - min;
				  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				  switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				  }
				  h /= 6;
				}
				var HSL = h.toString() + s.toString() + l.toString();
				return HSL;
			}
			function compare_lum(a, b) {
				var rgba = hexToRgb(a.color1);
				var rgbb = hexToRgb(b.color1);
				var aval = 0.241 * rgba.r + 0.691 * rgba.g + .068 * rgba.b;
				var bval = 0.241 * rgbb.r + 0.691 * rgbb.g + .068 * rgbb.b;
				if ( aval < bval ){
					return 1;
				}
				if ( aval > bval ){
					return -1;
				}
				return 0;
			}
			function compare_hsl(a, b) {
				var hsla = hexToHSL(a.color1);
				var hslb = hexToHSL(b.color1);
				if ( hsla < hslb ){
					return 1;
				}
				if ( hsla > hslb ){
					return -1;
				}
				return 0;
			}
			
			var self = this;
			var hexc = this.showingData;
			hexc.sort(function(x, y){
				return d3.descending(x.color1, y.color1);
			});
			this.hexcolor = hexc;
			
			let hslc = await d3.csv('pics_info_final.csv');
			hslc.sort(compare_lum);
			this.hslcolor = hslc;
			
			let rgbc = await d3.csv('pics_info_final.csv');
			rgbc.sort(compare_hsl);
			this.rgbcolor = rgbc;
			
			let yearc = await d3.csv('pics_info_final.csv');
			yearc.sort(function(x, y){
				return d3.descending(x.year_of_birth, y.year_of_birth);
			});
			this.yearcolor = yearc;

            this.renderChart();
        },
        renderChart() {
            const svgWidth = 1200;
            const svgHeight = 728;

            const size = 5;
			const blocksizehor = 10;
			const blocksizever = 11;
			const border = 2;
			const leftpadding = 50;
			const toppadding = 60;
			const wsize = 88;
			var colors = this.showingData;
			var self = this;
			if(self.sortColor == "HEX"){
				console.log('hex');
				colors = this.hexcolor;
			} else if(self.sortColor == "HSV"){
				console.log('hsl');	
				colors = this.hslcolor;
			} else if(self.sortColor == "RGB"){
				console.log('rgb');
				colors = this.rgbcolor;
			} else if(self.sortColor == "Year"){
				console.log('year');
				colors = this.yearcolor;
			}

            this.svg = d3.select('#colorsvg')
                .attr('height', svgHeight)
                .attr('width', svgWidth);
				
			this.svg.selectAll("rect").remove();

			var rects = this.svg.selectAll('rect')
				.data(colors)

			var rectsEnter = rects.enter()
				.append('g')
				.attr('class', 'rect')
				.on("click", handleClick)
				.style("cursor", "pointer")
				.on('mouseover', function(d){ 
					var hovered = d3.select(this);
					hovered.select("rect.one")
						.attr("width", 6)
						.attr("height", 6)
						.attr('x', -1)
						.attr('y', -1)
					hovered.select("rect.two")
						.attr("width", 6)
						.attr("height", 6)
						.attr('x', 5)
						.attr('y', -1)
					hovered.select("rect.three")
						.attr("width", 6)
						.attr("height", 6)
						.attr('x', -1)
						.attr('y', 5)
					hovered.select("rect.four")
						.attr("width", 6)
						.attr("height", 6)
						.attr('x', 5)
						.attr('y', 5)
					if (hovered.style('fill-opacity') == 1) {
                        eventHub.$emit('previewPic', d);
                    }
				})
				.on('mouseout', function(d){
					var hovered = d3.select(this);
					hovered.select("rect.one")
						.attr("width", 5)
						.attr("height", 5)
						.attr('x', 0)
						.attr('y', 0)
					hovered.select("rect.two")
						.attr("width", 5)
						.attr("height", 5)
						.attr('x', 5)
						.attr('y', 0)
					hovered.select("rect.three")
						.attr("width", 5)
						.attr("height", 5)
						.attr('x', 0)
						.attr('y', 5)
					hovered.select("rect.four")
						.attr("width", 5)
						.attr("height", 5)
						.attr('x', 5)
						.attr('y', 5)
					// hovered.selectAll("rect.hover").remove();
					// hovered.selectAll('rect')
						// .style('width', 5)
						// .style('height', 5);
				})
				.attr('transform', function(d, i) {
					var tx = (i%wsize)*(size*2 + 2) + leftpadding;
					var ty = Math.floor(i/wsize)*(size*2 + 2) + toppadding;
					return 'translate('+[tx, ty]+')';
				});

			rectsEnter.append('text')
				.attr('y', -10)
				.style('visibility', 'hidden')
				.attr('fill', 'white')
				.style("font", "8px roboto")
				.text(function(d) {
					return d.filename;
				});
				
			rectsEnter.append("rect")
				.attr("class", "one")
				.attr("width", size)
				.attr("height", size)
				.attr('x', 0)
				.attr('y', 0)
				.attr('fill',  function(d) {return d['color1'].slice(0, 7);})
			rectsEnter.append("rect")
				.attr("class", "two")
				.attr("width", size)
				.attr("height", size)
				.attr('x', size)
				.attr('y', 0)
				.attr('fill',  function(d) {return d['color2'].slice(0, 7);})
			rectsEnter.append("rect")
				.attr("class", "three")
				.attr("width", size)
				.attr("height", size)
				.attr('x', 0)
				.attr('y', size)
				.attr('fill',  function(d) {return d['color3'].slice(0, 7);})
			rectsEnter.append("rect")
				.attr("class", "four")
				.attr("width", size)
				.attr("height", size)
				.attr('x', size)
				.attr('y', size)
				.attr('fill',  function(d) {return d['color4'].slice(0, 7);})

			rects.merge(rectsEnter)
				.transition()
				.duration(500)
				//.attr('transform', function(d, i) {
					//var tx = (i%wsize)*(size*2 + 2) + leftpadding;
					//var ty = Math.floor(i/wsize)*(size*2 + 2) + toppadding;
					//return 'translate('+[tx, ty]+')';
				//});

			var modal = document.getElementById("myModal");
			var content = document.getElementsByClassName("modal-content");
			var selected = [];
				
			var detailsvg = d3.select(".modal-content").append("svg")
				.attr("id", "detailsvg")
				.attr('width', '100%')
				.attr('height', '100%');
				
			d3.selection.prototype.moveToFront = function() {
			  return this.each(function(){
			  this.parentNode.appendChild(this);
			  });
			};

			window.onclick = function(event) {
			  if (event.target == modal) {
				// modal.style.paddingTop = "0px";
				modal.style.display = "none";
			  }
			}
			var curr = this;
			function handleClick(d,i) {
				modal.style.display = "block";
				selected = d;
				curr.renderDetail(selected);
			}
			eventHub.$emit('picAmountChanged', this.showingData.length);
		},
		wrap(text, width) {
			text.each(function() {
				var text = d3.select(this),
					words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.1, // ems
					y = text.attr("y"),
					dy = parseFloat(text.attr("dy"));
					var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
				while (word = words.pop()) {
				  line.push(word);
				  tspan.text(line.join(" "));
				  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					++lineNumber;
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
				  }
				}
			});
		},
		renderDetail(selected) {
			var detailsvg = d3.select("#detailsvg");
			var wid = parseFloat(detailsvg.style("width").slice(0, -2));
			var hei = parseFloat(detailsvg.style("height").slice(0, -2));
			var pData = this.showingData;
			var allData = this.showinghslData;
			var artistData = this.artistData;
			var modal = document.getElementById("myModal");
			var content = document.getElementsByClassName("modal-content");
			var percent = 0;
			// console.log('selected');
			// console.log(selected);
			var prev = 0;
			for (var i = 1; i < 11; i++) {
				var str = selected['color'+i.toString()];
				var percent = parseFloat(str.split(":")[1]);
				var per = percent*100;
				const ind = i;
				var widthper = Math.ceil(wid*percent);
				var rectx = prev;
				if(i > 4){
					rectx = rectx - 150;
				}
				detailsvg.append("rect")
					.attr("width", widthper+1)
					.attr("height", hei)
					.attr('x', prev)
					.attr('y', 0)
					.attr('fill', str.slice(0, 7))
					.on('mouseover', function(d){
						console.log("#t".concat(ind.toString()));
						d3.selectAll("#t".concat(ind.toString())).style("opacity",1);
					})
					.on('mouseout', function(d){
						d3.selectAll("#t".concat(ind.toString())).style("opacity",0);
					});
				detailsvg.append("rect")
					.attr("id", "t".concat(ind.toString()))
					.attr("width", 140)
					.attr("height", 30)
					.attr('x', rectx+20)
					.attr('y', 700)
					.attr('fill', '#2e2e2e')
					.attr("rx",2)
					.attr("ry",2)
					.style("opacity", 0);
				detailsvg.append("text")
					.attr("id", "t".concat(ind.toString()))
					.attr('x', rectx+24)
					.attr('y', 720)
					.attr('fill', 'white')
					.style("font", "18px roboto")
					.style("opacity", 0)
					.text(str.split(":")[0].concat(" | ", per.toString().slice(0,4),"%"));
				prev = prev + widthper;
			}
			detailsvg.append("rect")
				.attr("width", 38)
				.attr("height", 38)
				.attr('transform', 'translate('+[1320, 30]+')')
				.attr('fill', "rgba(255, 255, 255, 0.2)");
			detailsvg.append("svg:image")
				.attr('id','close')
				.attr('transform', 'translate('+[1325, 35]+')')
				.attr('fill', 'white')
				.attr("width", "28px")
				.attr("height", "28px")
					// .style('width', "28px")
					// .style('height', "28px")
				.style("font", "20px roboto")
				.style("cursor", "pointer")
				.on("click", function() {
					modal.style.display = "none";
					// modal.style.paddingTop = "50px";
					detailsvg.selectAll("*").remove();})
				.attr("xlink:href", "close.png");
			detailsvg.append("rect")
				.attr("width", 820)
				.attr("height", 660)
				.attr('x', 114)
				.attr('y', 30)
				.attr('fill', "rgba(74, 74, 74, 0.1)");
			detailsvg.append("rect")
				.attr("width", 360)
				.attr("height", 400)
				.attr('x', 934)
				.attr('y', 30)
				.attr('fill', "rgba(74, 74, 74, 0.8)");
			var barg = detailsvg.append("g")
				.attr("id", "bar")
				.attr('x', 934)
				.attr('y', 430);
			barg.append("rect")					
				.attr("width", 360)
				.attr("height", 260)
				.attr('x', 934)
				.attr('y', 430)
				.attr('fill', "rgba(0, 0, 0, 0.7)");
			//console.log(selected);
			var paintingimage = detailsvg.append('image')
				.attr('xlink:href', 'sampled_images/'.concat(selected.artist_name.split(' ').join('_'),'/',selected.filename))
				.attr('width', 820)
				.attr('height', 660)
				.attr('x', 114)
				.attr('y', 30)
			detailsvg.append("text")
				.attr('transform', 'translate('+[960, 70]+')')
				.attr('fill', 'white')
				.attr('dy', '0')
				.style("font", "18px roboto slab")
				.style("font-weight","bold")
				.text(selected.name_of_pic)
				.call(this.wrap, 320);
			detailsvg.append("text")
				.attr('transform', 'translate('+[960, 110]+')')
				.attr('fill', 'white')
				.style("font", "14px roboto")
				.text(selected.artist_name.concat(', ',selected.year_of_pic));
			
			// thumbmail
			detailsvg.append("text")
				.attr('transform', 'translate('+[960, 154]+')')
				.attr('fill', 'white')
				.style("font", "14px Roboto Slab")
				.style("font-weight","bold")
				.text('Paintings with Similar Main Color');
			var piclst = selected.similar_pics.split(',');
			var picone = piclst[0].split('_');
			var pictwo = piclst[1].split('_');
			var picthree = piclst[2].split('_');
			var objone = pData.find(o => o.filename === piclst[0]);
			var objtwo = pData.find(o => o.filename === piclst[1]);
			var objthree = pData.find(o => o.filename === piclst[2]);
			picone.pop();
			pictwo.pop();
			picthree.pop();
			var nameone = picone.join('_');
			var nametwo = pictwo.join('_');
			var namethree = picthree.join('_');
			
			detailsvg.append("rect")
				.attr("width", 100)
				.attr("height", 100)
				.attr('transform', 'translate('+[955, 165]+')')
				.attr('fill', 'rgba(0, 0, 0, 0.7)')
			detailsvg.append("rect")
				.attr("width", 100)
				.attr("height", 100)
				.attr('transform', 'translate('+[1065, 165]+')')
				.attr('fill', 'rgba(0, 0, 0, 0.7)')
			detailsvg.append("rect")
				.attr("width", 100)
				.attr("height", 100)
				.attr('transform', 'translate('+[1175, 165]+')')
				.attr('fill', 'rgba(0, 0, 0, 0.7)')
			var artistimage = detailsvg.append('image')
				.attr('xlink:href', 'sampled_images/'.concat(nameone,'/',piclst[0]))
				.attr('id', 'picone')
				.attr('width', 100)
				.attr('height', 100)
				.attr('x', 955)
				.attr('y', 165)
				.on('mouseover', function(d){
					d3.select("#picone").style("opacity",0);
					d3.select("#txtone").style("opacity",1);
				})
				.on('mouseout', function(d){
					d3.select("#picone").style("opacity",1);
					d3.select("#txtone").style("opacity",0);
				});
			detailsvg.append("text")
				.attr('transform', 'translate('+[960, 180]+')')
				.attr('id', 'txtone')
				.attr('fill', 'white')
				.attr('dy', '0')
				.style("font", "10px roboto")
				.style('opacity', 0)
				.text(objone.name_of_pic)
				.call(this.wrap, 92);
			var artistimage = detailsvg.append('image')
				.attr('xlink:href', 'sampled_images/'.concat(nametwo,'/',piclst[1]))
				.attr('id', 'pictwo')
				.attr('width', 100)
				.attr('height', 100)
				.attr('x', 1065)
				.attr('y', 165)
				.on('mouseover', function(d){
					d3.select("#pictwo").style("opacity",0);
					d3.select("#txttwo").style("opacity",1);
				})
				.on('mouseout', function(d){
					d3.select("#pictwo").style("opacity",1);
					d3.select("#txttwo").style("opacity",0);
				});
			detailsvg.append("text")
				.attr('id', 'txttwo')
				.attr('transform', 'translate('+[1070, 180]+')')
				.attr('fill', 'white')
				.attr('dy', '0')
				.style("font", "10px roboto")
				.style('opacity', 0)
				.text(objtwo.name_of_pic)
				.call(this.wrap, 92);
			var artistimage = detailsvg.append('image')
				.attr('id', 'picthree')
				.attr('xlink:href', 'sampled_images/'.concat(namethree,'/',piclst[2]))
				.attr('width', 100)
				.attr('height', 100)
				.attr('x', 1175)
				.attr('y', 165)
				.on('mouseover', function(d){
					d3.select("#picthree").style("opacity",0);
					d3.select("#txtthree").style("opacity",1);
				})
				.on('mouseout', function(d){
					d3.select("#picthree").style("opacity",1);
					d3.select("#txtthree").style("opacity",0);
				});
			detailsvg.append("text")
				.attr('id', 'txtthree')
				.attr('transform', 'translate('+[1180, 180]+')')
				.attr('fill', 'white')
				.attr('dy', '0')
				.style("font", "10px roboto")
				.style('opacity', 0)
				.text(objthree.name_of_pic)
				.call(this.wrap, 92);				
				
			// Artist Info
			var h = 170;
			var artistimage = detailsvg.append('image')
				.attr('xlink:href', 'Artists_photo_square/'.concat(selected.id, '_',selected.artist_name.split(' ').join('_'),'.jpg'))
				.attr('width', 80)
				.attr('height', 80)
				.attr('x', 960)
				.attr('y', 304);
			detailsvg.append("text")
				.attr('transform', 'translate('+[1060, 320]+')')
				.attr('fill', 'white')
				.style("font", "18px roboto slab")
				.style("font-weight", "bold")
				.text(selected.artist_name);
			detailsvg.append("text")
				.attr('transform', 'translate('+[1060, 340]+')')
				.attr('fill', 'white')
				.style("font", "12px roboto")
				.text(selected.year_of_birth.concat(' ~ ',selected.year_of_death));
			detailsvg.append("text")
				.attr('transform', 'translate('+[1060, 360]+')')
				.attr('fill', 'white')
				.style("font", "12px roboto")
				.text(selected.nationality);
			var obj = artistData.find(o => o.id === selected.id);
			//console.log(obj);
			detailsvg.append("text")
				.attr('transform', 'translate('+[1060, 380]+')')
				.attr('fill', 'white')
				.style("font", "12px roboto")
				.text(obj.number_of_paintings.concat(' paintings'));
			detailsvg.append("text")
				.attr('transform', 'translate('+[1060, 400]+')')
				.attr('fill', 'white')
				.attr('dy', 0)
				.style("font", "12px roboto")
				.text(selected.genre.split(',').join(' '))
				.call(this.wrap, 120);
			// console.log('-------------');	
			// console.log(allData);
			var onedata = allData.filter(function(d){return d.id == selected.id;});
			// console.log(onedata);
			var harr = []
			var sarr = []
			var varr = []
			onedata.forEach(function(d) {
				for (var i = 1; i < 11; i++) {
					harr.push(d['color'+i.toString()+'-H']);
					sarr.push(d['color'+i.toString()+'-S']);
					varr.push(d['color'+i.toString()+'-V']);
				}
			});
			
			var barw = 250;
			var barh = 150;
			var bar = barg.append("svg")
				.append("g")
				.attr("transform",
				  "translate(" + 1000 + "," + 500 + ")");

			var x = d3.scaleLinear()
				.domain([0, 360])  
				.range([0, barw]);
			bar.append("g")
				.attr("id","x")
				.attr("class", "axiswhite")
				.attr("transform", "translate(0," + barh + ")")
				.call(d3.axisBottom(x));

			var histogram = d3.histogram()
				.value(function(d) { return d; })
				.domain(x.domain())
				.thresholds(x.ticks(40)); 
			var formatPercent = d3.format(".0%");
			var bins = histogram(harr);
			var y = d3.scaleLinear()
				.range([barh, 0])
				.domain([0, d3.max(bins, function(d) { return d.length; })]); 
			bar.append("g")
			  .attr("class", "axiswhite")
			  .call(d3.axisLeft(y));
			bar.append("text")  
			  .attr("class", "axis")				
			  .attr("transform",
					"translate(" + 120 + " ," + 180 + ")")
			  .style("text-anchor", "middle")
			  .style("fill", "white")
			  .style("font", "10px roboto")
			  .text("Hue");
			bar.append("text") 
			  .attr("class", "axis")     			
			  .attr("transform", "rotate(-90)")	
			  .attr("y", -30)
			  .attr("x", -70)
			  .style("text-anchor", "middle")
			  .style("fill", "white")
			  .style("font", "10px roboto")
			  .text("Frequency");
			bar.append("text")    			
			  .attr("transform",
					"translate(" + -20 + " ," + -40 + ")")
			  .style("fill", "white")
			  .style("font", "14px roboto slab")
			  .style("font-weight","bold")
			  .text(selected.artist_name.concat("'s Overall Color Usage"));
			bar.selectAll("rect")
			  .data(bins)
			  .enter()
			  .append("rect")
				.attr('class', 'bars')
				.attr("x", 1)
				.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
				.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
				.attr("height", function(d) { return barh - y(d.length); })
				.style("fill", "rgba(255,255,255,0.6)")
				
			var current = "Hue";
			bar.append('g')
				.style("cursor", "pointer")
				.append("text")
				.attr("id","hue")
				.attr('x', 0)
				.attr('y', -20)
				.text('Hue')
				.style("fill", "#fc766a")
				.style("font-size", 12)
				.style("text-decoration","underline")
				.on("click", function(d) { updateBar(harr, "Hue");});
			bar.append('g')
				.style("cursor", "pointer")
				.append("text")
				.attr("id","saturation")
				.attr('x', 50)
				.attr('y', -20)
				.text("Saturation")
				.style("fill", 'white')
				.style("font-size", 12)
				.style("text-decoration","underline")
				.on("click", function(d) { updateBar(sarr, "Saturation"); });
			bar.append('g')
				.style("cursor", "pointer")
				.append("text")
				.attr("id","value")
				.attr('x', 130)
				.attr('y', -20)
				.text('Value')
				.style("fill", 'white')
				.style("font-size", 12)
				.style("text-decoration","underline")
				.on("click", function(d) { updateBar(varr, "Value"); });
			bar.append("svg:image")
				.attr("class", "axis")
				.attr('xlink:href', 'hue-bar-256.png')
				.attr('transform', 'translate('+[1, 149]+')')
				// .style('width', 250)
				// .style('height', 20)
				.attr("width", "250px")
				.attr("height", "20px")
				.style("opacity", 0.6);
			d3.select("#x").style("display","none");
				
			function updateBar(data, select){
				console.log(select);
				bar.selectAll(".axis").remove();
				bar.selectAll(".axiswhite").remove();
				bar.selectAll(".bars").remove();
				var x = d3.scaleLinear();
				if (select == "Hue"){
					d3.select("#hue")
						.style("fill", "#fc766a");
					d3.select("#saturation")
						.style("fill", "white");
					d3.select("#value")
						.style("fill", "white");
					x.domain([0, 360]);
					x.range([0, barw]);
				}else if (select == "Saturation"){
					d3.select("#saturation")
						.style("fill", "#fc766a");
					d3.select("#hue")
						.style("fill", "white");
					d3.select("#value")
						.style("fill", "white");
					x.domain([0, 1]);
					x.range([0, barw]);
				}else if (select == "Value"){
					d3.select("#value")
						.style("fill", "#fc766a");
					d3.select("#saturation")
						.style("fill", "white");
					d3.select("#hue")
						.style("fill", "white");
					x.domain([0, 1]);
					x.range([0, barw]);
				}
				
				bar.append("g")
					.attr("id","x")
					.attr("class", "axiswhite")
					.attr("transform", "translate(0," + barh + ")")
					.call(d3.axisBottom(x));

				var histogram = d3.histogram()
					.value(function(d) { return d; })
					.domain(x.domain())
					.thresholds(x.ticks(40)); 
				var formatPercent = d3.format(".0%");
				var bins = histogram(data);
				var y = d3.scaleLinear()
					.range([barh, 0])
					.domain([0, d3.max(bins, function(d) { return d.length; })]); 
				bar.append("g")
				  .attr("class", "axiswhite")
				  .call(d3.axisLeft(y));
				bar.append("text") 
				  .attr("class", "axis") 					
				  .attr("transform",
						"translate(" + 120 + " ," + 180 + ")")
				  .style("text-anchor", "middle")
				  .style("fill", "white")
				  .style("font", "10px roboto")
				  .text(select);
				  
				if(select == "Hue"){
					bar.append("svg:image")
						.attr("class", "axis")
						.attr('xlink:href', 'hue-bar-256.png')
						.attr('transform', 'translate('+[1, 149]+')')
						.style('width', 250)
						.style('height', 20)
					d3.select("#x").style("display","none");
				}
				
				bar.append("text")  
				  .attr("class", "axis") 
				  .attr("transform", "rotate(-90)")	
				  .attr("y", -30)
				  .attr("x", -70)
				  .style("text-anchor", "middle")
				  .style("fill", "white")
				  .style("font", "10px roboto")
				  .text("Frequency");
				bar.selectAll("rect")
				  .data(bins)
				  .enter()
				  .append("rect")
					.attr("class", "bars") 
					.attr("x", 1)
					.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
					.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
					.attr("height", function(d) { return barh - y(d.length); })
					.style("fill", "rgba(255,255,255,0.6)")
				}
			},
			updateChartByFilter(){
				var self = this;
				var s = d3.select('#colorsvg');
				var year_values = [1260, 1990];
				s.selectAll('rect').style('fill-opacity', 0.05).style('pointer-events', 'none');

				var filteredData = [];
				if (this.artists_list.length == 1 && this.artists_list[0] == 'All') {
					filteredData = this.showingData;
				} else {
					filteredData = this.showingData.filter(d => self.artists_list.includes(d['artist_name']));
		
				}

				if (this.paintingYear.length != 0 && !(Number(this.paintingYear[0]) == year_values[0] && Number(this.paintingYear[1]) == year_values[1])) {
					console.log("year");
					filteredData = filteredData.filter(d => d['year_of_pic'] >= Number(self.paintingYear[0]) && d['year_of_pic'] <= Number(self.paintingYear[1]));
				}

				if (this.genre != '') {
					console.log("genre");
					filteredData = filteredData.filter(d => d['genre'].split(',').includes(self.genre));
				}

				if (this.country != '') {
					console.log("country");
					filteredData = filteredData.filter(d => d['nationality'] == self.country);
				}

				if (this.colorAmount.length != 0) {
					console.log("amount");
					filteredData = filteredData.filter(d => d['amount_of_main_color'] >= Number(self.colorAmount[0]) && d['amount_of_main_color'] <= Number(self.colorAmount[1]));
				}

				if (this.intensity.length != 0) {
					console.log("int");
					filteredData = filteredData.filter(d => d['color_intensity'] * 100 >= Number(self.intensity[0]) && d['color_intensity'] * 100 <= Number(self.intensity[1]));
				}

				if (this.colorTheory != '') {
					console.log("theory");
					filteredData = filteredData.filter(d => d['color_theory_tag'].split(',').includes(self.colorTheory));
				}

				var rectone = s.selectAll('.one')
					.data(filteredData, function(d) {
						return d.filename;
					});
				var recttwo = s.selectAll('.two')
					.data(filteredData, function(d) {
						return d.filename;
					});
				var rectthree = s.selectAll('.three')
					.data(filteredData, function(d) {
						return d.filename;
					});
				var rectfour = s.selectAll('.four')
					.data(filteredData, function(d) {
						return d.filename;
					});
				rectone.style('fill-opacity', 1).style('pointer-events', 'auto');
				recttwo.style('fill-opacity', 1).style('pointer-events', 'auto');
				rectthree.style('fill-opacity', 1).style('pointer-events', 'auto');
				rectfour.style('fill-opacity', 1).style('pointer-events', 'auto');
				
				eventHub.$emit('picAmountChanged', filteredData.length);
			}
        }

}
</script>

<style>
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 0px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: none;
  margin: auto;
  padding: 0px;
  width: 100%;
  height: 100%;
}

.axiswhite line{
  stroke: white;
}

.axiswhite path{
  stroke: white;
}

.axiswhite text{
  fill: white;
} 

</style>