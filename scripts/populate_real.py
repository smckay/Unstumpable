#used https://gist.github.com/yanofsky/5436496 as guideline
import tweepy
import MySQLdb as mdb
import sys

con = mdb.connect('localhost', 'root', 'password1', 'unstumpable');
cur = con.cursor()
cur.execute("DROP TABLE IF EXISTS real_tweets")
cur.execute("CREATE TABLE real_tweets(ID INT PRIMARY KEY AUTO_INCREMENT, \
                 tweet BLOB)")
consumer_key = "YZjQNOxHfRdqvvgZGe186FmFJ"
consumer_secret = "MaMXUIHuamKSo6VhoGgDWwJqeU1f4laBAUbN73FDG8EMh1WADC"
access_key = "1813411740-6goKcpeC6SwhpEKEIn7QM4ss9Nq8g4OueQ28Gqz"
access_secret = "mKpg4Qw89EqoFmO1uJVfWCEDOaisB9YSZQcmIAJVdWjSg"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_key, access_secret)
api = tweepy.API(auth)


tweets = []
new_tweets = api.user_timeline(screen_name = "realDonaldTrump", count = 200)
tweets.extend(new_tweets)

oldest = tweets[-1].id - 1

while len(new_tweets) > 0:
	new_tweets = api.user_timeline(screen_name = "realDonaldTrump", count = 200, max_id = oldest)
	tweets.extend(new_tweets)
	oldest = tweets[-1].id - 1
	print (len(tweets))

outtweets = [[tweet.id_str, tweet.text] for tweet in tweets]

i = 0

for tweet in outtweets:
	with con:
		text = tweet[1]
		try:
			cur.execute("INSERT INTO real_tweets(tweet) VALUES('%s')" % (text))
			print(text)
		except Exception as e:
			print("meme")
