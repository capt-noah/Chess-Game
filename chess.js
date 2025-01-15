const board = document.getElementById("board");
const graveWhite = document.getElementById("graveWhite");
const graveBlack = document.getElementById("graveBlack");
const moveSelfSound = document.getElementById("moveSelf");
const moveOpponentSound = document.getElementById("moveOpponent");
const captureSound = document.getElementById("capture");
const invalidSound = document.getElementById("invalid");
const promotedSound = document.getElementById("promoted");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const grave1 = document.getElementById("grave1");
const grave2 = document.getElementById("grave2");

const player1Minutes = document.getElementById("player1Minutes");
const player1Seconds = document.getElementById("player1Seconds");
const player2Minutes = document.getElementById("player2Minutes");
const player2Seconds = document.getElementById("player2Seconds");

const timer1 = document.getElementById("timer1");
const timer2 = document.getElementById("timer2");

let playerMinutes;
let playerSeconds;

let chessPieces = ["rook_white","knight_white","bishop_white","king_white","queen_white","bishop_white","knight_white","rook_white",
                    "rook_black","knight_black","bishop_black","king_black","queen_black","bishop_black","knight_black","rook_black",]


let peiceMap = new Map();
peiceMap.set("rook_white", "rw");
peiceMap.set("knight_white", "kw");
peiceMap.set("bishop_white", "bw");
peiceMap.set("king_white", "Kw");
peiceMap.set("queen_white", "qw");

peiceMap.set("rook_black", "rb");
peiceMap.set("knight_black", "kb");
peiceMap.set("bishop_black", "bb");
peiceMap.set("king_black", "Kb");
peiceMap.set("queen_black", "qb");

let player = 1;
let selectedPeice;
let killedPeice;
let currentTile;
let currentPeice;
let targetTile;
let c;
let isPromotable = false;
let selected = [];
let markedTiles = [];
let isPeiceSelected;
let availableTiles = [];
let isValid = new Map();

let m = 10;
let s = 60;
let m1 = 10;
let s1 = 60;


const timer = setInterval(check, 1000);


function check(){

    if(player == 1){
        m = Number(player1Minutes.innerText);
        s = Number(player1Seconds.innerText);

        playerMinutes = player1Minutes;
        playerSeconds = player1Seconds;
    }
    

    else{
        m = Number(player2Minutes.innerText);
        s = Number(player2Seconds.innerText);

        playerMinutes = player2Minutes;
        playerSeconds = player2Seconds;
        
    }

    if( m == 0 && s == 0){
        clearInterval(timer);
        window.alert("TIME'S UP!!")
    }

    if(s == 0 || playerSeconds.innerText == "00"){
        s = 60;
        s--;
        m--;
        
        playerMinutes.innerText = m < 10? "0" + m : m;
        playerSeconds.innerText = s;
    }

    else{
        s--;
        playerSeconds.innerText = s < 10? "0" + s : s == 0? "00" : s;
    }


}

let pawnFirstMove = new Map();
for( let i = 1; i <= 2; i++){
    for( let j = 1; j <= 8; j++){
        if( i == 1){
            pawnFirstMove.set("pb2-" + j, 1);
        }
        else{
            pawnFirstMove.set("pw7-" + j, 1);
        }
        
    }
}

window.onload = () => {
    gameStart();
}

