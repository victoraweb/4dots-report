Chart.defaults.global.responsive = true;

var chartColors = [
	"#D24D57",
	"#D91E18",
	"#96281B",
	"#446CB3",
	"#F1A9A0",
	"#D2527F",
	"#DCC6E0",
	"#F7CA18",
	"#FDE3A7",
	"#F89406",
	"#663399",
	"#913D88",
	"#BE90D4",
	"#446CB3",
	"#81CFE0",
	"#22A7F0",
	"#A2DED0",
	"#87D37C",
	"#26A65B",
	"#65C6BB",
	"#36D7B7",
	"#86E2D5",
	"#D35400",
	"#ECECEC",
	"#6C7A89",
	"#95A5A6",
	"#BFBFBF",
	"#9B59B6",
	"#22A7F0"
];

var currencyFormat = function (num) {
    return "R$ " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

var compareValues = function(a, b){
	if(a.value < b.value) {
		return 1;
	}
	if(a.value > b.value) {
		return -1;
	}
	return 0;

}

var currencyToNumber = function (currency) {
	return Number(currency.replace(/\.|,[0-9]{2}/g,""));
}

var populateRankingTable = function(objects) {
	var $table = $("#table-body");
	$table.empty();
	var despesaTotal = 0;

	for(var i = 0; i < objects.length; i++) {
		var	$tr = $("<tr>");
		var $td = $("<td>")

		$td.html(i+1);
		$tr.append($td);

		$td = $("<td>");
		$td.html(objects[i].label);
		$tr.append($td);

		$td = $("<td>");
		$td.addClass('hidden-xs');
		$td.html("R$ " + objects[i].currency);
		$tr.append($td);

		$td = $("<td>", { class: "text-center" });
		var $label = $("<span>", { class: "badge bg-red my-badge" });
		$label.html(objects[i].value + "%");
		$td.append($label);
		$tr.append($td);
		// $tr.css("background-color", chartColors[i]);
		$table.append($tr);
		despesaTotal += objects[i].number;
	}

	// add valor total de despesas no final da tabela
	var	$tr = $("<tr>");
	var $td = $("<td>");
	$tr.append($td);

	$td = $("<td>");
	$td.html("<strong>TOTAL</strong>");
	$tr.append($td);

	$td = $("<td>", { colspan: '2' });
	$td.html("<strong>" + currencyFormat(despesaTotal) + "</strong>");
	$tr.append($td);

	$table.append($tr);

};

var myPieChart = null;
var myLineChart = null;
var myMonthChart = null;
var dados = null;

var createCharts = function(year) {
	var chartData = [];
	var line = [];

	var totalExecutado = 0;
	var totalRealizado = 0;

	for(var i = 0; i < dados.despesas[year][11].length; i++) {
		var obj = dados.despesas[year][11][i];
		totalExecutado += currencyToNumber(obj.executada);
		// console.log(totalExecutado);
	}
	// console.log("============= ");
	for(var i = 0; i < dados.despesas[year][11].length; i++) {
		var obj = dados.despesas[year][11][i];
		totalRealizado += currencyToNumber(obj.realizada);
	}

	var test = 0;
	for(var i = 0; i < dados.despesas[year][11].length; i++) {
		var obj = dados.despesas[year][11][i];
		var percent = (100.0 * currencyToNumber(obj.executada)) / totalExecutado;
		test++;
		// console.log(Math.floor(percent * 100) / 100);
		line.push({
			value: Math.floor(percent * 100) / 100,
			currency: obj.executada,
			number: currencyToNumber(obj.executada),
			label: obj.descricao,
			color: chartColors[i],
        	highlight: "#F62459"
		});
	}
	// console.log("TOTAL: " + test);


    var options = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,

        //String - The colour of each segment stroke
        segmentStrokeColor : "#fff",

        //Number - The width of each segment stroke
        segmentStrokeWidth : 0,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout : 0, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps : 100,

        //String - Animation easing effect
        animationEasing : "easeOutBounce",

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate : true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale : true,

        //String - A legend template
        tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value + ' %' %>"

    };

	// Get the context of the canvas element we want to select
    var context = document.getElementById("pie-chart").getContext("2d");
    if (myPieChart != null) {
    	myPieChart.destroy();
    }

    myPieChart = new Chart(context).Pie(line, options);

	var sortedValues = line.sort(compareValues);

	populateRankingTable(sortedValues);


	//==================================================
	// LINE CHART
	//==================================================
	var despesas_bruta = dados.despesas_bruta[year];
	var receitas_bruta = dados.receitas_bruta[year];

	var data = {
	    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
	    datasets: [
	        {
	            label: "Receita",
	            fillColor: "rgba(46, 204, 113,0.2)",
	            strokeColor: "rgba(46, 204, 113,1.0)",
	            pointColor: "rgba(46, 204, 113,1.0)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(46, 204, 113,1.0)",
	            data: receitas_bruta
	        },
	        {
	            label: "Despesa",
	            fillColor: "rgba(231, 76, 60,0.2)",
	            strokeColor: "rgba(231, 76, 60,1.0)",
	            pointColor: "rgba(231, 76, 60,1.0)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(231, 76, 60,1.0)",
	            data: despesas_bruta
	        }
	    ]
	};

	var options = {

		scaleLabel: function (value) {
			// console.log(value);
    		return currencyFormat(Number(value.value));
		},

	    ///Boolean - Whether grid lines are shown across the chart
	    scaleShowGridLines : true,

	    //String - Colour of the grid lines
	    scaleGridLineColor : "rgba(0,0,0,.05)",

	    //Number - Width of the grid lines
	    scaleGridLineWidth : 1,

	    //Boolean - Whether to show horizontal lines (except X axis)
	    scaleShowHorizontalLines: true,

	    //Boolean - Whether to show vertical lines (except Y axis)
	    scaleShowVerticalLines: true,

	    //Boolean - Whether the line is curved between points
	    bezierCurve : true,

	    //Number - Tension of the bezier curve between points
	    bezierCurveTension : 0.4,

	    //Boolean - Whether to show a dot for each point
	    pointDot : true,

	    //Number - Radius of each point dot in pixels
	    pointDotRadius : 4,

	    //Number - Pixel width of point dot stroke
	    pointDotStrokeWidth : 1,

	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	    pointHitDetectionRadius : 20,

	    //Boolean - Whether to show a stroke for datasets
	    datasetStroke : true,

	    //Number - Pixel width of dataset stroke
	    datasetStrokeWidth : 2,

	    //Boolean - Whether to fill the dataset with a colour
	    datasetFill : true,

	    multiTooltipTemplate: "<%if (label){%><%=datasetLabel %>: <%}%><%= currencyFormat(value) %>",

	    //String - A legend template
	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};

	if (myLineChart != null) {
    	myLineChart.destroy();
    }
  var lineChartContext = context = document.getElementById("line-chart").getContext("2d");
	myLineChart = new Chart(lineChartContext).Line(data, options);

	//==================================================
	// LINE CHART COM GASTOS DE CADA MES
	//==================================================
	var gastosMesais 		= [];
	var receitasMensais = [];

	for(var i=0; i < dados.receitas_bruta[year].length; i++){
		if(i === 0){
			receitasMensais.push(dados.receitas_bruta[year][0]);
		}
		else if (dados.receitas_bruta[year][i] === 0) {
			receitasMensais.push(0);
		}
		else {
			receitasMensais.push(dados.receitas_bruta[year][i] - dados.receitas_bruta[year][i-1]);
		}
	}

	for(var i=0; i<dados.despesas_bruta[year].length; i++){
		if(i === 0){
			gastosMesais.push(dados.despesas_bruta[year][0]);
		}
		else if (dados.despesas_bruta[year][i] === 0) {
			gastosMesais.push(0);
		}
		else {
			gastosMesais.push(dados.despesas_bruta[year][i] - dados.despesas_bruta[year][i-1]);
		}
	}

	console.log("RECEITA: " + receitasMensais);
	console.log("DESPESAS: " + gastosMesais);

	var monthData = {
	    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
	    datasets: [
	        {
	            label: "Receita",
	            fillColor: "rgba(46, 204, 113,0.2)",
	            strokeColor: "rgba(46, 204, 113,1.0)",
	            pointColor: "rgba(46, 204, 113,1.0)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(46, 204, 113,1.0)",
	            data: receitasMensais
	        },
	        {
	            label: "Despesa",
	            fillColor: "rgba(231, 76, 60,0.2)",
	            strokeColor: "rgba(231, 76, 60,1.0)",
	            pointColor: "rgba(231, 76, 60,1.0)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(231, 76, 60,1.0)",
	            data: gastosMesais
	        }
	    ]
	};

	if (myMonthChart != null) {
    	myMonthChart.destroy();
    }
  var monthChartContext = context = document.getElementById("month-chart").getContext("2d");
	myMonthChart = new Chart(monthChartContext).Line(monthData, options);

}

var observeYearChanges = function(year) {
	dados = dadosAbertos;
	createCharts(year);
};
