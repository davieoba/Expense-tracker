# note: this is a good example of how the callback function works 
```
function fullName(fn){
 return fn('David', 'Bodunrin') ;
}

const ans = fullName(function(firstName, lastName){
  let myName = `${firstName} ${lastName}`
  return myName
})

console.log(ans)
```
