/**
 * Created by nayantara on 6/22/16.
 */

//TODO Load complete Json output after edition
/**
 * @description Global variable declarations
 * @type {number}
 */

// i --> newAgent ID (Dropped Element ID)
var i = 1;

//droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
var droptype;

// finalElementCount --> Number of elements that exist on the canvas at the time of saving the model
var finalElementCount=0;

/**
 * @description jsPlumb function opened
 */

jsPlumb.ready(function() {

    jsPlumb.Defaults.PaintStyle = {strokeStyle: "darkblue", lineWidth: 2, dashstyle: '3 3'}; //Connector line style
    jsPlumb.Defaults.EndpointStyle = {radius: 7, fillStyle: "darkblue"}; //Connector endpoint/anchor style
    jsPlumb.importDefaults({Connector: ["Bezier", {curviness: 50}]}); //Connector line style
    jsPlumb.setContainer($('#container'));
    var canvas = $('#container');
    /**
     * @function draggable method for the 'import stream' tool
     * @helper clone
     */


    $(".stream").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'window' tool
     * @helper clone
     */

    $(".wstream").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Pass through query' tool
     * @helper clone
     */

    $(".squery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Filter query' tool
     * @helper clone
     */
    $(".filter").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'windows query' tool
     * @helper clone
     */
    $(".wquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'Join query' tool
     * @helper clone
     */

    $(".joquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'state-machine query' tool
     * @helper clone
     */

    $(".stquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'Partition' tool
     * @helper clone
     */

    $(".partition").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function droppable method for the 'stream' & the 'query' objects
     */

    canvas.droppable
    ({
        accept: '.stream, .wstream , .squery, .filter, .wquery, .joquery, .stquery , .partition',
        containment: 'container',

        /**
         *
         * @param e --> original event object fired/ normalized by jQuery
         * @param ui --> object that contains additional info added by jQuery depending on which interaction was used
         * @helper clone
         */

        drop: function (e, ui) {
            var mouseTop = e.pageY - canvas.offset().top - 40;
            var mouseLeft = e.pageX - canvas.offset().left - 60;
            var dropElem = ui.draggable.attr('class');
            //Clone the element in the toolbox in order to drop the clone on the canvas
            droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).removeAttr("class");
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);

            var newAgent;
            //If the dropped Element is a Stream then->
            if (dropElem == "stream ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('streamdrop ');

                //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
                canvas.addClass("disabledbutton");
                $("#toolbox").addClass("disabledbutton");

                canvas.append(newAgent);
                //generate the stream definition form
                defineStream(newAgent,i,mouseTop,mouseLeft);
                finalElementCount = i;
                i++;    //Increment the Element ID for the next dropped Element

            }

            //If the dropped Element is a Window(not window query) then->
            else if (dropElem == "wstream ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('wstreamdrop');
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropWindowStream(newAgent, i, e,mouseTop,mouseLeft,"Window");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Pass through Query then->
            else if (dropElem == "squery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('squerydrop ');
                droptype = "squerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropQuery(newAgent, i, e,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Filter query then->
            else if (dropElem == "filter ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('filterdrop ');
                droptype = "filterdrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropQuery(newAgent, i, e,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Window Query then->
            else if (dropElem == "wquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('wquerydrop ');
                droptype = "wquerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Join Query then->
            else if (dropElem == "joquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('joquerydrop');
                droptype = "joquerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a State machine Query(Pattern and Sequence) then->
            else if(dropElem == "stquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('stquerydrop');
                droptype = "stquerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Partition then->
            else{
                newAgent = $('<div>').attr('id', i).addClass('partitiondrop');
                droptype = "partitiondrop";
                $(droppedElement).draggable({containment: "container"});
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropPartition(newAgent,i,e,droptype,mouseTop,mouseLeft);
                finalElementCount=i;
                i++;
            }

            /*
             @function Delete an element detaching all its connections when the 'boxclose' icon is clicked
             @description Though the functionality of the 3 are the same, they are differenciated as their css positioning differs.
             */

            //Remove Element Icon for the stream elements
            newAgent.on('click', '.boxclose', function (e) {
                jsPlumb.remove(newAgent);
                jsPlumb.detachAllConnections(newAgent.attr('id'));
                jsPlumb.removeAllEndpoints($(this));
                jsPlumb.detach($(this));
            });

            //Remove Element Icon for the Window stream element
            newAgent.on('click', '.boxclosewindow', function (e) {
                jsPlumb.remove(newAgent);
            });

            //Remove Element Icon for the query element
            newAgent.on('click', '.boxclose1', function (e) {
                jsPlumb.remove(newAgent);
            });
            newAgent.on('click', '.element-close-icon', function (e) {
                jsPlumb.remove(newAgent);
            });
        }
    });

    //Display the model in Json format in the text area
    $('#saveButton').click(function(){
        saveFlowchart();
        //generateForms();
    });

    //Export the generated Json output as a text file for storage purposes
    $('#exportButton').click(function(){
        exportFlowChart();
    });

    //Recreate the model based on the Json output provided
    $('#loadButton').click(function(e){
        loadFlowchart(e);
    });
    $('#auto-align').click(function(){
        autoAlign();
        //generateForms();
    });
});

// Update the model when a connection is established
jsPlumb.bind('connection' , function(connection){
    var target = connection.targetId;
    var targetId= target.substr(0, target.indexOf('-'));
    var targetClass = $('#'+targetId).attr('class');

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceClass = $('#'+sourceId).attr('class');

    var model;
    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable' || targetClass == 'wquerydrop ui-draggable'){
        model = queryList.get(targetId);
        model.set('inStream' , sourceId);
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable' || sourceClass == 'wquerydrop ui-draggable'){
        model = queryList.get(sourceId);
        model.set('outStream' , targetId);
    }
});

// Update the model when a connection is detached
jsPlumb.bind('connectionDetached', function (connection) {

    var target = connection.targetId;
    var targetId= target.substr(0, target.indexOf('-'));
    var targetClass = $('#'+targetId).attr('class');

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceClass = $('#'+sourceId).attr('class');

    var model;
    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable' || targetClass == 'wquerydrop ui-draggable'){
        model = queryList.get(targetId);
        if (model != undefined){
            model.set('inStream' , '');
        }
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable' || sourceClass == 'wquerydrop ui-draggable'){
        model = queryList.get(sourceId);
        if (model != undefined){
            model.set('outStream' , '');
        }
    }
});

function generateQuery() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/visual-editor",
        success: function (response) {
            console.log("successfully executed");
        },
        error: function (e){
            console.log(e.message);
        }
    });
}


/**
 * @function Auto align the diagram
 */
function autoAlign() {
    var g = new dagre.graphlib.Graph();
    g.setGraph({
        rankDir : 'LR',
        edgesep : 25
    });
    g.setDefaultEdgeLabel(function () {
        return {};
    });
    var nodes = document.getElementById("container").children;
    // var nodes = $(".ui-draggable");
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var nodeID = n.id ;
        g.setNode(nodeID, {width: 120, height: 80});
    }
    var edges = jsPlumb.getAllConnections();
    for (var i = 0; i < edges.length; i++) {
        var connection = edges[i];
        var target = connection.targetId;
        var source = connection.sourceId;
        var targetId= target.substr(0, target.indexOf('-'));
        var sourceId= source.substr(0, source.indexOf('-'));
        g.setEdge(sourceId, targetId);
    }
    // calculate the layout (i.e. node positions)
    dagre.layout(g);
    // Applying the calculated layout
    g.nodes().forEach(function (v) {
        $("#" + v).css("left", g.node(v).x + "px");
        $("#" + v).css("top", g.node(v).y + "px");
    });
    edges = edges.slice(0);
    for (var j = 0; j<edges.length ; j++){
        var source = edges[j].sourceId;
        var target = edges[j].targetId;
        jsPlumb.detach(edges[j]);
        jsPlumb.connect({
            source: source,
            target: target
        });

    }


}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Display info of all the elements dropped on the canvas
 * @jsonOutput
 */

function saveFlowchart(){
    //node - Array that stores the element related information as objects
    var node = [];
    //matches - Array that stores element IDs of elements that exist on te canvas
    var matches = [];
    //totalElementCount - Number of elements at the time of saving the json for the model
    var totalElementCount=0;
    //Get the element IDs of all the elements existing on the canvas
    var searchEles = document.getElementById("container").children;
    for(var i = 0; i < searchEles.length; i++)
    {
        matches.push(searchEles[i]);
        var idOfEl = searchEles[i].id;
        totalElementCount=idOfEl;

        if(searchEles[i].id !=null || searchEles[i].id !="")
        {
            var $element = $("#" + searchEles[i].id);
            var dropElem = $("#" + searchEles[i].id).attr('class');

            var position = $element.position();

            var elId = parseInt(idOfEl);

            //If the element is a stream
            if (dropElem == "streamdrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();

                /*Check whether the stream is an import, export or a defined stream by checking whether the ID exists in the
                 createdImportStreamArray, createdExportStreamArray or the createdDefinedStreamArray
                 Loop through 100 as these arrays have been initialized to hold 100 records where non-existent element records may be null.
                 Since these were intermediate storage points, objects werent created and arrays were used instead.
                 */
                for (var count = 0; count < 100; count++) {
                    if (createdImportStreamArray[count][0] == idOfEl)
                    {
                        node.push({
                            id: idOfEl,
                            class: dropElem,
                            position:
                            {
                                top: position.top,
                                left: position.left,
                                bottom: position.bottom,
                                right: position.right
                            },
                            predefinedStream: createdImportStreamArray[count][1],
                            name: createdImportStreamArray[count][2],
                            kind: "import"
                        });

                    }
                    else if (createdExportStreamArray[count][0] == idOfEl)
                    {
                        node.push({
                            id: idOfEl,
                            class: dropElem,
                            position:
                            {
                                top: position.top,
                                left: position.left,
                                bottom: position.bottom,
                                right: position.right
                            },
                            predefinedStream: createdExportStreamArray[count][1],
                            name: createdExportStreamArray[count][2],
                            kind: "export"
                        });
                    }
                    else if (createdDefinedStreamArray[count][0] == idOfEl)
                    {
                        var attrNum = createdDefinedStreamArray[count][2].length;
                        var attrArray = [];
                        for (var f = 0; f < attrNum-1; f++) {
                            attrArray.push({
                                attributeName: createdDefinedStreamArray[count][2][f][0],
                                attributeType: createdDefinedStreamArray[count][2][f][1]
                            });
                        }

                        node.push({
                            id: idOfEl,
                            class: dropElem,
                            position:
                            {
                                top: position.top,
                                left: position.left,
                                bottom: position.bottom,
                                right: position.right
                            },
                            name: createdDefinedStreamArray[count][1],
                            numberOfAttributes: createdDefinedStreamArray[count][4],
                            kind: "defined",
                            attributes:attrArray
                        });
                    }
                }
            }

            else if (dropElem == "wstreamdrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                var fromStream = createdWindowStreamArray[idOfEl][2];

                //If the window is defined by the user and not derived from a stream
                if(fromStream == null)
                {
                    var attrArray = [];
                    var attrNum = createdWindowStreamArray[idOfEl][4].length;
                    for (var f = 0; f < attrNum-1; f++)
                    {
                        attrArray.push({
                            attributeName: createdWindowStreamArray[idOfEl][4][f][0],
                            atrributeType: createdWindowStreamArray[idOfEl][4][f][1]
                        });
                    }

                    node.push({
                        id: idOfEl,
                        class: dropElem,
                        position:
                        {
                            top: position.top,
                            left: position.left,
                            bottom: position.bottom,
                            right: position.right
                        },
                        name: createdWindowStreamArray[idOfEl][1],
                        kind: "defined window",
                        attributes: attrArray
                    });
                }

                //If the window is derived from a stream
                else
                {
                    node.push({
                        id: idOfEl,
                        class: dropElem,
                        position:
                        {
                            top: position.top,
                            left: position.left,
                            bottom: position.bottom,
                            right: position.right
                        },
                        name: createdWindowStreamArray[idOfEl][1],
                        fromStreamIndex: createdWindowStreamArray[idOfEl][2],
                        fromStreamName: createdWindowStreamArray[idOfEl][3],
                        kind: "derived window"
                    });
                }
            }

            else if (dropElem=="filterdrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                // var arrlen = createdSimpleQueryArray[elId][4].length;
                var attrArray = [];
                for(var ct=0;ct<createdSimpleQueryArray[elId][4].length;ct++)
                {
                    attrArray.push({
                        attrName:createdSimpleQueryArray[elId][4][ct][0],
                        attrType:createdSimpleQueryArray[elId][4][ct][1]
                    });
                }

                node.push({
                    id:idOfEl,
                    class:dropElem,
                    position:
                    {
                        top: position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    name:createdSimpleQueryArray[elId][1],
                    fromStream:
                    {
                        index:createdSimpleQueryArray[elId][2][0],
                        name:createdSimpleQueryArray[elId][2][1]
                    },
                    filter:createdSimpleQueryArray[elId][3],
                    attributes: attrArray,
                    intoStream:
                    {
                        index:createdSimpleQueryArray[elId][5][0],
                        name:createdSimpleQueryArray[elId][5][1]
                    }
                });
            }

            else if (dropElem=="squerydrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                // var arrlen = createdSimpleQueryArray[elId][4].length;
                var attrArray = [];
                for(var ct=0;ct<createdPassThroughQueryArray[elId][4].length;ct++)
                {
                    attrArray.push({
                        attrName:createdPassThroughQueryArray[elId][4][ct][0],
                        attrType:createdPassThroughQueryArray[elId][4][ct][1]
                    });
                }

                node.push({
                    id:idOfEl,
                    class:dropElem,
                    position:
                    {
                        top: position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    name:createdPassThroughQueryArray[elId][1],
                    fromStream:
                    {
                        index:createdPassThroughQueryArray[elId][2][0],
                        name:createdPassThroughQueryArray[elId][2][1]
                    },
                    filter:createdPassThroughQueryArray[elId][3],
                    attributes: attrArray,
                    intoStream:
                    {
                        index:createdPassThroughQueryArray[elId][5][0],
                        name:createdPassThroughQueryArray[elId][5][1]
                    }
                });
            }
            else if (dropElem=="wquerydrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                var attrArray = [];
                for(var ct=0;ct<createdWindowQueryArray[elId][6].length;ct++)
                {
                    attrArray.push({
                        attrName:createdWindowQueryArray[elId][6][ct][0],
                        attrType:createdWindowQueryArray[elId][6][ct][1]
                    });
                }

                node.push({
                    id:idOfEl,
                    class:dropElem,
                    position:
                    {
                        top:position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    name:createdWindowQueryArray[elId][1],
                    fromStream:
                    {
                        index:createdWindowQueryArray[elId][2][0],
                        name:createdWindowQueryArray[elId][2][1]
                    },
                    filter1:createdWindowQueryArray[elId][3],
                    window:createdWindowQueryArray[elId][4],
                    filter2:createdWindowQueryArray[elId][5],
                    attributes:attrArray,
                    intoStream:
                    {
                        index:createdWindowQueryArray[elId][7][0],
                        name:createdWindowQueryArray[elId][7][1]
                    }
                });


            }

            else if (dropElem=="joquerydrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                var attrArray = [];
                for(var ct=0;ct<createdJoinQueryArray[elId][4].length;ct++)
                {
                    attrArray.push({
                        attrName:createdJoinQueryArray[elId][4][ct][0],
                        attrType:createdJoinQueryArray[elId][4][ct][1]
                    });
                }

                node.push({
                    id: idOfEl,
                    class: dropElem,
                    position: {
                        top: position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    name: createdJoinQueryArray[elId][1],
                    leftStream: {
                        name: createdJoinQueryArray[elId][2][0],
                        filter1: createdJoinQueryArray[elId][2][1],
                        window: createdJoinQueryArray[elId][2][2],
                        filter2: createdJoinQueryArray[elId][2][3]
                    },
                    rightStream:
                    {
                        name:createdJoinQueryArray[elId][3][0],
                        filter1:createdJoinQueryArray[elId][3][1],
                        window:createdJoinQueryArray[elId][3][2],
                        filter2:createdJoinQueryArray[elId][3][3]
                    },
                    attributes:attrArray,
                    intoStreamName:createdJoinQueryArray[elId][5]
                });
            }

            else if(dropElem=="stquerydrop ui-draggable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                var attrArray = [];
                var states = [];
                for(var rec=0;rec<createdStateMachineQueryArray[elId][2].length;rec++)
                {
                    states.push({
                        stateId:createdStateMachineQueryArray[elId][2][rec][0],
                        stateSelectedStream:createdStateMachineQueryArray[elId][2][rec][1],
                        stateFilter:createdStateMachineQueryArray[elId][2][rec][2]
                    });
                }

                for(var lp=0;lp<createdStateMachineQueryArray[elId][4].length;lp++)
                {
                    attrArray.push({
                        attrName:createdStateMachineQueryArray[elId][4][lp][0],
                        attrType:createdStateMachineQueryArray[elId][4][lp][1]
                    });
                }

                node.push({
                    id: idOfEl,
                    class: dropElem,
                    position: {
                        top: position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    name: createdStateMachineQueryArray[elId][1],
                    processLogic:createdStateMachineQueryArray[elId][3],
                    intoStreamName:createdStateMachineQueryArray[elId][5],
                    state:states,
                    attributes:attrArray
                });
            }

            else if(dropElem=="partitiondrop ui-draggable ui-resizable")
            {
                position.bottom = position.top + $element.height();
                position.right = position.left + $element.width();
                var attrArray = [];
                for(var d=0; d<100;d++)
                {
                    if(createdPartitionConditionArray[d][0]== idOfEl)
                    {
                        //alert("almost there!\nd: "+ d+"\nidOfEl: "+idOfEl+"\nsubPcId: "+createdPartitionConditionArray[d][5]);
                    }
                }
                for(var rec=0;rec<createdPartitionConditionArray[elId][2].length-1;rec++)
                {
                    attrArray.push({
                        attrName:createdPartitionConditionArray[elId][2][rec][0],
                        attrType:createdPartitionConditionArray[elId][2][rec][1]
                    });
                }

                node.push({
                    id: idOfEl,
                    class: dropElem,
                    position: {
                        top: position.top,
                        left: position.left,
                        bottom: position.bottom,
                        right: position.right
                    },
                    partitionName: createdPartitionConditionArray[elId][1],
                    type: createdPartitionConditionArray[elId][3],
                    numberOfAttributes: createdPartitionConditionArray[elId][4],
                    subPartitionConditionId: createdPartitionConditionArray[elId][5],
                    attributes:attrArray
                });
            }
        }

    }

    //connections - Array that stores all connection related info. This is handled by jsPlumb's 'getConnections() method and not done manually
    var connections = [];
    $.each(jsPlumb.getConnections(), function (idx, connection) {
        connections.push({
            connectionId: connection.id,
            pageSourceId: connection.sourceId,
            pageTargetId: connection.targetId
        });
    });

    var flowChart = {};
    flowChart.node =node;
    flowChart.connections = connections;

    var flowChartJson = JSON.stringify(flowChart);
    //console.log(flowChartJson);

    $('#jsonOutput').val(flowChartJson);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Method to export and download the generated json output as a text file
 */

function exportFlowChart()
{
    var textToSave = document.getElementById("jsonOutput").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.getElementById("inputFileNameToSaveAs").value ='';

}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Method to load a previously saved model
 * @description After saving the elements even if they are deleted or distorted, loading the model will restore the last saved version
 */

function loadFlowchart(e) {

    var flowChartJson = $('#jsonOutput').val();
    var flowChart = JSON.parse(flowChartJson);

    var node = flowChart.node;
    $.each(node, function( index, elem ) {

        var id = elem.id;
        var classes = elem.class;
        var kind= elem.kind;
        var top = elem.position.top;
        var bottom = elem.position.bottom;
        var left = elem.position.left;
        var right = elem.position.right;
        // alert("elem id: "+id+"\nclass:"+classes+"\nasName:"+asName+"\nPosition:top-"+top+"bottom-"+bottom+"left-"+left+"right-"+right);

        droppedElement = document.getElementById(id);

        if(id == null || id == "" || id == undefined)
        {

        }
        else
        {
            if(classes == "streamdrop ui-draggable")
            {
                var node = document.createElement("div");
                node.id = id + "-nodeInitial";
                node.className = "streamNameNode";

                var asName = elem.name;

                var textnode = document.createTextNode(asName);
                textnode.id = id + "-textnodeInitial";
                node.appendChild(textnode);

                var selectedStream = elem.predefinedStream;
                if (kind == "import") {
                    createdImportStreamArray[id - 1][0] = id;
                    createdImportStreamArray[id - 1][1] = selectedStream;
                    createdImportStreamArray[id - 1][2] = asName;
                    createdImportStreamArray[id - 1][3] = "Import";
                    var newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                    var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propImportStream'));
                    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                    newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                    dropCompleteElement(newAgent, id, e, kind, top, left);
                }
                else if (kind == "export") {

                    createdExportStreamArray[id - 1][0] = id;
                    createdExportStreamArray[id - 1][1] = selectedStream;
                    createdExportStreamArray[id - 1][2] = asName;
                    createdExportStreamArray[id - 1][3] = "Export";

                    var newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                    var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propExportStream'));
                    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                    newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                    dropCompleteElement(newAgent, id, e, kind, top, left);

                }
                else if (kind == "defined")
                {
                    var tblerows = elem.numberOfAttributes;
                    createdDefinedStreamArray[id][0] = id;
                    createdDefinedStreamArray[id][1] = asName;
                    createdDefinedStreamArray[id][3] = "Defined Stream";
                    createdDefinedStreamArray[id][4] = tblerows;
                    createdDefinedStreamArray[id][2] = [];
                    var attrArray = elem.attributes;

                    var r = 0;
                    $.each(attrArray, function (index, elem) {
                        //alert("attrName: " + elem.attributeName + "\nattrType: " + elem.attributeType+"\nr:"+r);
                        createdDefinedStreamArray[id][2][r] = new Array(2);
                        createdDefinedStreamArray[id][2][r][0] = elem.attributeName;
                        createdDefinedStreamArray[id][2][r][1] = elem.attributeType;
                        r++;
                    });

                    var newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                    var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propDefinedStream'));
                    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                    newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                    dropCompleteElement(newAgent, id, e, kind, top, left);
                }
            }



            else if(classes == "wstreamdrop ui-draggable")
            {
                var asName = elem.name;
                createdWindowStreamArray[id][0] = id;
                createdWindowStreamArray[id][1] = asName;
                var predefarr = PredefinedStreams();

                if(kind == "derived window")
                {
                    createdWindowStreamArray[id][2] = elem.fromStreamIndex;
                    createdWindowStreamArray[id][3] = elem.fromStreamName;
                    var selectedPredefStream= elem.fromStreamName;
                    createdWindowStreamArray[id][4] = [];

                    for(var t=0;t<100;t++)
                    {
                        if(createdImportStreamArray[t][0]==createdWindowStreamArray[id][2])
                        {
                            for(var f=0;f<predefarr.length;f++)
                            {
                                if(predefarr[f][0]==selectedPredefStream)
                                {
                                    for(var r=0;r<predefarr[f][1].length;r++)
                                    {
                                        createdWindowStreamArray[id][4][r] = new Array(2);
                                        createdWindowStreamArray[id][4][r][0] = predefarr[f][1][r];
                                        createdWindowStreamArray[id][4][r][1] = predefarr[f][2][r];
                                        //alert("from predefarrName: "+ createdWindowStreamArray[id][4][r][0]+"\nfrom predefarrName: "+ createdWindowStreamArray[id][4][r][1]);
                                    }
                                }

                            }
                        }

                        else if(createdExportStreamArray[t][0]==createdWindowStreamArray[id][2])
                        {
                            for(var f=0;f<predefarr.length;f++)
                            {
                                if(predefarr[f][0]==selectedPredefStream)
                                {
                                    for(var r=0;r<predefarr[f][1].length;r++)
                                    {
                                        createdWindowStreamArray[id][4][r] = new Array(2);
                                        createdWindowStreamArray[id][4][r][0] = predefarr[f][1][r];
                                        createdWindowStreamArray[id][4][r][1] = predefarr[f][2][r];
                                        //alert("from predefarrName: "+ createdWindowStreamArray[id][4][r][0]+"\nfrom predefarrName: "+ createdWindowStreamArray[id][4][r][1]);
                                    }
                                }

                            }
                        }

                        else if(createdDefinedStreamArray[t][0]==createdWindowStreamArray[id][2])
                        {
                            for(var f=0;f<createdDefinedStreamArray[t][2].length;f++)
                            {
                                createdWindowStreamArray[id][4][r] = new Array(2);
                                createdWindowStreamArray[id][4][r][0] = createdDefinedStreamArray[t][2][f][0];
                                createdWindowStreamArray[id][4][r][1] = createdDefinedStreamArray[t][2][f][1];
                                //alert("from predefarrName: "+ createdWindowStreamArray[id][4][r][0]+"\nfrom predefarrName: "+ createdWindowStreamArray[id][4][r][1]);
                            }
                        }
                    }
                }
                else if(kind == "defined window")
                {
                    createdWindowStreamArray[id][2] = null;
                    createdWindowStreamArray[id][3] = null;
                    createdWindowStreamArray[id][4] = [];
                    var attrArray = elem.attributes;

                    var r = 0;
                    $.each(attrArray, function (index, elem) {
                        createdWindowStreamArray[id][4][r] = new Array(2);
                        createdWindowStreamArray[id][4][r][0] = elem.attributeName;
                        createdWindowStreamArray[id][4][r][1] = elem.attributeType;
                        r++;
                    });
                }

                var newAgent = $('<div>').attr('id', id).addClass('wstreamdrop');
                dropWindowStream(newAgent, id, e,top,left,asName);
            }

            else if(classes == "squerydrop ui-draggable")
            {
                createdPassThroughQueryArray[id][0] = id;
                createdPassThroughQueryArray[id][1] = elem.name;
                createdPassThroughQueryArray[id][2][0] = elem.fromStream.index;
                createdPassThroughQueryArray[id][2][1] = elem.fromStream.name;
                createdPassThroughQueryArray[id][3] = elem.filter;
                createdPassThroughQueryArray[id][4] = [];
                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    //alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdPassThroughQueryArray[id][4][r] = new Array(2);
                    createdPassThroughQueryArray[id][4][r][0] = elem.attrName;
                    createdPassThroughQueryArray[id][4][r][1] = elem.attrType;
                    r++;
                });

                createdPassThroughQueryArray[id][5][0] = elem.intoStream.index;
                createdPassThroughQueryArray[id][5][1] = elem.intoStream.name;

                var newAgent = $('<div>').attr('id', id).addClass('squerydrop');
                dropQuery(newAgent, id,e,"squerydrop",top,left,elem.name);
            }

            else if(classes == "filterdrop ui-draggable")
            {
                createdSimpleQueryArray[id][0] = id;
                createdSimpleQueryArray[id][1] = elem.name;
                createdSimpleQueryArray[id][2][0] = elem.fromStream.index;
                createdSimpleQueryArray[id][2][1] = elem.fromStream.name;
                createdSimpleQueryArray[id][3] = elem.filter;
                createdSimpleQueryArray[id][4] = [];
                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    // alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdSimpleQueryArray[id][4][r] = new Array(2);
                    createdSimpleQueryArray[id][4][r][0] = elem.attrName;
                    createdSimpleQueryArray[id][4][r][1] = elem.attrType;
                    r++;
                });
                createdSimpleQueryArray[id][5][0] = elem.intoStream.index;
                createdSimpleQueryArray[id][5][1] = elem.intoStream.name;

                var newAgent = $('<div>').attr('id', id).addClass('filterdrop');
                dropQuery(newAgent, id,e,"filterdrop",top,left,elem.name);
            }

            else if(classes == "wquerydrop ui-draggable")
            {
                createdWindowQueryArray[id][0] = id;
                createdWindowQueryArray[id][1] = elem.name;
                createdWindowQueryArray[id][2][0] = elem.fromStream.index;
                createdWindowQueryArray[id][2][1] = elem.fromStream.name;
                createdWindowQueryArray[id][3] = elem.filter1;
                createdWindowQueryArray[id][4] = elem.window;
                createdWindowQueryArray[id][5] = elem.filter2;
                createdWindowQueryArray[id][6] = [];

                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    // alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdWindowQueryArray[id][6][r] = new Array(2);
                    createdWindowQueryArray[id][6][r][0] = elem.attrName;
                    createdWindowQueryArray[id][6][r][1] = elem.attrType;
                    r++;
                });

                createdWindowQueryArray[id][7][0] = elem.intoStream.index;
                createdWindowQueryArray[id][7][1] = elem.intoStream.name;

                var newAgent = $('<div>').attr('id', id).addClass('wquerydrop');
                dropQuery(newAgent, id,e,"wquerydrop",top,left,elem.name);
            }
            else if(classes == "joquerydrop ui-draggable")
            {
                createdJoinQueryArray[id][0] = id;
                createdJoinQueryArray[id][1] = elem.name;
                createdJoinQueryArray[id][2][0] = elem.leftStream.name;
                createdJoinQueryArray[id][2][1] = elem.leftStream.filter1;
                createdJoinQueryArray[id][2][2] = elem.leftStream.window;
                createdJoinQueryArray[id][2][3] = elem.leftStream.filter2;
                createdJoinQueryArray[id][3][0] = elem.rightStream.name;
                createdJoinQueryArray[id][3][1] = elem.rightStream.filter1;
                createdJoinQueryArray[id][3][2] = elem.rightStream.window;
                createdJoinQueryArray[id][3][3] = elem.rightStream.filter2;
                createdJoinQueryArray[id][4] = [];

                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    // alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdJoinQueryArray[id][4][r] = new Array(2);
                    createdJoinQueryArray[id][4][r][0] = elem.attrName;
                    createdJoinQueryArray[id][4][r][1] = elem.attrType;
                    r++;
                });

                createdJoinQueryArray[id][5]= elem.intoStreamName;

                var newAgent = $('<div>').attr('id', id).addClass('joquerydrop');
                dropQuery(newAgent, id,e,"joquerydrop",top,left,elem.name);
            }
            else if(classes == "stquerydrop ui-draggable")
            {
                createdStateMachineQueryArray[id][0] = id;
                createdStateMachineQueryArray[id][1] = elem.name;
                createdStateMachineQueryArray[id][2] = [];
                createdStateMachineQueryArray[id][4] = [];
                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    // alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdStateMachineQueryArray[id][4][r] = new Array(2);
                    createdStateMachineQueryArray[id][4][r][0] = elem.attrName;
                    createdStateMachineQueryArray[id][4][r][1] = elem.attrType;
                    r++;
                });

                var states = elem.state;

                var q = 0;
                $.each(states, function (index, elem) {
                    // alert("State ID: " + elem.stateId + "\nSelected Stream: " + elem.stateSelectedStream+ "\nState Filter: " + elem.stateFilter);
                    createdStateMachineQueryArray[id][2][q] = new Array(2);
                    createdStateMachineQueryArray[id][2][q][0] = elem.stateId;
                    createdStateMachineQueryArray[id][2][q][1] = elem.stateSelectedStream;
                    createdStateMachineQueryArray[id][2][q][2] = elem.stateFilter;
                    q++;
                });

                createdStateMachineQueryArray[id][3] = elem.processLogic;
                createdStateMachineQueryArray[id][5]= elem.intoStreamName;

                var newAgent = $('<div>').attr('id', id).addClass('stquerydrop');
                dropQuery(newAgent, id,e,"stquerydrop",top,left,elem.name);
            }

            else if(classes == "partitiondrop ui-draggable ui-resizable")
            {
                createdPartitionConditionArray[id][0]== id;
                createdPartitionConditionArray[id][1]== elem.partitionName;
                createdPartitionConditionArray[id][2] = [];
                createdPartitionConditionArray[id][3]== elem.type;
                createdPartitionConditionArray[id][4]== elem.numberOfAttributes;
                createdPartitionConditionArray[id][4]== elem.subPartitionConditionId;

                var attrArray = elem.attributes;

                var r = 0;
                $.each(attrArray, function (index, elem) {
                    //alert("attrName: " + elem.attrName + "\nattrType: " + elem.attrType);
                    createdPartitionConditionArray[id][2][r] = new Array(2);
                    createdPartitionConditionArray[id][2][r][0] = elem.attrName;
                    createdPartitionConditionArray[id][2][r][1] = elem.attrType;
                    r++;
                });

                var width = right-left;
                var height = bottom-top;
                //alert("width: "+width +"\nHeight: "+height);
                var newAgent = $('<div style="width:'+width+'px;height:'+height+'px">').attr('id', id).addClass('partitiondrop');
                droptype = "partitiondrop";
                $(droppedElement).draggable({containment: "container"});
                //Drop the element instantly since its attributes will be set only when the user requires it
                // dropPartition(newAgent,id,e,droptype,top,left);

                var thisId = id + '-pc'+ elem.subPartitionConditionId;
                var finalElement =  newAgent;
                var connectionIn = $('<div class="connectorInPart" onclick="getPartitionConnectionDetails('+thisId+')">').attr('id', id + '-pc'+ elem.subPartitionConditionId).addClass('connection').text("pc"+elem.subPartitionConditionId);
                finalElement.append(connectionIn);

                jsPlumb.makeTarget(connectionIn, {
                    anchor: 'Continuous'
                });
                jsPlumb.makeSource(connectionIn, {
                    anchor: 'Continuous'
                });
                x = elem.subPartitionConditionId;
                x++;

                $(finalElement).on('dblclick',function () {

                    var connectionIn = $('<div class="connectorInPart" onclick="getPartitionConnectionDetails(this.id)">').attr('id', i + '-pc'+ x).addClass('connection').text("pc"+x);
                    finalElement.append(connectionIn);

                    jsPlumb.makeTarget(connectionIn, {
                        anchor: 'Continuous'
                    });
                    jsPlumb.makeSource(connectionIn, {
                        anchor: 'Continuous'
                    });

                    x++;
                });

                finalElement.css({
                    'top': top,
                    'left': left
                });

                $(function() { $(finalElement).draggable().resizable(); });
                $('#container').append(finalElement);

                //alert("Successful!");
                // var newAgent = $('<div>').attr('id', id).addClass('squerydrop');
                // dropQuery(newAgent, id,e,"squerydrop",top,left,elem.name);
            }
        }
        i = parseInt(id)+1;
    });


    var connections = flowChart.connections;
    $.each(connections, function( index, elem ) {
        var connection1 = jsPlumb.connect({
            source: elem.pageSourceId,
            target: elem.pageTargetId,
            anchors: ["BottomCenter", [0.75, 0, 0, -1]]

        });
    });

    // numberOfElements = flowChart.numberOfElements;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @function Create a 3D array to store predefined Stream Definitions
 * @returns {Array}
 * @constructor
 * @decomposed Each row stores details of one Stream
 * @rowInfo col1-> Stream name, col2-> subdivided array for attribute names
 * @rowInfo col3-> Subdivided array for attribute type info
 * @rowInfo col4-> Stream definition in a single line
 *
 */


