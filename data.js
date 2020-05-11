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
  // pctg =  start + percentage/2;
  // console.log(value_diff, )
  return percentage;
}


get_data = function () {
  data_objs = [];
  fetch(data_url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      active_nums = generate_rates(data)[0];
      ave_rates = generate_rates(data)[1];
      rates_list = Object.values(ave_rates);
      // console.log(rates_list)
      highest = _.max(rates_list);
      lowest = _.min(rates_list);
      // console.log(lowest, highest)
      pos_diff = highest - 1;
      neg_diff = 1 - lowest;

      for (const cn in ave_rates) {
        console.log(cn);
        cn_rate = ave_rates[cn];

        if (cn_rate > 1) {
          limit_diff = pos_diff;
          value_diff = cn_rate - 1;
          pct = get_pct(value_diff, limit_diff);
          pct = 50 + pct / 2;
        } else {
          limit_diff = neg_diff;
          value_diff = cn_rate - lowest;
          pct = get_pct(value_diff, limit_diff);
          pct /= 2;
        }
        console.log(pct, value_diff, limit_diff, highest, lowest, cn_rate);

        data_objs.push({
          country: cn,
          rate: cn_rate,
          active: active_nums[cn],
          pct,
          // 'diff': pct,
          // 'color': getColorForPercentage(pct),
          color: getColorPercent(pct),
        });
      }

      html = '<tr>'
	            		+ '<td> COUNTRY</td>'
	                    + '<td> ACTIVE CASES </td>'
	                    + '<td> 7 DAY AVE RATE</td>'
	                    + '<td> % rate COLOR SCALE </td>'
                    + '</tr>';
      data_objs.forEach((e, i) => {
        html += `${'<tr>'
                			+ '<td>'}${e.country}</td>`
		                    + `<td>${e.active}</td>`
		                    + `<td>${e.rate}</td>`
		                    // `<td style='background-color:${e.color};'>` + e.pct + "</td>" +
		                    `<td style='background-color:${e.color};'>` + "</td>" +
	                    "</tr>";
            })
            document.getElementById("covid").innerHTML = html;

            rates_copy = [...rates_list]
            rates_copy = rates_copy.filter(improving)
            console.log(rates_copy)
            count_good = rates_copy.length

            rates_copy = [...rates_list]
            rates_copy = rates_copy.filter(degrading)
            console.log(rates_copy)
            count_bad = rates_copy.length

            document.getElementById("stats").innerHTML = `<p> Improving: ${count_good} &nbsp;&nbsp;&nbsp; Worsening: ${count_bad}</p>`;


        }).catch(function(error) {});
}


average = function (nums) {
  return nums.reduce((a, b) => (a + b)) / nums.length;
};


generate_rates = function (data) {
  average_rates = {};
  active_nums = {};
  for (const country in data) {
    // console.log(country)
    country_data = data[country];
    country_data.sort(compare_dates);
    len_data = country_data.length;
    last_weeks_data = country_data.slice(len_data - 8, len_data);
    //
    rates = [];
    prev_active = null;
    for (const day of last_weeks_data) {
      active = day.confirmed - (day.deaths + day.recovered);
      if (prev_active != null) {
        rate = active / prev_active;
        rates.push(rate);
      }
      prev_active = active;
      // console.log(active);
    }
    // console.log(average(rates));
    average_rates[country] = average(rates);
    active_nums[country] = active;
  }
  return [active_nums, average_rates];
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

getColorPercent('#loadbar_storage', 100, 1500);
