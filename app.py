from sanic import Sanic, response
from sanic.response import json

from twilio.twiml.voice_response import VoiceResponse

import pymysql as mdb

from pdb import set_trace

con = mdb.connect('localhost', 'root', 'password1', 'unstumpable')

app = Sanic()

@app.route('/')
async def test(request):
	#return json({'hello': 'world'})
	return await response.file('./static/templates/mainpage.html')

#@app.route('/static/js/mainpage.js')
#async def get_js(request):
#	return await response.file('./static/js/mainpage.js')

app.static('/js', './static/js')
app.static('/css', './static/css')

@app.route('/get_tweets')
async def get_tweets(request, methods=['GET']):
	print(" [*] REQUEST RECEIVED AT /get_tweets")

	num_tweets = int(request.args['num_tweets'][0])
	print("PARAMETER 'num_tweets': %s" % (num_tweets))


	ret = {}

	real_tweet = get_real_tweet()
	if not real_tweet:
		return json(error("Cannot retrieve real tweet data"))
	else:
		ret['real_tweet'] = real_tweet

	fake_tweets = get_fake_tweets(num_tweets)
	if not fake_tweets:
		return json(error("Cannot retrieve fake tweet data"))
	else:
		ret['fake_tweets'] = fake_tweets

	return json(ret)

@app.route('/get_tweets_mobile')
async def get_tweets_mobile(request, methods=['GET','POST']):
	pass

def get_real_tweet():
	real_tweet_q = "SELECT ID, Tweet FROM real_tweets ORDER BY RAND() LIMIT 1;"
	with con:
		cur = con.cursor()
		cur.execute(real_tweet_q)
		real_tweet = cur.fetchone()
		if not real_tweet:
			return None
		else:
			return {'ID': real_tweet[0], 'Tweet': real_tweet[1]}
			
def get_fake_tweets(num_tweets):
	fake_tweet_q = "SELECT ID, Tweet, Handle FROM fake_tweets ORDER BY RAND() LIMIT {};".format(num_tweets)
	with con:
		cur = con.cursor()
		cur.execute(fake_tweet_q)
		fake_tweets = cur.fetchall()
		if len(fake_tweets) != num_tweets:
			return None
		else:
			return list(map(lambda x: {'ID': x[0], 'Tweet': x[1], 'Handle': x[2]}, fake_tweets))
	

def error(err):
	print(' [X] %s' % err)
	return {'error': err}

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=80)
