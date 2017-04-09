const num_fake_tweets = 3;

var correctAnswer;
var indexes;
var tweets;

var realid;

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
	$('.choice').css('background-color', '#2C5D9D');
}

function newGame() {
	$('.remove').remove();
	//$('.choice').next().remove();
	resetColors();
	$.get('/get_tweets?num_tweets=' + num_fake_tweets, function(data) {
		tweets = data.fake_tweets;
		tweets.push(data.real_tweet);
		shuffle(tweets);
		for (var i = 0; i < tweets.length; i++) {
			var tweet = tweets[i];
			$('#choice_' + i).html(tweet.Tweet);
			if (tweet['Handle'] == 'realDonaldTrump')
				correctAnswer = i;
		}
	})
	.done(function() {
		console.log("Sending request to server...");
	})
	.fail(function() {
		alert("Cannot contact server... Sorry!!!");
	});
	$('.choice').prop('disabled', false);
}

$(document).ready(function() {
	score = 0;
	setInterval(function() {
		$('#score').html(score);
	},500);

	for (var i = 0; i < num_fake_tweets+1; i++) {
		var newChoice = document.createElement('button');
		newChoice.setAttribute('id', 'choice_' + i);
		newChoice.setAttribute('value', '' + i);
		newChoice.setAttribute('class', "choice btn btn-lg btn-primary btn-block");
		newChoice.style.backgroundColor = "2C5D9D";
		newChoice.setAttribute('style', 'white-space: normal;');
		$('#choices').append(newChoice);
	}
	
	$('.choice').click(function(e) {
		var target = e.target;
		console.log(target);
		if (target.getAttribute('value') == correctAnswer) {
			target.style.backgroundColor = "#00FF00";			
			//alert("Correct! Make HackNY Great Again!");
			score += 1;
			console.log(realid);
			//var url = "https://twitter.com/realDonaldTrump/status/" + realid;
			var url = "https://twitter.com/realDonaldTrump/status/"; 
			//$(target).after('<a id="remove" href=' + url + ">Think it's fake news? See the original tweet!</a>");
			$('.choice').each(function(index) {
				var tweet = tweets[index];
				$.get('/embed?id=' + tweet['ID'], function(data) {
					console.log(data.html);
					$('#choice_' + index).after('<span class="remove">' + data.html + '</span>');
				});
			});

			/*
			for (var tweet_index = 0; tweet_index < tweets.length; tweet_index++) {
				var tweet = tweets[tweet_index];
//				$('#choice_' + i).after('<a class="remove" href=' + url + tweet['ID'] + ">Click here to see the original tweet!</a>");
				console.log(tweet_index);
				$.get('/embed?id=' + tweet['ID'], function(data) {
					console.log(tweet_index);
					console.log(data.html);
					$('#choice_' + tweet_index).after('<span class="remove">' + data.html + '</span>');
				});
			}
			*/
			$('.choice').prop('disabled', true);
		} else {
			target.style.backgroundColor = "#FF0000";
			//alert("Fake news! Bad!");
			score = 0;
		}
	});

	newGame();
});
