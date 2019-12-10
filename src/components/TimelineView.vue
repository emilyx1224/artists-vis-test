<template>
    <div id="timeline">
        <div id="myModal" class="modal">
			<div class="modal-content">
			</div>
		</div>
        <svg class="timeline-svg">
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
            artists_list: ['All'],
            paintingYear: [],
            genre: '',
            country: '',
            colorAmount: [],
            intensity: [],
            colorTheory: '',
            artist_info: [],
            partialData: [],
            showinghslData: []
        }
    },
    mounted() {
        this.fetchData();

        var self = this;
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
        eventHub.$emit('viewChanged', 'timeline-view');
	},
    methods: {
        async fetchData() {
            let data = await d3.csv('pics_info_final.csv');
            let artist_data = await d3.csv('artists_info_final.csv');
            this.showingData = data.filter(d => !isNaN(parseInt(d['year_of_pic'])));
            let hsldata = await d3.csv('color_info_kmeans_final_hsv_360.csv');
			this.allData = data;
            this.artist_info = artist_data;
            this.showinghslData = hsldata;
            // console.log(this.showingData);
            this.renderChart();
        },
        renderChart() {
            const svgWidth = 1000;
            const svgHeight = 750;
            const margin = {
                top: 20,
                right: 30,
                bottom: 30,
                left: 50
            };
            const timeBarHeight = 20;
            this.width = svgWidth - margin.left - margin.right;
            this.height = svgHeight - margin.top - margin.bottom - timeBarHeight;
            const timeBarWidth = 420;
            const padding_top = 40;
            const padding_left = 280;
            this.rect_height = 4;
            this.rect_width = 4;
            const margin_padding_top_1 = -70;
            const margin_padding_top_2 = -60;

            this.svg = d3.select('.timeline-svg')
                .attr('height', svgHeight)
                .attr('width', svgWidth);

            this.chartG = this.svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top + margin_padding_top_1) + ')');

            var timeBar = this.svg.append('g')
                .attr('width', timeBarWidth)
                .attr('height', timeBarHeight)
                .attr('transform', 'translate(' + (margin.left + padding_left) + ',' + (margin.top + this.height + padding_top + margin_padding_top_2) + ')');

            var minYear = d3.min(this.showingData, function(d) {
                return Number(d.year_of_pic)
            });
            var maxYear = d3.max(this.showingData, function(d) {
                return Number(d.year_of_pic)
            });

            this.timeScale = d3.scaleLinear().domain([minYear, maxYear]).range([0, timeBarWidth]);
             this.timeAxis = d3.axisTop(this.timeScale).tickFormat(d3.format("d"));

            this.xScale = d3.scaleLinear().domain([1267,1987]).range([0, this.width]);
            this.yScale = d3.scaleLinear().domain([140, 0]).range([0, this.height]);

            timeBar.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + 20 + ')')
                .call(this.timeAxis)
                .style('color','#fff')
                .style('opacity','0.7')
                .call(g => g.select(".domain").remove());

            timeBar.append('rect')
                .attr('width', timeBarWidth)
                .attr('height', timeBarHeight)
                .attr('x', 0)
                .attr('y', margin.top)
                .style('fill', '#ffffff')
                .style('opacity','0.8');

            var brush = d3.brushX()
                .extent([[0, 0], [timeBarWidth, timeBarHeight]])
                .on("start brush end", this.brushed);

            var gBrush = timeBar.append('g')
                .attr('transform', 'translate(0,' + margin.top + ')')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, this.timeScale.range());

            gBrush.selectAll('.handle')
                .attr('height', 26)
                .attr('width', 6)
                .style('fill', '#ffffff');
       
            gBrush.selectAll('.selection')
                .style('fill','#fc766a')
                .style('fill-opacity','1')
                .style('stroke','#fc766a');

            // console.log(gBrush.selectAll('.handle'));

            this.xAxis = this.chartG.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + this.height + ')')
                .style('color', '#fff')
                .style('opacity','0.7');

            this.chartG.append('g')
                .attr('class', 'gridline')
                .call(this.make_y_gridlines()
                    .tickSize(this.width))
                .call(g => g.select(".domain").remove())
                .style('color','#fff')
                .style('opacity','0.2');

            this.chartG.append('text')
                .attr('class', 'x label')
                .attr('transform', 'translate(-35,' + (this.height + 5) + ')')
                .text('Year')
                .style('fill', '#fff')
                .style('font-size', "12px");

            this.chartG.append('text')
                .attr('class', 'y label')
                .attr('transform', 'translate(' + (this.width - 35) + ',' + 60 + ')')
                .text('Painting')
                .style('fill', '#fff')
                .style('font-size', "12px");

            this.chartG.append('text')
                .attr('class', 'y label')
                .attr('transform', 'translate(' + (this.width - 35) + ',' + 72 + ')')
                .text('Amount')
                .style('fill', '#fff')
                .style('font-size', "12px");

            timeBar.append('text')
                .attr('class', 'scroll-tip')
                .attr('transform', 'translate(' + 60 + ',' + 60 + ')')
                .text('You can drag handles and the bar to adjust the view')
                .style('fill', '#fff')
                .style('font-size', "12px");

            var yArray = [];
            var yCnt = [];

            for (var i = minYear; i <= maxYear; i++) {
                yArray.push(0);
                yCnt.push(0);
            }

            var self = this;

            this.showingData.forEach(function(d) {
                d.y = yArray[Number(d.year_of_pic) - minYear] * self.rect_height + yCnt[Number(d.year_of_pic) - minYear];
                yArray[Number(d.year_of_pic) - minYear] += 1;
                yCnt[Number(d.year_of_pic) - minYear] += 1;
            });

            var line_length = 16;
            var line_color = 'white'

            for (i = 0; i < this.artist_info.length; i++) {
                var artist = this.artist_info[i];
                var name = artist['name'].split(' ').join('-');
                var year_of_birth = artist['year_of_birth'];
                var year_of_death = artist['year_of_death'];
                // console.log(name, year_of_birth, year_of_death);

                var g = this.chartG.append('g')
                    .attr('class', 'g-bd-' + name)
                    .attr('transform', 'translate(0,' + this.height + ')');

                var x1 = this.xScale(year_of_birth);
                var x2 = this.xScale(year_of_death);
                // console.log(x1, x2);
                g.append('line')
                    .attr('class', 'line-b-' + name)
                    .attr('x1', x1)
                    .attr('y1', 0)
                    .attr('x2', x1)
                    .attr('y2', line_length)
                    .style('stroke', line_color)
                    .attr('transform', 'translate(' + 0 + ',0)')
                    .style('opacity', 0);

                g.append('circle')
                    .attr('class', 'circle-b-' + name)
                    .attr('r', 5)
                    .attr('cx', x1)
                    .attr('cy', line_length)
                    .style('fill', line_color)
                    .style('opacity', 0);

                g.append('text')
                    .attr('class', 'text-b-' + name)
                    .attr('x', x1 - 12)
                    .attr('y', line_length + 15)
                    .text('b.' + year_of_birth)
                    .attr('font-size', '8px')
                    .style('fill', line_color)
                    .style('opacity', 0);


                g.append('line')
                    .attr('class', 'line-d-' + name)
                    .attr('x1', x2)
                    .attr('y1', 0)
                    .attr('x2', x2)
                    .attr('y2', line_length)
                    .style('stroke', line_color)
                    .attr('transform', 'translate(' + 0 + ',0)')
                    .style('opacity', 0);

                g.append('circle')
                    .attr('class', 'circle-d-' + name)
                    .attr('r', 5)
                    .attr('cx', x2)
                    .attr('cy', line_length)
                    .style('fill', line_color)
                    .style('opacity', 0);

                g.append('text')
                    .attr('class', 'text-d-' + name)
                    .attr('x', x2 - 12)
                    .attr('y', line_length + 15)
                    .text('d.' + year_of_death)
                    .attr('font-size', '8px')
                    .style('fill', line_color)
                    .style('opacity', 0);

            }

            this.updateChartByYear(minYear, maxYear);
        },

        updateChartByYear(arg_minYear, arg_maxYear) {
            var modal = document.getElementById("myModal");
			// var content = document.getElementsByClassName("modal-content");
			var selected = [];
				
			d3.select(".modal-content").append("svg")
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
            
            var filteredData = this.showingData.filter(d => !isNaN(parseInt(d['year_of_pic'])) && Number(d['year_of_pic']) >= arg_minYear && Number(d['year_of_pic']) <= arg_maxYear);

            this.xScale.domain([arg_minYear, arg_maxYear]);

            var pics_remove = this.chartG.selectAll('rect')
                .data([]);
            pics_remove.exit().remove();
            var pics = this.chartG.selectAll('rect')
                .data(filteredData, function(d) {
                    return d.filename;
                });
            pics.exit().remove();

            var self = this;
            var picsEnter = pics.enter()
                .append('rect')
                .attr('class', 'pics')
                .attr('x', function(d) {
                    return self.xScale(Number(d.year_of_pic));
                })
                .attr('y', function(d) {
                    return self.height - 5 - d.y;
                })
                .attr('width', this.rect_width)
                .attr('height', this.rect_height)
                .style('fill', function(d) {
                    var color1 = d['color1'].split(':')[0];
                    // console.log(color1);
                    return color1;
                })
                .on("click", handleClick);

            picsEnter.style("cursor", "pointer")
                .on('mouseover', function(d) {
                    var hovered = d3.select(this);
                    hovered.attr('width', 6)
                        .attr('height', 6);
                    if (hovered.style('fill-opacity') == 1) {
                        eventHub.$emit('previewPic', d);
                    }
                })
                .on('mouseout', function() {
                    var hovered = d3.select(this);
                    hovered.attr('width', self.rect_width)
                        .attr('height', self.rect_height);
                });


            pics.merge(picsEnter)
                .transition()
                .duration(0);

            this.xAxis.call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));

            eventHub.$emit('picAmountChanged', filteredData.length);
        },
        brushed() {
            if (!d3.event.sourceEvent) return; // ignore brush-by-zoom
            if (!d3.event.selection) return; // Ignore empty selections.
            var s = d3.event.selection || this.timeScale.range();
            var newScale = s.map(this.timeScale.invert, this.timeScale);
            this.updateChartByYear(newScale[0], newScale[1]);
        },
        make_y_gridlines() {
            return d3.axisRight(this.yScale);
        },

        clearBDInfo() {
            for (var i = 0; i < this.artist_info.length; i++) {
                var artist = this.artist_info[i];
                var name = artist['name'].split(' ').join('-');
                this.chartG.select('.circle-b-' + name)
                    .style('opacity', 0);

                this.chartG.select('.line-b-' + name)
                    .style('opacity', 0);
                
                this.chartG.select('.text-b-' + name)
                    .style('opacity', 0);

                this.chartG.select('.circle-d-' + name)
                    .style('opacity', 0);

                this.chartG.select('.line-d-' + name)
                    .style('opacity', 0);
                
                this.chartG.select('.text-d-' + name)
                    .style('opacity', 0);
            }
        },

        updateChartByFilter() {
            // var minYear = d3.min(this.showingData, function(d) {
            //     return Number(d.year_of_pic)
            // });
            // var maxYear = d3.max(this.showingData, function(d) {
            //     return Number(d.year_of_pic)
            // });
            this.clearBDInfo();
            var minYear = 1267;
            var maxYear = 1987;
            this.updateChartByYear(minYear, maxYear);
            this.chartG.selectAll('rect').style('fill-opacity', 0.05).style('pointer-events', 'none');

            var self = this;

            var filteredData = [];
            if (this.artists_list.length == 1 && this.artists_list[0] == 'All') {
                filteredData = this.showingData;
            } else {
                filteredData = this.showingData.filter(d => self.artists_list.includes(d['artist_name']));

                if (this.artists_list.length == 1) {
                    var name = self.artists_list[0].split(' ').join('-');
                    // console.log('circle-b-' + name);
                    
                    this.chartG.select('.circle-b-' + name)
                        .style('opacity', 1);

                    this.chartG.select('.line-b-' + name)
                        .style('opacity', 1);
                    
                    this.chartG.select('.text-b-' + name)
                        .style('opacity', 1);

                    this.chartG.select('.circle-d-' + name)
                        .style('opacity', 1);

                    this.chartG.select('.line-d-' + name)
                        .style('opacity', 1);
                    
                    this.chartG.select('.text-d-' + name)
                        .style('opacity', 1);
                }
            }

            if (this.paintingYear.length != 0) {
                filteredData = filteredData.filter(d => d['year_of_pic'] >= Number(self.paintingYear[0]) && d['year_of_pic'] <= Number(self.paintingYear[1]));
            }

            if (this.genre != '') {
                filteredData = filteredData.filter(d => d['genre'].split(',').includes(self.genre));
            }

            if (this.country != '') {
                filteredData = filteredData.filter(d => d['nationality'] == self.country);
            }

            if (this.colorAmount.length != 0) {
                filteredData = filteredData.filter(d => d['amount_of_main_color'] >= Number(self.colorAmount[0]) && d['amount_of_main_color'] <= Number(self.colorAmount[1]));
            }

            if (this.intensity.length != 0) {
                filteredData = filteredData.filter(d => d['color_intensity'] * 100 >= Number(self.intensity[0]) && d['color_intensity'] * 100 <= Number(self.intensity[1]));
            }

            if (this.colorTheory != '') {
                filteredData = filteredData.filter(d => d['color_theory_tag'].split(',').includes(self.colorTheory));
            }

            var pics = this.chartG.selectAll('rect')
                .data(filteredData, function(d) {
                    return d.filename;
                });
            pics.style('fill-opacity', 1).style('pointer-events', 'auto');

            eventHub.$emit('picAmountChanged', filteredData.length);
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
			var allData = this.showinghslData;
			var pData = this.allData;
			var artist_info = this.artist_info;
			var modal = document.getElementById("myModal");
			var content = document.getElementsByClassName("modal-content");
			var percent = 0;

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
				.style("font", "14px roboto slab")
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
			
			var h = 170;
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
			var obj = artist_info.find(o => o.id === selected.id);
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
					.call(d3.axisBottom(x))
					.style("line-stroke","white");

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
</style>
