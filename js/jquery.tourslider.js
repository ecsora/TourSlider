/*
jQuery TourSlider v1.0
Copyright 2013 Ecsora
Author: Hamza HARBILI
*/
;
(function($) {
    "use strict";

    $.fn.tourslider = function(options) {
        
        return this.each(function(){
			
			// Slider default settings
			var defaults = {
				backgrounds          : new Array (
											'img/img1+.jpg',
											'img/img2+.jpg',
											'img/img3+.jpg',
											'img/img4+.jpg'),
				titles               : new Array (
											'Assurance groupe 1',
											'Assurance Hadj & Omra 1',
											'Assurance groupe 2',
											'Assurance Hadj & Omra 2'),
				captions             : new Array (
											'Offrez à vos employés des avantages qu’ils ne trouveront pas ailleurs.',
											'Une assistance vous permettant de vous consacrer entièrement à votre pèlerinage.',
											'Q’ils ne trouveront pas ailleurs offrez à vos employés des avantages.',
											'De vous consacrer entièrement à votre pèlerinage une assistance vous permettant.'),
				startindex           : 0,
	
				// Transition valuess
				animtype             : 'slide',    // transition type: slide/fade
				animduration         : 650,        // length of transition
				animspeed            : 3600,       // delay between transitions
				automatic            : true,       // enable/disable automatic slide rotation
	
				// Control configuration
				showcontrols         : true,       // enable/disable next + previous UI elements
	
				// Interaction values
				keyboard             : true,       // enable/disable keyboard navigation
				swipe                : true,       // enable/disable swipe navigation
				hoverpause           : true,       // enable/disable pause slides on hover
	
				// Presentational options
				usecaptions          : true,       // enable/disable captions
			};
	
			// Create settings from defauls and user options
			var settings             = $.extend({}, defaults, options);
	
			// Slider elements
			var $wrapper             = $(this),
				$slides              = $wrapper.find('div.slides'),
				$slide               = null,
				$slide_background    = null,
	
				// Control elements
				$slide_direction     = null,
				
				// Caption elements
				$slide_caption       = null;
	
			// State management object
			var state = {
				slidecount           : settings.backgrounds.length,    // Integer: Total number of slides
				animating            : false,                          // Boolean: is transition is progress
				paused               : false,                          // Boolean: is the slider paused
				currentslide         : settings.startindex,            // Integer: Current slide being viewed (0 based)
				interval             : null                            // Interval for automatic rotation
			};
				
			// Run through options and initialise settings
			var init = function(){
				
				// Start the first slide
				__go(false, false);
	
				// If more than 1 slide
				if(state.slidecount > 1){
					// Create and show controls
					if(settings.showcontrols){
						__controls();
					}
	
					// Enable keyboard navigation
					if(settings.keyboard){
						__keyboard();
					}
					
					// Enable swipe navigation
					if(settings.swipe){
						__swipe();
					}
	
					// Enable pause on hover
					if (settings.hoverpause && settings.automatic){
						__hoverpause();
					}
				} else {
					// Stop automatic animation, because we only have one slide! 
					settings.automatic = false;
				}
	
				// If automatic is set to true, kick off the interval
				if(settings.automatic){
					state.interval = setInterval(function () {
					   __setnext('next');
					}, settings.animspeed);
				}
	
			};
	
			var __controls = function() {
	
				// create the elements for the controls
				$slide_direction = $('<ul class="slides-direction"></ul>');
				$slide_direction.html(
				'<li><a class="prev" data-direction="prev" href="#">Previous</a></li>' +
				'<li><a class="next" data-direction="next" href="#">Next</a></li>'	
				);
				
				$slide_direction.appendTo($wrapper);
	
				// bind click events
				$slide_direction.on('click', 'a', function(e){
					e.preventDefault();
					var direction = $(this).attr('data-direction');
					if(!state.animating){
						__setnext(direction);
					}
				});
			};
	
			var __keyboard = function() {
	
				$(document).keyup(function(e){
					if(!state.paused){
						clearInterval(state.interval);
						state.paused = true;
					}
	
					if (!state.animating) {
						if(e.keyCode === 39){
							e.preventDefault();
							__setnext('next');
						}else if(e.keyCode === 37){
							e.preventDefault();
							__setnext('prev');
						}
					}
	
					if (state.paused && settings.automatic){
						state.interval = setInterval(function(){
							__setnext('next');
						}, settings.animspeed);
						state.paused = false;
					}
				});
			};
			
			var __swipe = function() {
				$wrapper.swipe({
					swipe:function(event, direction, distance, duration, fingerCount) {
						if(!state.paused){
							clearInterval(state.interval);
							state.paused = true;
						}
		
						if (!state.animating) {
							if(direction === 'left'){
								__setnext('next');
							}else if(direction == 'right'){
								__setnext('prev');
							}
						}
		
						if (state.paused && settings.automatic){
							state.interval = setInterval(function(){
								__setnext('next');
							}, settings.animspeed);
							state.paused = false;
						}
					}
				});
			};
	
			var __hoverpause = function() {
				$wrapper.on('mouseover', function(e){
					if (!state.paused) {
						clearInterval(state.interval);
						state.paused = true;
					}
				}).on('mouseout', function(e){
					if (state.paused) {
						state.interval = setInterval(function (){
							__setnext('next');
						}, settings.animspeed);
						state.paused = false;
					}
				});
			};
	
			var __captions = function() {
				$slide_caption = $('<div class="slide-caption"></div>');
				$slide_caption.html(
					'<div class="caption">' +
					'<h1 class="caption-title">' + settings.titles[state.currentslide] + '</h1>' +
					'<div class="caption-excerpt">' + settings.captions[state.currentslide] + '</div>' +
					'</div>'	
				);
				$slide_caption.appendTo($slide);
			};
	
			var __setnext = function(direction) {
				if(direction === 'next'){
					state.currentslide++;
					if(state.currentslide > state.slidecount-1){
						state.currentslide = 0;
					}
				}else{
					state.currentslide--;
					if(state.currentslide < 0){
						state.currentslide = state.slidecount-1;
					}
				}
				__go(state.currentslide, direction);
			};
	
			var __go = function(position, direction) {
	
				// only if we're not already doing things
				if(!state.animating){
	
					// doing things
					state.animating = true;
					
					$slide = $('<div id="slide' + state.currentslide + '" class="slide"></div>');
					$slide_background = $('<div class="slide-background"></div>');
					$slide.css({ 'margin': '0 auto', 'overflow': 'hidden', 'padding': '0px', 'position': 'absolute' });
					$slide_background.css({ 'margin': '0 auto', 'overflow': 'hidden', 'padding': '0px', 'position': 'absolute', '-webkit-background-size': 'cover', '-moz-background-size': 'cover', '-o-background-size': 'cover', 'background-size': 'cover' });
	
					// first one
					if(position === false){
						if(settings.animtype == 'slide'){
							$slide.css({ 'width': '100%', 'height': '0%', 'top': $slides.outerHeight() });
							$slide_background.css({ 'width': $slides.outerWidth(), 'height': $slides.outerHeight(), 'bottom' : '-100px' });
						}else{
							$slide.css({ 'width': '100%', 'height': '100%', 'opacity': '0' });
							$slide_background.css({ 'width': '100%', 'height': '100%' });
						}
						
						// Load image and start transition
						var img = new Image();
						img.src = settings.backgrounds[state.currentslide];
						$(img).on('load',function() {
						
							$slide_background.css({ 'background': 'url("' + img.src + '") no-repeat center center' });
							
							$slide.append($slide_background);
							$slides.append($slide);
							
							if(settings.usecaptions){
								__captions();
								$slide_caption.css({ 'width': $slides.outerWidth(), 'height': $slides.outerHeight(), 'bottom': '-200px' })
								.animate({'bottom': '0px'}, settings.animduration, 'easeOutCubic', function(){ $slide_caption.css({ 'width': '100%', 'height': '100%' }) });
							}
							
							if(settings.animtype == 'slide'){
								$slide.animate({ 'height': '100%', top: '0' }, settings.animduration, 'easeOutCubic', function(){ $slide_background.css({ 'width': '100%', 'height': '100%' }); state.animating = false; });
								$slide_background.animate({ 'bottom': '0px' }, settings.animduration, 'easeOutCubic');
							}else{
								$slide.animate({ 'opacity': '1' }, settings.animduration, 'easeOutCubic', function(){ state.animating = false; });
							}
						})
					}else{
						if(settings.animtype == 'slide'){
							$slide.css({ 'width': '0%', 'height': '100%' });
							(direction == 'next') ? $slide.css({'right': '0px'}) : $slide.css({'left': '0px'});
							
							$slide_background.css({ 'width': $slides.outerWidth(), 'height': $slides.outerHeight() });
							(direction == 'next') ? $slide_background.css({'right': '-100px'}) : $slide_background.css({'left': '-100px'});
						}else{
							$slide.css({ 'width': '100%', 'height': '100%', 'opacity': '0' });
							$slide_background.css({ 'width': '100%', 'height': '100%' });
						}
						
						// Load image and start transition
						var img = settings.backgrounds[state.currentslide];
						$('<img />').attr('src', img).on('load', function() {
							
							$slide_background.css({ 'background': 'url("' + img + '") no-repeat center center' });
						
							$slide.append($slide_background);
							$slides.append($slide);
							
							if(settings.usecaptions){
								__captions();
								if(direction == 'next'){
									$slide_caption.css({ 'width': $slides.outerWidth(), 'height': $slides.outerHeight(), 'right': '-200px'})
									.animate({ 'right': '0px' }, settings.animduration, 'easeOutCubic', function(){ $slide_caption.css({'width': '100%', 'height': '100%'}) });
								}else{
									$slide_caption.css({ 'width': $slides.outerWidth(), 'height': $slides.outerHeight(), 'left': '-200px'})
									.animate({ 'left': '0px' }, settings.animduration, 'easeOutCubic', function(){ $slide_caption.css({'width': '100%', 'height': '100%'}) });
								}
							}
							
							if(settings.animtype == 'slide'){
								
								$slide.animate({ 'width': '100%' }, settings.animduration, 'easeOutCubic', function(){
									$slide_background.css({ 'width': '100%', 'height': '100%' });
									$slide.prev().remove();
									state.animating = false;
								});
								
								if(direction == 'next'){
									$slide_background.animate({ 'right': '0px' }, settings.animduration, 'easeOutCubic');
								}else{
									$slide_background.animate({ 'left': '0px' }, settings.animduration, 'easeOutCubic');
								}
							}else{
								$slide.animate({ 'opacity': '1' }, settings.animduration, 'easeOutCubic', function(){ state.animating = false; });
							}
						})
					}
				}
			};
	
			// Lets start :)
			init();
			
		});// end each
    };
	
})(jQuery);
