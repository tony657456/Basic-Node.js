/*
function a(){
    console.log('A');
}
*/

// 자바스크립트에서는 함수가 변수 값으로 들어갈 수 있다!라고 이해
var a = function(){
    console.log('A');
}

// 굉장히 오래걸리는 함수가 있다고 가정하자.
function slowfunc(callback){
    callback();
}

slowfunc(a);