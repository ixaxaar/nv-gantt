/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

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
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = "%H:%M";

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
        .tickFormat(d3.time.format(tickFormat))
        .tickSubdivide(true)
        .tickSize(8)
        .tickPadding(8)
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
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(8).tickPadding(8);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function gantt(tasks) {

        initTimeDomain(tasks);
        initAxis();
        var that = this;

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .attr("class" ,"gantt-tooltip")
            .style("visibility", "hidden")
            .text("a simple tooltip")
        ;

        var svg = d3.select("body")
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

        var bar = svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("g")
            .attr('class', 'gg')
        ;

        bar.append('rect')
            // .attr("rx", 5)
            // .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status];
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            })
            .on('click', function(d) {
                var $this = d3.select(this);
                gantt.timeDomain([d.startDate, d.endDate])
                gantt.redraw(tasks);
            })
            .on('mouseenter', function(d) {
                tooltip.style("left", (margin.left + x(d.startDate)) + 'px');
                tooltip.style("top", y(d.taskName)-y.rangeBand()/2 + 'px');
                tooltip.text(
                    'Start: ' + moment(d.startDate).format('lll') +
                    '\n End: ' + moment(d.endDate).format('lll') +
                    '\n Value: ' + d.value
                )
                tooltip.style("visibility", "visible");
            })
            .on('mouseleave', function(d) {
                tooltip.style("visibility", "hidden");
            })
        ;

        bar.append('text')
            .text(function(d) { return d.value })
            .attr("transform", rectTransform)
            .attr('dy', function(d) {return y.rangeBand() / 2;})
            .attr('class', function(d) {
                if(taskStatus[d.status] == null){ return "text-bar";}
                return 'text-' + taskStatus[d.status];
            })
            .attr('dx', function(d) {
                return (x(d.endDate) - x(d.startDate))/2 - (d.value.length*3);
            })
            .on('mouseenter', function(d) {
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

        var svg = d3.select("svg");

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
            .attr('class', function(d) {
                if(taskStatus[d.status] == null){ return "text-bar";}
                return 'text-' + taskStatus[d.status];
            })
            .attr('dx', function(d) {
                // to small to be displayed?
                if ((x(d.endDate) - x(d.startDate))/2 < d.value.length*3)
                    return -10000;
                else return (x(d.endDate) - x(d.startDate))/2 - (d.value.length*3);
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
        width = +value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value;
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
