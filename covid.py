
import json
import requests
import time

headers = {
    'authority': 'dashboards-dev.sprinklr.com',
    'accept': 'application/json, text/plain, */*',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
    'dnt': '1',
    'origin': 'https://covid19.who.int',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-language': 'en,en-US;q=0.9,fr-FR;q=0.8,fr;q=0.7,ar-EG;q=0.6,ar;q=0.5,my-ZG;q=0.4,my;q=0.3',
}

response = requests.get('https://dashboards-dev.sprinklr.com/data/9043/global-covid19-who-gis.json', headers=headers)
print(response.status_code)

with open('covid_who.json', 'w') as e:
	e.write(response.text)

with open('covid_who.json', 'r') as e:
	data = json.loads(e.read())

rows = data['rows']
print(len(rows))

all_countries = {}

for row in rows:
	epoch = row[0]
	country = row[1]
	day = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.localtime(epoch))
	# print(day, end=' ')
	if not all_countries.get(country):
		all_countries[country] = []
	all_countries[country].append(country)

print(all_countries)


















