$(document).mouseup(function(e) {
	var container = $(".qr-code ");

	if (!container.is(e.target) // if the target of the click isn't the container...
		&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});
///////////

$(document).ready(function() {
	//替换placeholder
	$('input, textarea').placeholder();
	//用户注销
	$("#logout").bind({
		click: function() {
			//snia退出
			WB2.logout();
			//qq退出
			QC.Login.signOut();
		}
	});
	//弹出框定位
	jQuery.fn.dialogSetPosition = function() {
		var $dialog = $(".modal-dialog");
		$dialog.each(function() {
			var $this = $(this);
			$this.timer = setInterval(function() {
				var iWidth = $this.width();
				var iHeight = $this.height();
				if (iHeight > 0) {
					$(".modal-dialog").animate({
						marginLeft: -iWidth / 2 + "px",
						marginTop: -iHeight / 2 + "px",
						top: "45%",
						left: "50%"
					}, 500);
					clearInterval($this.timer);
				}
			}, 30);
		});
	};

	//登录/注册
	$("#btn-login-register,#btn-login-register-2").bind({
		click: function() {
			$("#myModal").modal('show').dialogSetPosition();
		}
	});

	//登录优化
	$("#CaptchaCodeLoginInput").bind({
		keydown: function(e) {
			if (e.keyCode == 13) {
				$("#btnLogin").trigger("click");
			}
		}
	});

	//注册优化
	$("#CaptchaCodeRegisterInput").on({
		keydown: function(e) {
			if (e.keyCode == 13) {
				$("#btnRegister").trigger("click");
			}
		}
	});

	$('.qr-link').on('click', function(event) {
		event.preventDefault();
		$(this).find('.qr-code').stop().fadeToggle();
	});


	/////////

	$('.select').on('click', function() {
		$(this).find('.select-list').slideToggle('fast');
	});

	$('.panel-group').on("click", ".panel-heading", function() {
		$(this).find('img').toggleClass('rotate').stop();
	});

	/////////
	$(".button").on("click", function() {

		var $button = $(this);
		var oldValue = $button.parent().find("input").val();

		if ($button.text() == "+") {
			var newVal = parseFloat(oldValue) + 3;
			if (oldValue == 9) {
				var newVal = parseFloat(oldValue) + 0;
			}
		} else {
			// Don't allow decrementing below zero
			if (oldValue > 3) {
				var newVal = parseFloat(oldValue) - 3;
			} else {
				newVal = 3;
			}
		}

		$button.parent().find("input").val(newVal);

	});
	////////////

	$('.tags .btn').on('click', function(event) {
		event.preventDefault();
		var btn_value = $(this).find(".value").text();
		$(".changed-value").text(btn_value);
	});

	$('.close-msg').on("click", function(event) {
		event.preventDefault();
		$(this).parent().hide();
	});

});