function gameStart(){
    let j = 1;
    
    for( let i = 1; i <= 8; i++){
    let color;
        for( let j = 1; j <= 8; j++){
            
            const tileContainer = document.createElement("div");
            tileContainer.classList = "chessTileContainer";
            tileContainer.id = "tc" + i + "-" + j;

            if(i % 2 == 0){
                color = j % 2 ? "white" : "rgb(149, 149, 149)";
            }
            else{
                color = j % 2 ? "rgb(149, 149, 149)" : "white";
            }

            tileContainer.style.backgroundColor = color;
            const t = document.createElement("div");
            t.classList = "chessTile";
            t.id = "t" + i + "-" + j;

            if( !(i >= 3) || !(i <= 6)){
                let str = "./Assets/Chess Peices1/";
                const img = document.createElement("img");
                img.classList.add("peices");
                img.width = 60;
                img.height = 60;
                
                    if( i == 7){
                        img.src = str + "pawn_white" + ".png"; 
                        peice = "pw";
                    }
                    else if( i == 2){
                        img.src = str + "pawn_black" + ".png";
                        peice = "pb";
                    }  
                
                    else{
                        let pop = chessPieces.pop();
                        peice = peiceMap.get(pop);
                        
                        img.src = str + pop + ".png"; 
                    }

                    img.id = peice + i + "-" + j;

                    img.onclick = (event) => {
                        handler(event, img);
                    };
                    t.append(img); 
            }

            tileContainer.append(t);
            board.append(tileContainer);
            
        }
    }

    let gameArray = [
        ["rb", "kb", "bb", "qb", "Kb", "bb", "kb", "rb"],
        ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
        ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
        ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
        ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
        ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
        ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw"],
        ["rw", "kw", "bw", "qw", "Kw", "bw", "kw", "rw"]
    ];

    // console.log(gameArray);
    // updateGame(gameArray);

    player1.style.borderColor = "rgb(0, 167, 72)";
 
}

function addToGrave(killedPeice, color){
    killedPeice.width = 20;
    killedPeice.height = 20;
    if(color == "w")
        grave2.append(killedPeice);
    else
        grave1.append(killedPeice);

}

function tileHandler(e){
    if( e.tagName == "IMG"){
        if(isValid.get(e.parentElement.id)){

            availableTiles.push(currentPeice.parentElement);
            availableTiles.forEach(removeHighlight);
            e.parentElement.append(currentPeice);

            updateId(currentPeice, e.parentElement);
            addToGrave(e, e.id[1]);
            
            if(isPromotable){
                currentPeice = promote(currentPeice);
                isPromotable = false;
            }
            else
                captureSound.play();
            board.removeEventListener('click', tileHandler);
            isPeiceSelected = false;
            

            changePlayer();
            return;
        }
        return;
    }
    
    if(isValid.get(e.target.id)){    
        availableTiles.push(currentPeice.parentElement);
        availableTiles.forEach(removeHighlight);
        e.target.append(currentPeice);

        updateId(currentPeice, e.target);
        
        board.removeEventListener('click', tileHandler);
        isPeiceSelected = false;
        if(isPromotable){
            currentPeice = promote(currentPeice);
            isPromotable = false;
        }
        board
        if(currentPeice.id[1] == "w")
            moveSelfSound.play();
        else
            moveOpponentSound.play();
            
            changePlayer();
    }
}



function handler(event, img){
    event.stopPropagation();

    if( (isPeiceSelected && img.id[1] == currentPeice.id[1]) || (isPeiceSelected && img.id[0] == "K") ){ 
        invalidSound.play();
        isPeiceSelected = false;
        availableTiles.push(currentPeice.parentElement);
        availableTiles.forEach(removeHighlight);
        board.removeEventListener('click', tileHandler);
        return;
    }

    if(isPeiceSelected && img.id[1] != currentPeice.id[1]){ 

        board.addEventListener('click', tileHandler(img));
        return;
    }

    if(!isPeiceSelected){ 
        currentPeice = img;
        currentTile = currentPeice.parentElement;
        if((player == 1 && currentPeice.id[1] == "b") || (player == 2 && currentPeice.id[1] == "w")){
            return;
        }
        if (currentTile.style.borderColor == "rgb(0, 255, 229)"){
            currentTile.style.borderColor = "";
            isPeiceSelected = false;
            availableTiles.forEach(addHighlight);
        }
        else{
            currentTile.style.borderColor = "rgb(0, 255, 229)";
            isPeiceSelected = true;
        }

        availableTiles = availableMoves(currentPeice);
        availableTiles.forEach(addHighlight);

        board.addEventListener('click', tileHandler);

        return;
    }
    
}

