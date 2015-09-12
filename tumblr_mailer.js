var fs = require('fs');



function csvParse(csvFile){

  var contacts = [];

  function ContactPerson(firstName, lastName, lastContact, email){
    this.firstName = firstName;
    this.lastName = lastName;
    this.numMonthsSinceContact = lastContact;
    this.emailAddress = email;
  }

  function readCSVFile(file){
    var csvFile = fs.readFileSync(file, { encoding: "utf8"});
    var lines = csvFile.split("\n").slice(1, -1);

    for(var i = 0; i < lines.length; i++){
      var details = lines[i].split(",");
      contacts.push(new ContactPerson(details[0], details[1], details[2], details[3]));
    }
    return;  
  }

  readCSVFile(csvFile);
  console.log(contacts);
  return contacts;

}

csvParse('./friend_list.csv');
