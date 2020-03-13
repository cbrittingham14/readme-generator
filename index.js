const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
var userEmail;
var gitImageURL;
const mitSrc = "https://camo.githubusercontent.com/2b5c48821f22738887c98a07f95852b610fb555b/68747470733a2f2f696d672e736869656c64732e696f2f61706d2f6c2f61746f6d69632d64657369676e2d75692e7376673f"
const gnuSrc = "https://camo.githubusercontent.com/581ed12f23a2dc1a36eb7c10dc01664456d9df71/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d47504c25323076332d79656c6c6f772e737667"
const apacheSrc = "https://camo.githubusercontent.com/6e97fc42cf3a7104864fabeae2596615886e6736/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4147504c2d626c75652e737667"
let markDown;
let badgeURL;
const questions = [
    {
        message:"What is github user name?",
        type: 'input',
        name: "username",
    },
    {
        message: 'what is the title of your project?',
        type:'input',
        name:'title'
    },
    {
        message: 'what is the description of your project?',
        type: 'input',
        name:'description'
    },
    {
        message: 'What license will you use?',
        type: 'list',
        choices:[
            {
                name: "Apache 2.0",
                value: 'apache'
            }, 
            {
                name: "GNU General Public License 3.0",
                value: 'gnu'}, 
            {
                name: "MIT", 
                value: 'mit'
            }
        ],
        name:'license',
    },
    {
        message:'what is the method of installation?',
        type:'input',
        name:'installation'
    },
    {
        message: 'what is the intended use of your application?',
        type: 'input',
        name: 'use'
    },
    {
        message:'how do people contribute?',
        type: 'input',
        name:'contribute'
    },
    {
        message:'how do you test this application?',
        type: 'input',
        name:'test'
    },
    {
        message:'how will you accept questions about this application?',
        type:'input',
        name:'questions'
    }
]
inquirer
    .prompt(questions)
    .then(function(inputs) {
        let { license } = inputs;
        getBadgeURL(license);
        console.log(inputs);
        const queryUrl = `https://api.github.com/users/${inputs.username}/events/public`;
        axios
          .get(queryUrl)
          .then(function({ data }) {
              if(data.length > 0){
                gitImageURL = data[0].actor.avatar_url;
              }else{
                  throw Error("User not found");
              }
              if(data[0].payload.commits){
                userEmail = data[0].payload.commits[0].author.email;
              } else{
                  userEmail = "No email provided"
              }
              markDown = makeMarkdown(inputs, gitImageURL, userEmail);
              fs.writeFile("readme.html", markDown, function(err){
                if(err){
                    console.log(err);
                }
                console.log("I think we made a file");
              })
          })
          .catch(function(err){
              console.log(err);
          });
    });      

    function getBadgeURL(lic){
        if(lic === 'apache'){
            badgeURL = apacheSrc;
        } else if (lic === 'mit'){
            badgeURL = mitSrc;
        } else{
            badgeURL = gnuSrc;
        }
    }
    function makeMarkdown(inputs, gitURL, email){
        var markdown = `<!DOCTYPE=html>
        <title>${inputs.title}</title>
        <h1>#${inputs.title}<h1>
        <h3 class="description">Description</h3>
        <div>${inputs.description}</div>
        <h3>Table of Contents</h3>
        <a href="#license">License</a>
        <br>
        <a href="#installation">Installation</a>
        <br>
        <a href="#use">Use</a>
        <br>
        <a href="#contribute">Contribute</a>
        <br>
        <a href="#test">Test</a>
        <br>
        <a href="#questions">Questions</a>
        <br>
        <a href="#contact">Contact</a>
        <br>
        <h3 id="license">License</h3>
        <img src="${badgeURL}" alt="${inputs.license} license" />
        <br>
        <h3  id="installation">Installation</h3>
        <div>${inputs.installation}</div>
        <h3 id="use">##Use</h3>
        <div>${inputs.use}</div>
        <h3 id="contribute">Contribute</h3>
        <div>${inputs.contribute}</div>
        <h3 id ="test">Test</h3>
        <div>${inputs.test}</div>
        <h3 "id=questions">Questions</h3>
        <div>${inputs.questions}</div>
        <h3 id="contact">Contact</h3>
        <img src="${gitURL}" alt="GIT avatar" />
        <a>Email: ${email}</a>
        `;
        return markdown;
    }    