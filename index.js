const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');

inquirer
    .prompt({
        message:"What is github user name?",
        type: 'input',
        name: "username",
    })
    .then(function({ username }) {
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        axios
          .get(queryUrl)
          .then(function(res) {
            console.log(res);
          });
        });      