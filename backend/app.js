const express = require("express");
const { sequelize, User, Exam } = require("./models");
const examRoutes = require('./routes/examRoutes');
const authRoutes = require('./routes/authRoutes')
const resultRoutes = require('./routes/resultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(express.json());

// testing
// app.use(async (req, res, next) => {
//     try {
//         req.user = await User.findOne({ where: { army_number: "ARMY1234" } });
//         if (!req.user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         next(); 
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
    
// })

app.use("/exams", examRoutes);
app.use("/auth", authRoutes);
app.use("/result", resultRoutes);
app.use("/admin/exams", adminRoutes);


// dummy data
// const seedDatabase = async() => {
//     try{
//         await sequelize.sync();
//         console.log('Database Synced')
//         const users = await User.bulkCreate([
//             {
//                 army_number: 'ARMY1234',
//                 name: 'John Doe',
//                 rank: 'Captain',
//                 course_enrolled: 'CS101',
//                 role: 'Student',
//               },
//               {
//                 army_number: 'ARMY5678',
//                 name: 'Admin User',
//                 rank: 'Major',
//                 course_enrolled: 'CS102',
//                 role: 'Admin',
//               },
//         ])
//         console.log('Users added:', users.map((u) => u.name));

//         const exams = await Exam.bulkCreate([
//             {
//                 exam_name: 'Midterm Exam - CS101',
//                 course_id: 'CS101',
//                 uploaded_by: users[1].user_id,
//               },
//               {
//                 exam_name: 'Final Exam - CS101',
//                 course_id: 'CS101',
//                 uploaded_by: users[1].user_id,
//               },
//               {
//                 exam_name: 'Midterm Exam - CS102',
//                 course_id: 'CS102',
//                 uploaded_by: users[1].user_id,
//               },
//         ])

//         console.log("Exam added:", exams.map((e) => e.exam_name));
//     } catch(e){
//         console.error('Error seeding database:', e);
//     }   
// }

sequelize.sync().then(async () => {
    // await seedDatabase();
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
})