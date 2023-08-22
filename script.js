const countrySelect1 = document.getElementById("country1");
const countrySelect2 = document.getElementById("country2");
const startDateInput1 = document.getElementById("startDate1");
const getDataBtn = document.getElementById("getDataBtn");
const canvas = document.getElementById("myChart");
const ctx = canvas.getContext("2d");
let myChart; // Declare uma variável para armazenar o objeto do gráfico


const config = {
  "accept": "application/json",
  "X-CSRF-TOKEN": ""
}

axios.get("https://covid-api.com/api/regions?per_page=", config)
  .then(response => {
    const countries = response.data.data;

    countrySelect1.innerHTML = "";
    countrySelect2.innerHTML = "";

    countries.forEach(country => {
      const option1 = document.createElement("option");
      option1.value = country.iso;
      option1.textContent = country.name;
      countrySelect1.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = country.iso;
      option2.textContent = country.name;
      countrySelect2.appendChild(option2);
    });
  })
  .catch(error => {
    console.error('Erro ao obter lista de países:', error);
  });

function getAndPlotData(countryCode1, countryCode2, startDate) {
  if (myChart) {
    myChart.destroy();
  }

  axios.get(`https://covid-api.com/api/reports/total?date=${startDate}&iso=${countryCode1}`, config)
    .then(response1 => {
      const data1 = response1.data;
      console.log(data1.data)

      axios.get(`https://covid-api.com/api/reports/total?date=${startDate}&iso=${countryCode2}`, config)
        .then(response2 => {
          const data2 = response2.data;
          console.log(data2.data)

          const labels = ["Confirmados", "Mortes", "Recuperados"];
          const values1 = [
            data1.data.confirmed,
            data1.data.deaths,
            data1.data.recovered,
          ];
          const values2 = [
            data2.data.confirmed,
            data2.data.deaths,
            data2.data.recovered,
          ];

           myChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: `País 1 (${countryCode1})`,
                  data: values1,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
                {
                  label: `País 2 (${countryCode2})`,
                  data: values2,
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  borderColor: "rgba(255, 206, 86, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        })
        .catch(error => {
          console.error('Erro ao obter dados do segundo país:', error);
        });
    })
    .catch(error => {
      console.error('Erro ao obter dados do primeiro país:', error);
    });
}

getDataBtn.addEventListener("click", () => {
  const countryCode1 = countrySelect1.value;
  const countryCode2 = countrySelect2.value;
  const startDate = startDateInput1.value;

  if (countryCode1 && countryCode2 && startDate) {
    getAndPlotData(countryCode1, countryCode2, startDate);
  }
});
