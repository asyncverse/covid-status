
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

# response = requests.get('https://pomber.github.io/covid19/timeseries.json', headers=headers)
# print(response.status_code)

fname = 'pomber_data.json'

# with open(fname, 'w') as e:
#   e.write(response.text)

def average(lst):
    return sum(lst)/len(lst)


with open(fname, 'r') as e:
    data = json.loads(e.read())


for row in data:
    print(row), len(data[row])
    country_data = sorted(data[row], key= lambda x: x['date'])
    last_week = country_data[-8:]
    change_rates = []
    prev_active_cases = 0

    for day in last_week:
        active_cases = day['confirmed'] - (day['recovered'] + day['deaths'])
        if prev_active_cases:
            rate = active_cases / prev_active_cases
            change_rates.append(rate)
        print(active_cases, end=' ')
        prev_active_cases = active_cases

    print()
    print(average(change_rates))


# print(data)

# ug = data['Uganda']
# print(ug)



































