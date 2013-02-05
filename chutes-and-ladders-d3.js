            //----------------
            // Todo:
            // * Most basic functionality. DONE
            // * More
            // * Add chutes and ladders
            //-----------------------

            // Board parameters
            var w = 500;
            var h = w;
            var spacew = w/10;
            var spaceh = h/10;
            var pad = 1;

            // Functions to place data / labels in correct position on C&L board.
            // The spaces wind up the board from lower left to upper left on 10x10 board.
            function spacex(d,i){
                        if(i % 20 < 10){
                            return i*spacew % w;}
                        else {
                            return w -spacew - (i*spacew % w);}
                        }
            function spacey(d,i){return h - spaceh - Math.floor(i/10)*spaceh;}


            //Data
            // Starting board. Should probably be generated on the fly.
            var dataset0 = [1.,          0.,  0.,  0.,          0.,
  0.,  0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,  0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,  0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,          0.,          0.,          0.,
  0.,          0.,          0.,          0.,        ]

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
                .attr("stroke-width", 0.5);

            // Add number labels to each space

            function labelx(d,i){return spacex(d,i) + spacew/2;}
            function labely(d,i){return spacey(d,i) + spaceh/2 + boardfontsize/3;}

            var boardfontsize = 16;
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
            var lineplot = d3.select("#lineplot")
                .append("svg")
                .attr("width", w)
                .attr("height", 100);

            // X scale will fit values from 0-100 within pixels 0-width
            var x = d3.scale.linear()
                .domain([0, 100])
                .range([0, w]);
            // Y scale will fit values from 0-1 within pixels 0-100
            var y = d3.scale.linear()
                .domain([0, 1])
                .range([100, 0]);

            // Create a line object
            var line = d3.svg.line()
                // assign the X function to plot the line
                .x(function(d,i) {return x(i);})
                .y(function(d) {return y(d);});

            // Display the line by appending an svg:path element with the data line created above
            lineplot.append("path")
                .attr("d", line(dataset0))
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("fill","none");

            // Animate line plot
            function animateline(dset,k) {
                d3.select("path")
                .transition()
                    .delay(500*k)
                    .duration(500)
                    .attr("d", line(dset))
                };


            //--------------------------------------
            // Moves counter
            var fontsize = 32;
            var counter = d3.select("#counter")
                .append("svg")
                .attr("width", 3*fontsize)
                .attr("height", 1.125*fontsize)
                .append("text")
                .text("0")
                .attr("text-anchor", "center")
                .attr("x", fontsize/2)
                .attr("y", 1.125*fontsize)
                .attr("font-family", "sans-serif")
                .attr("font-size", fontsize)
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
