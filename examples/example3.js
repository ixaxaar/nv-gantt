var tasks = [
    {
        "startDate":new Date("Mon Mar 1 2014 17:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 2 2014 17:16:02 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "1"
    },
    {
        "startDate":new Date("Mon Mar 2 2014 17:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 3 2014 17:16:02 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "2"
    }
    ,
    {
        "startDate":new Date("Mon Mar 3 2014 17:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 4 2014 17:16:02 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "3"
    }
    ,
    {
        "startDate":new Date("Mon Mar 4 2014 17:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 5 2014 17:16:02 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "4"
    }
    ,
    {
        "startDate":new Date("Mon Mar 5 2014 17:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 6 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "5"
    },
    {
        "startDate":new Date("Mon Mar 6 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 6 2014 17:00:03 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "7"
    },
        {
        "startDate":new Date("Mon Mar 6 2014 17:00:03 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 6 2014 17:16:03 GMT+0530 (IST)"),
        "taskName":"E Job",
        "value": "6"
    }
    ,
        {
        "startDate":new Date("Mon Mar 1 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 2 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"A Job",
        "value": "1"
    },
    {
        "startDate":new Date("Mon Mar 2 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 3 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"A Job",
        "value": "2"
    }
    ,
    {
        "startDate":new Date("Mon Mar 3 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 4 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"A Job",
        "color":"#736474",
        "value": "3"
    }
    ,
    {
        "startDate":new Date("Mon Mar 4 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 5 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"A Job",
        "color":"#927938",
        "value": "4"
    }
    ,
    {
        "startDate":new Date("Mon Mar 5 2014 17:00:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 6 2014 17:00:02 GMT+0530 (IST)"),
        "taskName":"A Job",
        "color":"#736474",
        "value": "5"
    }
    ,
        {
        "startDate":new Date("Mon Mar 1 2014 8:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 2 2014 8:16:02 GMT+0530 (IST)"),
        "taskName":"N Job",
        "color":"#736474",
        "value": "1"
    },
    {
        "startDate":new Date("Mon Mar 2 2014 8:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 3 2014 8:16:02 GMT+0530 (IST)"),
        "taskName":"N Job",
        "color":"#927938",
        "value": "2"
    }
    ,
    {
        "startDate":new Date("Mon Mar 3 2014 8:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 4 2014 8:16:02 GMT+0530 (IST)"),
        "taskName":"N Job",
        "color":"#736474",
        "value": "3"
    }
    ,
    {
        "startDate":new Date("Mon Mar 4 2014 8:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 5 2014 8:16:02 GMT+0530 (IST)"),
        "taskName":"N Job",
        "color":"#927938",
        "value": "4"
    }
    ,
    {
        "startDate":new Date("Mon Mar 5 2014 8:16:02 GMT+0530 (IST)"),
        "endDate":new Date("Mon Mar 6 2014 8:16:02 GMT+0530 (IST)"),
        "taskName":"N Job",
        "color":"#736474",
        "value": "5"
    }
];

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed"
    // "RUNNING" : "bar-running",
    // "KILLED" : "bar-killed"
};

var taskNames = [ "D Job", "P Job", "E Job", "A Job", "N Job" ];

tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = tasks[tasks.length - 1].endDate;
tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = tasks[0].startDate;

var format = "%H:%M";
var timeDomainString = "1day";

var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 80
};
gantt.margin(margin);

gantt.timeDomainMode("fixed");
changeTimeDomain(timeDomainString);


gantt.tickFormat(function(d) {
    var td = gantt.timeDomain();
    var tdiff = (td[1]-td[0])/1000;
    if (tdiff < 100)
        return moment(d).format('h:mm:ss a');
    else if (tdiff < 3600)
        return moment(d).format('h:mm a');
    else if (tdiff < 86400)
        return moment(d).format('h:mm a');
    else if (tdiff < 604800)
        return moment(d).format('ddd h:mm a');
    else if (tdiff < 31536000)
        return moment(d).format('Do MMM \'YY ');
    else
        return moment(d).format('lll');
});

gantt(tasks);

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
    case "1min":
    gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -1), getEndDate() ]);
    break;
    case "1hr":
	gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
	break;
    case "3hr":
	gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
	break;

    case "6hr":
	gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
	break;

    case "1day":
	gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
	break;

    case "1week":
	gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
	break;

    case "4week":
    gantt.timeDomain([ d3.time.day.offset(getEndDate(), -28), getEndDate() ]);
    break;

    default:

    }
    gantt.redraw(tasks);
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
	lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    tasks.push({
	"startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
	"endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
	"taskName" : taskName,
	"status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
