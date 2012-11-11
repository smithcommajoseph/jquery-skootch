/*!
	* jQuery Skootch: http://jquery-skootch.twohard.com/
	*
	* Dependencies:
	* jQuery 1.6+ (jquery.com)
	*
*/

(function($) {

	var ver = '1.1',
		
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


				function onTriggerClick(e){
					//call retreat and act appropriately
					//initial pass
					if(typeof $(params.indigen).data(STATE) == 'undefined' || $(params.indigen).data(STATE) === null){
						$(params.indigen)
							.data(STATE, 0)
							.data('justify', params.justify);
					}

					//if we are closed, advance
					if($(params.indigen).data(STATE) === 0){
						_advance($trigger, params, function(){
							$trigger.one('click'+E_SPACE, onTriggerClick);
						});
					}
					//if we are open, retreat
					else{
						_retreat($trigger, params, function(){
							$trigger.one('click'+E_SPACE, onTriggerClick);
						});
					}
			
					return false;
				}


				function onInvadeClick(e){
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
				
					if(params.invaderClickRetreat === true){ _retreat($trigger, params, function(){ nonVaders(); });
					} else { nonVaders(); }
					
					return false;
				}

				$trigger.data(OPTS, params);
				
				$('#'+$trigger.attr('id')).one('click'+E_SPACE, onTriggerClick);
				$(params.invaderLinks).on('click'+E_SPACE, onInvadeClick);

				
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
					params = $trigger.data(OPTS),
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
			indigenSR = parseInt($(params.indigen).css(params.justify), 10),
			indigenSA, animap = {};
    
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
		animap.direction = (params.justify == 'right') ? 'right': 'left';

		animap.indigen_advance = indigenSA;
		animap.indigen_retreat = indigenSR;
		animap.invader_advance = invaderWidth;

		return animap;
	}

	function _destroy($trigger, params, callback){
		if(!params) { return false; }
	
		$trigger.removeData(OPTS);
		$trigger.off('click'+E_SPACE);
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

			$(params.indigen).css('position', 'relative');
		
			$trigger
				.removeClass(params.triggerClosed)
				.addClass(params.triggerOpen);

			$({'skootch_animate_state': 0})
				.animate({'skootch_animate_state': 1},{
					duration: params.advanceSpeed,
					easing: params.advanceEasing,
					step: function(now, fx){
						$(params.indigen).css(animap.direction, (animap.indigen_advance * now) + 'px');
						$(params.invader).css(animap.direction, (-animap.invader_advance + (animap.invader_advance * now)) + 'px');
					}
				})
				.promise()
				.done(animatecallback);
		}
	}

	function _retreat($trigger, params, animatecallback){
		if($(params.indigen).data(STATE) == 1){
			var animap = _setDirectionMaps($(params.indigen), params);
			$(params.indigen).data(STATE, 0);
				
			$trigger
				.removeClass(params.triggerOpen)
				.addClass(params.triggerClosed);

			$({'skootch_animate_state': 1})
				.animate({'skootch_animate_state': 0},{
					duration: params.retreatSpeed,
					easing: params.retreatEasing,
					step: function(now, fx){
						$(params.indigen).css(animap.direction, (animap.indigen_retreat * now) + 'px');
						$(params.invader).css(animap.direction, (-animap.invader_advance + (animap.invader_advance * now)) + 'px');
					}
				})
				.promise()
				.done(function(){
					if(params.squashOverflow !== false) { $('body').css({"overflow-x": "auto"}); }
					$(params.indigen).removeAttr('style');

					animatecallback();
				});
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
		advanceEasing:			'swing',
		advanceSpeed:			600,
		indigen:				'#skootch-indigen',
		indigenUseMargins:		false,
		invader:				'#skootch-invader',
		invaderClickCallback:	null,
		invaderClickRetreat:	true,
		invaderLinks:			'#skootch-invader a, #skootch-invader input[type=submit]',
		justify:				'left',
		minInvaderMargin:		40,
		retreatEasing:			'swing',
		retreatSpeed:			600,
		smart:					true,
		squashOverflow:			true,
		triggerClosed:			'skootch-trigger-closed',
		triggerOpen:			'skootch-trigger-open',
		wrapperSuffix:			'skootch-wrap'
	};

})(jQuery);