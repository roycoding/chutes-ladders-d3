            //----------------
            // Todo:
            // * Refactor some repetitive code.
            // * More
            //-----------------------

            // Board parameters
            var w = 500;
            var h = w;
            var spacew = w/10;
            var spaceh = h/10;
            var pad = 1;
            var boardfontsize = 16;
            var chutecolor = "tomato";
            var laddercolor = "yellowgreen";

            // Functions to place data / labels / obstacles in correct position on C&L board.
            // The spaces wind up the board from lower left to upper left on 10x10 board.
            function spacex(d,i){
                        if(i % 20 < 10){
                            return (i*spacew % w) + pad;}
                        else {
                            return (w -spacew - (i*spacew % w)) + pad;}
                        }
            function spacey(d,i){return (h - spaceh - Math.floor(i/10)*spaceh) + pad;}


            //Data
            // Starting board of zeros
            var dataset0 = new Array(100)
            for (var j=0; j < 100; j++){dataset0[j] = 0.0}

            // Create SVG of board
            var board = d3.select("#board")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

            // Create spaces on board (rows, then spaces)
            var rects = board.selectAll("rect")
                .data(dataset0)
                .enter()
                .append("rect")
                .attr("x",spacex)
                .attr("y",spacey)
                .attr("width",spacew-2*pad)
                .attr("height",spaceh-2*pad)
                .attr("fill", function(d) {return "rgb(255," + Math.round(255-d*200.0/1) + "," + Math.round(255-d*200.0/1) + ")";})
                .attr("stroke","silver")
                .attr("stroke-width", 1.0)
                .attr("stroke-opacity", 0.5)
                .attr("shape-rendering", "crispEdges");

            // Add chutes and ladders
            var ladders = [[1,38],[4,14],[9,31],[21,42],[28,84],[36,44],[51,67],[71,91],[80,100]];

            // Add arrow marker elements
            var arrowlist = [chutecolor,laddercolor]

            for (var j in arrowlist){
            board.append("marker")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 4)
                .attr("refY", 0)
                .attr("markerWidth", 3)
                .attr("markerHeight", 3)
                .attr("orient", "auto")
                .attr("id",function(){if (j == 0){return "chute-end";} else {return "ladder-end";}})
                .attr("fill",arrowlist[j])
                .attr("fill-opacity", 0.2)
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");
            }

            board.selectAll("line")
                .data(ladders)
                .enter()
                .append("line")
                .attr("x1",function(d){return labelx(d[0]-1,d[0]-1);})
                .attr("y1",function(d){return labely(d[0]-1,d[0]-1)-boardfontsize/3;})
                .attr("x2",function(d){return labelx(d[1]-1,d[1]-1);})
                .attr("y2",function(d){return labely(d[1]-1,d[1]-1)-boardfontsize/3;})
                .attr("stroke", laddercolor)
                .attr("stroke-width", 8)
                .attr("stroke-opacity", 0.2)
                // Add end arrows
                .attr("marker-end","url(#ladder-end)");

            var chutes = [[98,78],[95,75],[93,73],[87,24],[64,60],[62,19],[56,53],[49,11],[48,26],[16,6]];
            // Concatenate chutes and ladders to draw chutes
            ladders.push.apply(ladders,chutes)
            board.selectAll("line")
                .data(ladders)
                .enter()
                .append("line")
                .attr("x1",function(d){return labelx(d[0]-1,d[0]-1);})
                .attr("y1",function(d){return labely(d[0]-1,d[0]-1)-boardfontsize/3;})
                .attr("x2",function(d){return labelx(d[1]-1,d[1]-1);})
                .attr("y2",function(d){return labely(d[1]-1,d[1]-1)-boardfontsize/3;})
                .attr("stroke", chutecolor)
                .attr("stroke-width", 8)
                .attr("stroke-opacity", 0.2)
                // Add end arrows
                .attr("marker-end","url(#chute-end)");

            // Add number labels to each space

            function labelx(d,i){return spacex(d,i) + spacew/2;}
            function labely(d,i){return spacey(d,i) + spaceh/2 + boardfontsize/3;}

            board.selectAll("text")
                .data(dataset0)
                .enter()
                .append("text")
                .text(function(d,i) {return i+1;})
                .attr("text-anchor", "middle")
                .attr("x", labelx)
                .attr("y", labely)
                .attr("font-family", "sans-serif")
                .attr("font-size", boardfontsize)
                .attr("font-weight", "bold")
                .attr("fill", "dimgray");
                //.attr("stroke","silver");


            // Loop through JSON imported data
            d3.json("markovboards.json",function(json){
                    board.on("click", function(){return animateboardloop(json);});
                })

            // Board animation test
            //board.on("click", function(){return animateboardloop(dsets);});

            function animateboardloop(dsets) {
                //console.log(dsets[dset]); 
                for (var k in dsets){
                    animateboard(dsets[k], k);
                    animateline(dsets[k], k);
                    animatecounter(k);
                    animatewin(dsets[k],k);
                    }
            ;}

            function animateboard(dset,k) {
                rects.data(dset)
                .transition()
                    .delay(500*k)
                    .duration(500)
                    .attr("fill", function(d) {return "rgb(255," + Math.round(255-d*200.0/1) + "," + Math.round(255-d*200.0/1) + ")";})
                };


            //------------------------------------------------
            // Create SVG line plot of board probabilities
            var plotsvgheight = 160
            var plotheight = 100
            var plotsvgwidth = w
            var plotwidth = plotsvgwidth - 80

            var lineplot = d3.select("#lineplot")
                .append("svg")
                .attr("width", plotsvgwidth)
                .attr("height", plotsvgheight);

            // X scale will fit values from 1-100 within pixels 0-width
            var x = d3.scale.linear()
                .domain([1, 100])
                .range([0, plotwidth]);
            // Y scale will fit values from 0-1 within pixels 0-100
            var y = d3.scale.linear()
                .domain([0, 1])
                .range([plotheight, 0]);

            // Create a line object
            var line = d3.svg.line()
                .interpolate("basis") // Spline interpolation
                // assign the X function to plot the line
                .x(function(d,i) {return x(i+1);})
                .y(function(d) {return y(d);});

            // Add scale / axes
            // x axis
            lineplot.selectAll("line")
                .data(x.ticks(10))
                .enter().append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 0)
                .attr("y2", 100)
                .style("stroke", "silver")
                .attr("stroke-opacity", 0.5)
                .attr("shape-rendering", "crispEdges")
                .attr("transform", "translate(62,20)");
            // Add x axis tick labels
            lineplot.selectAll(".rule")
                .data(x.ticks(10))
                .enter().append("text")
                .attr("class","xticks")
                .attr("x", x)
                .attr("y", plotheight+15)
                .style("fill", "dimgrey")
                .attr("text-anchor", "middle")
                .text(String)
                .attr("transform", "translate(62,20)");
            // x axis label
            lineplot.append("text")
                .attr("x", (plotwidth)/2)
                .attr("y", plotheight+37)
                .style("fill", "dimgrey")
                //.attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .text("Position on Game Board")
                .attr("transform", "translate(62,20)");

            // y axis
            var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
            lineplot.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(62,20)")
                .call(yAxisLeft);
            // y axis label
            lineplot.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -plotheight/2 - 20)
                .attr("y", 20) //plotheight/2)
                .style("fill", "dimgrey")
                //.attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .text("Probability");

            // Display the line by appending an svg:path element with the data line created above
            lineplot.append("path")
                .attr("id","plot")
                .attr("d", line(dataset0))
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("fill","none")
                .attr("transform", "translate(62,20)");

            // Animate line plot
            function animateline(dset,k) {
                d3.select("#lineplot #plot")
                .transition()
                    .delay(500*k)
                    .duration(500)
                    .attr("d", line(dset))
                };


            //--------------------------------------
            // Moves counter
            var counterfontsize = 32;
            var counter = d3.select("#counter")
                .append("svg")
                .attr("width", 2*counterfontsize)
                .attr("height", 1.125*counterfontsize)
                .append("text")
                .text("0")
                .attr("text-anchor", "center")
                .attr("x", counterfontsize/10)
                .attr("y", 1.125*counterfontsize)
                .attr("font-family", "sans-serif")
                .attr("font-size", counterfontsize)
                .attr("font-weight", "bold")
                .attr("fill", "dimgray");

            // Animate counter
            function animatecounter(k) {
                d3.select("#counter text")
                .transition()
                    .delay(500*k)
                    .duration(500)
                    .text(parseInt(k)+1)
                };

            //--------------------------------------
            // Win display (percent chance)
            var counterfontsize = 32;
            var counter = d3.select("#win")
                .append("svg")
                .attr("width", 4.5*counterfontsize)
                .attr("height", 1.125*counterfontsize)
                .append("text")
                .text("0.00%")
                .attr("text-anchor", "center")
                .attr("x", counterfontsize/10)
                .attr("y", 1.125*counterfontsize)
                .attr("font-family", "sans-serif")
                .attr("font-size", counterfontsize)
                .attr("font-weight", "bold")
                .attr("fill", "dimgray");

            // Animate chance
            function animatewin(dset,k) {
                d3.select("#win text")
                .transition()
                    .delay(500*k)
                    .duration(500)
                    .text((parseFloat(dset[99])*100).toFixed(2) + "%")
                };
