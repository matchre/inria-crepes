jQuery.noConflict();

PancakeApp = function() {
	this.width = 600;
	this.height = 330;
	this.margin = 0;
	this.firstPancakePosition = new paper.Point([this.width / 2, 50]);
	this.numberOfFlip = 0;
	this.algo = true; // Test if user algo is optimal

	this.generatePancake(10);
};

PancakeApp.prototype.generatePancake = function(size) {
	this.pancakes = [];
	for (var i=0; i < size; i++) {
		this.pancakes.push({
			size : i + 1
		});
	}

	this.shufflePancake();
};

PancakeApp.prototype.shufflePancake = function() {
	for (var i = 0; i < this.pancakes.length * 3; i++) {
		var flipIndex = Math.floor((Math.random()*this.pancakes.length));
		this.flip(flipIndex);
	}

	this.setFlipNumber(0);
	this.algo = true;
};

PancakeApp.prototype.setFlipNumber = function(N) {
	this.numberOfFlip = N;
	jQuery("#flip").text("Retournements : " + N);
};

PancakeApp.prototype.start = function(canvasId) {
	var me = this;

	var canvas = document.getElementById(canvasId);
	canvas.width = this.width;
	canvas.height = this.height;
	paper.setup(canvas);

	var tool = new paper.Tool();

	tool.onMouseUp = function(event) {
		me.flipPancake(event.point);
	}

	tool.onMouseMove = function(event) {
		me.highlight(event.point);
	}

	jQuery("#shuffle").click(function() {
		me.shufflePancake();
		me.render();
	});

    jQuery( "#slider-1" ).change( function( event ) {
    	var value = jQuery("#slider-1").val();

    	if (value == me.pancakes.length) {
    		return;
    	}

    	me.generatePancake(value);
    	me.render();
    });

	this.render();
};

PancakeApp.prototype.highlight = function(point) {
	var hitResult = paper.project.hitTest(point);

	if (hitResult && hitResult.item && typeof hitResult.item.positionIndex == 'number') {
		this.render(hitResult.item.positionIndex);
	} else {
		this.render();
	}
};

PancakeApp.prototype.winTest = function() {
	var previousSize = this.pancakes[0].size;

	for (var i = 1; i < this.pancakes.length; i++) {
		if (previousSize + 1!== this.pancakes[i].size ) {
			return false;
		}
		previousSize = this.pancakes[i].size;
	}

	return true;
};

PancakeApp.prototype.flipPancake = function(point) {
	var hitResult = paper.project.hitTest(point);

	if (hitResult && hitResult.item && typeof hitResult.item.positionIndex == 'number') {
		this.flip(hitResult.item.positionIndex);
		this.render(hitResult.item.positionIndex);

		this.setFlipNumber(this.numberOfFlip + 1);

		if ( this.winTest() ) {
			if (!this.algo) {
				alert("Votre démarche est encore très exploratoire. Essayez de trouver une démarche systématique");
			} else {
				alert("Félicitation vous avez trouvé une démarche systématique et efficace")
			}
			this.shufflePancake();
		}
	}	
};

PancakeApp.prototype.flip = function(index) {
	var p = index,
		t = Math.floor((p)/ 2),
		buffer;

	this.testFlip(index);

	for (var i = 0; i <= t; i++) {
		buffer = this.pancakes[p-i];
		this.pancakes[p-i] = this.pancakes[i];
		this.pancakes[i] = buffer;
	}
};

PancakeApp.prototype.testFlip = function(index) {
	var nextBigger = this.pancakes.length ;

	for (var i = (this.pancakes.length - 1); i > 0; i--) {
		if (this.pancakes[i].size === (i + 1)) {
			nextBigger -= 1;
		} else {
			break;
		}
	}

	if (nextBigger === this.pancakes[0].size && index === this.pancakes[0].size - 1) {
		return;
	}
	if (nextBigger === this.pancakes[index].size) {
		return;
	}

	this.algo = false;
};

PancakeApp.prototype.render = function(highlightIndex) {
	paper.project.activeLayer.removeChildren();

	for (var i = 0; i < this.pancakes.length; i++) {
		var width = (this.width - 30) / this.pancakes.length;
		var size = this.pancakes[i].size * width;
		if (i < highlightIndex) {
			this.createPancake(size, i, 'yellow');
		} else if (i === highlightIndex) {
			this.createPancake(size, i, 'yellow');
			var raster = new paper.Raster('spatule');
			raster.position = new paper.Point([this.width / 2 + 50, (i+1) * this.pancakeHeight() ])
		} else {
			this.createPancake(size, i);
		}
	}

	paper.view.draw();
};

PancakeApp.prototype.pancakeHeight = function() {
	return (this.height - 100) / this.pancakes.length;
};

PancakeApp.prototype.createPancake = function(size, positionIndex, color) {
	var height = this.pancakeHeight();
	var offset = new paper.Point([0, height]);
	var vecHalfSize = (new paper.Point([size, height])).divide(2),
	    center = this.firstPancakePosition.add(offset.multiply(positionIndex));

	var rect = new paper.Rectangle(center.subtract(vecHalfSize), center.add(vecHalfSize));
	var path = new paper.Path.Rectangle(rect);
	path.fillColor = 'orange';
	if (color) {
		path.fillColor = color;
	}
	path.strokeColor = 'brown';
	path.positionIndex = positionIndex;

	return path;
}