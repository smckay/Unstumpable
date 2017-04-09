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

function newGame() {
	indexes = Array.from(Array(num_fake_tweets+1).keys());
	shuffle(indexes);

	$.get('/get_tweets?num_tweets=' + num_fake_tweets, function(data) {
		var fake_tweets = data.fake_tweets;
		console.log(fake_tweets);
		for (var i = 0; i < fake_tweets.length; i++) {
			$('#choice_' + indexes[i]).html(fake_tweets[i].Tweet);
		}

		$('#choice_' + indexes[num_fake_tweets]).html(data.real_tweet.Tweet);
		correctAnswer = indexes[num_fake_tweets];
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
		$('#choices').append(newChoice);
	}
	
	$('.choice').click(function(e) {
		var target = e.target;

		console.log(target);
		if (target.getAttribute('value') == correctAnswer) {
			alert("Correct! Make HackNY Great Again!");
			score += 1;
		} else {
			alert("Fake news! Bad!");
			score = 0;
		}
	});

	newGame();
});