function changePlayer(){
    if( player == 1){
        player = 2;
        player1.style.borderColor = "";
        timer1.style.fill = "rgb(157, 157, 157)";

        player2.style.borderColor = "rgb(0, 167, 72)";
        timer2.style.fill = "white";

    }
    else{
        player = 1;
        player2.style.borderColor = "";
        timer2.style.fill = "rgb(157, 157, 157)";

        player1.style.borderColor = "rgb(0, 167, 72)";
        timer1.style.fill = "white";
    }
}

function updateId( p, t){
        let idInitials = p.id[0] + p.id[1];
        p.id = "";
        p.id = idInitials + t.id[1] + "-" + t.id[3];
        return p;
}

function availableMoves(currentPeice){
    let r = Number(currentPeice.id[2]);
    let c = Number(currentPeice.id[4])
    let id = currentPeice.id;
    let left, right, up, down;
    let counter = 1;
    availableTiles = [];
    isValid.clear();

    switch(currentPeice.id[0]){

        case "p":

            if( isFirstMove(id)){
                let checkTile1 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + c) : document.getElementById("t" + (r + 1) + "-" + c);
                let checkTile2 = id[1] == "w" ? document.getElementById("t" + (r - 2) + "-" + c) : document.getElementById("t" + (r + 2) + "-" + c);

                if (checkTile1.children[0] == undefined && checkTile2.children[0] == undefined){
                    availableTiles.push(checkTile1);
                    availableTiles.push(checkTile2);
                    isValid.set(checkTile1.id, 1);
                    isValid.set(checkTile2.id, 1);
                }

                else if(checkTile1.children[0] == undefined && checkTile2.children[0] != undefined){
         
                    availableTiles.push(checkTile1);
                    isValid.set(checkTile1.id, 1);
                }

            }
            else{
                
                let checkTile1 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + c) : document.getElementById("t" + (r + 1) + "-" + c);

                if(checkTile1.firstChild != undefined){
                    let checkTile2 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c + 1)) : document.getElementById("t" + (r + 1) + "-" + (c + 1));
                    let checkTile3 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c - 1)) : document.getElementById("t" + (r + 1) + "-" + (c - 1));
                    if(checkTile2 && id[1] != checkTile2.firstChild.id[1]){
                        availableTiles.push(checkTile2);
                        isValid.set(checkTile2.id, 1);
                    }
                    if(checkTile3 && id[1] != checkTile3.firstChild.id[1]){
                        availableTiles.push(checkTile3);
                        isValid.set(checkTile3.id, 1);
                    }
                }

                if(checkTile1.firstChild == undefined){    
                    if((id[1] == "w" && checkTile1.id[1] == "1") || (id[1] == "b" && checkTile1.id[1] == "8")){
                        isPromotable = true;
                    }

                    availableTiles.push(checkTile1);
                    isValid.set(checkTile1.id, 1);
                }

                let checkTile2 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c + 1)) : document.getElementById("t" + (r + 1) + "-" + (c + 1));
                let checkTile3 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c - 1)) : document.getElementById("t" + (r + 1) + "-" + (c - 1));

                    if(checkTile2)
                        if(checkTile2.firstChild != undefined)
                            if( id[1] != checkTile2.firstChild.id[1]){
                                if((id[1] == "w" && checkTile2.firstChild.id[2] == 1) || (id[1] == "b" && checkTile2.firstChild.id[2] == 8))
                                    isPromotable = true;
                                else
                                    isPromotable = false;
                                availableTiles.push(checkTile2);
                                isValid.set(checkTile2.id, 1);
                            }
                    if(checkTile3)
                        if(checkTile3.firstChild != undefined)
                            if(id[1] != checkTile3.firstChild.id[1]){
                                if((id[1] == "w" && checkTile3.firstChild.id[2] == 1) || (id[1] == "b" && checkTile3.firstChild.id[2] == 8))
                                    isPromotable = true;
                                else
                                    isPromotable = false;
                                availableTiles.push(checkTile3);
                                isValid.set(checkTile3.id, 1);
                            }

            }  
            break;
        
        case "k":

            let checkTile1 = id[1] == "w" ? document.getElementById("t" + (r - 2) + "-" + (c + 1)) : document.getElementById("t" + (r + 2) + "-" + (c + 1));
            let checkTile2 = id[1] == "w" ? document.getElementById("t" + (r - 2) + "-" + (c - 1)) : document.getElementById("t" + (r + 2) + "-" + (c - 1));
            let checkTile3 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c + 2)) : document.getElementById("t" + (r + 1) + "-" + (c - 2));
            let checkTile4 = id[1] == "w" ? document.getElementById("t" + (r + 1) + "-" + (c + 2)) : document.getElementById("t" + (r - 1) + "-" + (c - 2));
            let checkTile5 = id[1] == "w" ? document.getElementById("t" + (r + 1) + "-" + (c - 2)) : document.getElementById("t" + (r - 1) + "-" + (c + 2));
            let checkTile6 = id[1] == "w" ? document.getElementById("t" + (r - 1) + "-" + (c - 2)) : document.getElementById("t" + (r + 1) + "-" + (c + 2));
            let checkTile7 = id[1] == "w" ? document.getElementById("t" + (r + 2) + "-" + (c + 1)) : document.getElementById("t" + (r - 2) + "-" + (c - 1));
            let checkTile8 = id[1] == "w" ? document.getElementById("t" + (r + 2) + "-" + (c - 1)) : document.getElementById("t" + (r - 2) + "-" + (c + 1));

            let arr = [checkTile1, checkTile2, checkTile3, checkTile4, checkTile5, checkTile6, checkTile7, checkTile8]
            let listOfTiles = [];
            
            arr.forEach((tile) =>{
                if( tile){
                    if(tile.firstChild != undefined) { 
                        if( id[1] != tile.firstChild.id[1])
                            listOfTiles.push(tile);
                    }
                    else
                        listOfTiles.push(tile);
                }
            });

            listOfTiles.forEach(pushAdd);
            break;

        case "r":

            let left = document.getElementById("t" + r + "-" + (c - counter)); 
            let right = document.getElementById("t" + r + "-" + (c + counter)); 
            let up = document.getElementById("t" + (r - counter) + "-" + c); 
            let down = document.getElementById("t" + (r + counter) + "-" + c); 

            let arrayOfTiles = [left, right, up, down];

            arrayOfTiles.forEach((tile) =>{              
                counter = 1;
                let index = arrayOfTiles.indexOf(tile);
                if(tile){
                    do{
                        if(tile.firstChild){
                            if((player == 1 && tile.firstChild.id[1] == "b") || (player == 2 && tile.firstChild.id[1] == "w")){
                                availableTiles.push(tile);
                                isValid.set(tile.id, 1);
                            }
                            break;
                        }
                        availableTiles.push(tile);
                        isValid.set(tile.id, 1);
                        counter++;
                            if(index == 0)
                                tile = document.getElementById("t" + r + "-" + (c - counter)); 
                            else if(index == 1)
                                tile = document.getElementById("t" + r + "-" + (c + counter)); 
                            else if(index == 2)
                                tile = document.getElementById("t" + (r - counter) + "-" + c); 
                            else
                                tile = document.getElementById("t" + (r + counter) + "-" + c); 
                    }
                    while(tile);
                }
            });
            
            break;

        case "b":
            counter = 1;
            let up_left = document.getElementById("t" + (r - counter) + "-" + (c - counter));
            let up_right = document.getElementById("t" + (r - counter) + "-" + (c + counter));
            let down_left = document.getElementById("t" + (r + counter) + "-" + (c - counter));
            let down_right = document.getElementById("t" + (r + counter) + "-" + (c + counter));

            let list = [up_left, up_right, down_left, down_right];

            list.forEach((tile) => {
                counter = 1;
                let index = list.indexOf(tile);
                if(tile){
                    do{
                        if(tile.firstChild){
                            if((player == 1 && tile.firstChild.id[1] == "b") || (player == 2 && tile.firstChild.id[1] == "w")){
                                availableTiles.push(tile);
                                isValid.set(tile.id, 1);
                            }
                            break;
                        }
                        availableTiles.push(tile);
                        isValid.set(tile.id, 1);
                        counter++;

                        if( index == 0){
                            tile = document.getElementById("t" + (r - counter) + "-" + (c - counter));
                        }
                        else if( index == 1){
                            tile = document.getElementById("t" + (r - counter) + "-" + (c + counter));
                        }
                        else if( index == 2){
                            tile = document.getElementById("t" + (r + counter) + "-" + (c - counter));
                        }
                        else{
                            tile = document.getElementById("t" + (r + counter) + "-" + (c + counter));
                        }
                    }
                    while(tile);
                }
            });

            break;

        case "K":
            counter = 1;
            let UP = document.getElementById("t" + (r - counter) + "-" + c);
            let DOWN = document.getElementById("t" + (r + counter) + "-" + c);
            let LEFT = document.getElementById("t" + r + "-" + (c - counter));
            let RIGHT = document.getElementById("t" + r + "-" + (c + counter));

            let UP_LEFT = document.getElementById("t" + (r - counter) + "-" + (c - counter));
            let UP_RIGHT = document.getElementById("t" + (r - counter) + "-" + (c + counter));
            let DOWN_LEFT = document.getElementById("t" + (r + counter) + "-" + (c - counter));
            let DOWN_RIGHT = document.getElementById("t" + (r + counter) + "-" + (c + counter));

            let listForKing = [UP, DOWN, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];

            listForKing.forEach((tile) => {
                if(tile){

                    if(tile.firstChild){
                        if((player == 1 && tile.firstChild.id[1] == "b") || (player == 2 && tile.firstChild.id[1] == "w")){
                            availableTiles.push(tile);
                            isValid.set(tile.id, 1);
                        }                 
                    }
                    else{
                        availableTiles.push(tile);
                        isValid.set(tile.id, 1);
                    }
                }
                
            });
            break;

        case "q":
            console.log("Queen");
            return queenMovement(currentPeice);
            break;
    
    }
    return availableTiles;
}

