//running Game of Doge....

/*--------------------------
------- BOOT METHODS --------
---------------------------*/

function setDimensions(input){
    var css = ['table{width:1240px;text-align:center;}img {height:', 'px;width:', 'px;}'];
    
    if (input == 0){
        dimensions = [60,61];
        pix = [20,20];
    }
    else if (input == 1){
        dimensions = [30,41];
        pix = [30,30];    
    }
    else if (input == 2){
        dimensions = [10,20];
        pix = [60,60];
    }
    var style = document.getElementsByTagName('style')[0];

    style.innerHTML=css[0]+pix[0]+css[1]+pix[1]+css[2];
    removeTable = document.getElementById("main");
    document.body.removeChild(removeTable);
    replaceTable = generateDogeTable(dimensions);        
    return true;
}


function generateDogeTable(dim){
    //initiate table & insert to html
    var rowNo = dim[0], colNo = dim[1];
    var newTable = document.createElement('table');
    newTable.setAttribute('id','main');
    
    for(j=0;j<rowNo; j++ ){
        var newRow = document.createElement('tr');
        for (i=0; i<colNo; i++){
            var newCol = document.createElement('td');
            var newDoge = document.createElement('img');
            newDoge.setAttribute('src', 'doge/deaddoge.jpg');
            newDoge.setAttribute('onclick',"this.setAttribute('src', 'doge/livedoge.png');")
            newRow.appendChild(newCol.appendChild(newDoge));
        }
        newTable.appendChild(newRow);
    }
    document.body.appendChild(newTable);
    return true
}

function generateStartPattern(input){
    var blankTable = document.getElementById('main');
    startArray = getWorld(dimensions);

    function inputCoordinates(coords){
        startArray[coords[0]][coords[1]] = 10 ;    
        return null;
    }

    if (input == 0){
        for (i= 0; i<startPatterns.glider.length; i++){
            inputCoordinates(startPatterns.glider[i]);
        }
        printWorld(startArray, dimensions)

    }
    if (input == 1){
        startArray.splice(1,1,startArray[0].map(function () {return 10;}));
        startArray.splice(-2, 1, startArray[0].map(function () {return 10;}));
        printWorld(startArray, dimensions);
    }
    if (input == 2){
        for (i= 0; i<startPatterns.gliderGun.length; i++){
            inputCoordinates(startPatterns.gliderGun[i]);
        }
        printWorld(startArray, dimensions)

    }
    return null


}
/*-----------------------------------
---------- RUNTIME METHODS -----------
------------------------------------*/



function getWorld(dim){
    //return an array representation of world on DOM
    var imgLongList = document.body.getElementsByTagName('img');
    var worldArray = [];
    var worldRow = [];

    for (i=0;i<imgLongList.length; i++){
        if (imgLongList[i].getAttribute('src') == 'doge/deaddoge.jpg')
            worldRow.push(0);
        else if (imgLongList[i].getAttribute('src') == 'doge/livedoge.png')
            worldRow.push(10);
        else
            worldRow.push(undefined);

        if ((i+1)%dim[1]==0){
            worldArray.push(worldRow);
            var worldRow = [];
        }
    }
    console.log(imgLongList[0].getAttribute('src'));
    console.log(worldArray)
    return worldArray
}

function updateWorld(inputArray, dim){
    //create a the next world neighbour representation by doing a neighbour tally 
    function printNeighbours(i,j){
        //add a ring of neighbours to next world from one cell 
        if (inputArray[i][j]%9 ==1){
            for (l= -1;l<2;l++){
                if ( isNotEdgeCase(i-1,j+l) )
                    worldArray[i-1][j+l] +=1;
                if ( isNotEdgeCase(i+1,j+l) )
                    worldArray[i+1][j+l] +=1;
                if (l!=0 && isNotEdgeCase(i, j+l))
                    worldArray[i][j+l] +=1;
            }
            worldArray[i][j]+=9
        }
    }
    function isNotEdgeCase(cell_i,cell_j){
        //check that the point on the next world exists
        return worldArray[cell_i] != undefined && worldArray[cell_i][cell_j] != undefined;
    }

    var worldArray = []
    for (i=0; i<dim[0];i++){
        worldArray.push(Array.apply(null, new Array(dim[1])).map(Number.prototype.valueOf,0));
    }
    for (rowInd = 0; rowInd<dim[0]; rowInd++){
        for (colInd =0; colInd<dim[1]; colInd++){
            printNeighbours(rowInd,colInd);
        }
    }
    return worldArray
}

function flattenWorld(inputArray){
    //take a tally of neighbours, and flatten into a representation (alive/dead/justdied)
    function conwayRules(value){
        if ( value%9 == 3 )
            return 10;
        else if ( value%9 == 2 && Math.floor(value/9) ==1 )
            return 10;
        else if (Math.floor(value/9)==1)
            return 9;
        else
            return 0;
    }

    var newWorld = []
    for (i=0; i<inputArray.length; i++){
        var newWorldRow = inputArray[i].map(conwayRules);
        newWorld.push(newWorldRow);
    }
    return newWorld
}

function printWorld(inputArray, dim){
    //take the world and represent it visually
    var imgLongList = document.body.getElementsByTagName('img');
    var newWorldLongList = inputArray.reduce(function (a,b) {
                                             return a.concat(b);});
    console.log(imgLongList);
    console.log(newWorldLongList);
    if (imgLongList.length != newWorldLongList.length){
        console.log("UH OH! Something's gone wrong..")
        return false}
    for (i=0;i<imgLongList.length; i++){
        if (newWorldLongList[i] == 0)
            imgLongList[i].setAttribute('src','doge/deaddoge.jpg');
        else if (newWorldLongList[i] == 10) 
            imgLongList[i].setAttribute('src','doge/livedoge.png');
        else if (newWorldLongList[i] == 9) 
            imgLongList[i].setAttribute('src','doge/waslivedoge.png');    
        }
    return inputArray;
}


/*------------------------------------
------------ MAIN() METHOD ------------
-------------------------------------*/


var dimensions = [10,20];
generateDogeTable(dimensions);


function start(){
    //var theTable = document.body.getElementsByTagName('table')[0]; //note these two lines can be moved out.
    var world = getWorld(dimensions);
    var neighbourWorld = updateWorld(world, dimensions);
    var flattenedWorld = flattenWorld(neighbourWorld);
    printWorld(flattenedWorld);
    world = flattenedWorld;
    if(world.every(function isZeroArray(each){
        return each.every(function isZero(x){
            return x==0;} );}))
        return true;
    requestAnimationFrame(start);
    //setTimeout(function(){},10000);
    //setInterval(start,30000);
}


var startPatterns = {
    glider: [[2,2],[3,3],[3,4],[4,3],[2,4]],
    gliderGun: [[7,1],[7,2],[8,1],[8,2],[7,11],[8,11],[9,11],[6,12],[10,12],[11,13],[5,13],[5,14],[11,14],
    [10,16],[6,16],[8,15],[7,17],[8,17],[9,17],[8,18],[7,21],[7,22],[6,21],[6,22],[5,21],[5,22],[4,23],[8,23],
    [8,25],[4,25],[3,25],[9,25],[6,35],[6,36],[5,35],[5,36]]
}


