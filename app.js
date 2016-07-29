var app = new Vue({
	el : '#app',
	data : {
		lights : [],
		groups : [],
	},
	methods : {
		
	}
});


var hue = jsHue();
var bridge = hue.bridge('192.168.1.159');
var user = bridge.user('xqrzcl9siul-cHmFKy0z1XnCX6bN7atUOwPr00m3');
user.getLights(function(data){
	app.lights = data;
});
user.getGroups(function(data){
	app.groups = data;
});

var lastThingSaid;

var repeatSelf = function(){
	say(lastThingSaid);
}

var say = function(message){
	var text = '';
	if (typeof message === 'string'){
		text = message;
	}else if (typeof message === 'object'){
		text = message[Math.floor(Math.random()*message.length)]
	}
	var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
	lastThingSaid = text;
}


var turnLightsOnOrOff = function(onOrOff){
	if (onOrOff.replace(/ /g, '') === 'on'){
		var on = true;
	}else if (onOrOff.replace(/ /g, '') === 'off'){
		var on = false;
	}
	/*if (on){
		say('Turning your lights on');
	}else if (on === false){
		say('Turning your lights off');
	}*/
	say(['Yes sir.', 'Okay', 'No problem', 'Alrighty']);
	user.setGroupState(1, {
		on: on
	}, function (data) {
		console.log(data);
	})
}

var readTime = function(){
	var a = new Date();
	var hours = a.getHours();
	var minutes = a.getMinutes();
	if (hours > 12){
		hours = hours - 12;
	}
	minutes = minutes.toString();
	if (minutes.length === 1){
		minutes = '0' + minutes;
	}
	var text = hours.toString() + ':' + minutes;
	say(text);
}

var readWeather = function(){
	$.get('http://api.openweathermap.org/data/2.5/weather?zip=75067,us&appid=29d70eb4ba024591e77ac4c096a9a26b', function(data){
		var city = data['name'];
		var temp = Math.round(data['main']['temp'] * (9/5) - 459.67);
		var description = data['weather'][0]['description'];
		say('In ' + city + ', it is ' + temp.toString() + ' degrees with ' + description);
	});
}

var sayYoureWelcome = function(){
	say(['You\'re welcome', 'No problem', 'My pleasure', 'Any time buddy']);
}


annyang.addCommands({
	'(hey persia) turn my lights :onOrOff (please)' : turnLightsOnOrOff,
	'(hey persia) what time is it' : readTime,
	'(hey persia) what\'s the weather (like outside)' : readWeather,
	'thanks' : sayYoureWelcome,
	'thank you' : sayYoureWelcome,
	'what (did you say)' : repeatSelf,
	'can you say that again (please)' : repeatSelf,
});

annyang.start();