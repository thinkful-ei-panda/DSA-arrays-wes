const Memory = require('./memory');

const memory = new Memory;

class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this.ptr = memory.allocate(this.length);
  }

  push(value){
    if(this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    
    memory.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size){
    const oldPtr = this.ptr;
    this.ptr = memory.allocate(size);
    if(this.ptr === null){
      throw new Error('Out of memory');
    }
    memory.copy(this.ptr, oldPtr, this.length);
    memory.free(oldPtr);
    this._capacity = size;
  }

  get(index) {
    if(index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    return memory.get(this.ptr + index);
  }

  pop() {
    if(this.length === 0) {
      throw new Error('Index error');
    }
    const value = memory.get (this.ptr + this.length - 1);
    this.length --;
    return value;
  }

  insert(index,value){
    if(index < 0 || index>= this.length){
      throw new Error('Index error');
    }

    if(this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    memory.set(this.ptr + index, value);
    this.length++;
  }

  remove(index) {
    if(index < 0 || index >= this.length){
      throw new Error('Index error');
    }
    memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1);
    this.length--;
  }
}

function main(){
  Array.SIZE_RATIO = 3;

  let arr = new Array();

  arr.push(3);

  //console.log(arr);

  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);

  //console.log(arr);

  arr.pop();
  arr.pop();
  arr.pop();

  //console.log(arr);

  let firstItem = arr.get(0);

  // console.log(firstItem);

  arr.pop();
  arr.pop();
  arr.pop();
  arr.push('tauhida');
  firstItem = arr.get(0);

  console.log(firstItem, 'typeof firstItem:',typeof firstItem);
  
}

// main();

//2. {length: 6, _capacity:12, ptr:3}
//when first item is pushed capacity is set to 3x the required space
//when the 4th item is pushed capacity is exceeded and space is reallocated. capacity is tripled again to 12

//3. { length: 3, _capacity: 12, ptr: 3 }
//each pop decreases the length of the array

//4. 3
//NaN
//I would guess that the Float64Array class only inserts numbers
//_resize looks for a contiguous piece of memory large enough to hold the array every time it is called, then copies the current data to the new target location, then frees up the old location to be reused

//5.

function urlifyString(string){
  if(string === ''){
    return '';
  }

  if(string[0] === ' '){
    return '%20' + urlifyString(string.slice(1));
  }

  return string[0] + urlifyString(string.slice(1));
}

// console.log(urlifyString('tauhida parveen'));
// console.log(urlifyString('www.thinkful.com /tauh ida parv een'));

//O(n^2), looping through once and at each step of the loop we are shifting the n-1 array up one memory block

//6. 

function filterLessThanFive(array){
  let filteredArray = [];
  for(let i = 0; i < array.length; i++){
    if(array[i] >= 5){
      filteredArray.push(array[i]);
    }
  }
  return filteredArray;
}

// console.log(filterLessThanFive([1,2,3,4,5,6,7,8,9,10,10,10,10,10]));

//O(n)

//7.

function largestContinuousSum(array){
  let beforeIndexSum = 0;
  let lastCheckedPoint = 0;
  let greatestContinuousSum = array[0];

  //loop through array  
  while(lastCheckedPoint <= array.length){
    let currentContinuousSum=array[lastCheckedPoint];
    //check if current sum is biggest
    if(currentContinuousSum > greatestContinuousSum) {
      greatestContinuousSum = currentContinuousSum;
    }
    beforeIndexSum=0;

    //loop through numbers after checkpoint
    for(let i = lastCheckedPoint+1; i<array.length; i++){
      

      //if prev numbers + current number is not negative, add it to current sum and reset prev numbers
      if(beforeIndexSum+array[i] >= 0){
        
        currentContinuousSum = currentContinuousSum+beforeIndexSum+array[i];
        beforeIndexSum=0;

        //check if current sum is biggest
        if(currentContinuousSum > greatestContinuousSum) {
          greatestContinuousSum = currentContinuousSum;
        }

      //else add the current number to prev numbers, 
      } else {
        beforeIndexSum = beforeIndexSum + array[i];        
      }
    }
    lastCheckedPoint++;
  }
  return greatestContinuousSum;
}

