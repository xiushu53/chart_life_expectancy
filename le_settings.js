var w = 350,
    h = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
};

var width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

var x = d3.scalePow()
    .exponent(2.5)
    .range([0, width]);

var y = d3.scaleBand()
    .rangeRound([0, height])
    .padding(1.1);

var line = d3.line()
    .x(function(d) { return x(d.le); })
    .y(function(d) { return y(d.name); });


var svg = d3.select("body").append("svg")
    .attr("id", "chart")
    .attr("width", w)
    .attr("height", h);

var chart = svg.append("g")
    .classed("display", true)
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


d3.json("lifeExpectancy.json").then(function(le_data) {


    chart.append("g")
        .attr("class", "cat")
        .append("rect")
        .attr("x", -margin.left)
        .attr("width", w)
        .attr("height", 245)
        .attr("fill", "#EEE")

    chart.append("g")
        .attr("class", "cat-text")
        .append("text")
        .text("HIGH INCOME")
        .attr("x", -180)
        .attr("y", -80)
        .attr("font-size", 18)
        .attr("fill", "#777")
        .attr("transform", "rotate(-90)");

    chart.append("g")
        .attr("class", "cat")
        .append("rect")
        .attr("x", -margin.left)
        .attr("y", 245)
        .attr("width", w)
        .attr("height", 85)
        .attr("fill", "#DDD");

    chart.append("g")
        .attr("class", "cat-text")
        .append("text")
        .text("MID")
        .attr("x", -305)
        .attr("y", -80)
        .attr("font-size", 18)
        .attr("fill", "#777")
        .attr("transform", "rotate(-90)");

    chart.append("g")
        .attr("class", "cat")
        .append("rect")
        .attr("x", -margin.left)
        .attr("y", 330)
        .attr("width", w)
        .attr("height", 130)
        .attr("fill", "#EEE");

    chart.append("g")
        .attr("class", "cat-text")
        .append("text")
        .text("LOW")
        .attr("x", -410)
        .attr("y", -80)
        .attr("font-size", 18)
        .attr("fill", "#777")
        .attr("transform", "rotate(-90)");

    draw_data('1990');

    function draw_data(y_val) {
        var year = y_val;

        var line_data = le_data[year].map(function(d) {
            return {
                id: d.name,
                values: [{ name: d.name, le: d.Male }, { name: d.name, le: d.Female }]
            };
        });

        console.log(line_data);

        x.domain([0, 85]);
        y.domain(line_data.map(function(entry) {
            return entry.id;
        }));


        var line_draw = chart.selectAll(".country")
            .data(line_data)
            .enter().append("g")
            .attr("class", "country");

        line_draw.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", "grey");

        var circles = chart.selectAll("circle")
            .data(le_data[year])
            .enter()
            .append("g")
            .attr("class", "circles");

        circles.append("circle")
            .attr("cx", function(d) {
                return x(d.Total);
            })
            .attr("cy", function(d) {
                return y(d.name);
            })
            .attr("r", 5)
            .attr("fill", "grey");


        circles.append("circle")
            .attr("cx", function(d) {
                return x(d.Male);
            })
            .attr("cy", function(d) {
                return y(d.name);
            })
            .attr("r", 5)
            .attr("fill", "steelblue");

        circles.append("circle")
            .attr("cx", function(d) {
                return x(d.Female);
            })
            .attr("cy", function(d) {
                return y(d.name);
            })
            .attr("r", 5)
            .attr("fill", "pink");

        chart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .text("life expectancy")
            .attr("x", 195)
            .attr("y", -5)
            .attr("fill", "#000");

        chart.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("country");

        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(10)
        };

        chart.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat(""))


    };
    //slider
    var slider2 = d3.sliderHorizontal()
        .min(1990)
        .max(2010)
        .step(1)
        .width(300)
        .on('onchange', function(val) {
            d3.selectAll(".country").remove();
            d3.selectAll(".circles").remove();
            d3.selectAll(".axis--y").remove();
            d3.selectAll(".axis--x").remove();
            d3.selectAll(".grid").remove();
            draw_data(String(val));
            d3.select("p#value2").text("Year: " + val);
        });

    var g = d3.select("div#slider2").append("svg")
        .attr("width", 350)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(30,10)");

    g.call(slider2);

    d3.select("p#value2").text(("Year: " + slider2.value()));
});
