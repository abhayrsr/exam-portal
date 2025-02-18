const { sequelize, Question} = require("../models");
// const questions = require("./questions.json").questions;
const { readFile } = require('node:fs/promises');
const {resolve} = require('node:path');

const readQuestions = async() => {
    
    try{
        const filePath = resolve("../data/questions.json");
        const content = await readFile(filePath, {encoding: 'utf8'});
        // console.log(content);
        return JSON.parse(content);
    } catch(e){
        console.error(e.message);
    }

}
const seedQuestions = async () => {
    try{
        await sequelize.authenticate();

        await sequelize.sync({ alter: true });
        
        const data = await readQuestions();
        // console.log(data.questions)
        
        // Use bulkCreate with the entire array
        await Question.bulkCreate(data.questions);
        
        console.log("Questions added successfully");

        const allQuestions = await Question.findAll();
        console.log("📊 Current Questions in DB:", allQuestions);
        
        // const questionData = await Question.bulkCreate(questions.questions.map((item) => ));
        // console.log(questionData);
       
    } catch(e){
        console.error("Error seeding questions:", error);
    } finally {
        process.exit();
    }
}

seedQuestions();
