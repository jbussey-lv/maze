function build_table(){
	var table = $("<table id='maze_table'></table>");
	var tbody = $("<tbody></tbody>");
	table.append(tbody);
	for(var i=0; i<config.height; i++){
		var tr = $("<tr></tr>");
		for(var j=0; j<config.width; j++){
			var td = $("<td></td>");
			td.data("tile", tiles[0]);
			tr.append(td);
		}
		tbody.append(tr);
	}
	$("body").append(table);
	table.find("td").click(start_maze);
}

var edges = new Array();
edges["t"] = new edge("b", [0, -1]);
edges["r"] = new edge("l", [1, 0]);
edges["b"] = new edge("t", [0, 1]);
edges["l"] = new edge("r", [-1, 0]);

var tiles = new Array();
tiles.push(new tile([], ["t", "r", "b", "l"], "", "blank"));
tiles.push(new tile([["t", "r"]], ["b", "l"], "img/tr.png", "tr"));
tiles.push(new tile([["b", "r"]], ["t", "l"], "img/br.png", "br"));
tiles.push(new tile([["b", "l"]], ["t", "r"], "img/bl.png", "bl"));
tiles.push(new tile([["t", "l"]], ["b", "r"], "img/tl.png", "tl"));
tiles.push(new tile([["t", "b"]], ["l", "r"], "img/vert.png", "vert"));
tiles.push(new tile([["l", "r"]], ["t", "b"], "img/hori.png", "hori"));
tiles.push(new tile([["t", "r"], ["b", "l"]], [], "img/tr_bl.png", "tr_bl"));
tiles.push(new tile([["b", "r"], ["t", "l"]], [], "img/br_tl.png", "br_tl"));
tiles.push(new tile([["t", "b"], ["l", "r"]], [], "img/cross.png", "cross"));

function draw_path(td, start){

	// if we're off the edge
	if(typeof($(td).data("tile"))=="undefined"){return false;}

	// get free edges
	var free = $(td).data("tile").free;

	var start_taken = true;
	var really_free = new Array();
	$(free).each(function(i, el){
		if(el == start){start_taken = false;}
		else{really_free.push(el);}
	});

	// if start is free AND there's at least one other edge free...
	if(!start_taken && really_free.length){

		var end = rand_element(really_free);
		update_tile(td, start, end);

		var coords 	= coords_from_td(td);
		
		var edge 	= edges[end];

		var new_x	= coords[0]+edge.diff[0];
		new_x		= (new_x>0)?(new_x):(config.width+new_x);
		new_x		= new_x%config.width;

		var new_y	= coords[1]+edge.diff[1];
		new_y		= (new_y>0)?(new_y):(config.height+new_y);
		new_y		= new_y%config.height;

		var new_coords	= [new_x, new_y];
		var new_td 	= td_from_coords(new_coords);
		var new_start	= edge.becomes;

		setTimeout(
			function(){draw_path(new_td, new_start)},
			config.delay
		);
	}
}

function update_tile(td, start, end){

	var current_tile = $(td).data("tile");
		
	// go through all potential tiles
	$(tiles).each(function(i, potential_tile){

		var good = true;

		if(!contains_path(potential_tile, start, end)){good = false;}
			
		if(!has_needed_frees(current_tile, potential_tile, start, end)){good = false;}

		if(good){good_tile = potential_tile;}

	});


	$(td).data("tile", good_tile);
	$(td).css("background", "url('"+good_tile.img+"')");

}

function tile(paths, free, img, label){
	this.paths = paths;
	this.free  = free;
	this.img   = img;
	this.label = label;
}

function has_needed_frees(current_tile, potential_tile, start, end){

	if((current_tile.free.length - 2) > potential_tile.free.length){
		return false;
	}

	return true;

}

function contains_path(tile, start, end){

	var answer = false;

	$(tile.paths).each(function(i, path){

		if((start == path[0] && end == path[1]) || (start == path[1] && end == path[0])){

			answer = true;
		}
	});

	return answer;
}

function edge(becomes, diff){
	this.becomes	= becomes;
	this.diff	= diff;
}

function start_maze(){
	var free = $(this).data("tile").free;
	var start = rand_element(free);
	draw_path(this, start);
}

function td_from_coords(coords){
	var tr = $("#maze_table tr")[coords[1]];
	var td = $(tr).find("td")[coords[0]];
	return $(td);
}

function coords_from_td(td){
	td = $(td)[0];
	var coords = [td.cellIndex, td.parentNode.rowIndex];
	return coords;
}

function rand(max){
	return Math.floor(Math.random() * max);
}

function rand_element(array){
	var i = rand(array.length);
	return array[i];
}
