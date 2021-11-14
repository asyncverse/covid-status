const data_url = 'https://pomber.github.io/covid19/timeseries.json';

function compare_dates(a, b) {
  return a.date > b.date;
}

function improving(a) {
  return a < 1;
}

function degrading(a) {
  return a > 1;
}

function get_pct(value_diff, limit_diff) {
  percentage = (value_diff / limit_diff) * 100;
  return percentage;
}


get_data = function () {
  data_objs = [];
  fetch(data_url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // generate the average rise in cases per country
      countries_data = generate_rates(data);
      // extract the results
      active_nums = countries_data[0];
      ave_rates = countries_data[1];
      last_updated = countries_data[2];
      // get the highest and lowest rate of increase
      rates_list = Object.values(ave_rates);
      console.log(rates_list)
      highest = _.max(rates_list);
      lowest = _.min(rates_list);
      // worst case scenario is that cases double, which would be an 100% increase
      // we compare the highest and lowest rates to see how far they are from the worst case scenario
      pos_diff = highest - 1;
      neg_diff = 1 - lowest;

      // iterate through the countries and create the data objects
      for (const cn in ave_rates) {
        // use the country rate of increase
        cn_rate = ave_rates[cn];

        // if there was a rise in cases
        if (cn_rate > 1) {
          limit_diff = pos_diff;
          value_diff = cn_rate - 1;
          pct = get_pct(value_diff, limit_diff);
          pct = 50 + pct / 2;
          // else, the cases were falling
        } else {
          limit_diff = neg_diff;
          value_diff = cn_rate - lowest;
          pct = get_pct(value_diff, limit_diff);
          pct /= 2;
        }
        console.log(cn, pct, value_diff, limit_diff, highest, lowest, cn_rate);

        data_objs.push({
          country: cn,
          rate: cn_rate,
          active: active_nums[cn],
          pct,
          color: getColorPercent(pct),
          last_updated: last_updated[cn] // the last date the data was updated for this country
        });
      }

      // console.log(data_objs);

      html = '<tr>'
        + '<td> COUNTRY</td>'
        + '<td> ACTIVE CASES </td>'
        + '<td> 7 DAY AVE RATE</td>'
        + '<td> % rate COLOR SCALE </td>'
        + '<td> LAST UPDATED </td>'
        + '</tr>';

      // console.log(html);
      // console.log(data_objs.length);

      data_objs.forEach((e, i) => {
        // console.log(e);
        html += `${'<tr>'
          + '<td>'}${e.country}</td>`
          + `<td>${e.active}</td>`
          + `<td>${e.rate}</td>`
          + `<td style='background-color:${e.color};'>` + String(e.pct) + "</td>"
          + `<td>${e.last_updated}</td>`
          + '</tr>';
      });

      // console.log(html);

      document.getElementById('covid').innerHTML = html;

      rates_copy = [...rates_list];
      rates_copy = rates_copy.filter(improving);
      // console.log(rates_copy);
      count_good = rates_copy.length;

      rates_copy = [...rates_list];
      rates_copy = rates_copy.filter(degrading);
      // console.log(rates_copy);
      count_bad = rates_copy.length;

      document.getElementById('stats').innerHTML = `<p> improving: ${count_good} &nbsp;&nbsp;&nbsp; Deteriorating: ${count_bad}</p>`;
    }).catch((error) => { });
};


average = function (nums) {
  return nums.reduce((a, b) => (a + b)) / nums.length;
};


generate_rates = function (data) {
  average_rates = {};
  active_nums = {};
  last_updated = {};
  for (const country in data) {
    // console.log(country)
    country_data = data[country];
    country_data.sort(compare_dates);
    len_data = country_data.length;
    last_weeks_data = country_data.slice(len_data - 6, len_data);
    //
    rates = [];
    prev_active = null;
    for (const day of last_weeks_data) {
      active = day.confirmed - (day.deaths + day.recovered);
      if (prev_active != null) {
        rate = active / prev_active;
        if (rate != Infinity) {
          rates.push(rate);
        }
      }
      prev_active = active;
      // console.log(active);
    }
    // console.log(average(rates));
    average_rates[country] = average(rates);
    active_nums[country] = active;
    last_updated[country] = country_data[len_data - 1].date;
  }
  return [active_nums, average_rates, last_updated];
};


const percentColors = [{
  pct: 0,
  color: '#00FF00',
}, {
  pct: 3,
  color: '#12FF00',
}, {
  pct: 6,
  color: '#24FF00',
},
{
  pct: 10,
  color: '#47FF00',
}, {
  pct: 13,
  color: '#58FF00',
}, {
  pct: 16,
  color: '#6AFF00',
},
{
  pct: 20,
  color: '#7CFF00',
}, {
  pct: 23,
  color: '#8DFF00',
}, {
  pct: 26,
  color: '#9FFF00',
},
{
  pct: 30,
  color: '#B0FF00',
}, {
  pct: 33,
  color: '#C2FF00',
}, {
  pct: 36,
  color: '#D4FF00',
},
{
  pct: 40,
  color: '#E5FF00',
}, {
  pct: 43,
  color: '#F7FF00',
}, {
  pct: 46,
  color: '#FFF600',
},
{
  pct: 50,
  color: '#FFE400',
}, {
  pct: 53,
  color: '#FFD300',
}, {
  pct: 56,
  color: '#FFC100',
},
{
  pct: 60,
  color: '#FFAF00',
}, {
  pct: 63,
  color: '#FF9E00',
}, {
  pct: 66,
  color: '#FF8C00',
},
{
  pct: 70,
  color: '#FF7B00',
}, {
  pct: 73,
  color: '#FF6900',
}, {
  pct: 76,
  color: '#FF5700',
},
{
  pct: 80,
  color: '#FF4600',
}, {
  pct: 83,
  color: '#FF3400',
}, {
  pct: 86,
  color: '#FF2300',
},
{
  pct: 90,
  color: '#FF1100',
}, {
  pct: 93,
  color: '#FF0000',
}, {
  pct: 96,
  color: '#FF0000',
},
{
  pct: 100,
  color: '#FF0000',
},
];

var getColorPercent = function (pct) {
  color = '000000';
  for (let i = 1; i < percentColors.length - 1; i++) {
    if (pct > percentColors[i].pct) {
      color = percentColors[i].color;
    }
  }
  return color;
};
