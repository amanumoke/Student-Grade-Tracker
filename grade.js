document.addEventListener('DOMContentLoaded', function() {
    const addStudentBtn = document.getElementById('addStudentBtn');
    const calculateAvgBtn = document.getElementById('calculateAvgBtn');
    const highlightTopBtn = document.getElementById('highlightTopBtn');
    const studentForm = document.getElementById('studentForm');
    const gradeForm = document.getElementById('gradeForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const gradeTableBody = document.getElementById('gradeTableBody');
    const summaryStats = document.getElementById('summaryStats');
    
    const studentRowTemplate = document.getElementById('studentRowTemplate');
    const statsTemplate = document.getElementById('statsTemplate');
 
    let students = [];
   
    addStudentBtn.addEventListener('click', showStudentForm);
    cancelBtn.addEventListener('click', hideStudentForm);
    gradeForm.addEventListener('submit', addStudent);
    calculateAvgBtn.addEventListener('click', calculateClassAverage);
    highlightTopBtn.addEventListener('click', highlightTopPerformers);
    
    function showStudentForm() {
        studentForm.classList.remove('hidden');
    }
    
    function hideStudentForm() {
        studentForm.classList.add('hidden');
        gradeForm.reset();
    }
    
    function addStudent(e) {
        e.preventDefault();
        
        const name = document.getElementById('studentName').value;
        const math = parseInt(document.getElementById('mathGrade').value);
        const science = parseInt(document.getElementById('scienceGrade').value);
        const english = parseInt(document.getElementById('englishGrade').value);
        
        const average = ((math + science + english) / 3).toFixed(1);
        
        const student = {
            name,
            math,
            science,
            english,
            average,
            id: Date.now().toString() 
        };
        
        students.push(student);
        
        updateGradeTable();

        gradeForm.reset();
        hideStudentForm();
    }
    
    function updateGradeTable() {
        while (gradeTableBody.firstChild && gradeTableBody.firstChild.id !== 'studentRowTemplate') {
            gradeTableBody.removeChild(gradeTableBody.firstChild);
        }
        
        students.forEach(student => {
            const row = studentRowTemplate.content.cloneNode(true);
            
            row.querySelector('.student-name').textContent = student.name;
            row.querySelector('.student-math').textContent = student.math;
            row.querySelector('.student-science').textContent = student.science;
            row.querySelector('.student-english').textContent = student.english;
            row.querySelector('.student-average').textContent = student.average;
            
            const editBtn = row.querySelector('.btn-edit');
            const deleteBtn = row.querySelector('.btn-delete');
            editBtn.dataset.id = student.id;
            deleteBtn.dataset.id = student.id;
            
            editBtn.addEventListener('click', editStudent);
            deleteBtn.addEventListener('click', deleteStudent);
            
            gradeTableBody.appendChild(row);
        });
        }
    
    function editStudent(e) {
        const studentId = e.target.dataset.id;
        const student = students.find(s => s.id === studentId);
        
        if (!student) return;
        
        document.getElementById('studentName').value = student.name;
        document.getElementById('mathGrade').value = student.math;
        document.getElementById('scienceGrade').value = student.science;
        document.getElementById('englishGrade').value = student.english;
        
        students = students.filter(s => s.id !== studentId);
        
        showStudentForm();
        updateGradeTable();
    }
    
    function deleteStudent(e) {
        const studentId = e.target.dataset.id;
        
        students = students.filter(student => student.id !== studentId);
        
        updateGradeTable();
    }
    
    function calculateClassAverage() {
        if (students.length === 0) {
            alert('No students to calculate average');
            return;
        }
        
        // Calculate averages
        const mathAvg = (students.reduce((sum, student) => sum + student.math, 0) / students.length).toFixed(1);
        const scienceAvg = (students.reduce((sum, student) => sum + student.science, 0) / students.length).toFixed(1);
        const englishAvg = (students.reduce((sum, student) => sum + student.english, 0) / students.length).toFixed(1);
        const overallAvg = (students.reduce((sum, student) => sum + parseFloat(student.average), 0) / students.length).toFixed(1);
        
        updateStatsDisplay(mathAvg, scienceAvg, englishAvg, overallAvg);
    }
    
    function updateStatsDisplay(math, science, english, overall) {

        while (summaryStats.firstChild && summaryStats.firstChild.id !== 'statsTemplate') {
            summaryStats.removeChild(summaryStats.firstChild);
        }
        
        const stats = statsTemplate.content.cloneNode(true);
        
        stats.querySelector('.math-avg').textContent = math;
        stats.querySelector('.science-avg').textContent = science;
        stats.querySelector('.english-avg').textContent = english;
        stats.querySelector('.overall-avg').textContent = overall;
        
        summaryStats.appendChild(stats);
    }
    
    function highlightTopPerformers() {
        if (students.length === 0) {
            alert('No students to highlight');
            return;
        }
        
        document.querySelectorAll('#gradeTableBody tr').forEach(row => {
            row.classList.remove('highlight');
        });
        
        const sortedStudents = [...students].sort((a, b) => b.average - a.average);
        
        const highlightCount = Math.max(1, Math.floor(students.length * 0.2));
        
        const topPerformers = sortedStudents.slice(0, highlightCount);
        
        document.querySelectorAll('#gradeTableBody tr').forEach(row => {
            const studentId = row.querySelector('.btn-edit')?.dataset.id;
            if (studentId && topPerformers.some(student => student.id === studentId)) {
                row.classList.add('highlight');
            }
        });
    }
    
    updateGradeTable();
});