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
		OPTS = 'skooOpts';

	function _setParams(options, arg2){
		var overrides = {},
			params = {},
			opts = {},
			nextAction = '',
			nextActionCallback = null;
	
		if(typeof options == 'object') { overrides = options; }
	
		if(typeof options == 'string') {
			switch(options){
				case 'destroy':
				case 'retreat':
				case 'advance':
					nextAction = options;
					if(arg2 !== undefined && arg2.constructor == Function){ nextActionCallback = arg2; }
					break;
				default:
				if(arg2 !== undefined){
					for(var prop in $.fn.skootch.defaults){
						if(prop == options) { overrides[options] = arg2; }
					}
				}
			}
		}
		params = $.extend({}, $.fn.skootch.defaults, overrides);	
		opts = {nextAction: nextAction, nextActionCallback: nextActionCallback, params: params};
		return opts;
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

	function _destroy($trigger, node, callback){
		var params = $(node).data(OPTS);
		if(!params) { return false; }
	
		$(node).removeData(OPTS);
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

	$.fn.skootch = function(option, arg2) {
		return this.each(function(){
			var $trigger = $(this),
				opts = _setParams(option, arg2),
				params = opts.params || null,
				nextAction = opts.nextAction || null,
				nextActionCallback = opts.nextActionCallback || null;
			
			$trigger.data(OPTS, params);
		
			if(nextAction !== null){
				switch(nextAction){
					case 'advance':
						_advance($trigger, params, nextActionCallback);
						break;
					case 'retreat':
						_retreat($trigger, params, nextActionCallback);
						break;
					case 'destroy':
						_destroy($trigger, this, nextActionCallback);
						break;
				}
			} else {
				//the $trigger node wrapper id
				var indigenwrap = $(params.indigen).attr('id')+'-'+params.wrapperSuffix,
				
					//wrap $params.indigen and set '$indigenwrapper' to the res
					$indigenwrapper = $(params.indigen).wrap(function() {
						return '<div id="'+indigenwrap+'" syle="position: relative;"/>';
					});
			
				return $('#'+$trigger.attr('id')+', '+params.invaderLinks).bind('click'+E_SPACE, clickHandler = function(e){
					var isinvader = false,
						nonInvaderClicks = function(){
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
					
						if(params.invaderClickRetreat === true){
							_retreat($trigger, params, function(){ nonInvaderClicks(); });
						} else {
							nonInvaderClicks();
						}
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
								// rebind
								$trigger.bind('click'+E_SPACE, clickHandler);
							});
						}
						//if we are open, retreat
						else{
							_retreat($trigger, params, function(){
								// rebind
								$trigger.bind('click'+E_SPACE, clickHandler);
							});
						}
					}
			
					return false;
				});
			}
		});
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