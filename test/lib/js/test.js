(function($){

	var should = chai.should();
		hund = '100px',
		skootchLeftSetup = function(){
			//set up a basic skootch
			$('body').append('<div id="side"><div id="skootch-trigger"><a href="javascript:void(0)">trigger</a></div><ul id="skootch-invader"><li>invader</li></ul></div>');
			$('#side').css({'position': 'absolute', 'left': '0px', 'top': hund});
			$('#skootch-invader').css({'width': hund, 'position': 'absolute', 'left': '-'+hund, 'list-style-type': 'none', 'padding': '0px'});
			$('#skootch-trigger').css({'width': hund, 'display': 'none'})
								.skootch({
									indigen: '#wrap',
									smart: false
								});
		},
		skootchLeftTeardown = function(){
			$('#skootch-trigger').skootch('destroy');
			$('#side').remove();
		};

	describe('jQuery Skootch', function(){
		describe('Defaults', function(){

			it('should be an object', function(){
				$.fn.skootch.defaults.should.be.a('object');
			});

			it('should have 17 props', function(){
				//how many defaults are there?
				var expected = 17,
					actual = 0,
					prop;

				for(prop in $.fn.skootch.defaults){
					if($.fn.skootch.defaults.hasOwnProperty(prop)) { actual++; }
				}

				actual.should.equal(expected);
			});

			it('should have props that match our expectations', function(){
				$.fn.skootch.defaults.advanceEasing.should.be.a('string');
				$.fn.skootch.defaults.advanceSpeed.should.be.a('number');
				$.fn.skootch.defaults.indigen.should.be.a('string');
				$.fn.skootch.defaults.indigenUseMargins.should.be.a('boolean');
				$.fn.skootch.defaults.invader.should.be.a('string');
				should.not.exist($.fn.skootch.defaults.invaderClickCallback);
				$.fn.skootch.defaults.invaderClickRetreat.should.be.a('boolean');
				$.fn.skootch.defaults.invaderLinks.should.be.a('string');
				$.fn.skootch.defaults.justify.should.be.a('string');
				$.fn.skootch.defaults.minInvaderMargin.should.be.a('number');
				$.fn.skootch.defaults.retreatEasing.should.be.a('string');
				$.fn.skootch.defaults.retreatSpeed.should.be.a('number');
				$.fn.skootch.defaults.smart.should.be.a('boolean');
				$.fn.skootch.defaults.squashOverflow.should.be.a('boolean');
				$.fn.skootch.defaults.triggerClosed.should.be.a('string');
				$.fn.skootch.defaults.triggerOpen.should.be.a('string');
				$.fn.skootch.defaults.wrapperSuffix.should.be.a('string');
			});

		});
	});


})(jQuery);