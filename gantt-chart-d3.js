/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function(selection) {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    var selection = selection || d3.select("body");

    var margin = {
        top : 20,
        right : 40,
        bottom : 20,
        left : 150
    };
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = 400 - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = function(t){ return moment(t).format('lll'); };

    var keyFunction = function(d) {
        return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    // Axis scales
    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(tickFormat)
        .tickSubdivide(true)
        .tickSize(8)
        .tickPadding(16)
    ;

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
    ;

    var initTimeDomain = function(tasks) {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = tasks[tasks.length - 1].endDate;
            tasks.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function() {
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(tickFormat).tickSubdivide(true)
            .tickSize(8).tickPadding(8);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function gantt(tasks) {

        initTimeDomain(tasks);
        initAxis();
        var that = this;

        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .attr("class" ,"gantt-tooltip")
            .style("visibility", "hidden")
            .text("a simple tooltip")
        ;

        var svg = selection
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        ;

        // this rect will bubble all events to chart
        selection.select("svg")
            .append("rect")
            .attr("class", "overlay")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .style('opacity', '0')
        ;

        var line = selection.select('.gantt-chart')
            .append('line')
            .attr('class', 'gantt-iLine')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('visibility', 'hidden')
        ;

        var compoundTooltip = true;
        var colors = d3.scale.category20();
        var prevScale = 0;

        selection.select('.chart')
            .on('mousemove', function() {
                var d3mouse = d3.mouse(this);
                var mouseX =  d3mouse[0] - margin.left;
                var mouseY =  d3mouse[1] - margin.top;
                var mousePageX = d3.event.pageX;
                var mousePageY = d3.event.pageY;

                if (mouseX > 0 && compoundTooltip) {
                    var line = selection.select('.gantt-iLine')
                        .attr('x1', mouseX)
                        .attr('x2', mouseX)
                        .attr('y1', height-margin.bottom)
                        .attr('y2', 0)
                        .attr('visibility', 'visible')
                    ;

                    // format tooltip
                    var tooltipTexts =
                        '<p class="gantt-tooltip-heading">'+
                        moment(x.invert(mouseX)).format('MMM Do YY, h:mm:ss a')+'</p>';
                    selection.selectAll('.gantt-rect').each(function(r){
                        var sd = x(r.startDate)
                        var ed = x(r.endDate)
                        if (sd < mouseX && ed > mouseX) {
                            tooltipTexts +=  '<p>' + r.taskName + ': ' + r.value + '</p>';
                        }
                    });

                    // display the tooltip
                    tooltip.style("left", (mousePageX + 40) + 'px');
                    tooltip.style("top", mousePageY + 'px');
                    tooltip.text();
                    tooltip.html(tooltipTexts);
                    tooltip.style("visibility", "visible");
                }
            })
            .on('mouseout', function() {
                var line = selection.select('.gantt-iLine')
                    .attr('visibility', 'hidden')
                ;
                tooltip.style("visibility", "hidden");
            })
        ;

        selection.select('.chart').call(d3.behavior.zoom().on("zoom", function(){
                var td = gantt.timeDomain();
                var scale = (td[1]-td[0])/10;

                // if (td[1]-td[0] > scale) {
                    if (d3.event.scale < prevScale)
                        gantt.timeDomain([td[0]-scale, td[1]+scale]);
                    else
                        gantt.timeDomain([td[0]+scale, td[1]-scale]);
                    gantt.redraw(tasks);
                    prevScale = d3.event.scale;
                    d3.event.sourceEvent.stopPropagation();
                // }
                // else {
                //     // just dont re-draw
                //     if (d3.event.scale < prevScale)
                //         gantt.timeDomain([td[0]-scale, td[1]+scale]);
                //     else
                //         gantt.timeDomain([td[0]+scale, td[1]-scale]);
                //     prevScale = d3.event.scale;
                //     d3.event.sourceEvent.stopPropagation();
                // }
            }))
        ;

        selection.select('.chart')
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null);

        selection.select('.chart').call(d3.behavior.drag()
            .on('dragstart', function() {
                d3.event.sourceEvent.stopPropagation();
            })
            .on('drag', function() {
                var td = gantt.timeDomain();
                var scale = (td[1]-td[0])/1000;

                d3.event.sourceEvent.stopPropagation();
                var td = gantt.timeDomain();
                gantt.timeDomain([td[0]-scale*d3.event.dx, td[1]-scale*d3.event.dx]);
                gantt.redraw(tasks);
            })
            .on('dragend', function() {
                d3.event.sourceEvent.stopPropagation();
            }))
        ;

        var bar = svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("g")
            .attr('class', 'gg')
        ;

        var ctr = 0;
        bar.append('rect')
            .attr('class', 'gantt-rect')
            .style("fill", function(d) {
                return d.color || colors(d.value);
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            })
            .on('click', function(d) {
                var $this = selection.select(this);
                gantt.timeDomain([d.startDate, d.endDate])
                gantt.redraw(tasks);
            })
            // .on('mouseenter', function(d) {
            //     compoundTooltip = false;
            //     tooltip.style("left", (margin.left + x(d.startDate)) + 'px');
            //     tooltip.style("top", y(d.taskName)-y.rangeBand()/2 + 'px');
            //     tooltip.text(
            //         'Start: ' + moment(d.startDate).format('lll') +
            //         '\n End: ' + moment(d.endDate).format('lll') +
            //         '\n Value: ' + d.value
            //     )
            //     tooltip.style("visibility", "visible");
            // })
            // .on('mouseleave', function(d) {
            //     compoundTooltip = true;
            //     tooltip.style("visibility", "hidden");
            // })
        ;

        bar.append('text')
            .text(function(d) { return d.value })
            .attr('class', 'gnatt-label')
            .attr("transform", rectTransform)
            .attr('dy', function(d) {return y.rangeBand() / 2;})
            .attr('dx', function(d) {
                if ((x(d.endDate) - x(d.startDate))/2 < String(d.value).length*5)
                    return -10000;
                else return (x(d.endDate) - x(d.startDate))/2 - (String(d.value).length*5);
            })
            .on('mouseenter', function(d) {
                // compoundTooltip = false;
                tooltip.style("visibility", "visible");
            })
        ;

        bar.on('mouseover', function(event) {
            bar.selectAll('.tooltip').style('visibility', 'visible');
        });
        bar.on('mouseout', function(event) {
            bar.selectAll('.tooltip').style('visibility', 'hidden');
        });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        svg.append("g").attr("class", "y axis").transition().call(yAxis);

        return gantt;

    };

    gantt.redraw = function(tasks) {

        initTimeDomain(tasks);
        initAxis();

        var svg = selection.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var gg = ganttChartGroup.selectAll('.gg').data(tasks, keyFunction);

        // transitions
        gg.selectAll('rect').transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            })
        ;
        gg.selectAll('text').transition()
            .attr("transform", rectTransform)
            .attr('dy', function(d) {return y.rangeBand() / 2;})
            .attr('dx', function(d) {
                // to small to be displayed?
                if ((x(d.endDate) - x(d.startDate))/2 < String(d.value).length*5)
                    return -10000;
                else return (x(d.endDate) - x(d.startDate))/2 - (String(d.value).length*5);
            })
        ;

        // rect.exit().remove();

        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);

        return gantt;
    };

    gantt.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
            return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
            timeDomainMode = value;
            return gantt;
    };

    gantt.taskTypes = function(value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function(value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function(value) {
        if (!arguments.length)
            return width;
        width = value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = value;
        return gantt;
    };

    gantt.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };

    return gantt;
};
