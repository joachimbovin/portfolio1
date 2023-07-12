var author = "None";

(function() {
    var width = 900,
        height = 720;


    var brewer = d3.entries(colorbrewer)[28].value[8].reverse();  /* change the number (21) to change the color */

    var svg = d3.select("#chart")
        .append("svg")
        .attr("style","overflow:visible")  //CSS !!!
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");

    var radiusScale = d3.scaleSqrt().domain([1, 1500]).range([1,20]);

    var div = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // the simulation is collection of forces about
    //where we want our circles to go
    // and how we want our circles to interact
    var simulation = d3.forceSimulation()
    // force( name, define force ...)
        .force("x", d3.forceX(width / 2).strength(0.04))
        .force('y', d3.forceY(height / 2).strength(0.04))
        .force("collide", d3.forceCollide(function(d)  {
            return radiusScale(d.freq) + 2;
        }   ))     //radius of circles has to match radius of forcecollide


    d3.select("#literature").on("click", function() {
        console.log("hello")

    })

    d3.queue()
        .defer(d3.csv, "authors_combined_full.csv")
        .await(ready)

    function ready(error, datapoints) {
        var circles = svg.selectAll(".full_name")
        //console.log(datapoints)
            .data(datapoints)
            //.data(datapoints.filter(function(d){
            //    return d.genre === genre;
            //}))
            //console.log(datapoints)
            .enter().append("circle")
            //.attr("style", "stroke:red")
            .attr("id","authors")
            .style("stroke-width", 5)
            .attr("r", 2)
            .attr("r", function(d) {
                return radiusScale(d.freq)
            })
            .attr("fill", function(d) {
                if (d.genre === "religion") {
                    return brewer[1];
                } else if (d.genre === "philosophy") {
                    return brewer[2];
                } else if (d.genre === "law_social_sciences_education") {
                    return brewer[3];
                }  else if (d.genre === "applied_science") {
                    return "#e7298a";
                }  else if (d.genre === "exact_science") {
                    return "#8e8d99";
                }  else if (d.genre === "art_games_sport") {
                    return "#d90d02";
                } else if (d.genre === "literature") {
                    return brewer[5];
                } else if (d.genre === "history_geography_biography") {
                    return brewer[7];
                }
                return "#e7298a";
            })
            //.attr("fill", "red")
            // .attr("cx", 100)
            // .attr("cy", 300)
            .on('click', function(d) {
                document.getElementById('author').innerHTML = "Naam: " + d.full_name;
                document.getElementById('frequency').innerHTML = "Aantal vertaalde teksten: " + d.freq;
                document.getElementById('genre').innerHTML = "Genre: " + d.genre
                get_picture(d.full_name)
             //  d3.select(this).attr("style", "stroke:black");

                /*            d3.select(this).attr("r", function(d) {
                                return radiusScale(d.freq) + 20
                            });*/

            })
            /*     .on("mouseover", function(d) {
                     document.getElementById('author').innerHTML = d.full_name;
                 })*/
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html(d.full_name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })




        simulation.nodes(datapoints)
            .on('tick', ticked)//we feed the simulation our nodes, our circles...

        //we write a code that fires at every tick of the clock
        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function(d) {
                    return d.y
                })
        }

    }





})();



function get_picture(author) {

    $(document).ready(function () {

        get_QID(author)

    })
}



function get_QID(author) {


    $.ajax({

        url: "https://www.wikidata.org/w/api.php?action=query&list=search&srsearch=" + author + "&format=json&origin=*",

        success: function (result) {

            var Q_ID = result.query.search[0]["title"];   //pageid (?)
            get_image(Q_ID)
            get_country_id(Q_ID)
        }
    })
}


function get_image(Q_ID) {

    //console.log(Q_ID)

    $.ajax({

        url: "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=" + Q_ID + "&origin=*",

        success: function (result) {
            $( "#results" ).empty();
            var item = result.claims.P18[0].mainsnak.datavalue.value;
            var new_item = item.split(' ').join('_');
            var test = (MD5(new_item));
            var number_1 = test[0];
            var number_2 = test[0] + test[1];

            //doesn't work all the time, probably an encoding (utf-8) problem e.g. Q457 > = île-de-blabla, doesn't work!

            var output = "<img id='img' alt='(afbeelding niet beschikbaar)' src='https://upload.wikimedia.org/wikipedia/commons/" + number_1 + "/" + number_2 + "/" + new_item + "'>"
            console.log(output)

            $("#results").append(output);

        },
        error: function (result) {
            console.log("Error: ", result)
        }
    })
}



function get_country_id(Q_ID) {

    $.ajax({

        url: "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=" + Q_ID + "&property=P27&origin=*",

        success: function (result) {
            var country_ID = result.claims.P27[0].mainsnak.datavalue.value.id;

            show_country(country_ID)


        }

    })

}



function show_country(country_ID) {

    $.ajax({

        url: "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=" + country_ID + "&property=P935&origin=*",


        success: function (result) {
            $("#country").empty();
            var country_name = result.claims.P935[0].mainsnak.datavalue.value;
            $("#country").append("Land: " + country_name);


        },
        error: function (result) {
            console.log("Error: ", result)
        }

    })

}















