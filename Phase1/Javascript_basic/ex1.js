let head = 0;
let tail = 0;
for(let i = 0; i<5;i++){
    let flip = Math.round(Math.random());
    if(flip == 1){
        head++;
    } else {
        tail++;
    } 
}
console.log("Heads:", head);
console.log("Tails:", tail);    