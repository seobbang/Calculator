/*
스택을 이용하여 후위 표기법으로 계산 구현
*/

const ans = document.querySelector("#ans");
let priAns = document.querySelector("#pri-ans");

const buttons= document.querySelector(".buttonContainer");  //.buttonContainer의 자식 요소들의 정보를 모두 담음.

const array = [];         //전체 식 배열
let numArray = [];        //숫자를 받아 저장해놓는 배열

const opStack = [];       //연산자 스택
const calStack = [];      //후위표기 스택

let num = 0;
let backNumber;           //array에서 다시 numArray로 돌려줘야 할 때

let num1 = 0;
let num2 = 0; 
let op;

let answer = 0;
let count = -1;           //첫 버튼 누름과 answer이 구해진 상태인지 아닌지 판단하는 count

//main
buttons.addEventListener("click", handleButton);

function handleButton(event){
    const button = event.target;
    const buttonClass = button.classList[0];        //왜 button.class는 undefined로 나오는가

    if(buttonClass !== "buttonContainer"){          //buttonContainer이 클릭되었을 때 무반응이도록
        //첫 클릭
        if(count === -1){
            priAns.classList.remove("hidden");
            ans.innerText = "";
            count++;
        }
        //answer이 구해진 상태
        else if(count === 1){
            ans.innerText = "";
            count--;
        }
        priAns.innerText = "Ans = "+ answer;
        handleArray(button);
    }    
}

function handleArray(button){
    const buttonClass = button.classList[0];          //왜 button.class는 undefined로 나오는가

    //숫자버튼//
    if(buttonClass === "numButton") {
        const num = button.innerText;
        numArray.push(Number(num));

        ans.innerText = ans.innerText + num;           //눌러진 숫자 화면표시하기
    }

    //연산자버튼//
    else if(buttonClass === "opButton") {
        //연산자 이전에 숫자가 먼저 입력되어 있는 경우
        if(numArray.length !== 0){
            let index = numArray.indexOf('.');

            //소수점 이하 자리가 없는 경우
            if(index === -1){
                for(i=numArray.length-1; i>=0 ; i--){
                    num += (10**(numArray.length-1-i))*numArray[i] ;
                }
            }
            //소수점 이하 자리가 있는 경우
            else{
                for(i=numArray.length-1; i>index; i--){
                    num += (10**((i-index)*(-1)))*numArray[i];
                }
                for(i=index-1; i>=0 ; i--){
                    num += (10**(index-1-i))*numArray[i] ;
                }
            }

            array.push(num);
            num = 0;
            numArray = [];
        }

        //직전 answer을 구한 후 아직 입력된 것이 없는 경우 직전 answer을 가져옴
        else if(numArray.length === 0 && array.length === 0){
            ans.innerText = answer;
            array.push(answer);
        }

        //직전에 입력이 숫자 또는 ) 가 아닌경우
        else if(numArray.length === 0 && array[array.length-1] !== ")"){
            alert("잘못된 입력입니다.");
            return 0;
        }
        
        op = button.id;
        array.push(op);

        ans.innerText = ans.innerText + op;        //눌러진 연산자 화면표시하기
    }

    //"="버튼//
    else if(buttonClass ==="endButton") {
        //연산자 이전에 숫자가 먼저 입력되어 있는 경우
        if(numArray.length !== 0){
            let index = numArray.indexOf('.');

            //소수점 이하 자리가 없는 경우
            if(index === -1){
                for(i=numArray.length-1; i>=0 ; i--){
                    num += (10**(numArray.length-1-i))*numArray[i] ;
                }
            }
            //소수점 이하 자리가 있는 경우
            else{
                for(i=numArray.length-1; i>index; i--){
                    num += (10**((i-index)*(-1)))*numArray[i];
                }
                for(i=index-1; i>=0 ; i--){
                    num += (10**(index-1-i))*numArray[i] ;
                }
            }

            array.push(num);
            num = 0;
            numArray = [];
        }
        
        let count1 = array.filter(element => "(" === element).length;
        let count2 = array.filter(element => ")" === element).length;

        //)를 다 입력하지 않았을 때
        if(count1 !== count2 ){
            for(i=0;i<(count1-count2);i++){
                array.push(")");
            }
        }
        console.log(array);

        //직전 입력이 ) 또는 숫자인 경우만 정상 계산
        if(array[array.length-1] === ")" || !(isNaN(array[array.length-1]))){
            array.push(button.innerText);
            answer = makeStack(array);
            console.log(answer);
            priAns.innerText = ans.innerText + "=";
            ans.innerText = answer;
            num1 = 0;
            num2 = 0;
            op = "";      
            
            count++;
        }

        //직전 answer을 구한 후 아직 입력된 것이 없는 경우 0을 표시
        else if(numArray.length === 0 && array.length === 0){
            priAns.innerText = "Ans = "+ answer;
            ans.innerText = "0";
            count++;
        }

        else{
            alert("잘못된 입력입니다.");
            return 0;
        }
            
    }

    //삭제버튼일 때
    else if(buttonClass === "deleteButton") {
        //'AC' 버튼//
        if(button.id === "AC"){
            for(i=array.length-1; i>=0 ; i--){
                array.pop();
            }
            ans.innerText = "0";
            numArray = [];
            num = 0;
            count--;
        }

        //'BS' 버튼//
        else if(button.id === "BS"){
            //직전 입력이 숫자가 아닐 때
            if(numArray.length === 0){

                //직전 answer 이후로 입력된 것이 없을 때
                if(array.length === 0) {
                    ans.innerText = "0";
                    count++
                    return 0;
                }

                array.pop();
                //삭제된 것의 직전 입력이 숫자일 때
                if(!(isNaN(array[array.length-1]))){
                    ans.innerText = "";
                    for(i=0;i<array.length;i++){
                        ans.innerText = ans.innerText + array[i];
                    }
                    backNumber = String(array.pop());
                    for(i=0;i<backNumber.length;i++){
                        numArray.push((Number(backNumber.substr(i,1))));
                    }
                }

                //삭제된 것의직전 입력된 것이 숫자가 아닐 때
                else{
                    ans.innerText = "";
                    for(i=0;i<array.length;i++){
                        ans.innerText = ans.innerText + array[i];
                    }
                }
            }

            //직전 입력이 숫자일 때
            else {
                numArray.pop();
                ans.innerText = "";
                for(i=0;i<array.length;i++){
                    ans.innerText = ans.innerText + array[i];
                }
                for(i=0;i<numArray.length;i++){ 
                    ans.innerText = ans.innerText + numArray[i];
                }
            }
            
        }
    }

    //그 외
    else if(buttonClass === "etcButton"){

        //'('버튼//
        if(button.innerText === "("){
            if(numArray.length !== 0){
                let index = numArray.indexOf('.');

                //소수점 이하 자리가 없는 경우
                if(index === -1){
                    for(i=numArray.length-1; i>=0 ; i--){
                        num += (10**(numArray.length-1-i))*numArray[i] ;
                    }
                }
                //소수점 이하 자리가 있는 경우
                else{
                    for(i=numArray.length-1; i>index; i--){
                        num += (10**((i-index)*(-1)))*numArray[i];
                    }
                    for(i=index-1; i>=0 ; i--){
                        num += (10**(index-1-i))*numArray[i] ;
                    }
                }

                array.push(num);
                num = 0;
                numArray = [];
                array.push("*");
            }
        }

        //')'버튼//
        else if(button.innerText === ")"){
            //이전 입력 중 짝 지어지지 않은 (가 남아있는지 확인
            let count1 = array.filter(element => "(" === element).length;
            let count2 = array.filter(element => ")" === element).length;

            if((count1 - count2 > 0) && count1 > 0){
                let index = numArray.indexOf('.');
                if(index === -1){
                    for(i=numArray.length-1; i>=0 ; i--){
                        num += (10**(numArray.length-1-i))*numArray[i] ;
                    }
                }
                else{
                    for(i=numArray.length-1; i>index; i--){
                        num += (10**((i-index)*(-1)))*numArray[i];
                    }
                    for(i=index-1; i>=0 ; i--){
                        num += (10**(index-1-i))*numArray[i] ;
                    }
                }
                array.push(num);
                num = 0;
                numArray = [];
            }

            else{
                alert("잘못된 입력입니다.");
                return 0;
            } 
        }

        //'.' 버튼//
        else if(button.innerText === "."){
            if(numArray.length === 0){
                numArray.push(0);
                ans.innerText = ans.innerText + "0";
            }
            numArray.push(button.innerText);
        }

        const etcButton = button.innerText;
        ans.innerText = ans.innerText + etcButton;
        array.push(etcButton); 
        console.log(array);
    }
}

