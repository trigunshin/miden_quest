javascript: (function () { 
    var jsCode = document.createElement('script'); 
    jsCode.setAttribute('src', 'https://rawgit.com/trigunshin/a51b81aa752604179ffaaca02c0b1db9/raw/cf7075ca9eaec31ef50944399fb6bc7e67f7191e/miden_online_chat_alerts.js');
  	document.body.appendChild(jsCode); 
}());

javascript:(
	function() {
		var MY_NAME = 'derivagral';
		function chatMention() {
		  if (!Notification) {
			alert('Desktop notifications not available in your browser. Try Chromium.'); 
			return;
		  }

		  if (Notification.permission !== "granted")
			Notification.requestPermission();
		  else {
			var notification = new Notification('Someone mentioned you!', {
			  title: 'Someone mentioned you!!',
			  body: "You were mentioned in miden quest chat!"
			});
		  }
		}
		function checkAlerts(datum) {
			var Arr = datum.split("|");
			var Command = Arr[0];
			if (Command == "CHATNEW") {
				var Chatinfo = Arr[1];
				//$('#ChatLog').html(Chatinfo + $('#ChatLog').html());
				var chatText = $(Chatinfo)[0].children[1].textContent;
				console.info('new chat info', chatText);

				if(chatText.indexOf(MY_NAME) > 0) {
					chatMention();
				}
			}
		}
		function onmsg(evt) {
			ServerReceptionHandler(evt.data);
			checkAlerts(evt.data);
		};
		ws.onmessage=onmsg;
	}
)();
