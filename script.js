$(document).ready(function () {
    var dt='';
    var error = false;
    var citiesArr = [];
    $("#weekForecast").hide()
    $("#cityError").hide()
    $("#error").hide()
    $("#cityLoading").hide()
    $("#submitWeather").click(function (){
        var city= $("#city").val();
        if(city === '') {
            $("#error").html("Field cannot be empty");
            $("#error").show()
            return;
        }
        $("#cityLoading").show()
        var url ='http://api.openweathermap.org/data/2.5/forecast?q=' + city +'&units=imperial&appid=5a1c8e04b97347a6ea98a3542a6db2fe'
       console.log(url)
        $.ajax({
            type: "get",
            url: url,
            success: function(data){
                dt=data;
                error = false;
                $("#cityError").hide()
                $("#error").hide()
            },
            error: function(data){
                console.log(data)
                error = true
                $("#cityError").show()
                $("#show").html('');
                $("#showMini").html('');
            },
            complete:function(){
                
                if(error) return;
                var currItem = dt.list[0];
                console.log(dt)
                $.ajax({
                    url: 'http://api.openweathermap.org/data/2.5/uvi/forecast?appid=5a1c8e04b97347a6ea98a3542a6db2fe&lat='+dt.city.coord.lat+'&lon='+dt.city.coord.lon+'&cnt=5&start='+Date.now(),
                    success: function(data2){
                        /*do some thing in second function*/
                        console.log(dt)
                        console.log(data2)
                        currItem.uvIndex = data2[0].value

                        $("#showMini").html('');
                        
                        if(!citiesArr.includes(dt.city.name + ", " + dt.city.country)){
                            var prev = addToPreviousCities(dt.city.name + ", " + dt.city.country)
                            $("#previousCities").append(prev);
                            citiesArr.push(dt.city.name + ", " + dt.city.country)
                        }
                        
                        var widget = show(currItem);
                        $("#show").html(widget);
                        $("#weekForecast").show()           
                        $("#city").val('');
                        
                        var uniqueList = []
                        var array = dt.list
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            var tmpdate = new Date(element.dt* 1000).toLocaleDateString("en-US")
                            if(!uniqueList.includes(tmpdate)){
                                if(index > 0){
                                    var miniwidget = showMini(element)
                                    $("#showMini").append(miniwidget);
                                }
                                
                                uniqueList.push(tmpdate)
                            }
                        }
                        $("#cityLoading").hide()
                    },
                });
            }
        });
    });

    $("#previousCities").on('click', 'li', function () {
        var currCity = $(this).text()
        $("#city").val(currCity);
        $("#submitWeather").click()
        
     });

    function addToPreviousCities(_city){
        return '<li class="list-group-item prevCity">'+_city+'</li>'
    }
    
    function show(data){
        var _color = 'green'
        if(data.uvIndex > 2){
            _color = 'yellow'
        }

        if(data.uvIndex > 7){
            _color = 'red'
        }
        
        return "<h2>Current Weather for " + dt.city.name + ", " + dt.city.country +"</h2>" +
                "<h6><img src='http://openweathermap.org/img/w/"+data.weather[0].icon+".png'>"+ data.weather[0].description +"</h6>" +    
                "<h6><strong>Temperature</strong>: "+ data.main.temp +"&deg;F</h6>" +
                "<h6><strong>Humidity</strong>: "+ data.main.humidity +"%</h6>" +
                "<h6><strong>Wind Speed</strong>: "+ data.wind.speed +"m/s</h6>" +
                '<h6><strong>UV Index</strong>: <span class="'+_color+'" style="padding:5px;">'+ data.uvIndex +'</span></h6>';

    }

    function showMini(data){
        return '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6">'+
        '<div class="card">'+
            '<div class="card-body" style="text-align:center;">'+
                '<h5 class="card-title">'+new Date(data.dt* 1000).toLocaleDateString("en-US")+'</h5>'+
                '<h6><img src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png"><br />'+ data.weather[0].description +'</h2>'+
                '<div class="card-text">temp: '+ data.main.temp +'&deg;F</div>'+
                '<div class="card-text">humidity: '+ data.main.humidity +'%</div>'+
           '</div>'+
        '</div>'+
        '</div>'

    }
});


