$(document).ready(function() {
	chrome.runtime.onMessage.addListener(
	function(msg, sender, sendResponse) {
		var e = msg['event'];
		console.log('event: ' + e);
		switch (e) {
		case 'start':
			show_loading();
			prepare_ctrl_panel();
			break;
		case 'loaded':
			sched_show_ctrl_panel();
			remove_loading();
			break;
		case 'ended':
			remove_ctrl_panel();
			break;
		default:
			console.log('Invalid event: ' + e);
			break;
		}
	});
});

jQuery.fn.center = function ()
{
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
	         $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
	         $(window).scrollLeft()) + "px");
	return this;
}

jQuery.fn.bottom_center = function ()
{
	this.css("position","fixed");
	this.css("bottom", "0px");
	this.css("height", "-" + g_panel_height);
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
				$(window).scrollLeft()) + "px");
	return this;
}

$(window).scroll(function()
{
	$('#jquery_jplayer_vi_panel').bottom_center();
});

function add_only_one(id_name, content)
{
	if (0 == $('#' + id_name, parent.document.body).length)
		$(parent.document.body).append('<div id="' + id_name + '">' + content + '</div>');
}

function audio_control_dom()
{
	var dom = '';
	var name = ['play', 'pause', 'stop'];
	for (var i = 0; i < name.length; i++) {
		url = chrome.extension.getURL('fa-' + name[i] + '.png');
		id = 'btn_' + name[i];
		dom += '<div id="' + id + '" class="ac_btn">' +
		       '<img src="' + url + '"/></div>';
	}
	return dom;
}

function loading_dom()
{
	var loader_url = chrome.extension.getURL("loader.gif");
	var loader = '<img style="float: left;" src="' + loader_url + '" border="0"/>';
	return loader +
	'<div style="float:right;font-size:15px;padding:8px 10px 0px 10px;color:#222;">' +
	'<span id="jquery_jplayer_status_span">Loading speech...</span>' + '<br/>' +
	'Click <a href="javascript:void(0)" id="user_dismiss_status_link">here</a> to dismiss.' + '</div>';
}

var g_panel_height = "15 px";
function prepare_ctrl_panel()
{
	add_only_one('jquery_jplayer_vi_panel', audio_control_dom());

	$("#jquery_jplayer_vi_panel").css({
		"background-color": "yellow",
		"font-size": "11px",
		"text-align": "center",
		"padding": "3px 8px 3px 8px",
		"font-family": "DejaVu Sans",
		"color": "#222",
		"box-shadow": "0 1px 2px black",
		"border-radius": "6px",
		"margin": "0 0 0 0",
		"height": g_panel_height,
		"z-index": "2147483640 !important",
		"opacity": "0.99"
	}).bottom_center().hide();

	$('#jquery_jplayer_vi_panel').bottom_center();
}

var g_show_panel_lock = 0;
function sched_show_ctrl_panel()
{
	g_show_panel_lock = 0;
	setTimeout(function(){ show_ctrl_panel(); }, 2000);
}

function show_ctrl_panel()
{
	if (g_show_panel_lock == 0)
		$("#jquery_jplayer_vi_panel").fadeIn();
}

function remove_ctrl_panel()
{
	$("#jquery_jplayer_vi_panel").fadeOut(700,function() {$(this).remove();});
	g_show_panel_lock = 1;
}

function show_loading()
{
	add_only_one('jquery_jplayer_status', loading_dom());

	$("#user_dismiss_status_link").click(function() {remove_loading();});

	$("#jquery_jplayer_status").css({
		"background-color": "yellow",
		"border": "0",
		"font-family": "DejaVu Sans",
		"border-style" : "outset",
		"padding": "3px 8px 3px 8px",
		"box-shadow": "0 1px 2px black",
		"border-radius": "6px",
		"-webkit-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"-moz-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"z-index": "2147483640 !important",
		"opacity": "0.99"
	}).center().hide().fadeIn();

	$('#jquery_jplayer_status').center();
}

function remove_loading()
{
	$("#jquery_jplayer_status").fadeOut(700, function() {$(this).remove();});
}
