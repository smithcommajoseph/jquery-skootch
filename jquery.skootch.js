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
				$(params.indigen).data(STATE, 0);
				
				return $('#'+$trigger.attr('id')+', '+params.invaderLinks).bind('click'+E_SPACE, clickHandler = function(e){
					var nonVaders = function(){
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
				
					//call retreat and act appropriately
					if(_isInvader(e, params)) {
						$trigger.bind('click'+E_SPACE, clickHandler);
					
						if(params.invaderClickRetreat === true){ _retreat($trigger, params, function(){ nonVaders(); });
						} else { nonVaders(); }
					} else {
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
				_advance($(this), $(this).data(OPTS), _hollaBack(a));
			});
		},
		retreat: function(a){
			return this.each(function(){
				_retreat($(this), $(this).data(OPTS), _hollaBack(a));
			});
		},
		destroy: function(a){
			return this.each(function(){
				_destroy($(this), $(this).data(OPTS), _hollaBack(a));
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
	
	function _hollaBack(a){
		return (a !== undefined && a.constructor == Function) ? a : null;
	}
	
	function _squashOverflow(params, val){
		if(params.squashOverflow) { $('body').css({"overflow-x": val}); }
	}
	
	function _isInvader(e, params){
		for(var i=0; i < $(params.invaderLinks).length; i++){
		    if(e.target === $(params.invaderLinks)[i]) { return true; }
		}
	}
	
	function _setDirectionMaps(params){
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
				total = (invaderWidth*2) + params.minInvaderMargin + indigenWidth;
		
			if(total <= winWidth) { indigenSA = 0; }
			else {
				if(winWidth <= indigenWidth ) { indigenSA = invaderWidth+params.minInvaderMargin; }
				else {
					indigenSA = (invaderWidth+params.minInvaderMargin) - $(params.indigen).offset().left;
				}
			}
		} else {
			indigenSA = invaderWidth;
		}
		
		// set animap = to our desired direction map
		if(params.justify == 'right'){ dir = 'right'; }
		else { 	dir = 'left'; }
	
		animap.indigen_advance[dir] = "+="+indigenSA;
		animap.indigen_retreat[dir] = "-="+indigenSR;
		animap.invader_advance[dir] = "+="+invaderWidth;
		animap.invader_retreat[dir] = "-="+invaderWidth;

		return animap;
	}

	function _destroy($trigger, params, callback){
		if(!params) { return false; }
	
		$trigger.removeData(OPTS).unbind('click'+E_SPACE);
		$(params.indigen).unwrap();
		$(params.invader+', '+params.indigen).removeAttr('style');
	
		if(callback !== null) { callback(); }
	}

	//TODO: could optimize this by not calling _setDirectionMaps fn every advance/retreat.
	//while this works as is, the animations use more CPU than they should.
	function _advance($trigger, params, callback){
		if($(params.indigen).data(STATE) !== 0){ return; }
		$(params.indigen).data(STATE, 1);
		
		var animap = _setDirectionMaps(params);
	
		_squashOverflow(params, "hidden");
		$(params.indigen)
			.css('position', 'relative')
			.animate(animap.indigen_advance, params.advanceSpeed, params.advanceEasing);
	
		$trigger
			.removeClass(params.triggerClosed)
			.addClass(params.triggerOpen);
		$(params.invader).animate(animap.invader_advance, params.advanceSpeed, params.advanceEasing, callback);
	}

	function _retreat($trigger, params, callback){
		if($(params.indigen).data(STATE) != 1){ return; }
		$(params.indigen).data(STATE, 0);
		
		var animap = _setDirectionMaps(params);
	
		$(params.indigen).animate(animap.indigen_retreat, params.retreatSpeed, params.retreatEasing, function(){
			_squashOverflow(params, "auto");
			$(params.indigen).removeAttr('style');
		});
	
		$trigger
			.removeClass(params.triggerOpen)
			.addClass(params.triggerClosed);
		$(params.invader).animate(animap.invader_retreat, params.retreatSpeed, params.retreatEasing, callback);
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