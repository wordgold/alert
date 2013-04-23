define(function(require, exports, module) {
	require('jquery');
	require('<!--#echo var="static"-->css/mod/alert.css');
	var amrt = 0;
	return function(content, opt) {
		opt = $.extend({
			time: 999,
			title: '提示',
			width: 320,
			height: 'a',
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
			$d = $(document),
			$select = $("select"),
			$a, $p;
		if (opt.cName) {
			opt.cName += " info";
			opt.width = "a";
		}
		opt.h = function() {
			$('<div id="hbg" style="height:' + $d.height() + 'px;"></div>').appendTo('body').fadeTo('fast', 0.6);
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
			$p = $("#alertP");
			$a[0].style.left = ($w.width() - $p.outerWidth()) / 2 - 9 + "px";
			if (-[1, ] || window.XMLHttpRequest) {
				$a.addClass("on")[0].style.top = ($w.height() - $a.height()) / 2 + "px";
				$w.on('resize', function() {
					$a.stop().animate({
						top: ($w.height() - $a.height()) / 2,
						left: ($w.width() - $p.outerWidth()) / 2 - 9
					});
				});
			} else {
				$a.css({
					position: "absolute",
					top: ($w.height() - $a.height()) / 2 + $w.scrollTop()
				});
				$w.on('scroll', function() {
					$a[0].style.top = ($w.height() - $a.height()) / 2 + $w.scrollTop() + "px";
				}).on('resize', function() {
					$a.stop().animate({
						top: ($w.height() - $a.height()) / 2 + $w.scrollTop(),
						left: ($w.width() - $p.outerWidth()) / 2 - 9
					});
				});
			}
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
		module.exports.remove = opt.r = function() {
			$a.addClass("off");
			setTimeout(function() {
				$a.remove();
			}, 600);
			$('#hbg').delay(300).fadeOut(function() {
				$(this).remove();
				$select.css("visibility", "visible");
				opt.rf();
			});
			if (amrt) {
				clearTimeout(amrt);
				amrt = 0;
			}
		}
		if ($('#alertM').length > 0) {
			$('#alertM').remove();
			opt.s();
		} else opt.h().s();
		if (amrt) {
			clearTimeout(amrt);
			amrt = 0;
		}
		if (!isNaN(opt.time)) amrt = setTimeout(function() {
			opt.r();
		}, opt.time + 999);
		else {
			$('#alertR').mousedown(function() {
				return false;
			});
			$('#alertT').css('cursor', 'move').on('mousedown', function(e) {
				var st = -[1, ] || window.XMLHttpRequest ? 0 : $w.scrollTop(),
					w = $w.width() - $a.width() - 9,
					t = st + 4,
					u = st + $w.height() - $a.height() - 9,
					x = e.pageX - $a.removeClass("on").fadeTo('fast', 0.6).offset().left,
					y = e.pageY - $a.offset().top - st;
				$d.on({
					mousemove: function(e) {
						var cx = e.clientX - x;
						var cy = e.clientY - y;
						$a.css({
							left: cx < 4 ? 4 : (cx > w ? w : cx),
							top: cy > u ? u : (cy < t ? t : cy)
						});
						e.preventDefault();
					},
					mouseup: function() {
						$a.fadeTo('fast', 1);
						$d.off('mousemove').off('mouseup');
					}
				});
				return false;
			})
		}
	}
});