/*!
	* jQuery Skootch: http://jquery-skootch.twohard.com/
	*
	* Dependencies:
	* jQuery 1.4+ (jquery.com)
	*
*/

(function($) {

	var ver = '1.0',
		
		E_SPACE = '.skooEvents',
		STATE = 'skooState',
		OPTS = 'skooOpts',

	methods = {
		init: function(a,b){
			return this.each(function(){
				var $trigger = $(this),
					params = _setParams(a, b),
					
					//the $trigger node wrapper id
					indigenwrap = $(params.indigen).attr('id')+'-'+params.wrapperSuffix,

					//wrap $params.indigen and set '$indigenwrapper' to the res
					$indigenwrapper = $(params.indigen).wrap(function() {
						return '<div id="'+indigenwrap+'" syle="position: relative;"/>';
					});
					
				$trigger.data(OPTS, params);
								
				return $('#'+$trigger.attr('id')+', '+params.invaderLinks).bind('click'+E_SPACE, clickHandler = function(e){
					var isinvader = false,
						nonVaders = function(){
							//fire our custom callback if it exists
							if(params.invaderClickCallback !== null){ params.invaderClickCallback(e); }
							//otherwise...
							else {
								 //if we are clicking on something with an href set the window.location
								 //otherwise, rebind our click
								 if($(e.target).attr('href') !== '' || typeof $(e.target).attr('href') !== undefined ){
								     window.location = $(e.target).attr('href');
								 }
								 //not a fan of this logic...
								 else if($(e.target).attr('type') === 'submit') {
								     var $form = $(e.target).closest('form');
								 }
							
							}
						};
					
					//unbind
					$trigger.unbind('click'+E_SPACE);
				
					//set the isinvader true if the e.target in the invaderLinks obj
					for(var i=0; i < $(params.invaderLinks).length; i++){
					    if(e.target === $(params.invaderLinks)[i]) { isinvader = true; }
					}
				
					//call retreat and act appropriately
					if(isinvader === true) {
						$trigger.bind('click'+E_SPACE, clickHandler);
					
						if(params.invaderClickRetreat === true){ _retreat($trigger, params, function(){ nonVaders(); });
						} else { nonVaders(); }
					} else {
						//initial pass
						if(typeof $(params.indigen).data(STATE) == 'undefined' || $(params.indigen).data(STATE) === null){                             
							$(params.indigen)
								.data(STATE, 0)
							 	.data('justify', params.justify);
						}
						//if we are closed, advance
						if($(params.indigen).data(STATE) == 0){
							_advance($trigger, params, function(){
								$trigger.bind('click'+E_SPACE, clickHandler);
							});
						}
						//if we are open, retreat
						else{
							_retreat($trigger, params, function(){
								$trigger.bind('click'+E_SPACE, clickHandler);
							});
						}
					}
			
					return false;
				});
				
			});
		},
		advance: function(a){
			return this.each(function(){
				var $trigger = $(this),
					params = $trigger.data(OPTS),
					callback = (a !== undefined && a.constructor == Function) ? a : null;
					
				_advance($trigger, params, callback);
			});
		},
		retreat: function(a){
			return this.each(function(){
				var $trigger = $(this),
					params = $trigger.data(OPTS),
					callback = (a !== undefined && a.constructor == Function) ? a : null;
					
				_retreat($trigger, params, callback);
			});
		},
		destroy: function(a){
			return this.each(function(){
				var $trigger = $(this),
					params = $trigger.data(OPTS)
					callback = (a !== undefined && a.constructor == Function) ? a : null;
					
				_destroy($trigger, params, callback);
			});
		}
	};
	
	function _setParams(a,b){
		var overrides = {},
			params = {}, p;
		
		if(typeof a == 'object') { overrides = a; }
		if(typeof a == 'string') {
			if(b !== undefined){
				for(p in $.fn.skootch.defaults){
					if(p == a) { overrides[a] = b; }
				}
			}
		}
		
		return $.extend({}, $.fn.skootch.defaults, overrides);
	}

	function _setDirectionMaps($trigger, params){
		var invaderWidth = $(params.invader).outerWidth(true),
			indigenSR = $(params.indigen).css(params.justify),
			indigenSA, dir, animap = {};
		
		animap.indigen_advance = {};
		animap.indigen_retreat = {};
		animap.invader_advance = {};
		animap.invader_retreat = {};
    
		//If the skootch is smart, we need to do determine how many px our indigen is animating.
		if(params.smart === true){
			var winWidth = $(window).width(),
				indigenWidth = $(params.indigen).outerWidth(params.indigenUseMargins),
				totalElemsWidth = (invaderWidth*2) + params.minInvaderMargin + indigenWidth;
		
			if(totalElemsWidth <= winWidth) { indigenSA = 0; }
			else {
				if(winWidth <= indigenWidth ) { indigenSA = invaderWidth+params.minInvaderMargin; }
				else {
					var indigenOffset = $(params.indigen).offset();
					indigenSA = (invaderWidth+params.minInvaderMargin) - indigenOffset.left;
				}
			}
		} else {
			indigenSA = invaderWidth;
		}
	
		// set animap = to our desired direction map
		switch(params.justify){
			case 'right':
				dir = params.justify;
			default:
				dir = 'left';
		}
	
		animap.indigen_advance[dir] = "+="+indigenSA;
		animap.indigen_retreat[dir] = "-="+indigenSR;
		animap.invader_advance[dir] = "+="+invaderWidth;
		animap.invader_retreat[dir] = "-="+invaderWidth;
	
		return animap;
	}

	function _destroy($trigger, params, callback){
		if(!params) { return false; }
	
		$trigger.removeData(OPTS);
		$trigger.unbind('click'+E_SPACE);
		$(params.indigen).unwrap();
		$(params.invader+', '+params.indigen).removeAttr('style');
	
		if(callback !== null) { callback(); }
	}

	//TODO: could optimize this by not calling _setDirectionMaps fn every advance/retreat.
	//while this works as is, the animations use more CPU than they should.
	function _advance($trigger, params, animatecallback){
		if($(params.indigen).data(STATE) != 1){
			var animap = _setDirectionMaps($(params.indigen), params);
			$(params.indigen).data(STATE, 1);
		
			if(params.squashOverflow !== false) { $('body').css({"overflow-x": "hidden"}); }
			$(params.indigen)
				.css('position', 'relative')
				.animate(animap.indigen_advance, params.advanceSpeed, params.advanceEasing);
		
			$trigger
				.removeClass(params.triggerClosed)
				.addClass(params.triggerOpen);
			$(params.invader).animate(animap.invader_advance, params.advanceSpeed, params.advanceEasing, animatecallback);
		}
	}

	function _retreat($trigger, params, animatecallback){
		if($(params.indigen).data(STATE) == 1){
			var animap = _setDirectionMaps($(params.indigen), params);
			$(params.indigen).data(STATE, 0);
		
			$(params.indigen).animate(animap.indigen_retreat, params.retreatSpeed, params.retreatEasing, function(){
				if(params.squashOverflow !== false) { $('body').css({"overflow-x": "auto"}); }
				$(params.indigen).removeAttr('style');
			});
		
			$trigger
				.removeClass(params.triggerOpen)
				.addClass(params.triggerClosed);
			$(params.invader).animate(animap.invader_retreat, params.retreatSpeed, params.retreatEasing, animatecallback);
		}
	}

	$.fn.skootch = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};
	
	$.fn.skootch.ver = function() { return ver; };

	$.fn.skootch.defaults = {
		advanceEasing: 			'swing',
		advanceSpeed: 			600,
		indigen: 				'#skootch-indigen',
		indigenUseMargins: 		false,
		invader: 				'#skootch-invader',
		invaderClickCallback: 	null,
		invaderClickRetreat: 	true,
		invaderLinks: 			'#skootch-invader a, #skootch-invader input[type=submit]',
		justify: 				'left',
		minInvaderMargin: 		40,
		retreatEasing: 			'swing',
		retreatSpeed: 			600,
		smart: 					true,
		squashOverflow: 		true,
		triggerClosed: 			'skootch-trigger-closed',
		triggerOpen: 			'skootch-trigger-open',
		wrapperSuffix: 			'skootch-wrap'
	};

})(jQuery);