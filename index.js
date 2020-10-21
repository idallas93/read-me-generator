
const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./generateMarkdown");
const util = require('util');
const axios = require("axios");



// array of questions for user
const questions = [{
    type: 'input',
    name: 'username',
    message: 'What is your GitHub username (e.g., "idallas93")?',
},
{
    type: 'input',
    name: 'title',
    message: 'What is the name of your git hub repo?',

},
{
    type: 'input',
    name: 'title',
    message: 'What is the name of your project?',

},
{
    type: 'input',
    name: 'description',
    message: 'Write a description of your project',

},
{
    type: 'list',
    name: 'license',
    message: 'What kind of license do you use?',
    choices: ["MIT", "GNU", "N/A"]
},

];

// function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, function (err){
        if (err) {
            return console.log(err);
        }
        console.log("Success!")
    })
}
const writeFileAsync = util.promisify(writeToFile);

// function to initialize program
//  function init() {
//     inquirer.prompt(questions).then((response) => {
//         let markDown = generateMarkdown(response)
//         console.log(markDown);
//         console.log(response);
//         writeToFile("readMe.md", markDown)


//     });

// }
const api = {
    async getUser(userResponses) {
      try { let response = await axios
          
          .get(`https://api.github.com/users/${userResponses.username}`);
          return response.data;
  
        } catch (error) {
          console.log(error);
        }
    }
  };
  
  
// function call to initialize program
async function init() {
    try {

        // Prompt Inquirer questions
        const userResponses = await inquirer.prompt(questions);
        console.log("Your responses: ", userResponses);
        console.log("Thank you for your responses! Fetching your GitHub data next...");
    
        // Call GitHub api for user info
        const userInfo = await api.getUser(userResponses);
        console.log("Your GitHub user info: ", userInfo);
    
        // Pass Inquirer userResponses and GitHub userInfo to generateMarkdown
        console.log("Generating your README next...")
        const markdown = generateMarkdown(userResponses, userInfo);
        console.log(markdown);
    
        // Write markdown to file
        await writeFileAsync('ExampleREADME.md', markdown);

    } catch (error) {
        console.log(error);
    }
};

init();