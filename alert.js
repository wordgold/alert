(function(){
var amrt = 0;
window.alertM=function(content, opt) {
	opt = $.extend({
		time: 600,
		title: '提示',
		width: 480,
		height: 'a',
		close: 1,
		btns:[
			// {
			// 	txt:"确定",
			// 	clas:"",
			// 	func:
			// }
		],
		clas: '',
		iframe: 0,
		of: function() {},
		cf: function() {},
		rf: function() {}
	}, opt || {});
	var $w = $(window),
		$d = $(document),
		ie6 = !-[1, ] && !window.XMLHttpRequest,
		$select = $("select"),
		$a, $p;
	if (opt.clas) {
		opt.clas += " info";
		opt.width = "a";
	}
	opt.h = function() {
		$('<div id="hbg" style="height:' + $d.height() + 'px;"></div>').appendTo('body').fadeTo('fast', 0.4);
		if (ie6)
			$select.css("visibility", "hidden");
		return opt;
	}
	opt.s = function() {
		var str = ['<div id="alertM" class="', opt.clas, '" style="width:', opt.width, 'px;"><div id="alertbg"></div><div id="alertb"><h5 id="alertT" class="panlT">'];
		if (opt.close) str.push('<a id="alertR" class="fr" title="关闭" href="javascript:">&times;</a>');
		str.push(opt.title, '</h5><div id="alertP" style="height:', opt.height, 'px;">');
		if (opt.iframe) str.push('<iframe id="alertF" frameBorder="0" scrolling="no" style="border:0;width:', opt.width - 48, 'px;height:', opt.height, 'px" src="', content, '"></iframe>');
		else str.push(content);
		str.push("</div>")
		if (opt.btns.length>0) {
			str.push('<div id="alertBtns">');
			for (var i = 0,l=opt.btns.length; i <l; i++) {
				str.push('<a id="alert_btn_',i,'" class="btn ',opt.btns[i].clas,'" href="javascript:">',opt.btns[i].txt, '</a>')
			};
			str.push('</div>');
		}
		str.push('</div></div>');
		$("body").append(str.join(''));
		$a = $('#alertM');
		$p = $("#alertP");
		$a[0].style.left = ($w.width() - $p.outerWidth()) / 2 + "px";
		if (ie6) {
			$a.css({
				position: "absolute",
				top: ($w.height() - $a.height()) / 2 + $w.scrollTop()
			});
			$w.on('scroll', function() {
				$a[0].style.top = ($w.height() - $a.height()) / 2 + $w.scrollTop() + "px";
			}).on('resize', function() {
				$a.stop().animate({
					top: ($w.height() - $a.height()) / 2 + $w.scrollTop(),
					left: ($w.width() - $p.outerWidth()) / 2
				});
			});
			$("#alertbg").css({
				width:$a.width(),
				height:$a.height()
			})
		} else {
			$a.addClass("on")[0].style.top = ($w.height() - $a.height()) / 2 + "px";
			$w.on('resize', function() {
				$a.stop().animate({
					top: ($w.height() - $a.height()) / 2,
					left: ($w.width() - $p.outerWidth()) / 2
				});
			});
		}
		if (!opt.clas) {
			$a.on("click", "#alertR", function() {
				if (!(opt.cf.call($a,opt) == false)) opt.r();
				return false;
			}).on("click", "#alertBtns .btn", function() {
				var i=this.id.split("_")[2]
				if (typeof(opt.btns[i].func)!="function"||opt.btns[i].func.call($a,opt) != false) opt.r();
				return false;
			})
			if ("ontouchend" in document) {
				var touch = function() {
					$a.css("position", "absolute");
					document.removeEventListener('touchend', touch, false);
				}
				document.addEventListener("touchend", touch, false);
			}
		}
		opt.of.call($a,opt);
	}
	alertM.remove = opt.r = function() {
		$a.addClass("off");
		$('#hbg').fadeOut(function() {
			if (ie6)
				$select.css("visibility", "visible");
			opt.rf.call($a,opt);
			$(this).remove();
			$a.remove();
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
		$('#alertR').on('mousedown',function() {
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
})()