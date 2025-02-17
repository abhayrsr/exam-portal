const { Exam } = require('../models');
const { Op } = require('sequelize');

const getAvailableExams = async(req, res) => {
    try{
        
        const { course_enrolled } = req.user;
        console.log(course_enrolled)
        if(!course_enrolled){
            return res.status(400).json({error: "User course not provided."})
        }

        const exams = await Exam.findAll({
            where: {course_id: course_enrolled},
            attributes: ['exam_id', 'exam_name', 'upload_date'],
        })

        if(exams.length === 0){
            return res.status(404).json({message: "No exams found for your course."});
        }

        res.status(200).json({exams});
    } catch(e){
        console.log("Error fetching exams:", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

module.exports = {getAvailableExams};