function PredefinedStreams()
{
    var StreamArray = new Array(3);
    for (var q = 0; q < 3; q++)
    {
        StreamArray[q] = new Array(4);
        for (var w=1; w<3; w++)
        {
            StreamArray[q][w] = new Array(5);
        }
    }

    StreamArray[0][0]="Stream1";
    StreamArray[0][1][0]="1_attr1";
    StreamArray[0][1][1]="1_attr2";
    StreamArray[0][1][2]="1_attr3";
    StreamArray[0][1][3]="1_attr4";
    StreamArray[0][1][4]="1_attr5";
    StreamArray[0][2][0]="1_type1";
    StreamArray[0][2][1]="1_type2";
    StreamArray[0][2][2]="1_type3";
    StreamArray[0][2][3]="1_type4";
    StreamArray[0][2][4]="1_type5";
    StreamArray[0][3] = "define stream Stream1 (1_attr1 1_type1, 1_attr2 1_type2, 1_attr3 1_type3, 1_attr4 1_type4, 1_attr5 1_type5 );";

    StreamArray[1][0]="Stream2";
    StreamArray[1][1][0]="2_attr1";
    StreamArray[1][1][1]="2_attr2";
    StreamArray[1][1][2]="2_attr3";
    StreamArray[1][1][3]="2_attr4";
    StreamArray[1][1][4]="2_attr5";
    StreamArray[1][2][0]="2_type1";
    StreamArray[1][2][1]="2_type2";
    StreamArray[1][2][2]="2_type3";
    StreamArray[1][2][3]="2_type4";
    StreamArray[1][2][4]="2_type5";
    StreamArray[1][3] = "define stream Stream2 (2_attr1 2_type1, 2_attr2 2_type2, 2_attr3 2_type3, 2_attr4 2_type4, 2_attr5 2_type5 );";

    StreamArray[2][0]="Stream3";
    StreamArray[2][1][0]="3_attr1";
    StreamArray[2][1][1]="3_attr2";
    StreamArray[2][1][2]="3_attr3";
    StreamArray[2][1][3]="3_attr4";
    StreamArray[2][1][4]="3_attr5";
    StreamArray[2][2][0]="3_type1";
    StreamArray[2][2][1]="3_type2";
    StreamArray[2][2][2]="3_type3";
    StreamArray[2][2][3]="3_type4";
    StreamArray[2][2][4]="3_type5";
    StreamArray[2][3] = "define stream Stream3 (3_attr1 3_type1, 3_attr2 3_type2, 3_attr3 3_type3, 3_attr4 3_type4, 3_attr5 3_type5 );";


    return StreamArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var attrNumber,streamInd;

function getAttributes(stream)
{
    var PredefStreamArr = PredefinedStreams();
    for(var c=0;c<3;c++)
    {
        if(PredefStreamArr[c][0]==stream)
        {
            attrNumber =PredefStreamArr[c][1].length;
            streamInd = c;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @function Retrieves info from the Predifined array onto individual arrays
 * @type {string}
 *
 */

var streamDef = streamtypes = PredefinedStreams();
var stream1_attr = streamtypes = PredefinedStreams();
var stream1_type = streamtypes = PredefinedStreams();
var stream2_attr = streamtypes = PredefinedStreams();
var stream2_type = streamtypes = PredefinedStreams();
var stream3_attr = streamtypes = PredefinedStreams();
var stream3_type = streamtypes = PredefinedStreams();

//Array that stores all Import stream data
var createdImportStreamArray = [];
for(var x = 0; x < 100; x++){
    createdImportStreamArray[x] = [];
    for(var y = 0; y < 4; y++){
        createdImportStreamArray[x][y] = null;
    }
}

//Array that stores all Export stream data
var createdExportStreamArray = [];
for(var x = 0; x < 100; x++){
    createdExportStreamArray[x] = [];
    for(var y = 0; y < 4; y++){
        createdExportStreamArray[x][y] = null;
    }
}


//Array that stores all Defined stream data
var createdDefinedStreamArray = [];
for(var x = 0; x < 100; x++){
    createdDefinedStreamArray[x] = [];
    for(var y = 0; y < 5; y++){
        createdDefinedStreamArray[x][y] = null
    }
}

//Array that stores all Window stream data
var createdWindowStreamArray = [];
for(var x = 0; x < 100; x++){
    createdWindowStreamArray[x] = [];
    for(var y = 0; y < 5; y++){
        createdWindowStreamArray[x][y] = null
    }
}

//Array that stores connection related data
var ConnectionArray = [];
for(var x = 0; x < 100; x++){
    ConnectionArray[x] = [];
    for(var y = 0; y < 3; y++){
        ConnectionArray[x][y] = null;
    }
}

//Array that stores Simple query related info
var createdSimpleQueryArray = [];
for(var x = 0; x < 100; x++){
    createdSimpleQueryArray[x] = [];
    for(var y = 0; y < 6; y++){
        createdSimpleQueryArray[x][y] = null;
        if(y==2 || y==5)
        {
            createdSimpleQueryArray[x][y]= [];
        }
    }
}

//Array that stores Pass-through query related info
var createdPassThroughQueryArray = [];
for(var x = 0; x < 100; x++){
    createdPassThroughQueryArray[x] = [];
    for(var y = 0; y < 6; y++){
        createdPassThroughQueryArray[x][y] = null;
        if(y==2 || y==5)
        {
            createdPassThroughQueryArray[x][y]= [];
        }
    }
}

//Array that stores Window query related info
var createdWindowQueryArray = [];
for(var x = 0; x < 100; x++){
    createdWindowQueryArray[x] = [];
    for(var y = 0; y < 8; y++){
        createdWindowQueryArray[x][y] = null;
        if(y==2 || y==7)
        {
            createdWindowQueryArray[x][y]= [];
        }
    }
}

//Array that stores Join query related info
var createdJoinQueryArray = [];
for(var x = 0; x < 100; x++){
    createdJoinQueryArray[x] = [];
    for(var y = 0; y < 8; y++){
        createdJoinQueryArray[x][y] = null;
        if(y==2 || y==3)
        {
            createdJoinQueryArray[x][y]= [];
        }
    }
}


//Array that stores State Machine query related info
var createdStateMachineQueryArray = [];
for(var x = 0; x < 100; x++){
    createdStateMachineQueryArray[x] = [];
    for(var y = 0; y < 6; y++){
        createdStateMachineQueryArray[x][y] = null;
        if(y==2 || y==4)
        {
            createdStateMachineQueryArray[x][y]= [];
        }
    }
}

//Array that stores all Partition Condition data
var createdPartitionConditionArray = [];
for(var x = 0; x < 100; x++){
    createdPartitionConditionArray[x] = [];
    for(var y = 0; y < 5; y++){
        createdPartitionConditionArray[x][y] = null
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @function Displays the selected Stream definition in a single line
 *
 */

function showStreamDefLine()
{
    var choice=document.getElementById("streamSelect");

    //var choice=document.getElementById("streamSelectExp");

    var selectedStr = choice.options[choice.selectedIndex].text;

    if(selectedStr == "Select an option")
    {
        alert("Please select a valid Stream from the list");
    }
    else if (selectedStr == "Stream1")
    {
        alert("Stream Definition: \n"+streamDef[0][3]);
    }
    else if(selectedStr=="Stream2")
    {
        alert("Stream Definition: \n"+streamDef[1][3]);
    }
    else
    {
        alert("Stream Definition: \n"+streamDef[2][3]);
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showStreamDefLineExp()
{
    var choice=document.getElementById("streamSelectExp");

    //var choice=document.getElementById("streamSelectExp");

    var selectedStr = choice.options[choice.selectedIndex].text;

    if(selectedStr == "Select an option")
    {
        alert("Please select a valid Stream from the list");
    }
    else if (selectedStr == "Stream1")
    {
        alert("Stream Definition: \n"+streamDef[0][3]);
    }
    else if(selectedStr=="Stream2")
    {
        alert("Stream Definition: \n"+streamDef[1][3]);
    }
    else
    {
        alert("Stream Definition: \n"+streamDef[2][3]);
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                          STREAM ELEMENT RELATED FUNCTIONALITIES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Create the Stream Property Form dynamically
 * @description The Stream form is divided into 3 sections.
 *      1. Import stream Form
 *      2. Export Stream Form
 *      3. Defined stream Form
 */

var importDiv, iStreamtype,headingimport, br, istreamlbl, istreamtypelbl, iPredefStreamdiv, istreamDefLineDiv, istreamDefDivx, istreamName, importbtn;
var exportDiv,eStreamtype,headingexport, estreamlbl, estreamtypelbl, ePredefStreamdiv, estreamDefLineDiv, estreamDefDivx, estreamName, exportbtn;
var streamDiv, streambtn, headingstream;
var definestreamdiv,inputval,input, attrDiv,newDiv,addenteredattr ;
var inputLbl,streamnameLbl,StreamNameInput,attrName,attNam,attrTypecomboDiv,addAttrBtn,showAttrDivision,endStreamDefBtn;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Store Import Stream info to array
 * @param i --> Element Id
 */

function storeImportStreamInfo(newAgent,i,e,kind,mouseTop,mouseLeft)
{
    /*
     The node hosts a text node where the Stream's name input by the user will be held.
     Rather than simply having a `newAgent.text(streamName)` statement, as the text function tends to
     reposition the other appended elements with the length of the Stream name input by the user.
     */
    var node = document.createElement("div");
    node.id = i+"-nodeInitial";
    node.className = "streamNameNode";

    //Retrieve the Predefined stream selected by the user from the combobox
    var choice=document.getElementById("streamSelect");
    var selectedStream = choice.options[choice.selectedIndex].text;

    //Retrieve the Stream name input by the user
    var asName= document.getElementById("istreamName").value;

    var StreamElementID = i;

    createdImportStreamArray[i-1][0]=StreamElementID;   //Element ID
    createdImportStreamArray[i-1][1]=selectedStream;    //The Predefined Stream selected
    createdImportStreamArray[i-1][2]=asName;            //The stream name provided by the user
    createdImportStreamArray[i-1][3]="Import";          //Not mandatory

    //Assign the Stream name input by the user to the textnode to be displayed on the dropped Stream
    var textnode = document.createTextNode(asName);
    textnode.id = i+"-textnodeInitial";
    node.appendChild(textnode);

    /*
     prop --> When clicked on this icon, a definition and related information of the Stream Element will be displayed as an alert message
     showIcon --> An icon that elucidates whether the dropped stream element is an Import/Export/Defined stream (In this case: an Import arrow icon)
     conIcon --> Clicking this icon is supposed to toggle between showing and hiding the "Connection Anchor Points" (Not implemented)
     boxclose --> Icon to remove/delete an element
     */
    var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (i+'-propImportStream'));
    var showIcon = $('<img src="../Images/Import.png" class="streamIconloc"></b></a> ').attr('id', (i));
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);

    dropCompleteElement(newAgent,i,e,kind,mouseTop,mouseLeft);


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Store Export stream info to array
 */
function storeExportStreamInfo(newAgent,i,e,kind,mouseTop,mouseLeft)
{
    var node = document.createElement("div");
    node.id = i+"-nodeInitial";
    node.className = "streamNameNode";

    var choice=document.getElementById("streamSelectExp");
    var selectedStream = choice.options[choice.selectedIndex].text;
    var asName= document.getElementById("estreamName").value;
    var StreamElementID = i;

    createdExportStreamArray[i-1][0]=StreamElementID;
    createdExportStreamArray[i-1][1]=selectedStream;
    createdExportStreamArray[i-1][2]=asName;
    createdExportStreamArray[i-1][3]="Export";

    var textnode = document.createTextNode(asName);
    textnode.id = i+"-textnodeInitial";
    node.appendChild(textnode);

    var element=document.getElementById(newAgent);

    var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (i+'-propExportStream'));
    var showIcon = $('<img src="../Images/Export.png" class="streamIconloc"></b></a> ').attr('id', (i));
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
    dropCompleteElement(newAgent,i,e,kind,mouseTop,mouseLeft);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @function detect the id of the element clicked
 * @param sender
 * @returns {*}
 *
 */
function doclick(sender)
{
    var arr = sender.id.match(/-prop(.*)/);  //By matching with the following pattern, the Element Type(Import, Export/ Defined Stream) is extracted and stored in variable `arr`
    if (arr != null) {
        droptype = arr[1];
    }

    var clickedelemId=sender.id;
    clickedelemId = clickedelemId.charAt(0);    //clickedelemId --> Gets the Element ID separately from the sender's ID as the `sender` will be the prop icon and not the element itself

    if(droptype == "ImportStream")
    {
        var selectedStreamim = createdImportStreamArray[clickedelemId-1][1];
        var streamnam = createdImportStreamArray[clickedelemId-1][2];
        var streamDefget;
        if (selectedStreamim == "Stream1")
        {
            streamDefget=streamDef[0][3];
            var res = streamDefget.replace("Stream1", streamnam);
        }
        else if(selectedStreamim=="Stream2")
        {
            streamDefget=streamDef[1][3];
            var res = streamDefget.replace("Stream2", streamnam);
        }
        else
        {
            streamDefget=streamDef[2][3];
            var res = streamDefget.replace("Stream3", streamnam);
        }
        alert("Stream ID: "+clickedelemId+"\nSelected stream: "+ createdImportStreamArray[clickedelemId-1][1]+"\nStream Type: Import Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
    else if (droptype == "ExportStream")
    {
        var selectedStreamim = createdExportStreamArray[clickedelemId-1][1];
        var streamnam = createdExportStreamArray[clickedelemId-1][2];
        var streamDefy;
        if (selectedStreamim == "Stream1")
        {
            streamDefy=streamDef[0][3];
            var res = streamDefy.replace("Stream1", streamnam);
        }
        else if(selectedStreamim=="Stream2")
        {
            streamDefy=streamDef[1][3];
            var res = streamDefy.replace("Stream2", streamnam);
        }
        else
        {
            streamDefy=streamDef[2][3];
            var res = streamDefy.replace("Stream3", streamnam);
        }
        alert("Stream ID: "+clickedelemId+"\nSelected stream: "+ createdExportStreamArray[clickedelemId-1][1]+"\nStream Type: Export Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
    else if(droptype == "DefinedStream")
    {
        var streamname = createdDefinedStreamArray[clickedelemId][1];
        var attrnum = createdDefinedStreamArray[clickedelemId][4];
        var tblerows = attrnum-1;
        var res = "define stream "+ streamname + "(";


        for( var t=0; t<tblerows; t++)
        {
            for (var y=0; y<2 ;y++)
            {
                res=res+ createdDefinedStreamArray[clickedelemId][2][t][y] + " ";
            }
            if(t==tblerows-1)
            {
                res=res+"";
            }
            else
            {
                res=res+", ";
            }

        }
        res=res+")";
        alert("Stream ID: "+clickedelemId+"\nCreated stream: "+ streamname+"\nStream Type: Defined Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dropCompleteElement(newAgent,i,e,kind,ptop,left)
{


    var finalElement = newAgent;

    /*
     connection --> The connection anchor point is appended to the element
     */

    if(kind=="import")
    {
        var connection1 = $('<div class="connectorInStream">').attr('id', i+"-Inimport" ).addClass('connection');
        var connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outimport" ).addClass('connection');
    }
    else if (kind=="export")
    {
        var connection1 = $('<div class="connectorInStream">').attr('id', i+"-Inexport" ).addClass('connection');
        var connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outexport" ).addClass('connection');
    }
    else
    {
        var connection1 = $('<div class="connectorInStream">').attr('id', i+"-Indefined" ).addClass('connection');
        var connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outdefined" ).addClass('connection');
    }


    finalElement.css({
        'top': ptop,
        'left': left
    });

    // connection.hide();
    finalElement.append(connection1);
    finalElement.append(connection2);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connection1, {
        anchor: 'Continuous'
        // parent: finalElement
    });

    jsPlumb.makeSource(connection2, {
        // parent:finalElement,
        deleteEndpointsOnDetach : true,
        anchor: 'Continuous'
    });

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
    $("#attrtable tr").remove();
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                            WINDOW(STREAM) ELEMENT RELATED FUNCTIONALITIES                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Drop a window stream on the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param topP
 * @param left
 * @param asName
 */

function dropWindowStream(newAgent, i, e,topP,left,asName)
{
    /*
     The node hosts a text node where the Window's name, input by the user will be held.
     Rather than simply having a `newAgent.text(windowName)` statement, as the text function tends to
     reposition the other appended elements with the length of the Stream name input by the user.
     */
    var windowNode = document.createElement("div");
    windowNode.id = i+"-windowNode";
    windowNode.className = "windowNameNode";
    var windowTextnode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    windowTextnode.id = i+"-windowTextnode";
    windowNode.appendChild(windowTextnode);

    var prop = $('<a onclick="getConnectionDetailsForWindow(this)"><b><img src="../Images/settings.png" class="windowSettingIconLoc"></b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefinedwindow"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(windowNode).append('<a class="boxclosewindow" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorInWindow">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOutWindow">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Continuous',
        maxConnections:1
    });
    // jsPlumb.makeTarget(connectionOut, {
    //     anchor: 'Continuous'
    // });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Continuous'
    });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Get the ID of the connected "from-stream"
 * @param element
 */

function getConnectionDetailsForWindow(element)
{
    var fromStreamIdForWindow;
    var clickedId =  element.id;
    var elementIdentity= element.id;
    var elementID=clickedId = clickedId.charAt(0); //Extract the window element's ID from the prop's ID

    /*
     The window has two connection achor points
     1. in
     2. out
     - If the Window is not connected(i.e. derived from a stream that has already been dropped on the container,
     a form to define the window will be shown.
     - If the Window is connected to a stream, the connected stream details will be gathered and only a name for the window
     needs to be specified.
     */
    clickedId = clickedId+"-in";
    var con=jsPlumb.getAllConnections();
    var list=[];
    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            list[i] = new Array(2);
            list[i][0] = con[i].sourceId;
            fromStreamIdForWindow =list[i][0];
            list[i][1] = con[i].targetId;
        }
    }
    if(fromStreamIdForWindow==undefined || fromStreamIdForWindow==null) /* No streams are connected to the in-connector anchor point of the window*/
    {
        createWindowDefinitionForm(elementIdentity);    /* Define a new window with user-input attributess and types*/
    }
    else
    {
        //Window derived from a stream
        fromStreamIdForWindow = fromStreamIdForWindow.charAt(0);
        getFromStreamNameForWindow(fromStreamIdForWindow,elementID);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Display form to define a new window
 * @param i
 */

function createWindowDefinitionForm(i)
{
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tableWindowStreamForm = document.createElement('table');    //To display the attributes defined for the window
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    /*---------Window Form Element Definitions-----------*/

    DefwindowStreamDiv=document.createElement("div");
    DefwindowStreamDiv.className="DefwindowStreamDiv";
    DefwindowStreamDiv.id="DefwindowStreamDiv";

    DefWindowAttrTableDiv=document.createElement("div");
    DefWindowAttrTableDiv.className="DefWindowAttrTableDiv";
    DefWindowAttrTableDiv.id="DefWindowAttrTableDiv";

    DefWindowAttrDiv=document.createElement("div");
    DefWindowAttrDiv.className="DefWindowAttrDiv";
    DefWindowAttrDiv.id="DefWindowAttrDiv";

    DefwindowStreamLabel= document.createElement("label");
    DefwindowStreamLabel.className="DefwindowStreamLabel";
    DefwindowStreamLabel.id="DefwindowStreamLabel";
    DefwindowStreamLabel.innerHTML='Define Window';

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    DefForWindowLabel= document.createElement("label");
    DefForWindowLabel.id ="DefForWindowLabel";
    DefForWindowLabel.className ="DefForWindowLabel";
    DefForWindowLabel.innerHTML = "Window Name: ";

    DefNameForWindow= document.createElement("input");
    DefNameForWindow.id ="DefNameForWindow";
    DefNameForWindow.className ="DefNameForWindow";

    DefAddAttributes=document.createElement("button");
    DefAddAttributes.type="button";
    DefAddAttributes.className="DefAddAttributes";
    DefAddAttributes.id="DefAddAttributes";
    DefAddAttributes.innerHTML="Add Atribute";
    DefAddAttributes.onclick = function () {
        addAttributeForWindow();    /* Open the form to add attributes to the Window */
    };

    DefCreateWindow=document.createElement("button");
    DefCreateWindow.type="button";
    DefCreateWindow.className="DefCreateWindow";
    DefCreateWindow.id="DefCreateWindow";
    DefCreateWindow.innerHTML="Create Window";
    DefCreateWindow.onclick = function () {
        CreateWindow(i);
    };

    WindowStreamCloseButton=document.createElement("button");
    WindowStreamCloseButton.type="button";
    WindowStreamCloseButton.className="partitionCloseButton";
    WindowStreamCloseButton.id="partitionCloseButton";
    WindowStreamCloseButton.innerHTML="Cancel";
    WindowStreamCloseButton.onclick = function()
    {
        $("#tableWindowStreamForm tr").remove();
        $("#DefWindowAttrDiv").removeClass("disabledbutton");
        closeForm();
    };


    // Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');

    td1.appendChild(DefwindowStreamLabel);
    tr1.appendChild(td1);
    tableWindowStreamForm.appendChild(tr1);

    // Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(DefForWindowLabel);
    tr2.appendChild(td2);
    td3.appendChild(DefNameForWindow);
    tr2.appendChild(td3);
    tableWindowStreamForm.appendChild(tr2);

    // Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');
    var td5=document.createElement('td');

    td4.appendChild(EmptyLabel);
    tr3.appendChild(td4);
    td5.appendChild(DefAddAttributes);
    tr3.appendChild(td5);
    tableWindowStreamForm.appendChild(tr3);

    DefwindowStreamDiv.appendChild(tableWindowStreamForm);
    DefwindowStreamDiv.appendChild(DefWindowAttrTableDiv);
    DefwindowStreamDiv.appendChild(WindowStreamCloseButton);

    lot.appendChild(DefwindowStreamDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Form to create multiple attribute and type specifications as the user wishes.
 */

function addAttributeForWindow()
{
    DefWindowAttrDiv=document.createElement("div");
    DefWindowAttrDiv.className="DefWindowAttrDiv";
    DefWindowAttrDiv.id="DefWindowAttrDiv";

    var tableWindowStreamForm = document.createElement('table');
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    DefWindowAttrTypeComboDiv=document.createElement("div");
    DefWindowAttrTypeComboDiv.className="DefWindowAttrTypeComboDiv";
    DefWindowAttrTypeComboDiv.id="DefWindowAttrTypeComboDiv";

    DefForWindowAttrLabel= document.createElement("label");
    DefForWindowAttrLabel.id ="DefForWindowAttrLabel";
    DefForWindowAttrLabel.className ="DefForWindowAttrLabel";
    DefForWindowAttrLabel.innerHTML = "Attribute Name: ";

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    DefForWindowAttrInput= document.createElement("input");
    DefForWindowAttrInput.id ="DefForWindowAttrInput";
    DefForWindowAttrInput.className ="DefForWindowAttrInput";

    DefForWindowAttrTypeLabel= document.createElement("label");
    DefForWindowAttrTypeLabel.id ="DefForWindowAttrTypeLabel";
    DefForWindowAttrTypeLabel.className ="DefForWindowAttrTypeLabel";
    DefForWindowAttrTypeLabel.innerHTML = "Attribute Type: ";


    //Generate a combo box to display the attribute types
    var html = '<select id="attrTypeComboForWindow">', attrtypes = typeGenerate(), i;
    for(i = 0; i < attrtypes.length; i++) {
        html += "<option value='"+attrtypes[i]+"'>"+attrtypes[i]+"</option>";
    }
    html += '</select>';

    DefWindowAttrTypeComboDiv.innerHTML = html;

    DefAddAttributesToTablebtn=document.createElement("button");
    DefAddAttributesToTablebtn.type="button";
    DefAddAttributesToTablebtn.className="DefAddAttributesToTablebtn";
    DefAddAttributesToTablebtn.id="DefAddAttributesToTablebtn";
    DefAddAttributesToTablebtn.innerHTML="Add";
    DefAddAttributesToTablebtn.onclick = function () {
        showAttributesForWindowInTable();
    };

    // Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');

    td1.appendChild(DefForWindowAttrLabel);
    tr1.appendChild(td1);
    td2.appendChild(DefForWindowAttrInput);
    tr1.appendChild(td2);
    tableWindowStreamForm.appendChild(tr1);

    // Row 2

    var tr2 = document.createElement('tr');
    var td3=document.createElement('td');
    var td4=document.createElement('td');

    td3.appendChild(DefForWindowAttrTypeLabel);
    tr2.appendChild(td3);
    td4.appendChild(DefWindowAttrTypeComboDiv);
    tr2.appendChild(td4);
    tableWindowStreamForm.appendChild(tr2);

    // Row 3

    var tr3 = document.createElement('tr');
    var td5=document.createElement('td');
    var td6=document.createElement('td');

    td5.appendChild(EmptyLabel);
    tr3.appendChild(td5);
    td6.appendChild(DefAddAttributesToTablebtn);
    tr3.appendChild(td6);
    tableWindowStreamForm.appendChild(tr3);

    DefWindowAttrDiv.appendChild(tableWindowStreamForm);
    DefwindowStreamDiv.appendChild(DefWindowAttrDiv);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Generate attribute types for the combobox
 * @returns {Array}
 */

function typeGenerate() {
    var typeArray = new Array();
    typeArray[0] = "int";
    typeArray[1] = "long";
    typeArray[2] = "double";
    typeArray[3] = "float";
    typeArray[4] = "string";
    typeArray[5] = "bool";
    return typeArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var attrName1 = document.createElement("label");
var attrType1= document.createElement("label");
var closeattr1= document.createElement("button");

var table1 = document.createElement('table');
table1.id = "attrtableForWindow";
table1.className = "attrtableForWindow";
var tr = document.createElement('tr');
var attrNameHeader= document.createElement('td');
var attrtypeHeader = document.createElement('td');
var attrDeleteHeader   = document.createElement('td');
attrNameHeader.innerHTML = "Attribute Name";
attrtypeHeader.innerHTML = "Attribute Type";
attrDeleteHeader.innerHTML = "Delete Row";
tr.appendChild(attrNameHeader);
tr.appendChild(attrtypeHeader);
tr.appendChild(attrDeleteHeader);
table1.appendChild(tr);

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/

/**
 * @function Append Added attributes to the display table
 */

function showAttributesForWindowInTable()
{
    var tr = document.createElement('tr');
    var attributeName = document.getElementById("DefForWindowAttrInput").value;
    var choice=document.getElementById("attrTypeComboForWindow");
    var attrTypeCombo = choice.options[choice.selectedIndex].text;

    DefWindowAttrTableDiv.appendChild(attrName1);
    DefWindowAttrTableDiv.appendChild(attrType1);
    DefWindowAttrTableDiv.appendChild(closeattr1);

    var tdAttrName = document.createElement('td');
    var tdAttrType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var text1 = document.createTextNode(attributeName);
    var text2 = document.createTextNode(attrTypeCombo);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    var text3= "<img src='../Images/Delete.png'>";
    deletebtn.innerHTML = text3;
    deletebtn.onclick = function() {
        deleteRowForWindow(this);
    };

    tdAttrName.appendChild(text1);
    tdAttrType.appendChild(text2);
    tdDelete.appendChild(deletebtn);
    tr.appendChild(tdAttrName);
    tr.appendChild(tdAttrType);
    tr.appendChild(tdDelete);
    table1.appendChild(tr);
    DefWindowAttrTableDiv.appendChild(table1);

    DefwindowStreamDiv.appendChild(DefCreateWindow);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table of the window form in defining a new window
 * @param row
 */

function deleteRowForWindow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('attrtableForWindow').deleteRow(i);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                        DROPPING QUERIES                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dropQuery(newAgent, i,e,droptype,topP,left,text)
{
    /*A text node division will be appended to the newAgent element so that the element name can be changed in the text node and doesn't need to be appended...
     ...to the newAgent Element everytime theuser changes it*/
    var node = document.createElement("div");
    node.id = i+"-nodeInitial";
    node.className = "queryNameNode";
    var textnode = document.createTextNode(text);
    textnode.id = i+"-textnodeInitial";
    node.appendChild(textnode);

    if( droptype=='squerydrop' || droptype =='wquerydrop' || droptype == 'filterdrop'){
        var newQuery = new app.Query;
        newQuery.set('id', i);
        queryList.add(newQuery);
        var prop = $('<a onclick="generatePropertiesFormForQueries(this)"><b><img src="../Images/settings.png" class="element-prop-icon"></b></a>').attr('id', (i+('-prop')));
        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
        newAgent.append(node).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
        dropCompleteQueryElement(newAgent,i,e,topP,left);
    }

    else if(droptype=="joquerydrop")
    {
        var prop = $('<a onclick="getJoinConnectionDetails(this)"><b><img src="../Images/settings.png" class="querySettingIconLoc"></b></a> ').attr('id', (i+('-propjoquerydrop')));
        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined1"></b></a> ').attr('id', (i+'vis'));
        newAgent.append(node).append('<a class="boxclose1" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
        dropCompleteJoinQueryElement(newAgent,i,e,topP,left);
    }
    else if(droptype=="stquerydrop")
    {
        var prop = $('<a onclick="getStateMachineConnectionDetails(this)"><b><img src="../Images/settings.png" class="querySettingIconLoc"></b></a> ').attr('id', (i+('-propstquerydrop')));
        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined1"></b></a> ').attr('id', (i+'vis'));
        newAgent.append(node).append('<a class="boxclose1" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
        dropCompleteStateMQueryElement(newAgent,i,e,topP,left);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                        PASS-THROUGH QUERY ELEMENT RELATED FUNCTIONALITIES                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param newAgent
 * @param i
 * @param e
 * @description Drops the Pass-though,Filter and the window queries as their in and out connectors can permit only one connection each
 *
 */

function dropCompleteQueryElement(newAgent,i,e,topP,left)
{
    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left',
        maxConnections:1,
        deleteEndpointsOnDetach:true
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1,
        deleteEndpointsOnDetach:true
    });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var fromStreamId, intoStreamId;
/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var queryDiv;
var simpleQueryLabel, simpleQueryName,queryNameInput, fromStreamLabel, fromStream, filterLabel,filterInput, selectLabel, insertIntoLabel, insertIntoStream;
var inputtxtName;
var inputlblName;
var queryFomButton;
/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/

/**
 * @function Create the query form for Pass-through and Filter queries.
 * @param elementID
 * @param fromNameSt
 * @param intoNameSt
 * @param fromStreamIndex
 * @param intoStreamIndex
 * @param streamType
 * @param defAttrNum
 * @param formHeading
 */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var attrName = document.createElement("label");
var attrType= document.createElement("label");
var closeattr= document.createElement("button");

var table = document.createElement('table');
table.id = "attrtable";
table.className = "attrtable";
var tr = document.createElement('tr');
var attrNameHeader= document.createElement('td');
var attrtypeHeader = document.createElement('td');
var attrDeleteHeader   = document.createElement('td');
attrNameHeader.innerHTML = "Attribute Name";
attrtypeHeader.innerHTML = "Attribute Type";
attrDeleteHeader.innerHTML = "Delete Row";
tr.appendChild(attrNameHeader);
tr.appendChild(attrtypeHeader);
tr.appendChild(attrDeleteHeader);
table.appendChild(tr);
/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('attrtable').deleteRow(i);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRowForVariablePartition(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('tableVariablePartitionConditionDisplay').deleteRow(i);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRowForRangePartition(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('tableRangePartitionConditionDisplay').deleteRow(i);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function connectionShowHideToggle(element)
{
    var clickedId =  element.id;
    var elementID=clickedId = clickedId.charAt(0);
    var ImportCon = elementID+"-Inimport";
    var ImportCon1 = elementID+"-Outimport";
    var ExportCon = elementID+"-Inexport";
    var ExportCon1 = elementID+"-Outexport";
    var DefinedCon = elementID+"-Indefined";
    var DefinedCon1 = elementID+"-Outdefined";

    var importConExists = document.getElementById(ImportCon);
    var importConExists1 = document.getElementById(ImportCon1);
    //alert(importConExists);
    var exportConExists = document.getElementById(ExportCon);
    var exportConExists1 = document.getElementById(ExportCon1);
    //alert(exportConExists);
    var definedConExists = document.getElementById(DefinedCon);
    var definedConExists1 = document.getElementById(DefinedCon1);
    //alert(definedConExists);

    if(importConExists != null || importConExists1 !=null)
    {
        if(importConExists+ $(':visible').length)
        {
            $(importConExists).hide();
        }
        else
        {
            $(importConExists).show();
        }

    }

    else if(exportConExists != null || exportConExists1 != null)
    {
        if(exportConExists+ $(':visible').length)
        {
            $(exportConExists).hide();
        }
        else
        {
            $(exportConExists).show();
        }

    }

    else if(definedConExists != null || definedConExists1 != null)
    {
        if(definedConExists+ $(':visible').length)
        {
            $(definedConExists).hide();
        }

        else
        {
            $(definedConExists).show();
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Method that appends the prop to a partition element and calls the method to drop the partition onto the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param droptype
 */

function dropPartition(newAgent, i, e, droptype,mouseTop,mouseLeft)
{

    var prop = $('<a><b><img src="../Images/settings.png" class="querySettingIconLoc"></b></a>').attr('id', (i+('-propPartition')));
    newAgent.append('<a class="boxclose1" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(prop);
    dropCompletePartitionElement(newAgent,i,e,mouseTop,mouseLeft);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description
 * @param newAgent
 * @param i
 * @param e
 */
var x =1;

function dropCompletePartitionElement(newAgent,i,e,mouseTop,mouseLeft)
{

    // $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    $(finalElement).on('dblclick',function () {

        var connectionIn = $('<div class="connectorInPart" onclick="getPartitionConnectionDetails(this.id)">').attr('id', i + '-pc'+ x).addClass('connection').text("pc"+x);
        finalElement.append(connectionIn);

        jsPlumb.makeTarget(connectionIn, {
            anchor: 'Left'
        });
        jsPlumb.makeSource(connectionIn, {
            anchor: 'Right'
        });

        x++;
    });

    finalElement.css({
        'top': mouseTop,
        'left': mouseLeft
    });

    $(function() { $(finalElement).draggable().resizable(); });
    $('#container').append(finalElement);

    // $(finalElement).resizable({
    //     resize: function (e, ui) {
    //         jsPlumb.repaint(ui.helper);
    //     }
    // });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO Json output for Partitions-> Hence regenerating a partition from input

var tablePartitionConditionTableForm = document.createElement('table');
tablePartitionConditionTableForm.id = "tablePartitionConditionTableForm";
tablePartitionConditionTableForm.className = "tablePartitionConditionTableForm";

function setPartitionConditionform(clickedId,selctedSt,fromStreamName,streamType,fromStreamIndex, defAttrNum, type)
{
    // alert("called");

    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tablePartitionConditionForm = document.createElement('table');
    tablePartitionConditionForm.id = "tablePartitionConditionForm";
    tablePartitionConditionForm.className = "tablePartitionConditionForm";

    var tableVariablePartitionConditionForm = document.createElement('table');
    tableVariablePartitionConditionForm.id = "tableVariablePartitionConditionForm";
    tableVariablePartitionConditionForm.className = "tableVariablePartitionConditionForm";

    var tableRangePartitionConditionForm = document.createElement('table');
    tableRangePartitionConditionForm.id = "tableRangePartitionConditionForm";
    tableRangePartitionConditionForm.className = "tableRangePartitionConditionForm";

    partitionConditionDiv=document.createElement("div");
    partitionConditionDiv.className="partitionConditionDiv";
    partitionConditionDiv.id="partitionConditionDiv";

    variablePartitionTypeTableDiv=document.createElement("div");
    variablePartitionTypeTableDiv.className="partitionTypeTableDiv";
    variablePartitionTypeTableDiv.id="partitionTypeTableDiv";

    variablePartitionTypeTableDisplayDiv=document.createElement("div");
    variablePartitionTypeTableDisplayDiv.className="variablePartitionTypeTableDisplayDiv";
    variablePartitionTypeTableDisplayDiv.id="variablePartitionTypeTableDisplayDiv";

    rangePartitionTypeTableDiv=document.createElement("div");
    rangePartitionTypeTableDiv.className="rangePartitionTypeTableDiv";
    rangePartitionTypeTableDiv.id="rangePartitionTypeTableDiv";

    rangePartitionTypeTableDisplayDiv=document.createElement("div");
    rangePartitionTypeTableDisplayDiv.className="rangePartitionTypeTableDisplayDiv";
    rangePartitionTypeTableDisplayDiv.id="rangePartitionTypeTableDisplayDiv";

    partitionConditionLabel= document.createElement("label");
    partitionConditionLabel.className="partitionConditionLabel";
    partitionConditionLabel.id="partitionConditionLabel";
    partitionConditionLabel.innerHTML='Define Partition Condition';

    variablePartitionIdLabel= document.createElement("label");
    variablePartitionIdLabel.id ="variablePartitionIdLabel";
    variablePartitionIdLabel.className ="variablePartitionIdLabel";
    variablePartitionIdLabel.innerHTML = "Variable Partitioning";

    rangePartitionIdLabel= document.createElement("label");
    rangePartitionIdLabel.id ="rangePartitionIdLabel";
    rangePartitionIdLabel.className ="rangePartitionIdLabel";
    rangePartitionIdLabel.innerHTML = "Range Partitioning";

    rangePartitionTypeInput = document.createElement("input");
    rangePartitionTypeInput.id ="rangePartitionTypeInput";
    rangePartitionTypeInput.className ="rangePartitionTypeInput";

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    partitionIdLabel= document.createElement("label");
    partitionIdLabel.id ="partitionIdLabel";
    partitionIdLabel.className ="partitionIdLabel";
    partitionIdLabel.innerHTML = "Partition ID: ";

    partitionIdInput= document.createElement("input");
    partitionIdInput.id ="partitionIdInput";
    partitionIdInput.className ="partitionIdInput";

    rangePartitionTypeLabel= document.createElement("label");
    rangePartitionTypeLabel.id ="rangePartitionTypeLabel";
    rangePartitionTypeLabel.className ="rangePartitionTypeLabel";
    rangePartitionTypeLabel.innerHTML = "Range Partition Type: ";

    variablePartitionTypeLabel= document.createElement("label");
    variablePartitionTypeLabel.id ="variablePartitionTypeLabel";
    variablePartitionTypeLabel.className ="variablePartitionTypeLabel";
    variablePartitionTypeLabel.innerHTML = "Varibale Partition Type: ";

    partitionTypeComboDiv=document.createElement("div");
    partitionTypeComboDiv.className="partitionTypeComboDiv";
    partitionTypeComboDiv.id="partitionTypeComboDiv";

    var html = '<select id="partitionTypeComboForPartition">', attrtypes = partitiontypeGenerate(streamType,selctedSt,fromStreamIndex,defAttrNum, type), i;
    for(i = 0; i < attrtypes.length; i++) {
        html += "<option value='"+attrtypes[i]+"'>"+attrtypes[i]+"</option>";
    }
    html += '</select>';

    partitionTypeComboDiv.innerHTML = html;

    btnAddVariablePartitionType=document.createElement("button");
    btnAddVariablePartitionType.type="button";
    btnAddVariablePartitionType.className="btnAddVariablePartitionType";
    btnAddVariablePartitionType.id="btnAddVariablePartitionType";
    btnAddVariablePartitionType.innerHTML="Add variable partition type";
    btnAddVariablePartitionType.onclick = function () {
        $("#rangePartitionTypeTableDiv").addClass("disabledbutton");
        addVariablePartitionTypeToTable();
    };

    btnAddRangePartitionType=document.createElement("button");
    btnAddRangePartitionType.type="button";
    btnAddRangePartitionType.className="btnAddRangePartitionType";
    btnAddRangePartitionType.id="btnAddRangePartitionType";
    btnAddRangePartitionType.innerHTML="Add range partition type";
    btnAddRangePartitionType.onclick = function () {
        $("#partitionTypeTableDiv").addClass("disabledbutton");
        addRangePartitionTypeToTable();
    };

    btnPartitionCondition=document.createElement("button");
    btnPartitionCondition.type="button";
    btnPartitionCondition.className="btnPartitionCondition";
    btnPartitionCondition.id="btnPartitionCondition";
    btnPartitionCondition.innerHTML="Apply Partition Condition";
    btnPartitionCondition.onclick = function () {
        savePartitionDetailsToStream(clickedId,streamType,fromStreamIndex,fromStreamName);
    };

    partitionCloseButton=document.createElement("button");
    partitionCloseButton.type="button";
    partitionCloseButton.className="partitionCloseButton";
    partitionCloseButton.id="partitionCloseButton";
    partitionCloseButton.innerHTML="Cancel";
    partitionCloseButton.onclick = function() {
        $("#tableVariablePartitionConditionDisplay tr").remove();
        $("#tableRangePartitionConditionDisplay tr").remove();
        $("#rangePartitionTypeTableDiv").removeClass("disabledbutton");
        $("#rangePartitionTypeTableDiv").addClass("disabledbutton");
        closeForm();
    };

    //Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');

    td1.appendChild(partitionConditionLabel);
    tr1.appendChild(td1);
    tablePartitionConditionForm.appendChild(tr1);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(partitionIdLabel);
    tr2.appendChild(td2);
    td3.appendChild(partitionIdInput);
    tr2.appendChild(td3);
    tablePartitionConditionForm.appendChild(tr2);

    partitionConditionDiv.appendChild(tablePartitionConditionForm);

    ////////////////////////Variable Partitioning Division Specs///////////////////

    variablePartitionTypeTableDiv.appendChild(variablePartitionIdLabel);
    variablePartitionTypeTableDiv.appendChild(variablePartitionTypeTableDisplayDiv);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(variablePartitionTypeLabel);
    tr2.appendChild(td2);
    td3.appendChild(partitionTypeComboDiv);
    tr2.appendChild(td3);
    tableVariablePartitionConditionForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');

    td4.appendChild(btnAddVariablePartitionType);
    tr3.appendChild(td4);
    tableVariablePartitionConditionForm.appendChild(tr3);

    variablePartitionTypeTableDiv.appendChild(tableVariablePartitionConditionForm);
    partitionConditionDiv.appendChild(variablePartitionTypeTableDiv);
    $(".variablePartitionTypeTableDisplayDiv").hide();

    ////////////////////////Range Partitioning Division Specs///////////////////

    rangePartitionTypeTableDiv.appendChild(rangePartitionIdLabel);
    rangePartitionTypeTableDiv.appendChild(rangePartitionTypeTableDisplayDiv);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(rangePartitionTypeLabel);
    tr2.appendChild(td2);
    td3.appendChild(rangePartitionTypeInput);
    tr2.appendChild(td3);
    tableRangePartitionConditionForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');

    td4.appendChild(btnAddRangePartitionType);
    tr3.appendChild(td4);
    tableRangePartitionConditionForm.appendChild(tr3);

    rangePartitionTypeTableDiv.appendChild(tableRangePartitionConditionForm);
    $(".rangePartitionTypeTableDiv").hide();
    partitionConditionDiv.appendChild(rangePartitionTypeTableDiv);
    partitionConditionDiv.appendChild(btnPartitionCondition);
    partitionConditionDiv.appendChild(partitionCloseButton);

    lot.appendChild(partitionConditionDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function savePartitionDetailsToStream(clickedId,streamType,fromStreamIndex,fromStreamName)
{
    var partitionIdInput = document.getElementById("partitionIdInput").value;
    var partitionConditionElementID = clickedId;
    var elClickedId= clickedId.substr(0, clickedId.indexOf('-')); //1-pc1
    var subPcId= clickedId.substr(clickedId.indexOf("c") + 1);


    if (streamType == "import" || streamType == "export")
    {
        var tablevar = document.getElementById('tableVariablePartitionConditionDisplay');
        var tableran = document.getElementById('tableRangePartitionConditionDisplay');

        if (tableran == null) {
            var tblerows = (tablevar.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerows);

            for (r = 1; r < tblerows; r++) {
                for (var c = 0; c < 1; c++) {
                    var attrNm = tablevar.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = attrNm;

                    var predefarr = PredefinedStreams();
                    for (var x = 0; x < predefarr.length; x++) {
                        for (var y = 0; y < predefarr[x][1].length; y++) {
                            if (predefarr[x][1][y] == attrNm) {
                                createdPartitionConditionArray[elClickedId][2][r - 1][1] = predefarr[x][2][y];
                            }
                        }
                    }

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }

            }
            createdPartitionConditionArray[elClickedId][4] = tblerows - 1;
        }
        else {
            var tblerowsRange = (tableran.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerowsRange);

            for (r = 1; r < tblerowsRange; r++) {
                for (var c = 0; c < 1; c++) {
                    var range = tableran.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = range;
                    createdPartitionConditionArray[elClickedId][2][r - 1][1] = null;

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }
            }
            createdPartitionConditionArray[elClickedId][4] = tblerowsRange - 1;
        }

        createdPartitionConditionArray[elClickedId][0] = elClickedId;
        createdPartitionConditionArray[elClickedId][1] = partitionIdInput;
        createdPartitionConditionArray[elClickedId][3] = "Partition Condition";
        createdPartitionConditionArray[elClickedId][5] = subPcId;
        createdPartitionConditionArray[elClickedId][6] = fromStreamName;


    }

    //Todo display all connected partitions

    else if (streamType == "defined") {
        var partitionIdInput = document.getElementById("partitionIdInput").value;
        var partitionConditionElementID = clickedId;

        var tablevar = document.getElementById('tableVariablePartitionConditionDisplay');
        var tableran = document.getElementById('tableRangePartitionConditionDisplay');

        if (tableran == null) {
            var tblerows = (tablevar.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerows);

            for (r = 1; r < tblerows; r++) {
                for (var c = 0; c < 1; c++) {
                    var attrNm = tablevar.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = attrNm;

                    for (var x = 0; x < createdDefinedStreamArray[fromStreamIndex][2].length-1; x++) {
                        if (createdDefinedStreamArray[fromStreamIndex][2][x][0] == attrNm) {
                            createdPartitionConditionArray[elClickedId][2][r - 1][1] = createdDefinedStreamArray[fromStreamIndex][2][x][1];
                        }

                    }

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }

            }
            createdPartitionConditionArray[elClickedId][4] = tblerows - 1;
        }
        else {
            var tblerowsRange = (tableran.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerowsRange);

            for (r = 1; r < tblerowsRange; r++) {
                for (var c = 0; c < 1; c++) {
                    var range = tableran.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = range;
                    createdPartitionConditionArray[elClickedId][2][r - 1][1] = null;

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }
            }
            createdPartitionConditionArray[elClickedId][4] = tblerowsRange - 1;
        }


        createdPartitionConditionArray[elClickedId][0] = elClickedId;
        createdPartitionConditionArray[elClickedId][1] = partitionIdInput;
        createdPartitionConditionArray[elClickedId][3] = "Partition Condition";
        createdPartitionConditionArray[elClickedId][4] = createdDefinedStreamArray[fromStreamIndex][2].length;
        createdPartitionConditionArray[elClickedId][5] = subPcId;
        createdPartitionConditionArray[elClickedId][6] = fromStreamName;



    }
    else if (streamType == "window") {

    }
    else {
        alert("This type of element cannot be connected to a partition condition");
    }

    // alert("experimental size : "+ createdPartitionConditionArray[elClickedId][7].length);


    // alert("clicked ID: "+createdPartitionConditionArray[elClickedId][0]+"partition name: "+createdPartitionConditionArray[elClickedId][1]+"what: "+createdPartitionConditionArray[elClickedId][2]+"len: "+createdPartitionConditionArray[elClickedId][4]+"subpc: "+createdPartitionConditionArray[elClickedId][5]+"selectedStream: "+createdPartitionConditionArray[elClickedId][6])
    //
    // alert("Element Id: " + createdPartitionConditionArray[elClickedId][0] + "\nName: " + createdPartitionConditionArray[elClickedId][1] + "\nDef: " + createdPartitionConditionArray[elClickedId][3] + "\ntable Rows: " + createdPartitionConditionArray[elClickedId][4]+ "\nSub pc id: " + createdPartitionConditionArray[elClickedId][5]);


    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
    document.getElementById(clickedId).innerHTML=partitionIdInput;
    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function partitiontypeGenerate(streamType,selctedSt,fromStreamIndex,defAttrNum, type)
{
    var attributes = [];
    // alert("fromStreamIndex:"+fromStreamIndex);

    if(streamType=="import" || streamType=="export")
    {
        var predefarr = PredefinedStreams();
        for(var x = 0; x<predefarr.length; x++)
        {
            if (predefarr[x][0] == selctedSt)
            {
                for(var n=0; n<predefarr[x][1].length;n++)
                {
                    attributes.push(predefarr[x][1][n]);
                }
            }
        }
    }
    else if(streamType=="defined")
    {
        for(var m=0;m<defAttrNum-1;m++)
        {
            attributes.push(createdDefinedStreamArray[fromStreamIndex][2][m][0]);
        }
    }
    else
    {
        if(type==null)
        {
            for (var m = 0; m < defAttrNum - 1; m++)
            {
                attributes.push(createdWindowStreamArray[fromStreamIndex][4][m][0]);
            }

        }
        else
        {
            //alert("Define method");
            for (var m = 0; m < defAttrNum - 1; m++)
            {
                attributes.push(createdWindowStreamArray[fromStreamIndex][4][m][0]);
            }
        }
    }

    return attributes;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tableVariablePartitionConditionDisplay = document.createElement('table');
tableVariablePartitionConditionDisplay.id = "tableVariablePartitionConditionDisplay";
tableVariablePartitionConditionDisplay.className = "tableVariablePartitionConditionDisplay";
var tr = document.createElement('tr');
var tdVarPartitionTypeTitle = document.createElement('td');
var tdVarPartitionTypeDelete   = document.createElement('td');
tdVarPartitionTypeTitle.innerHTML = "Partition Type";
tdVarPartitionTypeDelete.innerHTML = "Delete";
tr.appendChild(tdVarPartitionTypeTitle);
tr.appendChild(tdVarPartitionTypeDelete);
tableVariablePartitionConditionDisplay.appendChild(tr);


function addVariablePartitionTypeToTable()
{
    var tr = document.createElement('tr');
    var choice=document.getElementById("partitionTypeComboForPartition");
    var partitionTypeCombo = choice.options[choice.selectedIndex].text;

    var trow = document.createElement('tr');
    var tdPartitionType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var partitionType = document.createTextNode(partitionTypeCombo);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    var text3= "<img src='../Images/Delete.png'>";
    deletebtn.innerHTML = text3;
    deletebtn.onclick = function() {
        deleteRowForVariablePartition(this);
    };

    tdPartitionType.appendChild(partitionType);
    tdDelete.appendChild(deletebtn);
    trow.appendChild(tdPartitionType);
    trow.appendChild(tdDelete);
    tableVariablePartitionConditionDisplay.appendChild(trow);
    variablePartitionTypeTableDisplayDiv.appendChild(tableVariablePartitionConditionDisplay);
    $(".variablePartitionTypeTableDisplayDiv").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tableRangePartitionConditionDisplay = document.createElement('table');
tableRangePartitionConditionDisplay.id = "tableRangePartitionConditionDisplay";
tableRangePartitionConditionDisplay.className = "tableRangePartitionConditionDisplay";
var tr = document.createElement('tr');
var tdRanPartitionTypeTitle = document.createElement('td');
var tdRanPartitionTypeDelete   = document.createElement('td');
tdRanPartitionTypeTitle.innerHTML = "Partition Type";
tdRanPartitionTypeDelete.innerHTML = "Delete";
tr.appendChild(tdRanPartitionTypeTitle);
tr.appendChild(tdRanPartitionTypeDelete);
tableRangePartitionConditionDisplay.appendChild(tr);


function addRangePartitionTypeToTable()
{
    var tr = document.createElement('tr');
    var choice=document.getElementById("rangePartitionTypeInput").value;

    var trow = document.createElement('tr');
    var tdPartitionType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var partitionType = document.createTextNode(choice);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    var text3= "<img src='../Images/Delete.png'>";
    deletebtn.innerHTML = text3;
    deletebtn.onclick = function() {
        deleteRowForRangePartition(this);
    };

    tdPartitionType.appendChild(partitionType);
    tdDelete.appendChild(deletebtn);
    trow.appendChild(tdPartitionType);
    trow.appendChild(tdDelete);
    tableRangePartitionConditionDisplay.appendChild(trow);
    rangePartitionTypeTableDisplayDiv.appendChild(tableRangePartitionConditionDisplay);
    $(".rangePartitionTypeTableDisplayDiv").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param newAgent
 * @param i
 * @param e
 * @description Drops the join query element as its in connector can permit 2 connections and its out connector can permit only one connection
 *
 */

function dropCompleteJoinQueryElement(newAgent,i,e,topP,left)
{
    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left',
        maxConnections:2
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1
    });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param newAgent
 * @param i
 * @param e
 * @description Drops the stte machine query element as its in connector can permit multiple connections and its out connector can permit only one connection
 *
 */

function dropCompleteStateMQueryElement(newAgent,i,e,topP,left)
{
    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left'
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1
    });
}

function CreateWindow(elementID)
{
    elementID = elementID.charAt(0);
    var table = document.getElementById('attrtableForWindow');
    var tblerows = (table.rows.length);

    var windowInput = document.getElementById("DefNameForWindow").value;

    createdWindowStreamArray[elementID][0] = elementID;
    createdWindowStreamArray[elementID][1] = windowInput;
    createdWindowStreamArray[elementID][2] = null;
    createdWindowStreamArray[elementID][3] = null;
    createdWindowStreamArray[elementID][4] = new Array(tblerows);

    for (var r = 1; r < tblerows; r++)
    {
        for (var c = 0; c < 1; c++)
        {
            var attrNm = table.rows[r].cells[c].innerHTML;
            var attrTp = table.rows[r].cells[1].innerHTML;
            createdWindowStreamArray[elementID][4][r-1] = [];
            createdWindowStreamArray[elementID][4][r-1][0] = attrNm;
            createdWindowStreamArray[elementID][4][r-1][1] = attrTp;
        }
    }
    // alert("Element ID:"+createdWindowStreamArray[elementID][0]+"\nElement Name:"+createdWindowStreamArray[elementID][1]+"\nSelected Stream Index:"+createdWindowStreamArray[elementID][2]+"\nSelected Stream:"+createdWindowStreamArray[elementID][3]+"\nAttributes:"+createdWindowStreamArray[elementID][4]);


    var elIdforNode =  elementID+"-windowNode";
    document.getElementById(elIdforNode).innerHTML = windowInput;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}


function getFromStreamNameForWindow(fromStreamId,elementID)
{
    var fromNameSt, selctedSt,streamType;
    var fromStreamIndex;
    var predefarr = PredefinedStreams();
    var lengthPreDef = predefarr.length;

    //alert("array legth:"+lengthPreDef);
    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'from Stream' Name
        if(createdImportStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdImportStreamArray[x][2];
            selctedSt = createdImportStreamArray[x][1];
            streamType = "import";

            for(var f =0; f<lengthPreDef; f++)
            {
                if(predefarr[f][0]==selctedSt)
                {
                    fromStreamIndex =f;
                }
            }
        }
        else if(createdExportStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdExportStreamArray[x][2];
            selctedSt = createdExportStreamArray[x][1];
            streamType = "export";
            for(var f =0; f<lengthPreDef; f++)
            {
                if(predefarr[f][0]==selctedSt)
                {
                    fromStreamIndex =f;
                }
            }
        }
        else if(createdDefinedStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdDefinedStreamArray[x][1];

            var defAttrNum = createdDefinedStreamArray[x][2].length;
            streamType = "defined";
            fromStreamIndex =createdDefinedStreamArray[x][0];
        }

    }
    //To retrieve the number of attributes
    getAttributes(selctedSt);
    //attrNumber gives the number of attributes
    //streamInd gives the index of the selected stream
    createWindowStreamForm(elementID, fromNameSt,fromStreamIndex,streamType, defAttrNum);
}

function createWindowStreamForm(elementID, fromNameSt,fromStreamIndex,streamType, defAttrNum)
{
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tableWindowStreamForm = document.createElement('table');
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    windowStreamDiv=document.createElement("div");
    windowStreamDiv.className="windowStreamDiv";
    windowStreamDiv.id="windowStreamDiv";

    var predefarr = PredefinedStreams();

    windowStreamDiv=document.createElement("div");
    windowStreamDiv.className="windowStreamDiv";
    windowStreamDiv.id="windowStreamDiv";

    windowStreamLabel= document.createElement("label");
    windowStreamLabel.className="windowStreamLabel";
    windowStreamLabel.id="windowStreamLabel";
    windowStreamLabel.innerHTML='Window';

    selectedStreamForWindowLabel= document.createElement("label");
    selectedStreamForWindowLabel.id ="selectedStreamForWindowLabel";
    selectedStreamForWindowLabel.className ="selectedStreamForWindowLabel";
    selectedStreamForWindowLabel.innerHTML = "Selected Stream: ";

    selectedStreamForWindow= document.createElement("label");
    selectedStreamForWindow.id ="selectedStreamForWindow";
    selectedStreamForWindow.className ="selectedStreamForWindow";
    selectedStreamForWindow.innerHTML = fromNameSt;

    windowStreamName= document.createElement("label");
    windowStreamName.id ="windowStreamName";
    windowStreamName.className ="windowStreamName";
    windowStreamName.innerHTML = "Window name";

    windowStreamNameInput= document.createElement("input");
    windowStreamNameInput.id = "windowStreamNameInput";
    windowStreamNameInput.className = "windowStreamNameInput";

    windowStreamFormButton=document.createElement("button");
    windowStreamFormButton.type="button";
    windowStreamFormButton.className="windowStreamFormButton";
    windowStreamFormButton.id="windowStreamFormButton";
    windowStreamFormButton.innerHTML="Submit";
    windowStreamFormButton.onclick = function () {
        getwindowStreamData(elementID, fromStreamIndex,streamType, defAttrNum);
    };

    windowStreamFomCloseButton=document.createElement("button");
    windowStreamFomCloseButton.type="button";
    windowStreamFomCloseButton.className="windowStreamFomCloseButton";
    windowStreamFomCloseButton.id="windowStreamFomCloseButton";
    windowStreamFomCloseButton.innerHTML="Cancel";
    windowStreamFomCloseButton.onclick = function() {
        closeForm();
    };

    windowStreamDiv.appendChild(windowStreamLabel);

    //Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');

    td1.appendChild(selectedStreamForWindowLabel);
    tr1.appendChild(td1);
    td2.appendChild(selectedStreamForWindow);
    tr1.appendChild(td2);
    tableWindowStreamForm.appendChild(tr1);

    //Row 2

    var tr2 = document.createElement('tr');
    var td3=document.createElement('td');
    var td4=document.createElement('td');

    td3.appendChild(windowStreamName);
    tr2.appendChild(td3);
    td4.appendChild(windowStreamNameInput);
    tr2.appendChild(td4);
    tableWindowStreamForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td5=document.createElement('td');
    var td6=document.createElement('td');

    td5.appendChild(windowStreamFormButton);
    tr3.appendChild(td5);
    td6.appendChild(windowStreamFomCloseButton);
    tr3.appendChild(td6);
    tableWindowStreamForm.appendChild(tr3);

    windowStreamDiv.appendChild(tableWindowStreamForm);
    lot.appendChild(windowStreamDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getwindowStreamData(elementID, fromStreamIndex,streamType, defAttrNum)
{
    var windowStreamName = document.getElementById("selectedStreamForWindow").innerHTML;
    var windowInput = document.getElementById("windowStreamNameInput").value;
    var predefarr = PredefinedStreams();
    createdWindowStreamArray[elementID][0] = elementID;
    createdWindowStreamArray[elementID][1] = windowInput;
    createdWindowStreamArray[elementID][2] = fromStreamIndex;
    createdWindowStreamArray[elementID][3] = windowStreamName;
    createdWindowStreamArray[elementID][4] = [];

    //alert("Element ID:"+createdWindowStreamArray[elementID][0]+"\nElement Name:"+createdWindowStreamArray[elementID][1]+"\nSelected Stream Index:"+createdWindowStreamArray[elementID][2]+"\nSelected Stream:"+createdWindowStreamArray[elementID][3]);
    if(streamType=="import" || streamType=="export")
    {
        for (var f = 0; f < attrNumber; f++)
        {
            createdWindowStreamArray[elementID][4][f]=[];
            createdWindowStreamArray[elementID][4][f][0] = predefarr[fromStreamIndex][1][f];
            createdWindowStreamArray[elementID][4][f][1] = predefarr[fromStreamIndex][2][f];
            //alert("Attribute: "+createdWindowStreamArray[elementID][4][f][0]+"\nAttribute Type:"+createdWindowStreamArray[elementID][4][f][1]);
        }
    }
    else
    {
        for (var f =0; f<defAttrNum-1;f++)
        {
            createdWindowStreamArray[elementID][4][f]=[];
            createdWindowStreamArray[elementID][4][f][0] = createdDefinedStreamArray[fromStreamIndex][2][f][0];
            createdWindowStreamArray[elementID][4][f][1] = createdDefinedStreamArray[fromStreamIndex][2][f][1];
            //alert("Attribute: "+createdWindowStreamArray[elementID][4][f][0]+"\nAttribute Type:"+createdWindowStreamArray[elementID][4][f][1]);
        }
    }

    var elIdforNode =  elementID+"-windowNode";
    document.getElementById(elIdforNode).innerHTML = windowInput;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}

function closeForm()
{
    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var wqueryDiv;
var windowQueryLabel, windowQueryName,wqueryNameInput, wfromStreamLabel, wfromStream, wfilterLabel1,wfilterInput1, wselectLabel, winsertIntoLabel, winsertIntoStream;
var windowLabel, windowInput, wfilterLabel2,wfilterInput2;
var winputtxtName, winputlblName;
var wqueryFomButton;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var jqueryDivLeft, jqueryDivRight, jqueryDivAttrMap;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getJoinQueryData(elementID, fromStreamIndex1,fromStreamIndex2, intoStreamIndex, streamType, defAttrNum)
{

    var queryName = document.getElementById("jQueryNameInput").value;
    var insertIntoStream = document.getElementById("jinsertIntoStream").innerHTML;

    //Left Stream Info
    var leftStreamchoice=document.getElementById("leftStreamCombo");
    var leftJoinStream = leftStreamchoice.options[leftStreamchoice.selectedIndex].text;
    var leftJoinfilter1 = document.getElementById("jfilterInput1").value;
    var leftJoinfilter2 = document.getElementById("jfilterInput2").value;
    var leftWindowInput = document.getElementById("jwindowInput").value;

    //Right Stream Info
    var rightStreamchoice=document.getElementById("rightStreamCombo");
    var rightJoinStream = rightStreamchoice.options[rightStreamchoice.selectedIndex].text;
    var rightJoinfilter1 = document.getElementById("jrfilterInput1").value;
    var rightJoinfilter2 = document.getElementById("jrfilterInput2").value;
    var rightWindowInput = document.getElementById("jrwindowInput").value;


    createdJoinQueryArray[elementID][0] = elementID;
    createdJoinQueryArray[elementID][1] = queryName;
    createdJoinQueryArray[elementID][2][0] = leftJoinStream;
    createdJoinQueryArray[elementID][2][1] = leftJoinfilter1;
    createdJoinQueryArray[elementID][2][2] = leftWindowInput;
    createdJoinQueryArray[elementID][2][3] = leftJoinfilter2;
    createdJoinQueryArray[elementID][3][0] = rightJoinStream;
    createdJoinQueryArray[elementID][3][1] = rightJoinfilter1;
    createdJoinQueryArray[elementID][3][2] = rightWindowInput;
    createdJoinQueryArray[elementID][3][3] = rightJoinfilter2;
    createdJoinQueryArray[elementID][4] = [];
    var loopCount=0;
    if(streamType=="import" || streamType=="export")
    {
        loopCount=attrNumber;
    }
    else
    {
        loopCount=defAttrNum-1;
    }
    for(var r=0; r<loopCount;r++)
    {
        createdJoinQueryArray[elementID][4][r] =[];
        var inputTextBoxID = "jinput"+r;
        var attrLabelID = "jlabel" + r;
        createdJoinQueryArray[elementID][4][r][0] = document.getElementById(inputTextBoxID).value;
        createdJoinQueryArray[elementID][4][r][1] = document.getElementById(attrLabelID).innerHTML;

        //alert(createdJoinQueryArray[elementID][4][r][0]+" as "+createdJoinQueryArray[elementID][4][r][1]);
    }

    createdJoinQueryArray[elementID][5]= insertIntoStream;

    //alert(createdJoinQueryArray[elementID][0]+"-"+createdJoinQueryArray[elementID][1]+"\nLeft\n"+createdJoinQueryArray[elementID][2][0]+"\n"+createdJoinQueryArray[elementID][2][1]+"\n"+createdJoinQueryArray[elementID][2][2]+"\n"+createdJoinQueryArray[elementID][2][3]+"\nRight\n"+createdJoinQueryArray[elementID][3][0]+"\n"+createdJoinQueryArray[elementID][3][1]+"\n"+createdJoinQueryArray[elementID][3][2]+"\n"+createdJoinQueryArray[elementID][3][3]+"\n"+createdJoinQueryArray[elementID][5]);

    var elIdforNode =  elementID+"-nodeInitial";
    document.getElementById(elIdforNode).innerHTML = queryName;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var jfromStreamId1,jfromStreamId2, jintoStreamId;

function getJoinConnectionDetails(element)
{
    var clickedId =  element.id;
    clickedId=clickedId.charAt(0);
    var from = clickedId+"-out";
    var from1 = clickedId;
    clickedId = clickedId+"-in";
    var con=jsPlumb.getAllConnections();
    var list=[];
    var checkPoint=-1;

    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            if(checkPoint==-1)
            {
                list[i] = new Array(2);
                list[i][0] = [];
                list[i][0]=con[i].sourceId;
                jfromStreamId1 =list[i][0];
                list[i][1] = con[i].targetId;
                checkPoint=i;
            }
            else
            {
                list[i] = new Array(2);
                list[i][0] = [];
                list[i][0]=con[i].sourceId;
                jfromStreamId2 =list[i][0];
                list[i][1] = con[i].targetId;
                checkPoint=i;
            }
        }

        if(con[i].sourceId==from || con[i].sourceId==from1)
        {
            list[i] = new Array(2);
            list[i][0] = con[i].sourceId;
            list[i][1] = con[i].targetId;
            jintoStreamId =list[i][1];
        }
    }

    jintoStreamId = jintoStreamId.charAt(0);
    getJoinFromStreamName(jfromStreamId1,jfromStreamId2,jintoStreamId,element.id);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getStateMachineConnectionDetails(element)
{
    var stintoStreamId;
    var connectedStreamIdListArray = [];
    var clickedId =  element.id.charAt(0);

    var from = clickedId+"-out";
    var from1 = clickedId;
    clickedId = clickedId+"-in";
    var con=jsPlumb.getAllConnections();
    var list=[];

    for(var i=0;i<con.length;i++)
    {
        if (con[i].targetId == clickedId)
        {
            connectedStreamIdListArray.push(con[i].sourceId);
        }

        if(con[i].sourceId==from || con[i].sourceId==from1)
        {
            list[i] = new Array(2);
            list[i][0] = con[i].sourceId;
            list[i][1] = con[i].targetId;
            stintoStreamId =list[i][1];
        }
    }

    stintoStreamId = stintoStreamId.charAt(0);

    getStateMachineFromStreamName(connectedStreamIdListArray, stintoStreamId,element.id);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPartitionConnectionDetails(element)
{
    var clickedId =  element;

    var con=jsPlumb.getAllConnections();
    var connectedStream, selectedStreamName;
    var list=[];
    var checkPoint=-1;

    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            connectedStream = con[i].sourceId;
        }
    }

    //partitionintoId = partitionintoId.charAt(0);
    getPartitionFromStreamName(clickedId,connectedStream);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getJoinFromStreamName(jfromStreamId1,jfromStreamId2,jintoStreamId,clickedId)
{
    var fromNameSt1,fromNameSt2, intoNameSt, streamType, selctedSt;
    var elementID=clickedId.charAt(0);

    //alert("jfromStreamId1: "+jfromStreamId1+"\njfromStreamId2: "+jfromStreamId2);

    /*The following checks whether the source/ the from stream is a Parttion condition
     This is done by pattern matching of the source's/from Stream's ID
     */
    var elClickedId1= jfromStreamId1.substr(0, jfromStreamId1.indexOf('-'));
    var subPcId1= jfromStreamId1.substr(jfromStreamId1.indexOf("c") + 1);
    var idTest1=/^\d+-pc\d+$/.test(jfromStreamId1);

    var elClickedId2= jfromStreamId2.substr(0, jfromStreamId2.indexOf('-'));
    var subPcId2= jfromStreamId2.substr(jfromStreamId2.indexOf("c") + 1);
    var idTest2=/^\d+-pc\d+$/.test(jfromStreamId2);
    var fromStreamIndex1,fromStreamIndex2,intoStreamIndex;


    // alert("elClickedId1: "+elClickedId1+"\nsubPcId1: "+subPcId1+"\nidTest1: "+idTest1+"\n--------------------------------"+"\nelClickedId2: "+elClickedId2+"\nsubPcId2: "+subPcId2+"\nidTest2: "+idTest2+"\n--------------------------------");

    /*
     If the pattern doesn't match, the from stream is not a Partition Condition anchor
     So can traverse through the Import, Export, Defined and Window Streams
     @function : To retrieve the first 'from Stream' Name (Left/Right)
     */
    if(idTest1==false)
    {
        jfromStreamId1 = jfromStreamId1.charAt(0);
        for(var x = 0; x<100; x++) {

            if (createdImportStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdImportStreamArray[x][2];
                fromStreamIndex1 = x;
            }
            else if (createdExportStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdExportStreamArray[x][2];
                fromStreamIndex1 = x;
            }
            else if (createdDefinedStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdDefinedStreamArray[x][1];
                fromStreamIndex1 = x;
            }
            else if (createdWindowStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdWindowStreamArray[x][1];
                fromStreamIndex1 = x;
            }
        }
    }

    /*
     If the source is a Partition condition anchor, can retrieve the Stream/Window's name that it is associated with
     or inherits from
     */

    else
    {
        for(var f=0;f<100;f++)
        {
            if(createdPartitionConditionArray[f][0]==elClickedId1 && createdPartitionConditionArray[f][5] == subPcId1)
            {
                fromNameSt1 = createdPartitionConditionArray[f][6];
                fromStreamIndex1 = elClickedId1;
            }
        }

    }

    /*
     @function : To retrieve the second 'from Stream' Name (Left/Right)
     */

    if(idTest2==false)
    {
        jfromStreamId2 = jfromStreamId2.charAt(0);
        for(var x = 0; x<100; x++)
        {
            if (createdImportStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdImportStreamArray[x][2];
                fromStreamIndex2 = x;
            }
            else if (createdExportStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdExportStreamArray[x][2];
                fromStreamIndex2 = x;
            }
            else if (createdDefinedStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdDefinedStreamArray[x][1];
                fromStreamIndex2 = x;
            }
            else if (createdWindowStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdWindowStreamArray[x][1];
                fromStreamIndex2 = x;
            }
        }
    }
    else
    {
        for(var f=0;f<100;f++)
        {
            if(createdPartitionConditionArray[f][0]==elClickedId2 && createdPartitionConditionArray[f][5] == subPcId2)
            {
                fromNameSt2 = createdPartitionConditionArray[f][6];
                fromStreamIndex2 = elClickedId2;
            }
        }
    }

    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'into Stream' Name
        if (createdImportStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdImportStreamArray[x][2];
            streamType = "import";
            selctedSt = createdImportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdExportStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdExportStreamArray[x][2];
            streamType = "export";
            selctedSt = createdExportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdDefinedStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdDefinedStreamArray[x][1];
            streamType = "defined";
            intoStreamIndex = x;
            var defAttrNum = createdDefinedStreamArray[x][2].length;
        }
        else if (createdWindowStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdWindowStreamArray[x][1];
            streamType = "window";
            intoStreamIndex = x;
            var defAttrNum = createdDefinedStreamArray[x][4].length;

        }
    }


    //To retrieve the number of attributes
    getAttributes(selctedSt);
    //attrNumber gives the number of attributes
    //streamInd gives the index of the selected stream
    createJoinQueryForm(elementID, fromNameSt1,fromNameSt2, intoNameSt, fromStreamIndex1,fromStreamIndex2, intoStreamIndex, streamType, defAttrNum);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getStateMachineFromStreamName(connectedStreamIdListArray, stintoStreamId,elementID)
{
    var intoNameSt, streamType, selctedSt, intoStreamIndex;
    var partitionId,elementID;
    var subPcId;
    var idTest;
    var elID = elementID;
    var connectionStreamArray = [];
    var connectionPartitionArray = [];

    // alert("connectedStreamIdListArray: "+connectedStreamIdListArray);
    var fromStreamIndex1,fromStreamIndex2,intoStreamIndex;
    var fromStreamNameListArray = [];
    var fromStreamIndexListArray = [];


    for(var m=0;m<connectedStreamIdListArray.length;m++)
    {
        partitionId= connectedStreamIdListArray[m].substr(0, connectedStreamIdListArray[m].indexOf('-'));
        subPcId = connectedStreamIdListArray[m].substr(connectedStreamIdListArray[m].indexOf("c") + 1);
        idTest = /^\d+-pc\d+$/.test(connectedStreamIdListArray[m]);
        //alert("status for connection "+connectedStreamIdListArray[m]+"\npartitionId: "+partitionId+"\nsubPcId: "+subPcId+"\nidTest: "+idTest);

        if(idTest==false)
        {
            elementID = connectedStreamIdListArray[m].charAt(0);
            for(var x = 0; x<100; x++)
            {
                if (createdImportStreamArray[x][0] == elementID) {
                    fromStreamNameListArray.push(createdImportStreamArray[x][2]);
                    fromStreamIndexListArray.push(x);
                }
                else if (createdExportStreamArray[x][0] == elementID) {
                    fromStreamNameListArray.push(createdExportStreamArray[x][2]);
                    fromStreamIndexListArray.push(x);
                }
                else if (createdDefinedStreamArray[x][0] == elementID) {
                    fromStreamNameListArray.push(createdDefinedStreamArray[x][1]);
                    fromStreamIndexListArray.push(x);
                }
                else if (createdWindowStreamArray[x][0] == elementID) {
                    fromStreamNameListArray.push(createdWindowStreamArray[x][1]);
                    fromStreamIndexListArray.push(x);
                }
            }
        }
        else
        {
            for(var f=0;f<100;f++)
            {
                if(createdPartitionConditionArray[f][0]==connectedStreamIdListArray[m].charAt(0))
                {
                    if(createdPartitionConditionArray[f][5] == subPcId)
                    {
                        fromStreamNameListArray.push(createdPartitionConditionArray[f][6]);
                        fromStreamIndexListArray.push(partitionId);
                    }
                }
            }
        }
    }




    for (var x = 0; x < 100; x++)
    {
        //To retrieve the 'into Stream' Name
        if (createdImportStreamArray[x][0] == stintoStreamId) {
            intoNameSt = createdImportStreamArray[x][2];
            streamType = "import";
            selctedSt = createdImportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdExportStreamArray[x][0] == stintoStreamId) {
            intoNameSt = createdExportStreamArray[x][2];
            streamType = "export";
            selctedSt = createdExportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdDefinedStreamArray[x][0] == stintoStreamId) {
            intoNameSt = createdDefinedStreamArray[x][1];
            streamType = "defined";
            intoStreamIndex = x;
            var defAttrNum = createdDefinedStreamArray[x][2].length;
        }
        else if (createdWindowStreamArray[x][0] == stintoStreamId) {
            intoNameSt = createdWindowStreamArray[x][1];
            streamType = "window";
            intoStreamIndex = x;
            var defAttrNum = createdWindowStreamArray[x][4].length;

        }
    }


    //alert("Final fromNameLIstArray: "+fromStreamNameListArray);
    elementID=elID.charAt(0);
    //To retrieve the number of attributes
    getAttributes(selctedSt);
    //attrNumber gives the number of attributes
    //streamInd gives the index of the selected stream
    createStateMachineQueryForm(elementID, fromStreamNameListArray, intoNameSt, intoStreamIndex, streamType, defAttrNum);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPartitionFromStreamName(clickedId, connectedStream)
{
    var streamType, selctedSt, fromStreamIndex;
    var fromStreamName;
    var connectedStream =  connectedStream.charAt(0);
    // alert("getPartitionFromStreamName-connectedStream: "+connectedStream);
    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'from Stream' Names
        if (createdImportStreamArray[x][0] == connectedStream) {
            fromStreamName=createdImportStreamArray[x][2];
            streamType = "import";
            selctedSt = createdImportStreamArray[x][1];
            fromStreamIndex = x;
        }
        else if (createdExportStreamArray[x][0] == connectedStream) {
            fromStreamName=createdExportStreamArray[x][2];
            streamType = "export";
            selctedSt = createdExportStreamArray[x][1];
            fromStreamIndex = x;
        }
        else if (createdDefinedStreamArray[x][0] == connectedStream) {
            fromStreamName=createdDefinedStreamArray[x][1];
            var defAttrNum = createdDefinedStreamArray[x][2].length;
            streamType = "defined";
            fromStreamIndex = x;

        }
        else if (createdWindowStreamArray[x][0] == connectedStream.charAt(0)) {
            fromStreamName=createdWindowStreamArray[x][1];
            var type=createdWindowStreamArray[x][2];
            var defAttrNum = createdWindowStreamArray[x][4].length;
            streamType = "window";
            fromStreamIndex = x;
        }
    }

    //To retrieve the number of attributes
    getAttributes(selctedSt);
    //attrNumber gives the number of attributes
    //streamInd gives the index of the selected stream
    setPartitionConditionform(clickedId,selctedSt,fromStreamName,streamType,fromStreamIndex, defAttrNum, type);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var stqueryDiv, stqueryDivState, stMultipleStateDiv, stqueryDivLogic, stqueryDivAttrMap;

 function createStateMachineQueryForm(elementID, fromStreamNameListArray, intoNameSt, intoStreamIndex, streamType, defAttrNum)
{
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var predefarr = PredefinedStreams();

    var tableStateQueryForm = document.createElement('table');
    tableStateQueryForm.id = "tableStateQueryForm";
    tableStateQueryForm.className = "tableStateQueryForm";

    var tableProcessLogicQueryForm = document.createElement('table');
    tableProcessLogicQueryForm.id = "tableProcessLogicQueryForm";
    tableProcessLogicQueryForm.className = "tableProcessLogicQueryForm";

    var tableStateAttrMapQueryForm = document.createElement('table');
    tableStateAttrMapQueryForm.id = "tableStateAttrMapQueryForm";
    tableStateAttrMapQueryForm.className = "tableStateAttrMapQueryForm";

    stqueryDiv=document.createElement("div");
    stqueryDiv.className="stqueryDiv";
    stqueryDiv.id="stqueryDiv";

    stqueryDivState=document.createElement("div");
    stqueryDivState.className="stqueryDivState";
    stqueryDivState.id="stqueryDivState";

    stMultipleStateDiv=document.createElement("div");
    stMultipleStateDiv.className="stMultipleStateDiv";
    stMultipleStateDiv.id="stMultipleStateDiv";

    stqueryDivLogic=document.createElement("div");
    stqueryDivLogic.className="stqueryDivLogic";
    stqueryDivLogic.id="stqueryDivLogic";

    stqueryDivAttrMap=document.createElement("div");
    stqueryDivAttrMap.className="stqueryDivAttrMap";
    stqueryDivAttrMap.id="stqueryDivAttrMap";

    stateQueryLabel= document.createElement("label");
    stateQueryLabel.className="stateQueryLabel";
    stateQueryLabel.id="stateQueryLabel";
    stateQueryLabel.innerHTML='State-machine Query';

    stQueryNameLabel=document.createElement("label");
    stQueryNameLabel.className="stQueryNameLabel";
    stQueryNameLabel.id="stQueryNameLabel";
    stQueryNameLabel.innerHTML="Query Name: ";

    stQueryNameInput=document.createElement("input");
    stQueryNameInput.className="stQueryNameInput";
    stQueryNameInput.id="stQueryNameInput";

    ///////////////////////////////////////////////////////////////////////
    //Div 1-->

    stateDivLabel= document.createElement("label");
    stateDivLabel.className="stateDivLabel";
    stateDivLabel.id="stateDivLabel";
    stateDivLabel.innerHTML='Create Multiple States';

    stateIdLabel= document.createElement("label");
    stateIdLabel.className="stateIdLabel";
    stateIdLabel.id="stateIdLabel";
    stateIdLabel.innerHTML='State ID: ';

    stateIDInput=document.createElement("input");
    stateIDInput.className="stateIDInput0";
    stateIDInput.id="stateIDInput0";

    stateStreamLabel= document.createElement("label");
    stateStreamLabel.className="stateStreamLabel";
    stateStreamLabel.id="stateStreamLabel";
    stateStreamLabel.innerHTML='Stream: ';

    StreamDropdown= document.createElement("div");
    StreamDropdown.id = "StreamDropdown0";
    StreamDropdown.className = "StreamDropdown0";

    var StreamOptions = '<select id="StreamCombo0">', StreamOpt = StreamGenerator(fromStreamNameListArray), i;
    for(i = 0; i < StreamOpt.length; i++) {
        StreamOptions += "<option value='"+StreamOpt[i]+"'>"+StreamOpt[i]+"</option>";
    }
    StreamOptions += '</select>';
    StreamDropdown.innerHTML = StreamOptions;

    stfilterLabel= document.createElement("label");
    stfilterLabel.className="stfilterLabel";
    stfilterLabel.id="stfilterLabel";
    stfilterLabel.innerHTML = "Filter : ";

    stfilterInput= document.createElement("input");
    stfilterInput.id = "stfilterInput0";
    stfilterInput.className = "stfilterInput0";

    hr = document.createElement('hr');

    stqueryAddState=document.createElement("button");
    stqueryAddState.type="button";
    stqueryAddState.className="stqueryAddState";
    stqueryAddState.id="stqueryAddState";
    stqueryAddState.innerHTML="Add State";
    stqueryAddState.onclick = function () {
        addStateDivisions(fromStreamNameListArray);
    };

    ///////////////////////////////////////////////////////////////////////
    //Div 2-->

    processLogicTitleLabel= document.createElement("label");
    processLogicTitleLabel.className="processLogicTitleLabel";
    processLogicTitleLabel.id="processLogicTitleLabel";
    processLogicTitleLabel.innerHTML='Enter the Process logic';

    processLogicLabel= document.createElement("label");
    processLogicLabel.className="processLogicLabel";
    processLogicLabel.id="processLogicLabel";
    processLogicLabel.innerHTML='Process logic: ';

    stProcessLogicInput= document.createElement("input");
    stProcessLogicInput.id = "stProcessLogicInput";
    stProcessLogicInput.className = "stProcessLogicInput";

    ///////////////////////////////////////////////////////////////////////
    //Div 3-->

    stselectLabel= document.createElement("label");
    stselectLabel.className="stselectLabel";
    stselectLabel.id="stselectLabel";
    stselectLabel.innerHTML= "Select : ";

    //Attributes

    stinsertIntoLabel=document.createElement("label");
    stinsertIntoLabel.className="stinsertIntoLabel";
    stinsertIntoLabel.id="stinsertIntoLabel";
    stinsertIntoLabel.innerHTML="insert into: ";

    stinsertIntoStream=document.createElement("label");
    stinsertIntoStream.className="stinsertIntoStream";
    stinsertIntoStream.id="stinsertIntoStream";
    stinsertIntoStream.innerHTML=intoNameSt;

    ///////////////////////////////////////////////////////////////////////

    stqueryFomButton=document.createElement("button");
    stqueryFomButton.type="button";
    stqueryFomButton.className="stqueryFomButton";
    stqueryFomButton.id="stqueryFomButton";
    stqueryFomButton.innerHTML="Submit Query";
    stqueryFomButton.onclick = function () {
        getStateMachineQueryData(elementID, streamType, defAttrNum);
    };

    stqueryFomCloseButton=document.createElement("button");
    stqueryFomCloseButton.type="button";
    stqueryFomCloseButton.className="stqueryFomCloseButton";
    stqueryFomCloseButton.id="stqueryFomCloseButton";
    stqueryFomCloseButton.innerHTML="Cancel";
    stqueryFomCloseButton.onclick = function() {
        closeForm();
    };


    stqueryDiv.appendChild(stateDivLabel);

    var tr21 = document.createElement('tr');
    var td21=document.createElement('td');
    var td31=document.createElement('td');

    td21.appendChild(stQueryNameLabel);
    tr21.appendChild(td21);
    td31.appendChild(stQueryNameInput);
    tr21.appendChild(td31);
    stqueryDiv.appendChild(tr21);

    ///////////////////////////////////////////////////////////////////////
    //Div 1 Table

    stqueryDivState.appendChild(stateDivLabel);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(stateIdLabel);
    tr2.appendChild(td2);
    td3.appendChild(stateIDInput);
    tr2.appendChild(td3);
    tableStateQueryForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');
    var td5=document.createElement('td');

    td4.appendChild(stateStreamLabel);
    tr3.appendChild(td4);
    td5.appendChild(StreamDropdown);
    tr3.appendChild(td5);
    tableStateQueryForm.appendChild(tr3);

    //Row 4

    var tr4 = document.createElement('tr');
    var td6=document.createElement('td');
    var td7=document.createElement('td');

    td6.appendChild(stfilterLabel);
    tr4.appendChild(td6);
    td7.appendChild(stfilterInput);
    tr4.appendChild(td7);
    tableStateQueryForm.appendChild(tr4);

    //Row 5

    var tr5 = document.createElement('tr');
    var td8=document.createElement('td');

    td8.appendChild(stqueryAddState);
    tr5.appendChild(td8);

    stMultipleStateDiv.appendChild(tableStateQueryForm);
    stMultipleStateDiv.appendChild(hr);
    stqueryDivState.appendChild(stMultipleStateDiv);

    ///////////////////////////////////////////////////////////////////////
    //Div 2 Table

    //Row 6

    var tr11 = document.createElement('tr');
    var td19=document.createElement('td');

    td19.appendChild(processLogicTitleLabel);
    tr11.appendChild(td19);
    tableProcessLogicQueryForm.appendChild(tr11);

    //Row 7

    var tr6 = document.createElement('tr');
    var td10=document.createElement('td');
    var td11=document.createElement('td');

    td10.appendChild(processLogicLabel);
    tr6.appendChild(td10);
    td11.appendChild(stProcessLogicInput);
    tr6.appendChild(td11);
    tableProcessLogicQueryForm.appendChild(tr6);

    stqueryDivLogic.appendChild(tableProcessLogicQueryForm);

    ///////////////////////////////////////////////////////////////////////
    //Div 3 Table

    //Row 8

    if(streamType=="import" || streamType=="export")
    {
        for (var f = 0; f < attrNumber; f++)
        {
            stinputtxtName = document.createElement("input");
            stinputtxtName.className = "stinput" + f;
            stinputtxtName.id = "stinput" + f;

            var aslblName = document.createElement("label");
            aslblName.innerHTML = " as ";

            stinputlblName = document.createElement("label");
            stinputlblName.innerHTML = predefarr[streamInd][1][f];
            stinputlblName.className = "stlabel" + f;
            stinputlblName.id = "stlabel" + f;

            var trName = document.createElement('tr');

            var tdName1 = document.createElement('td');
            tdName1.appendChild(stinputtxtName);
            trName.appendChild(tdName1);

            var tdName2 = document.createElement('td');
            tdName2.appendChild(aslblName);
            trName.appendChild(tdName2);

            var tdName3 = document.createElement('td');
            tdName3.appendChild(stinputlblName);
            trName.appendChild(tdName3);

            tableStateAttrMapQueryForm.appendChild(trName);
        }
    }
    else if(streamType=="defined")
    {
        for (var f =0; f<defAttrNum-1;f++)
        {
            stinputtxtName = document.createElement("input");
            stinputtxtName.className = "stinput" + f;
            stinputtxtName.id = "stinput" + f;

            var aslblName = document.createElement("label");
            aslblName.innerHTML = " as ";

            stinputlblName = document.createElement("label");
            stinputlblName.className = "stlabel" + f;
            stinputlblName.id = "stlabel" + f;
            stinputlblName.innerHTML = createdDefinedStreamArray[intoStreamIndex][2][f][0];
            var trName = document.createElement('tr');

            var tdName1 = document.createElement('td');
            tdName1.appendChild(stinputtxtName);
            trName.appendChild(tdName1);

            var tdName2 = document.createElement('td');
            tdName2.appendChild(aslblName);
            trName.appendChild(tdName2);

            var tdName3 = document.createElement('td');
            tdName3.appendChild(stinputlblName);
            trName.appendChild(tdName3);

            tableStateAttrMapQueryForm.appendChild(trName);
        }
    }

    else
    {
        for (var f =0; f<defAttrNum;f++)
        {
            stinputtxtName = document.createElement("input");
            stinputtxtName.className = "stinput" + f;
            stinputtxtName.id = "stinput" + f;

            var aslblName = document.createElement("label");
            aslblName.innerHTML = " as ";

            stinputlblName = document.createElement("label");
            stinputlblName.className = "stlabel" + f;
            stinputlblName.id = "stlabel" + f;
            stinputlblName.innerHTML = createdWindowStreamArray[intoStreamIndex][4][f][0];
            var trName = document.createElement('tr');

            var tdName1 = document.createElement('td');
            tdName1.appendChild(stinputtxtName);
            trName.appendChild(tdName1);

            var tdName2 = document.createElement('td');
            tdName2.appendChild(aslblName);
            trName.appendChild(tdName2);

            var tdName3 = document.createElement('td');
            tdName3.appendChild(stinputlblName);
            trName.appendChild(tdName3);

            tableStateAttrMapQueryForm.appendChild(trName);

        }
    }

    //Row 18

    var tr18= document.createElement('tr');
    var td38 = document.createElement('td');
    var td39 = document.createElement('td');

    td38.appendChild(stinsertIntoLabel);
    tr18.appendChild(td38);
    td39.appendChild(stinsertIntoStream);
    tr18.appendChild(td39);
    tableStateAttrMapQueryForm.appendChild(tr18);

    stqueryDivAttrMap.appendChild(tableStateAttrMapQueryForm);

    var tr20= document.createElement('tr');
    var td41 = document.createElement('td');
    var td42 = document.createElement('td');

    td41.appendChild(stqueryFomButton);
    tr20.appendChild(td41);
    td42.appendChild(stqueryFomCloseButton);
    tr20.appendChild(td42);

    stqueryDiv.appendChild(stqueryDivState);
    stqueryDiv.appendChild(stqueryAddState);
    stqueryDiv.appendChild(stqueryDivLogic);
    stqueryDiv.appendChild(stqueryDivAttrMap);
    stqueryDiv.appendChild(tr20);

    lot.appendChild(stqueryDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var numberOfStateDivs=0;
var stateIdLabelstr = "stateIdLabel";
var stateIDInputstr = "stateIDInput";
var stateStreamLabelstr = "stateStreamLabel";
var StreamDropdownstr = "StreamDropdown";
var StreamCombostr = "StreamCombo";
var stfilterLabelstr ="stfilterLabel";
var stfilterInputstr = "stfilterInput";

function addStateDivisions(fromStreamNameListArray)
{
    numberOfStateDivs++;

    var tableStateQueryForm = document.createElement('table');
    tableStateQueryForm.id = "tableStateQueryForm";
    tableStateQueryForm.className = "tableStateQueryForm";

    stateIdLabelx= document.createElement("label");
    stateIdLabelx.className=stateIdLabelstr+numberOfStateDivs;
    stateIdLabelx.id=stateIdLabelstr+numberOfStateDivs;
    stateIdLabelx.innerHTML='State ID: ';

    stateIDInputx=document.createElement("input");
    stateIDInputx.className=stateIDInputstr+numberOfStateDivs;
    stateIDInputx.id=stateIDInputstr+numberOfStateDivs;

    stateStreamLabelx= document.createElement("label");
    stateStreamLabelx.className=stateStreamLabelstr+numberOfStateDivs;
    stateStreamLabelx.id=stateStreamLabelstr+numberOfStateDivs;
    stateStreamLabelx.innerHTML='Stream: ';

    StreamDropdownx= document.createElement("div");
    StreamDropdownx.id = StreamDropdownstr+numberOfStateDivs;
    StreamDropdownx.className = StreamDropdownstr+numberOfStateDivs;

    var hr= document.createElement("hr");

    streamcomboId = StreamCombostr +numberOfStateDivs;

    var StreamOptions = '<select id='+streamcomboId+'>', StreamOpt = StreamGenerator(fromStreamNameListArray), i;
    for(i = 0; i < StreamOpt.length; i++) {
        StreamOptions += "<option value='"+StreamOpt[i]+"'>"+StreamOpt[i]+"</option>";
    }
    StreamOptions += '</select>';
    StreamDropdownx.innerHTML = StreamOptions;

    stfilterLabelx= document.createElement("label");
    stfilterLabelx.className=stfilterLabelstr+numberOfStateDivs;
    stfilterLabelx.id=stfilterLabelstr+numberOfStateDivs;
    stfilterLabelx.innerHTML = "Filter : ";

    stfilterInputx= document.createElement("input");
    stfilterInputx.id = stfilterInputstr+numberOfStateDivs ;
    stfilterInputx.className = stfilterInputstr+numberOfStateDivs ;


    //Row 1

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(stateIdLabelx);
    tr2.appendChild(td2);
    td3.appendChild(stateIDInputx);
    tr2.appendChild(td3);
    tableStateQueryForm.appendChild(tr2);

    //Row 2

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');
    var td5=document.createElement('td');

    td4.appendChild(stateStreamLabelx);
    tr3.appendChild(td4);
    td5.appendChild(StreamDropdownx);
    tr3.appendChild(td5);
    tableStateQueryForm.appendChild(tr3);

    //Row 3

    var tr4 = document.createElement('tr');
    var td6=document.createElement('td');
    var td7=document.createElement('td');

    td6.appendChild(stfilterLabelx);
    tr4.appendChild(td6);
    td7.appendChild(stfilterInputx);
    tr4.appendChild(td7);
    tableStateQueryForm.appendChild(tr4);

    stMultipleStateDiv.appendChild(tableStateQueryForm);
    stMultipleStateDiv.appendChild(hr);
    stqueryDivState.appendChild(stMultipleStateDiv);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Generate the Streams to be selected when a StateMachine query's left and right join streams are selected
 * @returns {Array}
 */

function StreamGenerator(fromStreamNameListArray) {
    var list = [];
    for(var g = 0; g<fromStreamNameListArray.length;g++)
    {
        if(fromStreamNameListArray[g] != null)
        {
            list.push(fromStreamNameListArray[g]);
        }
    }
    return list;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getStateMachineQueryData(elementID, streamType, defAttrNum)
{
    var queryName = document.getElementById("stQueryNameInput").value;
    var insertIntoStream = document.getElementById("stinsertIntoStream").innerHTML;
    var processLogic = document.getElementById("stProcessLogicInput").value;

    createdStateMachineQueryArray[elementID][0] = elementID;
    createdStateMachineQueryArray[elementID][1] = queryName;

    //Multiple State Info
    for(var m = 0; m<=numberOfStateDivs ; m++)
    {
        var streamComboBoxId =  StreamCombostr +m;
        var stateIdString = "stateIDInput"+m;
        var stfilterInputString = "stfilterInput"+m;
        //State ID
        var stateId = document.getElementById(stateIdString).value;
        //Selected Stream
        var Streamchoice=document.getElementById(streamComboBoxId);
        var SelectedStream = Streamchoice.options[Streamchoice.selectedIndex].text;
        //Filter
        var StateFilter = document.getElementById(stfilterInputString).value;

        createdStateMachineQueryArray[elementID][2][m] = [];
        createdStateMachineQueryArray[elementID][2][m][0] = stateId;
        createdStateMachineQueryArray[elementID][2][m][1] = SelectedStream;
        createdStateMachineQueryArray[elementID][2][m][2] = StateFilter;
    }

    createdStateMachineQueryArray[elementID][3] = processLogic;
    //createdJoinQueryArray[elementID][4] = [];
    var loopCount=0;
    if(streamType=="import" || streamType=="export")
    {
        loopCount=attrNumber;
    }
    else
    {
        loopCount=defAttrNum-1;
    }
    for(var r=0; r<loopCount;r++)
    {
        createdStateMachineQueryArray[elementID][4][r] =[];
        var inputTextBoxID = "stinput"+r;
        var attrLabelID = "stlabel" + r;
        createdStateMachineQueryArray[elementID][4][r][0] = document.getElementById(inputTextBoxID).value;
        createdStateMachineQueryArray[elementID][4][r][1] = document.getElementById(attrLabelID).innerHTML;

    }

    createdStateMachineQueryArray[elementID][5]= insertIntoStream;
    var elIdforNode =  elementID+"-nodeInitial";
    document.getElementById(elIdforNode).innerHTML = queryName;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    numberOfStateDivs=0;

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


