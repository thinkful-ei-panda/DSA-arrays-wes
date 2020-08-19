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

console.log(largestContinuousSum([4, 6, -3, 5, -2, 1])); //12
console.log(largestContinuousSum([1])); //1
console.log(largestContinuousSum([1,-1])); //1
console.log(largestContinuousSum([-1,1])); //1
console.log(largestContinuousSum([-2,-3,-1])); //-1