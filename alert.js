define(function(require, exports, module) {
	require('jquery');
	require('<!--#echo var="static"-->css/mod/alert.css');
	var amrt = 0;
	return function(content, opt) {
		opt = $.extend({
			time: 999,
			title: '提示',
			width: 320,
			height: 'auto',
			btnC: 1,
			btnY: 1,
			btnYT: '确定',
			btnN: 0,
			btnNT: '取消',
			cName: '',
			iframe: 0,
			of: function() {},
			cf: function() {},
			yf: function() {},
			nf: function() {},
			rf: function() {}
		}, opt || {});
		var $w = $(window),
			$select = $("select"),
			$a, c;
		if (opt.cName) {
			opt.cName += " info";
			opt.width = "auto";
		}
		opt.h = function() {
			$('<div id="hbg" style="height:' + $(document).height() + 'px;"></div>').appendTo('body').fadeTo('fast', 0.6);
			$select.css("visibility", "hidden");
			return opt;
		}
		opt.s = function() {
			var str = ['<div id="alertM" class="', opt.cName, '" style="width:', opt.width, 'px;"><h5 id="alertT" class="panlT">'];
			if (opt.btnC) str.push('<a id="alertR" class="fr" title="关闭" href="javascript:">&times;</a>');
			str.push(opt.title, '</h5><div id="alertP" style="height:', opt.height, 'px;">');
			if (opt.iframe) str.push('<iframe id="alertF" frameBorder="0" scrolling="no" width="100%" height="100%" style="border:0;width:', opt.width - 24, 'px;height:', opt.height, 'px" src="', content, '"></iframe>');
			else str.push(content);
			str.push("</div>")
			if (opt.btnY || opt.btnN) {
				str.push('<div id="alertBtns">');
				if (opt.btnY) str.push('<a id="alertY" class="lightbtn" href="javascript:">', opt.btnYT, '</a>');
				if (opt.btnN) str.push('<a id="alertN" class="lightbtn" href="javascript:">', opt.btnNT, '</a>');
				str.push('</div>');
			}
			str.push('</div>');
			$("body").append(str.join(''));
			$a = $('#alertM');
			c = ($w.height() - $a.height()) / 2;
			$a.css({
				top: c,
				left: ($w.width() - $("#alertP").width()) / 2 + 14
			}).addClass("on");
			if (!-[1, ] && !window.XMLHttpRequest) {
				$a.css({
					position: "absolute",
					top: c + $w.scrollTop()
				});
				$w.bind('scroll', function() {
					$a.css({
						top: ($w.height() - $a.height()) / 2 + $w.scrollTop()
					});
				});
			}
			$w.on('resize', function() {
				c = ($w.height() - $a.height()) / 2 + (!-[1, ] && !window.XMLHttpRequest ? $w.scrollTop() : 0);
				$a.stop().animate({
					top: c,
					left: ($w.width() - $("#alertP").width()) / 2 + 14
				});
			});
			try {
				var touch = function() {
					if (!opt.cName) $a.css("position", "absolute");
					document.removeEventListener('touchend', touch, false);
				}
				document.addEventListener("touchend", touch, false);
			} catch (e) {}
			if (!opt.cName) $a.on("click", "#alertR", function() {
				if (!(opt.cf() == false)) opt.r();
				return false;
			}).on("click", "#alertY", function() {
				if (!(opt.yf() == false)) opt.r();
				return false;
			}).on("click", "#alertN", function() {
				if (!(opt.nf() == false)) opt.r();
				return false;
			})
			opt.of();
		}
		opt.r = function() {
			$a.addClass("off");
			setTimeout(function() {
				$a.remove();
			}, 600);
			$('#hbg').delay(300).fadeOut(function() {
				$(this).remove();
				$select.css("visibility", "visible");
				opt.rf();
			});
			if (amrt);
			clearTimeout(amrt);
			amrt = 0;
		}
		if ($('#alertM').length > 0) {
			$('#alertM').remove();
			opt.s();
		} else opt.h().s();
		if (amrt);
		clearTimeout(amrt);
		amrt = 0;
		if (!isNaN(opt.time)) amrt = setTimeout(function() {
			opt.r();
		}, opt.time + 999);
		else {
			$('#alertR').mousedown(function() {
				return false;
			});
			$('#alertT').css('cursor', 'move').on('mousedown', function(e) {
				var st = !-[1, ] && !window.XMLHttpRequest ? $w.scrollTop() : 0,
					w = $w.width() - $a.width() - 12,
					t = st + 4,
					u = st + $w.height() - $a.height() - 12,
					x = e.pageX - $a.removeClass("on").fadeTo('fast', 0.6).offset().left,
					y = e.pageY - $a.offset().top - st;
				$(document).on({
					mousemove: function(e) {
						var cx = e.clientX - x;
						var cy = e.clientY - y;
						c = $a.css({
							left: cx < 4 ? 4 : (cx > w ? w : cx),
							top: cy > u ? u : (cy < t ? t : cy)
						}).offset().top - $w.scrollTop();
						e.preventDefault();
					},
					mouseup: function() {
						$a.fadeTo('fast', 1);
						$(this).off('mousemove').off('mouseup');
					}
				});
				return false;
			})
		}
	}
});