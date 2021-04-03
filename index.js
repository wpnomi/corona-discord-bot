const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    //msg content
    let msg_contains = msg.content;
    //check if includes command
    if(msg_contains.includes("!rona")){
      //get text after first space (ex: !rona canada)
      let country_query = msg_contains.substr(msg_contains.indexOf(' ')+1);
      //build api call url
      let channel_url = `https://corona.lmao.ninja/v2/countries/${country_query}?today=true&strict=true&query`;
      //api call
      axios.get(channel_url)
        .then(response => {

          function get_yesterday_cases(){
            //get yesterday cases for calculation
            return axios.get(`https://corona.lmao.ninja/v2/countries/${country_query}?yesterday=true&strict=true&query`)
              .then(response => {
                const today_cases = response.data.todayCases;
                return today_cases;
              })
              .catch(error => {
                console.log(error);
            });
          }
          
          get_yesterday_cases().then(data => { 
            var yesterday_cases = data;     
            //if status 200
            //get data into variable
            var cases_data = response.data;

            var percentage_dif_from_yesterday = (((cases_data.todayCases - yesterday_cases) / yesterday_cases) * 100 ).toFixed(2);

            //build message
            let cases_info = `Country: ${cases_data.country} :flag_${cases_data.countryInfo.iso2.toLowerCase()}:\n\n :chart_with_upwards_trend: New Cases: ${cases_data.todayCases}\n\n :skull: Today's Deaths: ${cases_data.todayDeaths}\n\n :bar_chart: Cases: ${cases_data.cases}\n\n :skull_crossbones: Deaths: ${cases_data.deaths}\n\n :grinning: Recovered Today: ${cases_data.todayRecovered}\n\n :smiley: Recovered: ${cases_data.recovered}\n\n :thermometer: Critical: ${cases_data.critical}\n\n :test_tube: Total Tests: ${cases_data.tests}\n\n\ :exclamation: Change from Yesterday: ${percentage_dif_from_yesterday} % \n\n Stay safe and wear a mask.`;
            //send it
            msg.channel.send(cases_info);
          
          })
          .catch(error => { 
            //if status 200
            //get data into variable
            var cases_data = response.data;
            //build message
            let cases_info = `Country: ${cases_data.country} :flag_${cases_data.countryInfo.iso2.toLowerCase()}:\n\n :chart_with_upwards_trend: New Cases: ${cases_data.todayCases}\n\n :skull: Today's Deaths: ${cases_data.todayDeaths}\n\n :bar_chart: Cases: ${cases_data.cases}\n\n :skull_crossbones: Deaths: ${cases_data.deaths}\n\n :grinning: Recovered Today: ${cases_data.todayRecovered}\n\n :smiley: Recovered: ${cases_data.recovered}\n\n :thermometer: Critical: ${cases_data.critical}\n\n :test_tube: Total Tests: ${cases_data.tests} \n\n Stay safe and wear a mask.`;
            //send it
            msg.channel.send(cases_info);
          });
        
        
        })
        .catch(error => {
          //if error send msg tagging the user
          msg.reply("Something went wrong! :( Please check the name of the country make sure it's spelled correctly.");
      });

    }

});
//missing token
client.login('');