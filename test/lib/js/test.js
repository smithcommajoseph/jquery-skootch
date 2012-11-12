(function($){

	var should = chai.should();
		hund = '100px',
		skootchLeftSetup = function(){
			//set up a basic skootch
			$('body').append('<div id="side"><div id="skootch-trigger"><a href="javascript:void(0)">trigger</a></div><ul id="skootch-invader"><li>invader</li></ul></div>');
			$('#side').css({'position': 'absolute', 'left': '0px', 'top': hund});
			$('#skootch-invader').css({'width': hund, 'position': 'absolute', 'left': '-'+hund, 'list-style-type': 'none', 'padding': '0px'});
			$('#skootch-trigger')
				.css({'width': hund, 'display': 'none'})
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

			it('should have prop advanceEasing (string)', function(){
				$.fn.skootch.defaults.advanceEasing.should.be.a('string');
			});

			it('should have prop advanceSpeed (number)', function(){
				$.fn.skootch.defaults.advanceSpeed.should.be.a('number');
			});

			it('should have prop indigen (string)', function(){
				$.fn.skootch.defaults.indigen.should.be.a('string');
			});

			it('should have prop indigenUseMargins (boolean)', function(){
				$.fn.skootch.defaults.indigenUseMargins.should.be.a('boolean');
			});

			it('should have prop invader (string)', function(){
				$.fn.skootch.defaults.invader.should.be.a('string');
			});

			it('should have prop invaderClickCallback (null)', function(){
				should.not.exist($.fn.skootch.defaults.invaderClickCallback);
			});

			it('should have prop invaderClickRetreat (boolean)', function(){
				$.fn.skootch.defaults.invaderClickRetreat.should.be.a('boolean');
			});

			it('should have prop invaderLinks (string)', function(){
				$.fn.skootch.defaults.invaderLinks.should.be.a('string');
			});

			it('should have prop justify (string)', function(){
				$.fn.skootch.defaults.justify.should.be.a('string');
			});

			it('should have prop minInvaderMargin (number)', function(){
				$.fn.skootch.defaults.minInvaderMargin.should.be.a('number');
			});

			it('should have prop retreatEasing (string)', function(){
				$.fn.skootch.defaults.retreatEasing.should.be.a('string');
			});

			it('should have prop retreatSpeed (number)', function(){
				$.fn.skootch.defaults.retreatSpeed.should.be.a('number');
			});

			it('should have prop smart (boolean)', function(){
				$.fn.skootch.defaults.smart.should.be.a('boolean');
			});

			it('should have prop squashOverflow (boolean)', function(){
				$.fn.skootch.defaults.squashOverflow.should.be.a('boolean');
			});

			it('should have prop triggerClosed (string)', function(){
				$.fn.skootch.defaults.triggerClosed.should.be.a('string');
			});
			it('should have prop triggerOpen (string)', function(){
				$.fn.skootch.defaults.triggerOpen.should.be.a('string');
			});

			it('should have prop wrapperSuffix (string)', function(){
				$.fn.skootch.defaults.wrapperSuffix.should.be.a('string');
			});

		});

		
		describe('General Functionality', function(){

			beforeEach(skootchLeftSetup);
			afterEach(skootchLeftTeardown);

			it('should be able to be Initialized', function(){
				$('#wrap-skootch-wrap').should.be.a('object');
				$('#wrap').css('position').should.equal('static');
				$('#wrap').css('left').should.equal('auto');
			});

			it('should be able to Advance', function(done){

				//advance and check positions
				$('#skootch-trigger').skootch('advance', function(){
					var wrapPosType = $('#wrap').css('position'),
						wrapLeftPos = $('#wrap').css('left'),
						skootchInvaderPos = $('#skootch-invader').css('left');
					
					$('#skootch-trigger').skootch('retreat', function(){
						wrapPosType.should.equal('relative');
						wrapLeftPos.should.equal(hund);
						skootchInvaderPos.should.equal('0px');

						done();

					});
				});

			});

			it('should be able to Retreat', function(done){

				$('#skootch-trigger').skootch('advance', function(){
					//retreat and check positions
					$('#skootch-trigger').skootch('retreat', function(){
						$('#wrap').css('position').should.equal('static');
						$('#wrap').css('left').should.equal('auto');
						$('#skootch-invader').css('left').should.equal('-'+hund);
							
						done();
							
					});
				});

			});

			it('should be able to be Destroyed', function(done){

				$('#skootch-trigger').skootch('destroy', function(){
					$('#wrap-skootch-wrap').length.should.equal(0);
					should.not.exist($('#wrap').attr('style'));

					done();
				});

			});
		});

	});


})(jQuery);