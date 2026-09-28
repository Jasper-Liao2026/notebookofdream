function bar(){
    console.log(myName)
}

function foo(){
    var myName = '叽叽叽';
    bar();
}

var myName = 'jiji'

foo();