## Introduction
A basic implementation of a Gantt Chart using D3.js. modified to support tooltips, zooming and panning.

Here is a example [Example 1] (http://bl.ocks.org/dk8996/5534835) and another one [Example 2] (http://bl.ocks.org/dk8996/5449641).

![screenshot](https://raw.githubusercontent.com/ixaxaar/Gantt-Chart/master/examples/screenshot1.png)

## Getting Started
### Data
Create a array of all your data.

```javascript
var tasks = [
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
  }];

```

### Task Names
Create a array of task names, they will be display on they y-axis in the order given to the array.

```javascript
var taskNames = [ "D Job", "P Job", "E Job", "A Job", "N Job" ];
```

### Create a Simple Gantt-Chart
Create a simple Gantt-Chart

```javascript
var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus);
gantt(tasks);
```

## Dependencies & Building
Relies on the fantastic [D3 visualization library](http://mbostock.github.com/d3/) to do lots of the heavy lifting for stacking and rendering to SVG.

## License

   Copyright 2012 Dimitry Kudryavtsev

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   [![githalytics.com alpha](https://cruel-carlota.pagodabox.com/c088458a0319a78b63aaea9c54fba4de "githalytics.com")](http://githalytics.com/dk8996/Gantt-Chart)
