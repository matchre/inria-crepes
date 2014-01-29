/*global define: false */
/*jslint browser: true */
define(['jquery', 'paperjs'],
    function (jQuery, paper) {
        "use strict";
        return {
            PancakeApp: function () {
                var i, flipIndex;
                this.generatePancake = function (size) {
                    this.pancakes = [];
                    for (i = 0; i < size; i += 1) {
                        this.pancakes.push({
                            size : i + 1
                        });
                    }
                    this.shufflePancake();
                };

                this.shufflePancake = function () {
                    for (i = 0; i < this.pancakes.length * 3; i += 1) {
                        flipIndex = Math.floor((Math.random() * this.pancakes.length));
                        this.flip(flipIndex);
                    }
                    this.setFlipNumber(0);
                    this.algo = true;
                };

                this.setFlipNumber = function (N) {
                    this.numberOfFlip = N;
                    jQuery("#flip").text("Retournements : " + N);
                };

                this.start = function (canvasId) {
                    var me = this,
                        canvas = document.getElementById(canvasId),
                        tool;
                    canvas.width = this.width;
                    canvas.height = this.height;
                    paper.setup(canvas);

                    tool = new paper.Tool();

                    tool.onMouseUp = function (event) {
                        me.flipPancake(event.point);
                    };

                    tool.onMouseMove = function (event) {
                        me.highlight(event.point);
                    };

                    jQuery("#shuffle").click(function () {
                        me.shufflePancake();
                        me.render();
                    });

                    jQuery("#slider-1").change(function () {
                        var value = jQuery("#slider-1").val();

                        if (value === me.pancakes.length) {
                            return;
                        }

                        me.generatePancake(value);
                        me.render();
                    });

                    this.render();
                };

                this.highlight = function (point) {
                    var hitResult = paper.project.hitTest(point);

                    if (hitResult && hitResult.item && typeof hitResult.item.positionIndex === 'number') {
                        this.render(hitResult.item.positionIndex);
                    } else {
                        this.render();
                    }
                };

                this.winTest = function () {
                    var previousSize = this.pancakes[0].size,
                        i;

                    for (i = 1; i < this.pancakes.length; i += 1) {
                        if (previousSize + 1 !== this.pancakes[i].size) {
                            return false;
                        }
                        previousSize = this.pancakes[i].size;
                    }

                    return true;
                };

                this.flipPancake = function (point) {
                    var hitResult = paper.project.hitTest(point);

                    if (hitResult && hitResult.item && typeof hitResult.item.positionIndex === 'number') {
                        this.flip(hitResult.item.positionIndex);
                        this.render(hitResult.item.positionIndex);

                        this.setFlipNumber(this.numberOfFlip + 1);

                        if (this.winTest()) {
                            if (!this.algo) {
                                window.alert("Votre démarche est encore très exploratoire. Essayez de trouver une démarche systématique");
                            } else {
                                window.alert("Félicitations vous avez trouvé une démarche systématique et efficace");
                            }
                            this.shufflePancake();
                        }
                    }
                };

                this.flip = function (index) {
                    var p = index,
                        t = Math.floor(p / 2),
                        buffer,
                        i;

                    this.testFlip(index);

                    for (i = 0; i <= t; i += 1) {
                        buffer = this.pancakes[p - i];
                        this.pancakes[p - i] = this.pancakes[i];
                        this.pancakes[i] = buffer;
                    }
                };

                this.testFlip = function (index) {
                    var nextBigger = this.pancakes.length,
                        i;

                    for (i = (this.pancakes.length - 1); i > 0; i -= 1) {
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

                this.render = function (highlightIndex) {
                    var i, width, size, raster;
                    paper.project.activeLayer.removeChildren();

                    for (i = 0; i < this.pancakes.length; i += 1) {
                        width = (this.width - 30) / this.pancakes.length;
                        size = this.pancakes[i].size * width;
                        if (i < highlightIndex) {
                            this.createPancake(size, i, 'yellow');
                        } else if (i === highlightIndex) {
                            this.createPancake(size, i, 'yellow');
                            raster = new paper.Raster('spatule');
                            raster.position = new paper.Point([this.width / 2 + 50, (i + 1) * this.pancakeHeight() ]);
                        } else {
                            this.createPancake(size, i);
                        }
                    }

                    paper.view.draw();
                };

                this.pancakeHeight = function () {
                    return (this.height - 100) / this.pancakes.length;
                };

                this.createPancake = function (size, positionIndex, color) {
                    var height = this.pancakeHeight(),
                        offset = new paper.Point([0, height]),
                        vecHalfSize = (new paper.Point([size, height])).divide(2),
                        center = this.firstPancakePosition.add(offset.multiply(positionIndex)),
                        rect = new paper.Rectangle(center.subtract(vecHalfSize), center.add(vecHalfSize)),
                        path = new paper.Path.Rectangle(rect);
                    path.fillColor = 'orange';
                    if (color) {
                        path.fillColor = color;
                    }
                    path.strokeColor = 'brown';
                    path.positionIndex = positionIndex;

                    return path;
                };

                this.width = 600;
                this.height = 330;
                this.margin = 0;
                this.firstPancakePosition = new paper.Point([this.width / 2, 50]);
                this.numberOfFlip = 0;
                this.algo = true; // Test if user algo is optimal
                this.generatePancake(10);
            }
        };
    });