const data_url = 'https://pomber.github.io/covid19/timeseries.json';

function compare_dates(a, b) {
  return a.date > b.date;
}

function improving(a) {
  return a < 0;
}

function degrading(a) {
  return a > 0;
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
      // console.log(data);
      // generate the average rise in cases per country
      countries_data = generate_rates(data);
      // extract the results
      active_nums = countries_data[0];
      ave_rates = countries_data[1];
      last_updated = countries_data[2];
      // get the highest and lowest rate of increase
      rates_list = Object.values(ave_rates);
      // console.log(rates_list)
      // worst case scenario is that cases double, which would be an 100% increase
      // we compare the highest and lowest rates to see how far they are from the worst case scenario

      // iterate through the countries and create the data objects
      for (const cntry in ave_rates) {
        // use the country rate of increase
        cntry_rate = ave_rates[cntry];

        // if there was a rise in cases
        if (cntry_rate > 1) {
          // else, the cases were falling
        } else {
        }
        // console.log(cntry, pct, value_diff, limit_diff, highest, lowest, cntry_rate);

        data_objs.push({
          country: cntry,
          rate: Number((cntry_rate).toFixed(3)),
          active: active_nums[cntry],
          pct: Number((cntry_rate).toFixed(3)),
          color: getColorPercent(Number((cntry_rate).toFixed(3))),
          last_updated: last_updated[cntry] // the last date the data was updated for this country
        });
      }

      // console.log(data_objs);

      html = '<tr>'
        + '<td> COUNTRY</td>'
        + '<td> AVERAGE ACTIVE CASES </td>'
        + '<td> 14 DAY %age RATE</td>'
        + '<td> % rate (+ COLOR SCALE) </td>'
        + '<td> LAST-UPDATED </td>'
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


      document.getElementById('covid').innerHTML = html;

      console.log(ave_rates);

      rates_copy = Object.values(ave_rates);
      console.log("oiuuo", rates_copy);

      rates_copy = rates_copy.filter(improving);
      console.log(rates_copy);
      count_good = rates_copy.length;

      rates_copy = Object.values(ave_rates);
      rates_copy = rates_copy.filter(degrading);
      console.log(rates_copy);
      count_bad = rates_copy.length;

      document.getElementById('stats').innerHTML = `<p> improving: ${count_good} &nbsp;&nbsp;&nbsp; Deteriorating: ${count_bad}</p>`;
    }).catch((error) => { });
};


average = function (nums) {
  return nums.reduce((a, b) => (a + b)) / nums.length;
};

sum = function (nums) {
  return nums.reduce((a, b) => (a + b), 0);
};


generate_rates = function (data) {
  average_rates = {};
  active_nums = {};
  last_updated = {};
  for (const country in data) {
    // get the country data
    country_data = data[country];

    // sort the dates in order
    country_data.sort(compare_dates);
    len_data = country_data.length;
    mid_length = len_data - 14;
    end_length = len_data - 28;
    // mid_length = len_data - 30;
    // end_length = len_data - 60;

    // slice to get data for the last 14 days
    last_2_weeks_data = country_data.slice(mid_length, len_data);
    sum_actives = 0;
    prev_active = null;
    for (const day of last_2_weeks_data) {
      active = day.confirmed - (day.deaths + day.recovered);
      if (prev_active != null) {
        // increament the total active cases for the country
        sum_actives += active;
      } else {
        // console.log(day.date);
      }
      prev_active = active;
    }

    // slice to get data for the last 28 days
    prev_2_weeks_data = country_data.slice(end_length, mid_length);
    sum_old_actives = 0;
    prev_active = null;
    for (const day of prev_2_weeks_data) {
      active = day.confirmed - (day.deaths + day.recovered);
      if (prev_active != null) {
        sum_old_actives += active;
      } else {
        // console.log(day.date);
      }
      prev_active = active;
    }

    increase = sum_actives - sum_old_actives;
    // calculate the average rate of increase
    if (increase > 0) {
      percentage_increase = ((increase + sum_old_actives) / sum_old_actives) * 100 - 100;
    } else {
      percentage_increase = ((increase + sum_old_actives) / sum_old_actives) * 100 - 100;
      console.log(country, increase, percentage_increase);
    }
    // console.log(country, increase, percentage_increase);

    // console.log(country, percentage_increase, sum(actives), sum(old_actives));
    average_rates[country] = percentage_increase;
    active_nums[country] = sum_actives / 14;
    last_updated[country] = country_data[len_data - 1].date;
  }
  return [active_nums, average_rates, last_updated];
};


const percentColors = [{
  pct: -100,
  color: '#00FF00',
}, {
  pct: -90,
  color: '#12FF00',
}, {
  pct: -80,
  color: '#24FF00',
},
{
  pct: -70,
  color: '#47FF00',
}, {
  pct: -60,
  color: '#58FF00',
}, {
  pct: -50,
  color: '#6AFF00',
},
{
  pct: -40,
  color: '#7CFF00',
}, {
  pct: -30,
  color: '#8DFF00',
}, {
  pct: -20,
  color: '#9FFF00',
},
{
  pct: -10,
  color: '#B0FF00',
},
{
  pct: -9,
  color: '#C2FF00',
}, {
  pct: -8,
  color: '#D4FF00',
},
{
  pct: -6,
  color: '#E5FF00',
}, {
  pct: -4,
  color: '#F7FF00',
}, {
  pct: -2,
  color: '#FFF600',
},
{
  pct: 0,
  color: '#FFE400',
},
{
  pct: 2,
  color: '#FFD300',
}, {
  pct: 4,
  color: '#FFC100',
},
{
  pct: 6,
  color: '#FFAF00',
}, {
  pct: 8,
  color: '#FF9E00',
}, {
  pct: 9,
  color: '#FF8C00',
},
{
  pct: 10,
  color: '#FF7B00',
}, {
  pct: 20,
  color: '#FF6900',
}, {
  pct: 30,
  color: '#FF5700',
},
{
  pct: 40,
  color: '#FF4600',
}, {
  pct: 50,
  color: '#FF3400',
}, {
  pct: 60,
  color: '#FF2300',
},
{
  pct: 70,
  color: '#FF1100',
}, {
  pct: 80,
  color: '#FF0000',
}, {
  pct: 90,
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
