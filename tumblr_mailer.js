var fs = require("fs");
var ejs = require("ejs");
var tumblr = require("tumblr.js");
var mandrill = require("mandrill-api/mandrill");

var mandrill_client = new mandrill.Mandrill("YSk7nLq-RIsIuuOaLosvoA")

var client = tumblr.createClient({
  consumer_key: 'lh8lNR7PsBA1oxANy7N0RvRGAlyxTNRB0KQTGTG2NP0MVvs0Qk',
  consumer_secret: 'L4hnIrVSxww1fAO86A0qgNeLY8w0iYCbQYTreQV15MNkm1TIsD',
  token: 'IwgvocxLMsN8Thx40Y4BpG5tggQDWyLWnhYEfSRlEooFwJ7cK9',
  token_secret: 'h2GN6yofCW6skD66sDzRvBXlNzAj3l3parxcjzvKloEyHRAy5w'
});



function getBlogTimelate(blogTimeString){
  var blogTime = new Date(blogTimeString.replace(/-/g, "/"));
  var timeNow = new Date();
  return Math.round((timeNow - blogTime) / 1000 / 60 / 60 / 24);
}


var emailTemplate = fs.readFileSync("./email_template.ejs", { encoding: "utf8"});

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


var blogInfo = client.posts('sunnybeezy.tumblr.com', function(error, blog){
  var forTemplate = [];
  for(var i = 0; i < blog.posts.length; i++){
    var post = blog.posts[i];
    if(getBlogTimelate(post.date) <= 70){
      forTemplate.push({
        "href" : post.short_url,
        "title": post.title
      });
    };
    
  };

  var contactList = csvParse("./friend_list.csv");
  contactList.forEach(function(contact){

  var firstName = contact["firstName"];
  var numMonthsSinceContact = contact["numMonthsSinceContact"];

    var customizedTemplate = ejs.render(emailTemplate, { firstName: firstName, 
    numMonthsSinceContact: numMonthsSinceContact, latestPosts: forTemplate});

    console.log(customizedTemplate);

    function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
      var message = {
          "html": message_html,
          "subject": subject,
          "from_email": from_email,
          "from_name": from_name,
          "to": [{
                  "email": to_email,
                  "name": to_name
              }],
          "important": false,
          "track_opens": true,    
          "auto_html": false,
          "preserve_recipients": true,
          "merge": false,
          "tags": [
              "Fullstack_Tumblrmailer_Workshop"
          ]    
      };
      var async = false;
      var ip_pool = "Main Pool";
      mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
          // console.log(message);
          // console.log(result);   
      }, function(e) {
          // Mandrill returns the error as an object with name and message keys
          console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
          // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
      });
    };

    sendEmail(firstName, contact["emailAddress"], "Sunil", "sunil.unka@gmail.com", "Hi! " + firstName + " it's been awhile!", customizedTemplate);

  });
  
  

});




