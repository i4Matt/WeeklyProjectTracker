// --- IMPORTS --- //
const schedule = require('node-schedule');
const fs = require('fs');
const express = require('express');
const app = express();

// PATH TO MY JSON FILE
const JSONPROJECTSPATH = 'data/projects.json';
const JSONCOMPLETEDPATH = 'data/completed.json';

var task = selectNewTask();

// readSpecificLine(filePath, lineIndex)
// deleteSpecificLine(filePath, lineIndex)
// addNewLine(filePath, newLine)
// getParsedSize(filePath)
//#region JSON FILE MANAGEMENT
// FUNCTION TO READ A SPECIFIC LINE OF A JSON FILE
function readSpecificLine(filePath, lineIndex) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf-8');
  
        // Parse the JSON data into an array
        const jsonData = JSON.parse(data);
  
        // Check if the JSON is an array and if the lineIndex is valid
        if (Array.isArray(jsonData) && lineIndex >= 0 && lineIndex < jsonData.length) {
            return jsonData[lineIndex];
        } else {
            throw new Error('Invalid line index or JSON is not an array.');
        }
    } catch (error) {
        console.error('Error reading JSON file:', error.message);
        return null;
    }
}

// Function to delete a specific line (index) from the JSON file
function deleteSpecificLine(filePath, lineIndex) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf-8');
  
        // Parse the JSON data into an array
        const jsonData = JSON.parse(data);
  
        // Check if the JSON is an array and if the lineIndex is valid
        if (Array.isArray(jsonData) && lineIndex >= 0 && lineIndex < jsonData.length) {
            // Remove the specified line
            const removedLine = jsonData.splice(lineIndex, 1);
  
            // Write the updated JSON data back to the file
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
            
            console.log(`Successfully deleted line ${lineIndex}:`, removedLine[0]);
        } else {
            throw new Error('Invalid line index or JSON is not an array.');
        }
    } catch (error) {
        console.error('Error deleting line:', error.message);
    }
}

// Function to add a new line (entry) to the JSON file
function addNewLine(filePath, newLine) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf-8');
  
        // Parse the JSON data into an array
        const jsonData = JSON.parse(data);
    
        // Check if the JSON is an array
        if (Array.isArray(jsonData)) {
            // Add the new line to the array
            jsonData.push(newLine);
    
            // Write the updated JSON data back to the file
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    
            console.log(`Successfully added new line: ${newLine}`);
        } else {
            throw new Error('JSON file is not an array.');
        }
    } catch (error) {
        console.error('Error adding new line:', error.message);
    }
}

// Function to get the size of the parsed JSON
function getParsedSize(filePath) {
    try {
      // Read the JSON file
      const data = fs.readFileSync(filePath, 'utf-8');
  
      // Parse the JSON data
      const jsonData = JSON.parse(data);
  
      // Determine the size
      if (Array.isArray(jsonData)) {
        console.log(`Parsed size: ${jsonData.length} items in the array.`);
        return jsonData.length; // Array size
      } else if (typeof jsonData === 'object') {
        const size = Object.keys(jsonData).length;
        console.log(`Parsed size: ${size} keys in the object.`);
        return size; // Object size
      } else {
        throw new Error('JSON is neither an array nor an object.');
      }
    } catch (error) {
      console.error('Error reading parsed size:', error.message);
      return null;
    }
  }
//#endregion

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function selectNewTask(){
    var randomNumber = getRandomInt(1, getParsedSize(JSONPROJECTSPATH));
    var currentTask = readSpecificLine(JSONPROJECTSPATH, randomNumber);
    addNewLine(JSONCOMPLETEDPATH, currentTask);
    deleteSpecificLine(JSONPROJECTSPATH, randomNumber);

    console.log("NEW TASK: " + currentTask);
    return currentTask
}

schedule.scheduleJob('1 1 * * 1', function() {
    selectNewTask();
    console.log('test');
});

app.get('/', (req, res) =>{
    res.send(task);
})

app.listen(9090);