//후위 표기법으로 전환
function makeStack(array){
    const length = array.length;

    for(i=0 ; i<length ; i++){
        let element = array.shift(); //배열 맨 앞 요소 제거하기
        
        //숫자는 바로 후위표기식 스택에 넣음
        if(!(isNaN(element))){
            calStack.push(element);
        }
        
        else {
            if(element === "("){
                opStack.push(element);
                console.log(calStack);
            }
            // '(' 가 나올 때까지 opStack에서 pop시켜서 후위표기식 스택에 push
            else if(element === ")"){
                let index = opStack.indexOf('(');

                for(i=opStack.length-1; i>index ; i--){
                    calStack.push(opStack.pop());
                }
                opStack.pop(); //마지막 ( 는 제거
                console.log(calStack);
            }

            //old operator가 없으면 new operator를 스택에 넣는다.
            //우선순위가 old operator >= new operator인 경우 old operator를 calArray에 넣은 후 new operator를 스택에 넣는다.
            else if(element === "*" || element === "/"){
                if(opStack[opStack.length-1] === "*" || opStack[opStack.length-1] === "/"){
                    calStack.push(opStack.pop());
                }
                opStack.push(element);
                console.log(calStack);
            }
            else if(element === "+" || element === "-"){
                if(opStack[opStack.length-1] === "*" || opStack[opStack.length-1] === "/" || 
                opStack[opStack.length-1] === "+" ||opStack[opStack.length-1] === "-"){
                    calStack.push(opStack.pop());
                }
                opStack.push(element);
                console.log(calStack);
            }

            else if(element === "="){
                const opLength = opStack.length;
                for(i=0 ; i<opLength ; i++){
                    calStack.push(opStack.pop());
                }
                console.log(calStack);
                return calculateStack(calStack);
                
            }
        }
    }
}

//후위 표시 수식 계산하기
function calculateStack(calStack){
    const tempStack = [];
    let length = calStack.length;

    for(i=0 ; i<length ; i++){
        let element = calStack.shift();
        if(!isNaN(element)){
            tempStack.push(element);
        }
        else{
            num2 = tempStack.pop();
            num1 = tempStack.pop();
            tempStack.push(calculate(num1, element, num2));
            
        }
    }
    return tempStack.pop();
}

//사칙 연산
function calculate(num1, op, num2){
    let ans;
    if (op === "+") {
        ans= (num1 + num2).toFixed(11);
        return Number(ans);
    }
    else if (op === "-") {
        ans= (num1 - num2).toFixed(11);
        return Number(ans);
    }
    else if (op === "*") {
        ans= (num1 * num2).toFixed(11);
        return Number(ans);
    }
    else if (op === "/") {
        ans= (num1 / num2).toFixed(11);
        return Number(ans);
    }
    else {
        alert("");
    }
}
