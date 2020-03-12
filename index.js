const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
var userEmail;
var gitImageURL;

let questions = [
    {
        message:"What is github user name?",
        type: 'input',
        name: "username",
    },
    // {
    //     message: 'what is the title of your project?',
    //     type:'input',
    //     name:'title'
    // },
    // {
    //     message: 'what is the description of your project?',
    //     type: 'input',
    //     name:'description'
    // },
    // {
    //     message: 'What license will you use?',
    //     type: 'list',
    //     choices:[
    //         {
    //             name: "Apache 2.0",
    //             value: 'apache'
    //         }, 
    //         {
    //             name: "GNU General Public License 3.0",
    //             value: 'gnu'}, 
    //         {
    //             name: "MIT", 
    //             value: 'mit'
    //         },
    //          {
    //              name: "None", 
    //              value: 'none'
    //         }
    //     ],
    //     name:'license',
    // },
    // {
    //     message:'what is the method of installation?',
    //     type:'input',
    //     name:'installation'
    // },
    // {
    //     message: 'what is the intended use of your application?',
    //     type: 'input',
    //     name: 'use'
    // },
    // {
    //     message:'how do people contribute?',
    //     type: 'input',
    //     name:'contribute'
    // },
    // {
    //     message:'how do you test this application?',
    //     type: 'input',
    //     name:'test'
    // },
    // {
    //     message:'how will you accept questions about this application?',
    //     type:'input',
    //     name:'questions'
    // }

]
inquirer
    .prompt(questions)
    .then(function(inputs) {
        const queryUrl = `https://api.github.com/users/${inputs.username}/events/public`;
        axios
          .get(queryUrl)
          .then(function({ data }) {
              gitImageURL = data[0].actor.avatar_url;
              userEmail = data[0].payload.commits[0].author.email;
              console.log(gitImageURL);
              console.log(userEmail);
          })
          .catch(function(err){
              console.log(err);
          });
        });      
