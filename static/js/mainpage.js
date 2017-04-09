const num_fake_tweets = 3;

var correctAnswer;
var indexes;

var score;

// http://stackoverflow.com/a/6274381
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

function resetColors() {
	for(var i = 0; i < num_fake_tweets + 1; i++){
		var id = 'choice_' + i;
		console.log(id);
		var property = document.getElementById(id);
		console.log(property);
		property.style.backgroundColor = "#2C59D";
	}
}

function newGame() {
	indexes = Array.from(Array(num_fake_tweets+1).keys());
	shuffle(indexes);
	resetColors();
	$.get('/get_tweets?num_tweets=' + num_fake_tweets, function(data) {
		var fake_tweets = data.fake_tweets;
		console.log(fake_tweets);
		for (var i = 0; i < fake_tweets.length; i++) {
			$('#choice_' + indexes[i]).html(fake_tweets[i].Tweet);
			var id = 'choice_' + i;
			var property = document.getElementById(id);
			console.log(property);
			property.style.backgroundColor = "#2C5D9D";
		}
		correctAnswer = indexes[num_fake_tweets];
		var property = document.getElementById('choice_' + correctAnswer);
                console.log(property);
		$('#choice_' + correctAnswer).html(data.real_tweet.Tweet);
		property.style.backgroundColor = "#2C5D9D";
	})
	.done(function() {
		console.log("Sending request to server...");
	})
	.fail(function() {
		alert("Cannot contact server... Sorry!!!");
	});
}

$(document).ready(function() {
	score = 0;

	for (var i = 0; i < num_fake_tweets+1; i++) {
		var newChoice = document.createElement('button');
		newChoice.setAttribute('id', 'choice_' + i);
		newChoice.setAttribute('value', '' + i);
		newChoice.setAttribute('class', "choice btn btn-lg btn-primary btn-block");
		newChoice.style.backgroundColor = "2C5D9D";
		$('#choices').append(newChoice);
	}
	
	$('.choice').click(function(e) {
		var target = e.target;
		console.log(target);
		if (target.getAttribute('value') == correctAnswer) {
		        target.style.backgroundColor = "#00FF00";			
			//alert("Correct! Make HackNY Great Again!");
			score += 1;
		} else {
			target.style.backgroundColor = "#FF0000";
			//alert("Fake news! Bad!");
			score = 0;
		}
	});

	newGame();
});
