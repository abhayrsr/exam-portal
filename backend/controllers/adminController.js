const {Exam, Question} = require("../models");

const getExamDetails = async(req, res) => {
    try{
        const id = (req.params);
        const exam_id = Number(id.exam_id);

        if(!exam_id){
            return res.status(400).json({error: "data not provided"});
        } 

        const data = await Exam.findAll({
            where: {exam_id},
            attributes: ['exam_id', 'exam_name', 'course_id'],
            include: [{
                model: Question,
                attributes: ["question_id", "question_text", "correct_answer"]
            }]
        })

        if(data.length === 0){
            return res.status(404).json({message: "No exam details"});
        }

        res.status(200).json({data});

    } catch(e){
        console.error(e, "Error while fetching the exam details");
        res.status(500).json({message: "Internal server error"});
    }
}

const updateExam = async(req, res) => {
    try{

    } catch(e){

    }
}

module.exports = {getExamDetails, updateExam}