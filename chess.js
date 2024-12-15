const board = document.getElementById("board");
const graveWhite = document.getElementById("graveWhite");
const graveBlack = document.getElementById("graveBlack");
let chessPieces = ["rook_white","knight_white","bishop_white","king_white","queen_white","bishop_white","knight_white","rook_white",
                    "rook_black","knight_black","bishop_black","king_black","queen_black","bishop_black","knight_black","rook_black",]
let graveWhiteStack = [];
let graveBlackStack = [];
let player = 1;
let peice;
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

let whatPeice = new Map();
whatPeice.set('r', "rook");
whatPeice.set('k', "knight");
whatPeice.set('b', "bishop");
whatPeice.set('K', "king");
whatPeice.set('q', "queen");
whatPeice.set('p', "pawn");

let whatColor = new Map();
whatPeice.set('w', "white");
whatPeice.set('b', "black");

let currentTile;
let c;
let selected = [];

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

window.onload = function gameStart(){
    let j = 1;
    
    for( let i = 1; i <= 8; i++){
    let color;
        for( let j = 1; j <= 8; j++){
            
            const tileContainer = document.createElement("div");
            tileContainer.classList = "chessTileContainer";
            tileContainer.id = "tc" + i + "-" + j;

            if(i % 2 == 0){
                color = j % 2 ? "white" : "gray";
            }
            else{
                color = j % 2 ? "gray" : "white";
            }

            tileContainer.style.backgroundColor = color;
            const t = document.createElement("div");
            t.classList = "chessTile";
            t.id = "t" + i + "-" + j;
            t.onclick = () => handler(t);

            if( !(i >= 3) || !(i <= 6)){
                let str = "./Assets/Chess Pieces/";
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

                    
                    t.append(img); 
            }

            tileContainer.append(t);
            board.append(tileContainer);
            
            
        }
        

    }

    makeGrave();


    
};

    function makeGrave(){
        for( let i = 1; i <= 16; i++){
            let graveTileBlack = document.createElement("div");
            let graveTileWhite = document.createElement("div");

            graveTileWhite.classList = "graveWhiteTile";
            graveTileBlack.classList = "graveBlackTile";

            graveTileBlack.id = "gtb-" + i;
            graveTileWhite.id = "gtw-" + i;

            graveWhite.append(graveTileWhite);
            graveBlack.append(graveTileBlack);

            graveWhiteStack.push(i);
            graveBlackStack.push(i);
        }
    }
    function addToGrave(t){
        if( t.children[0].id[1] == "w"){
            let gtw = document.getElementById("gtw-" + graveWhiteStack.pop());
            gtw.append(t.children[0]);
        }
        else{
            let gtb = document.getElementById("gtb-" + graveBlackStack.pop());
            gtb.append(t.children[0]);
        }
    }

    function handler(t){
        let pr, pc, tr, tc;
        currentTile = t;

        selected.push(currentTile.id);
        if( !currentTile.children[0]){
            if( selected.length < 2){
                selected.pop();
                return;
            }

        }  
        else{
            if( (selected.length < 2 && currentTile.children[0].id[1] == "b" && player == 1) || (selected.length < 2 && currentTile.children[0].id[1] == "w" && player == 2)){
                selected.pop();
                return;
            }
        }

            if( selected.length < 2){

                let color = currentTile.style.backgroundColor;
                if( color == "green"){
                    currentTile.style.backgroundColor = ""
                }
                else{
                    // currentTile.style.backgroundColor = "rgba(16, 124, 16, 0.3)";
                    currentTile.style.backgroundColor = "green";
                }
                
            }

            else if( selected.length == 2){
                
                let p = (document.getElementById(selected[0])).children[0];
                let t = document.getElementById(selected[1]);
                let isValid, canOvertake = false;

                if( !t.children[0]){
                    isValid = isValidMove(p, t);
                }
                else if(t.children[0].id[1] != p.id[1]){
                    isValid = isValidMove(p, t);
                    canOvertake = true;
                }
                else{
                    isValid = false;
                }

                if( isValid){
                    p = updateId(p, t);

                    if( canOvertake){
                        console.log(t.children[0].id);
                        addToGrave(t);
                        // t.children[0].remove();

                    }    
               
                    if( p.id[1] == "w"){
                        player = 2;
                        let p1 = document.getElementById("p1");
                        let p2 = document.getElementById("p2");
                        p2.style.backgroundColor = "";
                        p2.style.backgroundColor = "rgb(11, 173, 100)";
                        p2.style.color = "";
                        p2.style.color = "white";

                        p1.style.backgroundColor = "";
                        p1.style.backgroundColor = "white";
                        p1.style.color = "";
                        p1.style.color = "black";
                        
                        
                        board.classList.remove("rotate0");
                        board.classList.add("rotate180");

                        let peices = document.querySelectorAll(".peices");
                        peices.forEach(peices => peices.classList.remove("rotate180", "rotate0"));
                        peices.forEach(peices => peices.classList.add("rotate180"));

                    }
                    else{
                        player = 1;
                        let p1 = document.getElementById("p1");
                        let p2 = document.getElementById("p2");
                        p1.style.backgroundColor = "";
                        p1.style.backgroundColor = "rgb(11, 173, 100)";
                        p1.style.color = "";
                        p1.style.color = "white";

                        p2.style.backgroundColor = "";
                        p2.style.backgroundColor = "gray";
                        p2.style.color = "";
                        p2.style.color = "white";

                        board.classList.remove("rotate180");
                        board.classList.add("rotate0");

                        let peices = document.querySelectorAll(".peices");
                        peices.forEach(peices => peices.classList.remove("rotate180", "rotate0"));
                        peices.forEach(peices => peices.classList.add("rotate0"));
                    }
                    t.append(p);

                } 
               

                const t1 = document.getElementById(selected[0]);
                t1.style.backgroundColor = "";
                const t2 = document.getElementById(selected[1]);
                t2.style.backgroundColor = "";

                selected.length = 0;
            }

            else if( selected.length == 3 && selected[1] == selected[2]){
                currentTile.style.backgroundColor = "";
                selected.length = 1;
            }
        
        
            else{
                const t1 = document.getElementById(selected[0]);
                t1.style.backgroundColor = "";
                const t2 = document.getElementById(selected[1]);
                t2.style.backgroundColor = "";

                selected.length = 0;
            }
        

    }

    // function availableMoves(t){
       
    //         let id = t.id;
    //         let c1 = Number(id[1]);
    //         let c2 = Number(id[3]);

    //     if(pawnFirstMove.get(t.children[0].id)){
    //         c1++;
    //         const t1 = document.getElementById("t" + c1 + "-" + c2);
    //         c1++;
    //         const t2 = document.getElementById("t" + c1 + "-" + c2);

    //         t1.style.backgroundColor = "rgba(14, 226, 145, 0.5)";
    //         t2.style.backgroundColor = "rgba(14, 226, 145, 0.5)";
            
    //     }
    // }

    function updateId( p, t){
        let idInitials = p.id[0] + p.id[1];
        p.id = "";
        p.id = idInitials + t.id[1] + "-" + t.id[3];
        return p;
    }

    function isValidMove(p, t){
        pr = Number(p.id[2]); // 1
        pc = Number(p.id[4]); // 1
        tr = Number(t.id[1]); // 6
        tc = Number(t.id[3]); // 1

        switch(p.id[0]){
            case "p":
                if(p.id[1] == 'b'){
                    let currentTile = document.getElementById("t" + tr + "-" + tc);
                    let isFirst = isFirstMove(p.id);
                    if( (isFirst && tr == pr + 2 && tc == pc) || (tr == pr + 1  && tc == pc) || (tr == pr + 1 && tc == pc + 1) || (tr == pr + 1 && tc == pc - 1)){
                        if(isFirst && tc == pc){
                            return canMove(p.id[0], pr, pc, tr, tc);
                        }
                        else if((tr == pr + 1 && tc == pc + 1) || (tr == pr + 1 && tc == pc - 1)){
                            if(!currentTile.children[0]){
                                return false;
                            }
                            else{
                                if( currentTile.children[0].id[1] == "w"){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                        }
                        else{
                            
                            if( !currentTile.children[0]){
                                return true;
                            }
                            else if( currentTile.children[0].id[1] == "w"){
                                return true;
                            }
                            else{
                                return false;
                            }
                        }
                        
                    }
                    else{
                        return false;
                    }
                }


                else{
                    let currentTile = document.getElementById("t" + tr + "-" + tc)
                    let isFirst = isFirstMove(p.id);
                    if( (isFirst && tr == pr - 2 && tc == pc) || (tr == pr - 1  && tc == pc) || (tr == pr - 1 && tc == pc - 1) || (tr == pr - 1 && tc == pc + 1)){
                        if( isFirst && tc == pc){
                            return canMove(p.id[0], pr, pc, tr, tc);
                        }
                        else if((tr == pr - 1 && tc == pc - 1) || (tr == pr - 1 && tc == pc + 1)){
                            if(!currentTile.children[0]){
                                return false;
                            }
                            else{
                                if( currentTile.children[0].id[1] == "b"){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                        }
                        else{
                            
                            if( !currentTile.children[0]){
                                return true;
                            }
                            else if( currentTile.children[0].id[1] == "b"){
                                return true;
                            }
                            else{
                                return false;
                            }
                        }
                    }
                    else{
                        return false;
                    }
                }

                break;
            case "r":              
                if( pc == tc || pr == tr){
                    return canMove(p.id[0], pr, pc, tr, tc);
                }
                else{
                    return false;
                }
                break;
            case "k":             
                if( tc == pc + 1 || tc == pc - 1 || pr == tr + 1 || pr == tr - 1 ){  
                    return canMove(p.id[0], pr, pc, tr, tc);
                }
                else{
                    return false;
                }
                break;
            case "b":            
                 // x1 + y1 == x2 + y2 || x1 - y1 == x2 - y2 
                if( pr + pc == tr + tc || pr - pc == tr - tc){
                    return canMove(p.id[0], pr, pc, tr, tc)
                }
                else{
                    return false;
                }

                break;
            case "K":
                if( (pr == tr && (tc == pc + 1 || tc == pc - 1) ) || (pc == tc && ( tr == pr + 1 || tr == pr - 1)) || (tr == pr - 1 && tc == pc - 1) || (tr == pr - 1 && tc == pc + 1) || ( tr == pr + 1 && tc == pc - 1) || (tr == pr + 1 && tc == pc + 1) ){
                    console.log("valid");
                    return true;
                }
                else{
                    console.log("not valid");
                    return false;
                }
                break;
            case "q":
                
                if((pr + pc == tr + tc || pr - pc == tr - tc) || (pc == tc || pr == tr)) {            
                    if(canMove("r", pr, pc, tr, tc) || canMove("b", pr, pc, tr, tc)){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
                break;
            default:
                break;
        }
        
    }

    function isFirstMove(id){
        if( pawnFirstMove.get(id) == 1){
            pawnFirstMove.set(id, 0);
            return true;
        }
        else{
            return false;
        }
    }

    function canMove(id, prow, pcol, trow, tcol){
        switch(id){
            case "r":
                let isTrue = false;
                // Up and down
                if( pcol == tcol){
                    // +
                    if(prow < trow){
                        let op = 1;
                        return isOk(prow, trow, pcol, tcol, isTrue, op);
                    }
                    // -
                    else{
                        let op = 0;
                        return isOk(prow, trow, pcol, tcol, isTrue, op);

                    }
                }
                // Right and left
                else{
                    // +
                    if( pcol < tcol) {   
                        let op = 1;
                        return isOk(prow, trow, pcol, tcol, isTrue, op);               
                    }
                    // -
                    else{
                        let op = 0;
                        return isOk(prow, trow, pcol, tcol, isTrue, op);
                    }
                }
            break;

            case "k":
                if( (tcol == pcol + 1 && trow == prow + 2) || ( tcol == pcol + 1 && trow == prow - 2) || (tcol == pcol - 1 && trow == prow + 2) || (tcol == pcol - 1 && trow == prow - 2)
                    || (trow == prow + 1 && tcol == pcol + 2) || ( trow == prow + 1 && tcol == pcol - 2) || (trow == prow - 1 && tcol == pcol + 2) || (trow == prow - 1 && tcol == pcol - 2)){
                        let currentTile = document.getElementById("t" + trow + "-" + tcol);
                        if( !currentTile.children[0]){
                            return true;
                        }
                        // till i figure it out
                        else{
                            return true;
                        }
                    }

                break;
            
            case "b":

                let i = 1;
                if( prow < trow && pcol < tcol){
                    while( prow + i != trow && pcol + i != tcol && i <= 8){
                        let currentTile = document.getElementById("t" + (prow + i) + "-" + (pcol + i));
                        if( currentTile.children[0]){
                            return false;
                        }
                        i++;
                    }
                    return true;
                }
                else if( prow < trow && pcol > tcol){
                    while( prow + i != trow && pcol - i != tcol && i <=8){
                        let currentTile = document.getElementById("t" + (prow + i) + "-" + (pcol - i));
                        if( currentTile.children[0]){
                            return false;
                        }
                        i++;   

                    }
                    return true;
                }
                else if( prow > trow && pcol < tcol){
                    while( prow - i != trow && pcol + i != tcol && i <=8){
                        let currentTile = document.getElementById("t" + (prow - i) + "-" + (pcol + i));
                        if( currentTile.children[0]){
                            return false;
                        }
                        i++;   
                                
                    }
                    return true;
                }
                else{
                    while( prow - i != trow && pcol - i != tcol && i <= 8){
                        let currentTile = document.getElementById("t" + (prow - i) + "-" + (pcol - i));
                        if( currentTile.children[0]){
                            return false;
                        }
                        i++;
                    }
                    return true;
                }

                
                
                break;

            case "K":
                
                break;
            
            case "q":

                break;

            case "p":
                
                if( prow < trow){
                    while(prow < trow){
                        prow++;
                        let currentTile = document.getElementById("t" + prow + "-" + pcol);
                        if(currentTile.children[0]){
                            return false;
                        }
                    }
                    return true;
                    
                }
                else if( prow > trow){
                    
                    while( prow > trow){
                        prow--;
                        let currentTile = document.getElementById("t" + prow + "-" + pcol);
                        if( currentTile.children[0]){
                            return false;
                        }
                    }
                    return true;
                    
                }
                else{
                    
                    return false;
                }
                
                break;

            default:
                break;
        }   
    }

    function isOk(prow, trow, pcol, tcol, isTrue, op){

        pcol == tcol ? (prow = op == 1 ? prow + 1 : prow - 1) : (pcol = op == 1 ? pcol + 1 : pcol - 1);
            
            while(pcol == tcol ? (op == 1 ? prow < trow : prow > trow) : (op == 1 ? pcol < tcol : pcol > tcol)){

                let testTile = document.getElementById("t" + prow + "-" + pcol);
                if(testTile.children[0]){
                    return isTrue;
                }

                pcol == tcol ? (prow = op == 1 ? prow + 1 : prow - 1) : (pcol = op == 1 ? pcol + 1 : pcol - 1);
            }
            isTrue = true;
            return isTrue;
        
    }