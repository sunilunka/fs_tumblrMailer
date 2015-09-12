var fs = require('fs');




function csvParse(csvFile){
  
  function readCSVFile(file){
    var csvFile = fs.readFileSync(file);

    return csvFile;
  }


  console.log(readCSVFile(csvFile));


}

csvParse('./friends_list.csv');
