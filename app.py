from sanic import Sanic
from sanic.response import json

import pymysql as mdb

from pdb import set_trace

con = mdb.connect('localhost', 'root', 'password1', 'unstumpable')

app = Sanic()

@app.route('/')
async def test(request):
	return json({'hello': 'world'})

@app.route('/get_tweets')
async def get_tweets(request, methods=['GET']):
	print(" [*] REQUEST RECEIVED AT /get_tweets")

	num_tweets = int(request.args['num_tweets'][0])
	print("PARAMETER 'num_tweets': %s" % (num_tweets))

	real_tweet_q = "SELECT ID, Tweet FROM real_tweets ORDER BY RAND() LIMIT 1;"
	fake_tweet_q = "SELECT ID, Tweet, Handle FROM fake_tweets ORDER BY RAND() LIMIT {};".format(num_tweets)

	ret = {}

	with con:
		cur = con.cursor()

		cur.execute(real_tweet_q)
		real_tweet = cur.fetchone()
		if not real_tweet:
			return json(error("Cannot retrieve real tweet data"))
		else:
			ret['real_tweet'] = {'ID': real_tweet[0], 'Tweet': real_tweet[1]}

		cur.execute(fake_tweet_q)
		fake_tweets = cur.fetchall()
		if len(fake_tweets) != num_tweets:
			return json(error("Cannot retrieve fake tweet data"))
		else:
			ret['fake_tweets'] = list(map(lambda x: {'ID': x[0], 'Tweet': x[1], 'Handle': x[2]}, fake_tweets))

	return json(ret)

def error(err):
	print(' [X] %s' % err)
	return {'error': err}

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=80)
