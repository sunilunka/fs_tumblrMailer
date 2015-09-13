var fs = require("fs");
var ejs = require("ejs");
var tumblr = require("tumblr.js");


var client = tumblr.createClient({
  consumer_key: 'lh8lNR7PsBA1oxANy7N0RvRGAlyxTNRB0KQTGTG2NP0MVvs0Qk',
  consumer_secret: 'L4hnIrVSxww1fAO86A0qgNeLY8w0iYCbQYTreQV15MNkm1TIsD',
  token: 'IwgvocxLMsN8Thx40Y4BpG5tggQDWyLWnhYEfSRlEooFwJ7cK9',
  token_secret: 'h2GN6yofCW6skD66sDzRvBXlNzAj3l3parxcjzvKloEyHRAy5w'
});

var blogInfo = client.posts('sunnybeezy.tumblr.com', function(error, blog){
  for(var i = 0; i < blog.posts.length; i++){
    var post = blog.posts[i];
    console.log(getBlogTimelate(post.date), post.timestamp, post.title, post.short_url);
  }
})

function getBlogTimelate(blogTimeString){
  var blogTime = blogTimeString.replace(/-/g, "/");
  return blogTime;
}

var emailTemplate = fs.readFileSync("./email_template.html", { encoding: "utf8"});

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
    var lines = csvFile.split("\n").slice(1);
    for(var i = 0; i < lines.length; i++){
      var details = lines[i].split(",");
      contacts.push(new ContactPerson(details[0], details[1], details[2], details[3]));
    }
    return;  
  }

  readCSVFile(csvFile);
  return contacts;

};

var contactList = csvParse("./friend_list.csv");

contactList.forEach(function(contact){

  // var firstName = contact["firstName"];
  // var numMonthsSinceContact = contact["numMonthsSinceContact"];

  var customizedTemplate = ejs.render(emailTemplate, { firstName: contact["firstName"], 
    numMonthsSinceContact: contact["numMonthsSinceContact"] });

  console.log(customizedTemplate, blogInfo);

});

