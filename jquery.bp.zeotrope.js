/*
 * Zeotrope Plugin
 * @author Ben Plum
 * @version 0.1.0
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 * 
 * Request Animation Frame Polyfill by Paul Irish <https://gist.github.com/paulirish/1579671>
 * jquery.requestAnimationFrame by Corey Frang <https://github.com/gnarf37/jquery-requestAnimationFrame>
 */

// RAF Polyfill
(function() {
	var lastTime = 0,
		vendors = ['webkit', 'moz'];
	
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
		window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
	
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

// jQuery Animation Shim
if (jQuery) (function($) {
	
	var animating = false;
	
	function raf() {
		if (animating) {
			window.requestAnimationFrame(raf);
			jQuery.fx.tick();
		}
	}
	
	jQuery.fx.timer = function( timer ) {
		if (timer() && jQuery.timers.push(timer) && !animating) {
			animating = true;
			raf();
		}
	};
	
	jQuery.fx.stop = function() {
		animating = false;
	};
})(jQuery);