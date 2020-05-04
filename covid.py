
import json, csv
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

# response = requests.get('https://covid.ourworldindata.org/data/owid-covid-data.csv', headers=headers)
# print(response.status_code)

fname = 'owid-covid-data.csv'

# with open(fname, 'w') as e:
#   e.write(response.text)

with open(fname, 'r') as e:
    data = csv.DictReader(e)

    for row in data:
        print(row)
        date = row['date']
        total_cases = row['total_cases']
        total_deaths = row['total_deaths']

    print(data)



















