/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.19028340080972, "KoPercent": 0.8097165991902834};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7582897033158813, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/assets\/f8265a54ui16891dcb0a04c81fdfd1-409"], "isController": false}, {"data": [1.0, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s95659630032604-565"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s91103504037800-614"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json-787"], "isController": false}, {"data": [0.75, 500, 1500, "\/web\/services\/webAnalytics\/dynamicProductData-709"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "\/web\/miniBasketRunningTotal.html-777"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/miniBasketRunningTotal.html-414"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "View_Basket"], "isController": true}, {"data": [0.75, 500, 1500, "\/web\/miniBasketRunningTotal.html-771"], "isController": false}, {"data": [0.4, 500, 1500, "\/web\/p\/battery-charger-leads\/7918270\/-702"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "\/web\/miniBasketRunningTotal.html-482"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s59808748327955-444"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "\/web\/-478"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json-707"], "isController": false}, {"data": [0.75, 500, 1500, "\/web\/ca\/basketsummary\/-400"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/services\/shoppingBasket\/lineItems\/791-8270\/1-770"], "isController": false}, {"data": [1.0, 500, 1500, "\/assets\/f8265a54ui16891dcb0a04c81fdfd1-485"], "isController": false}, {"data": [0.7, 500, 1500, "\/web\/miniBasketRunningTotal.html-647"], "isController": false}, {"data": [0.95, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s93351641723496-657"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "\/web\/services\/webAnalytics\/dynamicHomeData-486"], "isController": false}, {"data": [0.75, 500, 1500, "\/web\/seam\/resource\/remoting\/execute-422"], "isController": false}, {"data": [0.8, 500, 1500, "\/web\/miniBasketRunningTotal.html-645"], "isController": false}, {"data": [1.0, 500, 1500, "\/web\/seam\/resource\/remoting\/interface.js-785"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "\/web\/seam\/resource\/remoting\/execute-387"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "\/web\/miniBasketRunningTotal.html-484"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/seam\/resource\/remoting\/execute-788"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod\/10\/JS-2.10.0\/s58145262317477-388"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/miniBasketRunningTotal.html-393"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s98885114834340-795"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod\/10\/JS-2.10.0\/s96537635333863-774"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "\/api\/config.json-37"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json?mbox=mbox-profile-data&mboxSession=55f7f9e10a2e44d58fd394bfca2863e0&mboxPC=391d22d18cd0402e80ba110dd42fe23f.37_0&mboxPage=0773f98ecdd14202809cd84defc27d02&mboxRid=996ad33fe45a4ab282e8d1d4a77a7db1&mboxVersion=1.6.4&mboxCount=2&mboxTime=1600880480751&mboxHost=ie.rs-online.com&mboxURL=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fp%2Fbattery-charger-leads%2F7918270%2F&mboxReferrer=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2Fbattery-charger-leads%2F&mboxXDomain=enabled&browserHeight=654&browserWidth=1349&browserTimeOffset=60&screenHeight=768&screenWidth=1366&colorDepth=24&devicePixelRatio=1&screenOrientation=landscape&webGLRenderer=ANGLE%20(Intel(R)%20UHD%20Graphics%20620%20Direct3D11%20vs_5_0%20ps_5_0)&profile.categoryAffinities=%7B%22PSSS_114891%22%3A10.25%7D&profile.favouriteCategoryBasedOnAffinity=PSSS_114891&profile.brandAffinities=%7B%22Ansmann%22%3A7%7D&profile.favouriteBrandBasedOnAffinity=Ansmann&profile.favouriteHighCategoryBasedOnAffinity=TCFM&mboxMCSDID=46793A00C43C9B39-78F13357517CF62A&mboxMCGVID=59093218937939380002999581454381340302&mboxAAMB=6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y&mboxMCGLH=6-715"], "isController": false}, {"data": [0.0, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Category_Page_2"], "isController": true}, {"data": [0.2916666666666667, 500, 1500, "Category_Page_1"], "isController": true}, {"data": [0.5, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/assets\/f8265a54ui16891dcb0a04c81fdfd1-549"], "isController": false}, {"data": [0.25, 500, 1500, "Category_Page_3"], "isController": true}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json?mbox=mbox-profile-data&mboxSession=55f7f9e10a2e44d58fd394bfca2863e0&mboxPC=391d22d18cd0402e80ba110dd42fe23f.37_0&mboxPage=49fbaae14667430f973f211b1017b55b&mboxRid=d4c852a911de409e80ef7a26cbc90b7c&mboxVersion=1.6.4&mboxCount=2&mboxTime=1600880472268&mboxHost=ie.rs-online.com&mboxURL=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2Fbattery-charger-leads%2F&mboxReferrer=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2F&mboxXDomain=enabled&browserHeight=654&browserWidth=1349&browserTimeOffset=60&screenHeight=768&screenWidth=1366&colorDepth=24&devicePixelRatio=1&screenOrientation=landscape&webGLRenderer=ANGLE%20(Intel(R)%20UHD%20Graphics%20620%20Direct3D11%20vs_5_0%20ps_5_0)&profile.categoryAffinities=%7B%22PSSS_114891%22%3A6.25%7D&profile.favouriteCategoryBasedOnAffinity=PSSS_114891&profile.favouriteHighCategoryBasedOnAffinity=TCFM&mboxMCSDID=6B54769D25917F36-4EB5D04E13E49AA2&mboxMCGVID=59093218937939380002999581454381340302&mboxAAMB=6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y&mboxMCGLH=6-663"], "isController": false}, {"data": [0.35, 500, 1500, "View_Product"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "\/DX-Analytics\/responsive\/serverComponent.php-600"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json-646"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json-483"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "\/web\/miniBasketRunningTotal.html-599"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s94985000119632-501"], "isController": false}, {"data": [0.375, 500, 1500, "\/web\/c\/batteries-chargers\/-544"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "\/web\/miniBasketRunningTotal.html-550"], "isController": false}, {"data": [0.8, 500, 1500, "\/web\/services\/webAnalytics\/dynamicData-648"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "Homepage"], "isController": true}, {"data": [0.625, 500, 1500, "Add_Product_To_Basket"], "isController": true}, {"data": [0.5, 500, 1500, "\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "\/web\/ca\/basketsummary\/-779"], "isController": false}, {"data": [0.75, 500, 1500, "\/web\/miniBasketRunningTotal.html-706"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "\/web\/ca\/basketsummary\/-389"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/seam\/resource\/remoting\/interface.js-406"], "isController": false}, {"data": [1.0, 500, 1500, "\/m2\/rscomponentsltd\/mbox\/json-415"], "isController": false}, {"data": [1.0, 500, 1500, "\/web\/c\/batteries-chargers\/-544-1"], "isController": false}, {"data": [0.75, 500, 1500, "\/web\/miniBasketRunningTotal.html-708"], "isController": false}, {"data": [1.0, 500, 1500, "\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s93458889441426-722"], "isController": false}, {"data": [1.0, 500, 1500, "\/web\/c\/batteries-chargers\/-544-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/DX-Analytics\/responsive\/serverComponent.php-551"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/web\/miniBasketRunningTotal.html-786"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "Clear_Basket"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 494, 4, 0.8097165991902834, 663.6356275303644, 19, 92633, 150.5, 2031.0, 2387.75, 3491.5500000000006, 0.729183580084727, 6.917489485235508, 1.5051880180118675], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/assets\/f8265a54ui16891dcb0a04c81fdfd1-409", 6, 0, 0.0, 76.33333333333333, 27, 195, 47.5, 195.0, 195.0, 195.0, 0.01422957522346362, 0.263330518051402, 0.027454001415842737], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 10.079520089285714, 72.05636160714286], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594-1", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 90.20061200765863, 4.4276531728665205], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s95659630032604-565", 12, 0, 0.0, 224.16666666666669, 167, 306, 222.0, 297.90000000000003, 306.0, 306.0, 0.023775511619290656, 0.10350706132695092, 0.03911118097919444], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s91103504037800-614", 12, 0, 0.0, 61.333333333333336, 46, 90, 59.0, 84.00000000000003, 90.0, 90.0, 0.023313782136591566, 0.10150829849218114, 0.04212342049126025], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json-787", 6, 0, 0.0, 143.16666666666666, 66, 430, 87.0, 430.0, 430.0, 430.0, 0.014558583740973678, 0.24676609876057926, 0.02317667766446347], "isController": false}, {"data": ["\/web\/services\/webAnalytics\/dynamicProductData-709", 10, 0, 0.0, 570.4, 42, 2051, 103.0, 2050.4, 2051.0, 2051.0, 0.01930643560724532, 0.019966323543039836, 0.038149064265332204], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-777", 7, 0, 0.0, 13282.857142857145, 38, 92633, 52.0, 92633.0, 92633.0, 92633.0, 0.012094509956373374, 0.013354917174204138, 0.02189092803766576], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-414", 6, 0, 0.0, 406.8333333333333, 49, 2049, 82.0, 2049.0, 2049.0, 2049.0, 0.014339007597284192, 0.0180217800563523, 0.028155238875917397], "isController": false}, {"data": ["View_Basket", 6, 0, 0.0, 1879.3333333333333, 1057, 3245, 1345.0, 3245.0, 3245.0, 3245.0, 0.014700333697574935, 0.9195676027002063, 0.18774508212586427], "isController": true}, {"data": ["\/web\/miniBasketRunningTotal.html-771", 8, 0, 0.0, 550.875, 41, 2117, 143.5, 2117.0, 2117.0, 2117.0, 0.015952461664240563, 0.016764494930108276, 0.02960708339149335], "isController": false}, {"data": ["\/web\/p\/battery-charger-leads\/7918270\/-702", 10, 0, 0.0, 1166.8, 377, 2647, 647.0, 2634.2, 2647.0, 2647.0, 0.01943774382219907, 0.5766062440350423, 0.03764734113531974], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-482", 13, 0, 0.0, 686.7692307692307, 37, 3062, 63.0, 3053.2, 3062.0, 3062.0, 0.02261671967097892, 0.032494544803721666, 0.041550067328234706], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s59808748327955-444", 6, 0, 0.0, 160.0, 62, 234, 153.5, 234.0, 234.0, 234.0, 0.014360525786717471, 0.06251643607052933, 0.04576716396968014], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639", 12, 2, 16.666666666666668, 1134.1666666666667, 248, 5361, 569.5, 4479.600000000003, 5361.0, 5361.0, 0.023250496979372932, 0.6600961408050097, 0.05622086724838118], "isController": false}, {"data": ["\/web\/-478", 13, 0, 0.0, 844.6153846153846, 212, 3178, 361.0, 2824.7999999999997, 3178.0, 3178.0, 0.02256490012428053, 0.6049332404411611, 0.03012665038377688], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json-707", 10, 0, 0.0, 158.2, 57, 302, 103.0, 301.8, 302.0, 302.0, 0.019358198293768402, 0.3818650371822594, 0.049132770864750076], "isController": false}, {"data": ["\/web\/ca\/basketsummary\/-400", 6, 0, 0.0, 955.3333333333334, 357, 3379, 448.5, 3379.0, 3379.0, 3379.0, 0.01414370475487781, 0.49400295868623845, 0.027359689292272588], "isController": false}, {"data": ["\/web\/services\/shoppingBasket\/lineItems\/791-8270\/1-770", 9, 0, 0.0, 584.8888888888889, 168, 2225, 263.0, 2225.0, 2225.0, 2225.0, 0.01759991864926491, 0.016696624213381413, 0.03456008331117048], "isController": false}, {"data": ["\/assets\/f8265a54ui16891dcb0a04c81fdfd1-485", 13, 0, 0.0, 168.61538461538464, 113, 240, 164.0, 234.0, 240.0, 240.0, 0.02282006902193184, 0.01847445040935693, 0.07636974721507389], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-647", 10, 0, 0.0, 656.9, 42, 2144, 177.0, 2135.0, 2144.0, 2144.0, 0.019523394884089607, 0.01941090657372229, 0.03672838662569357], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s93351641723496-657", 10, 0, 0.0, 251.3, 144, 926, 173.5, 855.8000000000003, 926.0, 926.0, 0.019545527396965752, 0.08508985017864612, 0.06573901455848609], "isController": false}, {"data": ["\/web\/services\/webAnalytics\/dynamicHomeData-486", 13, 0, 0.0, 632.0769230769232, 36, 3107, 48.0, 2798.2, 3107.0, 3107.0, 0.02277154187861717, 0.024312794825780186, 0.044496194962934936], "isController": false}, {"data": ["\/web\/seam\/resource\/remoting\/execute-422", 6, 0, 0.0, 593.1666666666666, 41, 2176, 121.0, 2176.0, 2176.0, 2176.0, 0.014342366633918262, 0.015402170418390738, 0.03244773701358461], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-645", 10, 0, 0.0, 511.0, 40, 2255, 117.5, 2136.6000000000004, 2255.0, 2255.0, 0.019358423140284686, 0.02717930170780009, 0.03706079367599033], "isController": false}, {"data": ["\/web\/seam\/resource\/remoting\/interface.js-785", 6, 0, 0.0, 29.166666666666668, 21, 42, 29.0, 42.0, 42.0, 42.0, 0.014698641110629322, 0.00938760867807771, 0.02878005412774589], "isController": false}, {"data": ["\/web\/seam\/resource\/remoting\/execute-387", 6, 0, 0.0, 247.16666666666666, 47, 1084, 90.5, 1084.0, 1084.0, 1084.0, 0.01453090602620891, 0.01219896049531015, 0.033328373652561194], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-484", 13, 0, 0.0, 405.84615384615387, 39, 2071, 51.0, 1700.5999999999997, 2071.0, 2071.0, 0.022639721914554205, 0.025389754241464824, 0.043774324095456035], "isController": false}, {"data": ["\/web\/seam\/resource\/remoting\/execute-788", 6, 0, 0.0, 403.6666666666667, 39, 2047, 86.5, 2047.0, 2047.0, 2047.0, 0.014561127613722406, 0.01562998642781564, 0.032421260702428796], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod\/10\/JS-2.10.0\/s58145262317477-388", 6, 0, 0.0, 127.16666666666667, 49, 250, 109.5, 250.0, 250.0, 250.0, 0.01430741386340712, 0.062287549807684514, 0.03946182215646111], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-393", 6, 0, 0.0, 415.83333333333337, 41, 2105, 80.5, 2105.0, 2105.0, 2105.0, 0.014405520195338853, 0.013756052569344573, 0.02669616747137503], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s98885114834340-795", 6, 0, 0.0, 96.83333333333334, 44, 216, 58.0, 216.0, 216.0, 216.0, 0.014587289122501623, 0.06355110155306004, 0.04679376323492586], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod\/10\/JS-2.10.0\/s96537635333863-774", 8, 0, 0.0, 81.5, 47, 268, 52.0, 268.0, 268.0, 268.0, 0.015936762924714732, 0.06937900099903582, 0.04359848558420189], "isController": false}, {"data": ["\/api\/config.json-37", 13, 0, 0.0, 317.6153846153846, 89, 1929, 173.0, 1309.7999999999995, 1929.0, 1929.0, 0.022671663733883497, 0.03846280451968336, 0.01503326140166689], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json?mbox=mbox-profile-data&mboxSession=55f7f9e10a2e44d58fd394bfca2863e0&mboxPC=391d22d18cd0402e80ba110dd42fe23f.37_0&mboxPage=0773f98ecdd14202809cd84defc27d02&mboxRid=996ad33fe45a4ab282e8d1d4a77a7db1&mboxVersion=1.6.4&mboxCount=2&mboxTime=1600880480751&mboxHost=ie.rs-online.com&mboxURL=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fp%2Fbattery-charger-leads%2F7918270%2F&mboxReferrer=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2Fbattery-charger-leads%2F&mboxXDomain=enabled&browserHeight=654&browserWidth=1349&browserTimeOffset=60&screenHeight=768&screenWidth=1366&colorDepth=24&devicePixelRatio=1&screenOrientation=landscape&webGLRenderer=ANGLE%20(Intel(R)%20UHD%20Graphics%20620%20Direct3D11%20vs_5_0%20ps_5_0)&profile.categoryAffinities=%7B%22PSSS_114891%22%3A10.25%7D&profile.favouriteCategoryBasedOnAffinity=PSSS_114891&profile.brandAffinities=%7B%22Ansmann%22%3A7%7D&profile.favouriteBrandBasedOnAffinity=Ansmann&profile.favouriteHighCategoryBasedOnAffinity=TCFM&mboxMCSDID=46793A00C43C9B39-78F13357517CF62A&mboxMCGVID=59093218937939380002999581454381340302&mboxAAMB=6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y&mboxMCGLH=6-715", 10, 0, 0.0, 68.3, 31, 208, 36.0, 206.70000000000002, 208.0, 208.0, 0.019337983473759323, 0.00934795099561608, 0.032304252470910844], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639-0", 2, 2, 100.0, 1582.5, 43, 3122, 1582.5, 3122.0, 3122.0, 3122.0, 0.044485964678144044, 0.04570237777481205, 0.0945761182659371], "isController": false}, {"data": ["Category_Page_2", 12, 0, 0.0, 2769.5833333333335, 588, 8746, 781.0, 8422.000000000002, 8746.0, 8746.0, 0.023380464452926356, 1.2121423702238094, 0.19694350049878323], "isController": true}, {"data": ["Category_Page_1", 12, 0, 0.0, 2845.166666666667, 841, 7927, 1034.0, 7605.100000000001, 7927.0, 7927.0, 0.023654269201353023, 1.7228404483814566, 0.22737204272355255], "isController": true}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639-1", 2, 0, 0.0, 1281.0, 324, 2238, 1281.0, 2238.0, 2238.0, 2238.0, 0.04743833017077799, 1.3387893589895636, 0.09994941146821633], "isController": false}, {"data": ["\/assets\/f8265a54ui16891dcb0a04c81fdfd1-549", 12, 0, 0.0, 34.41666666666667, 19, 63, 29.5, 60.900000000000006, 63.0, 63.0, 0.02387185587764878, 0.44176920789203555, 0.04275875226782631], "isController": false}, {"data": ["Category_Page_3", 12, 2, 16.666666666666668, 2893.8333333333335, 372, 6939, 1322.0, 6932.1, 6939.0, 6939.0, 0.023052407727935487, 1.1832668815663343, 0.29362929303068086], "isController": true}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json?mbox=mbox-profile-data&mboxSession=55f7f9e10a2e44d58fd394bfca2863e0&mboxPC=391d22d18cd0402e80ba110dd42fe23f.37_0&mboxPage=49fbaae14667430f973f211b1017b55b&mboxRid=d4c852a911de409e80ef7a26cbc90b7c&mboxVersion=1.6.4&mboxCount=2&mboxTime=1600880472268&mboxHost=ie.rs-online.com&mboxURL=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2Fbattery-charger-leads%2F&mboxReferrer=https%3A%2F%2Fie.rs-online.com%2Fweb%2Fc%2Fbatteries-chargers%2Fbattery-charger-accessories%2F&mboxXDomain=enabled&browserHeight=654&browserWidth=1349&browserTimeOffset=60&screenHeight=768&screenWidth=1366&colorDepth=24&devicePixelRatio=1&screenOrientation=landscape&webGLRenderer=ANGLE%20(Intel(R)%20UHD%20Graphics%20620%20Direct3D11%20vs_5_0%20ps_5_0)&profile.categoryAffinities=%7B%22PSSS_114891%22%3A6.25%7D&profile.favouriteCategoryBasedOnAffinity=PSSS_114891&profile.favouriteHighCategoryBasedOnAffinity=TCFM&mboxMCSDID=6B54769D25917F36-4EB5D04E13E49AA2&mboxMCGVID=59093218937939380002999581454381340302&mboxAAMB=6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y&mboxMCGLH=6-663", 10, 0, 0.0, 117.1, 33, 224, 133.5, 221.3, 224.0, 224.0, 0.019575792574901878, 0.009462907543531669, 0.031158773747883367], "isController": false}, {"data": ["View_Product", 10, 0, 0.0, 3287.0, 833, 9252, 1243.0, 9136.2, 9252.0, 9252.0, 0.019292133053983248, 1.1060194951827544, 0.292925794859997], "isController": true}, {"data": ["\/DX-Analytics\/responsive\/serverComponent.php-600", 12, 0, 0.0, 516.5, 45, 2128, 102.5, 1836.400000000001, 2128.0, 2128.0, 0.023296175932720643, 0.021895144518798072, 0.0580679176955811], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json-646", 10, 0, 0.0, 103.9, 58, 280, 64.5, 276.40000000000003, 280.0, 280.0, 0.019575102818227552, 0.3750696751315936, 0.032113491430019986], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json-483", 13, 0, 0.0, 246.2307692307692, 191, 304, 262.0, 298.4, 304.0, 304.0, 0.0225022112749926, 0.400152942012667, 0.03254470204908598], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-599", 12, 0, 0.0, 910.25, 40, 3073, 146.0, 3068.5, 3073.0, 3073.0, 0.02316414499210489, 0.02963004809455604, 0.044735377995413494], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s94985000119632-501", 12, 0, 0.0, 185.33333333333331, 140, 233, 183.0, 232.7, 233.0, 233.0, 0.024019984627209837, 0.10457137838681783, 0.0664068129683897], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/-544", 12, 0, 0.0, 1471.5, 417, 3592, 626.5, 3576.4, 3592.0, 3592.0, 0.023848277260071424, 1.1399798699424264, 0.04890565907198404], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-550", 12, 0, 0.0, 719.1666666666666, 39, 3045, 55.0, 2748.300000000001, 3045.0, 3045.0, 0.02381410708013249, 0.028042816524212, 0.042932447440281164], "isController": false}, {"data": ["\/web\/services\/webAnalytics\/dynamicData-648", 10, 0, 0.0, 470.4, 37, 2083, 93.0, 1981.7000000000003, 2083.0, 2083.0, 0.019446475520776614, 0.02199312822325332, 0.03873722731179701], "isController": false}, {"data": ["Homepage", 13, 0, 0.0, 3472.846153846154, 976, 10276, 1391.0, 9996.0, 10276.0, 10276.0, 0.023001358849507415, 1.2591412431615192, 0.3465789183257134], "isController": true}, {"data": ["Add_Product_To_Basket", 8, 0, 0.0, 12887.875, 321, 97027, 606.0, 97027.0, 97027.0, 97027.0, 0.013599313234681647, 0.09916940600749663, 0.11068200821483515], "isController": true}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/-594", 12, 0, 0.0, 1281.5000000000002, 425, 3489, 605.0, 3483.9, 3489.0, 3489.0, 0.02354820415508062, 1.0660564073927625, 0.051636259843639926], "isController": false}, {"data": ["\/web\/ca\/basketsummary\/-779", 6, 0, 0.0, 818.3333333333334, 434, 1213, 842.0, 1213.0, 1213.0, 1213.0, 0.014662469941936618, 0.560591282428496, 0.027263030048288398], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-706", 10, 0, 0.0, 552.9, 43, 2046, 52.0, 2045.6, 2046.0, 2046.0, 0.01930788939668638, 0.027093267845799473, 0.037318529974532895], "isController": false}, {"data": ["\/web\/ca\/basketsummary\/-389", 6, 0, 0.0, 907.0, 378, 2459, 579.5, 2459.0, 2459.0, 2459.0, 0.014170126539229994, 0.4935650650881146, 0.028723104804617573], "isController": false}, {"data": ["\/web\/seam\/resource\/remoting\/interface.js-406", 6, 0, 0.0, 360.0, 21, 2020, 29.5, 2020.0, 2020.0, 2020.0, 0.014254930424060421, 0.009111183557175339, 0.028421695588336616], "isController": false}, {"data": ["\/m2\/rscomponentsltd\/mbox\/json-415", 6, 0, 0.0, 170.83333333333334, 70, 262, 188.5, 262.0, 262.0, 262.0, 0.014299162307408159, 0.24234566586432477, 0.022749725187974402], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/-544-1", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 106.1993269836272, 4.735221190176322], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-708", 10, 0, 0.0, 723.7, 44, 3280, 183.5, 3156.5000000000005, 3280.0, 3280.0, 0.019256283806813258, 0.021101050839477692, 0.03759864633138909], "isController": false}, {"data": ["\/b\/ss\/rscomponentsprod,rscomponentssandpitireland,rscomponentsdsprod\/10\/JS-2.10.0\/s93458889441426-722", 9, 0, 0.0, 51.888888888888886, 45, 63, 53.0, 63.0, 63.0, 63.0, 0.017625769658608428, 0.07682777701345042, 0.06221804888605136], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/-544-0", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 12.744140625, 93.5546875], "isController": false}, {"data": ["\/DX-Analytics\/responsive\/serverComponent.php-551", 12, 0, 0.0, 395.91666666666663, 35, 1139, 60.0, 1124.6000000000001, 1139.0, 1139.0, 0.023798757704847805, 0.023701920311843056, 0.05527478392711234], "isController": false}, {"data": ["\/web\/miniBasketRunningTotal.html-786", 6, 0, 0.0, 388.16666666666663, 37, 1700, 159.5, 1700.0, 1700.0, 1700.0, 0.014722517354167332, 0.019177133200748885, 0.028381102790162416], "isController": false}, {"data": ["Clear_Basket", 6, 0, 0.0, 4419.666666666667, 1409, 14804, 1993.0, 14804.0, 14804.0, 14804.0, 0.014519618424427807, 1.7232475841472388, 0.34547191709176883], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["One or more sub-samples failed", 2, 50.0, 0.4048582995951417], "isController": false}, {"data": ["Response was null", 2, 50.0, 0.4048582995951417], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 494, 4, "One or more sub-samples failed", 2, "Response was null", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639", 12, 2, "One or more sub-samples failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/web\/c\/batteries-chargers\/battery-charger-accessories\/battery-charger-leads\/-639-0", 2, 2, "Response was null", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