// console.log(largestContinuousSum([4, 6, -3, 5, -2, 1])); //12
// console.log(largestContinuousSum([1])); //1
// console.log(largestContinuousSum([1,-1])); //1
// console.log(largestContinuousSum([-1,1])); //1
// console.log(largestContinuousSum([-2,-3,-1])); //-1

//8. 

function mergeSortedArrays(arrayA,arrayB){
  let indexA=0;
  let indexB=0;

  let result = [];

  while(indexA<arrayA.length || indexB<arrayB.length){
    if(indexA === arrayA.length && indexB < arrayB.length){
      result = [...result,...arrayB.slice(indexB)];
      break;
    }

    if(indexB === arrayB.length && indexA < arrayA.length){
      result = [...result,...arrayA.slice(indexA)];
      break;
    }

    if(arrayA[indexA]<arrayB[indexB]){
      result.push(arrayA[indexA]);
      indexA++;
    } else if(arrayB[indexB]<arrayA[indexA]){
      result.push(arrayB[indexB]);
      indexB++;
    } else {
      result.push(arrayB[indexB]);
      result.push(arrayB[indexB]);
      indexB++;
      indexA++;      
    }
  }
  return result;
}

// console.log(mergeSortedArrays([1, 3, 6, 8, 11],[2, 3, 5, 8, 9, 10]));
// console.log(mergeSortedArrays([1, 1,1,1,1,1],[2,2,2,2,2]));
// console.log(mergeSortedArrays([5],[1,2,3,4,5]));

//9.

function removeChars(string, chars){
  let add = true;
  let result = [];
  let i=0;
  let j=0;

  while(i < string.length){
    while(j < chars.length){
      if(string[i] === chars[j]){
        add = false;
        break;
      }
      j++;
    }
    if(add === true){
      result.push(string[i]);
    } else {
      add = true;
    }
    i++;
    j=0;
  }
  return result.join('');
}

// console.log(removeChars('Battle of the Vowels: Hawaii vs. Grozny', 'aeiou'));

//10.

function products(array){
  let totalProduct = 1;
  let result = [];
  for(let i = 0; i < array.length; i++){
    totalProduct = totalProduct * array[i];
  }

  for(let j = 0; j < array.length; j++){
    result.push(totalProduct/array[j]);
  }
  
  return result;
}

// console.log(products([1, 3, 9, 4]));

//11.

function twoDArray(array){
  let result = [];
  for(let x = 0; x < array.length; x++){
    let subArray = [];
    for(let y = 0; y < array[0].length; y++){
      subArray.push(5);
    }
    result.push(subArray);
  }

  for(let m = 0; m < array.length; m++) {
    for(let n = 0; n < array[m].length; n++){
      let value = array[m][n];

      //is the value a 1?
      if(value === 1){       

        //check the row and column for zeroes
        if(areThereZeroes(m,n,array)){
          result[m][n] = 0;
          
        }else {
          result[m][n] = 1;
          
        }
      } else {
        result [m][n] = 0;

      }
    }
  }
  return result;
}

function areThereZeroes(m,n,array){
  //check column for 0s
  for(let i = 0; i < array.length; i++){
    if(array[i][n] === 0) {
      return true;
    }
  }

  //check row for 0s
  for(let j = 0; j < array[m].length; j++){
    if(array[m][j] === 0) {
      return true;
    }
  }

  return false;
}

// console.log(twoDArray([[1,0,1,1,0],
//   [0,1,1,1,0],
//   [1,1,1,1,1],
//   [1,0,1,1,1],
//   [1,1,1,1,1]]));

// console.log(twoDArray([[1,0,1,1,0,0],
//   [0,1,1,1,0,0],
//   [1,1,1,1,1,0],
//   [1,0,1,1,1,0],
//   [1,1,1,1,1,0]]));

//12.

function rotatedString(string1,string2, count=string1.length){
  if(string1 === string2) {
    return true;
  }

  if(count === 0){
    return false;
  }

  const movedChar = string1[string1.length-1];

  return rotatedString(movedChar.concat(string1.slice(0,-1)),string2,count-1);
}

// console.log(rotatedString('amazon', 'azonma')); //false
// console.log(rotatedString('amazon', 'azonam')); //true