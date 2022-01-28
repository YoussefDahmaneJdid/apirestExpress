///  Read Excel file 
var xlsx = require('node-xlsx'); 
var obj = xlsx.parse(fs.readFileSync(__dirname + '/data.xlsx'));

///// Parsin Excel file 
var valuesPerTaskes = [];
var AllTasks = [];

for(j=1;j < obj[0].data.length ; j++){

 obj[0].data[j].map((item)=>{
  //  console.log(item)
    valuesPerTaskes.push(item);
    })
    AllTasks.push(valuesPerTaskes);
    valuesPerTaskes=[];


}


let pair = {}
var arrayGlobalTasks=[];


for ( i = 0; i < AllTasks.length ; i++){
 
 pair['Retailler ID']=AllTasks[i][0];
 pair['Name']=AllTasks[i][1];
 pair['Telephone POS']=AllTasks[i][2];
 pair['Address']=AllTasks[i][3];
 pair['City']=AllTasks[i][4];
 pair['Sales Rep']=AllTasks[i][5];
 pair['Telephone Comm']=AllTasks[i][6];
 pair['Supervisor']=AllTasks[i][7];
 pair['Telephone Super']=AllTasks[i][8];
 pair['RSM']=AllTasks[i][9];
 pair['Telephone RSM']=AllTasks[i][10];
 pair['Region']=AllTasks[i][11];
 pair['POS Kind']=AllTasks[i][12];
 pair['Level']=AllTasks[i][13];
 pair['GPS Longtitude']=AllTasks[i][14];
 pair['GPS Latitude']=AllTasks[i][15];
 pair['Potence Existe ou pas ']=AllTasks[i][16];
 arrayGlobalTasks.push(pair);
 pair = {};
}

//console.log(arrayGlobalTasks[0]);


CasaTasks = [];


arrayGlobalTasks.map((item)=>{

  if(item.City == 'Casablanca'){
    CasaTasks.push(item);
  }

})
//console.log(CasaTasks.length);




var CasaTasks5 = [];

CasaTasks.map((item,index)=>{
 if(index<6){
    CasaTasks5.push(item);
 }

})
console.log(CasaTasks5.length);
console.log(factorial(CasaTasks5.length-1));


CasaTasks5.map((item,index)=>{
 item['gène']=index;

})
//console.log(CasaTasks5[0]);

var ListChromosone= [];
var ChromosoneObj = [{
 chromosone: [],
 distanceSum:''
}];







for(k = 0 ; k < factorial(CasaTasks5.length-1) ; k++){


var ListSwitcher=[];
//console.log(CasaTasks5);
//let  RandomChangerA = getRandomArbitrary(1,CasaTasks5.length);

// let  RandomChangerB = getRandomArbitrary(1,CasaTasks5.length);
//  console.log(Math.trunc(RandomChangerA)  , '  random 2 ' , Math.trunc(RandomChangerB))
//swap(CasaTasks5,Math.trunc(RandomChangerA),Math.trunc(RandomChangerB));
//console.log(CasaTasks5);

if(k!=0){

let  RandomChangerA = getRandomArbitrary(1,CasaTasks5.length);
let  RandomChangerB = getRandomArbitrary(1,CasaTasks5.length);

//console.log(Math.trunc(RandomChangerA)  , '  random 2 ' , Math.trunc(RandomChangerB))
swap(CasaTasks5,Math.trunc(RandomChangerA),Math.trunc(RandomChangerB));
//console.log(ListSwitcher);
}

var distanceOneChromosone = calculateDistanceOfChromosone(CasaTasks5);
ChromosoneObj['chromosone']=CasaTasks5;

ChromosoneObj['distanceSum'] = distanceOneChromosone;
ListChromosone.push(ChromosoneObj);
ChromosoneObj= {};    



}

/*ListChromosone.map((item,index)=>{
/// console.log(item.distanceSum);
 console.log(index);
})*/
console.log(ListChromosone.length)
//console.log(CasaTasks5[0]);







//console.log(sumDistance);








function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
  }
  else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
  }
}


function swap(chromosone,i,j){
 var newArray= [];
 if(i != j){
    var temp = chromosone[i];
    chromosone[i] = chromosone[j];
    chromosone[j] = temp;
    newArray=chromosone;
  }
  
 
}


function calculateDistanceOfChromosone(chromosone){
 var sumDistance = 0;
 chromosone.map((item, index, elements)=>{
    if(index<chromosone.length-1){
   var distances = distance(item['GPS Latitude'], item['GPS Longtitude'], elements[index+1]['GPS Latitude'], elements[index+1]['GPS Longtitude'], 'K') ;
   sumDistance += distances; }
 })
 return  sumDistance;   
}


function factorial(n){
 //base case
 if(n == 0 || n == 1){
     return 1;
 //recursive case
 }else{
     return n * factorial(n-1);
 }
}

function getRandomArbitrary(min, max) {
 return Math.random() * (max - min) + min;
}
