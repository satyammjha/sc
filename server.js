const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 10000,
    acquireTimeout: 10000,
});

function handleDisconnect() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to the database.');
            connection.release();
        }
    });

    db.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection lost. Reconnecting...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.post('/add-student', (req, res) => {
    const {
        admissionForSession,
        studentName,
        enquiryNo,
        dob,
        address,
        presentSchool,
        presentClass,
        curriculum,
        applyingFor,
        nationality,
        religion,
        caste,
        busRequired,
        fathersName,
        fatherDob,
        fathersQualification,
        fathersEmail,
        fathersOccupation,
        fathersOrganisation,
        fathersDesignation,
        fathersContact,
        mothersName,
        mothersDob,
        mothersQualification,
        mothersEmail,
        mothersOccupation,
        mothersOrganisation,
        mothersDesignation,
        mothersContact,
        familyType,
        numberOfSibling,
        siblingName,
        siblingSchoolName,
        siblingClass,
        sourceOfInfo,
        satisfiedWithInfo,
        preferedCallTime
    } = req.body;

    const sql = `
        INSERT INTO wp_wlsm_inquiries(
            admissionForSession, name, enquiryNo, dob, address,
            presentSchool, presentClass, curriculum, applyingFor, nationality,
            religion, caste, busRequired, fathersName, fatherDob,
            fathersQualification, fathersEmail, fathersOccupation, fathersOrganisation, fathersDesignation,
            fathersContact, mothersName, mothersDob, mothersQualification, mothersEmail,
            mothersOccupation, mothersOrganisation, mothersDesignation, mothersContact,
            familyType, numberOfSibling, siblingName, siblingSchoolName, siblingClass,
            sourceOfInfo, satisfiedWithInfo, preferedCallTime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
    `;

    const values = [
        admissionForSession, studentName, enquiryNo, dob, address,
        presentSchool, presentClass, curriculum, applyingFor, nationality,
        religion, caste, busRequired, fathersName, fatherDob,
        fathersQualification, fathersEmail, fathersOccupation, fathersOrganisation, fathersDesignation,
        fathersContact, mothersName, mothersDob, mothersQualification, mothersEmail,
        mothersOccupation, mothersOrganisation, mothersDesignation, mothersContact,
        familyType, numberOfSibling, siblingName, siblingSchoolName, siblingClass,
        sourceOfInfo, satisfiedWithInfo, preferedCallTime
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Failed to add student:', err);
            return res.status(500).json({ success: false, error: 'Failed to add student' });
        }
        return res.json({ success: true, message: 'Student added successfully' });
    });
});

app.get('/', (req, res) => {
    const query = 'SELECT * FROM wp_wlsm_student_records';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }
        res.json(results);
    });
});


app.get('/inquiriesList', (req, res) => {
    console.log('Fetching inquiries list...');
    const query = 'SELECT * from wp_wlsm_inquiries';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
        }
        res.json(result);
        console.log('fetched')
    })

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});