function queenMovement(currentPeice){

    let tilesForQueen = [];
    currentPeice.id = currentPeice.id.replace("q", "r");

    tilesForQueen.push(availableMoves(currentPeice));
    let valid1 = new Map(isValid);
    currentPeice.id = currentPeice.id.replace("r", "b");

    tilesForQueen.push(availableMoves(currentPeice));
    let valid2 = new Map(isValid);
    currentPeice.id = currentPeice.id.replace("b", "q");

    availableTiles = tilesForQueen.flat(Infinity);
    availableTiles.forEach(addHighlight);

    isValid = new Map(valid1);
    valid2.forEach((value, key) => {
        isValid.set(key, value);
    });

    return availableTiles;
}

function promote(currentPeice){

    if( currentPeice.id[1] == "w"){
        let str = currentPeice.id;
        str = str.replace("p", "q");
        currentPeice.id = str;
        currentPeice.src = "./Assets/Chess Peices1/queen_white.png";
    }
    else{
        let str = currentPeice.id;
        str = str.replace("p", "q");
        currentPeice.id = str;
        currentPeice.src = "./Assets/Chess Peices1/queen_black.png";

    }
    promotedSound.play();
    return currentPeice;
}

function pushAdd(tile){
    if( tile && tile.id){
        availableTiles.push(tile);
        isValid.set(tile.id, 1);
    }
}

function addHighlight(tile){
    if(isPeiceSelected){
        if(tile.firstChild){
            if( currentPeice.id[1] != tile.firstChild.id[1])
                tile.style.borderColor = "rgb(255, 0, 55)";
            else
                tile.style.borderColor = "rgb(0, 255, 229)";
        }
        else
        tile.style.borderColor = "rgb(0, 255, 229)";

    }
    else{
        tile.style.borderColor = "";
    }
}

function removeHighlight(tile){
    tile.style.borderColor = "";
}

function isFirstMove(id){
        if( pawnFirstMove.get(id) == 1){
            return true;
        }
        else{
            return false;
        }
}