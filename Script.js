window.onload = function() {
 // محاسبه روزهای مونده تا کنکور (۷ تیر ۱۴۰۵ = ۲۰۲۶-۰۶-۲۸)
 const konkorDate = new Date('2026-06-28');
 const today = new Date();
 const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
 document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

 // نمایش تاریخ و ساعت ایران با حرکت زنده (هر ثانیه بروز)
 function updateDateTime() {
     const now = new Date();
     const date = now.toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' });
     const time = now.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit' });
     document.getElementById('currentDate').innerText = date;
     document.getElementById('currentTime').innerText = time;
 }
 updateDateTime();
 setInterval(updateDateTime, 1000);

 // شروع IndexedDB برای ذخیره محلی
 let db;
 const request = indexedDB.open('StudyDB', 1);
 request.onupgradeneeded = (event) => {
     db = event.target.result;
     db.createObjectStore('lessons', { keyPath: 'id', autoIncrement: true });
 };
 request.onsuccess = (event) => {
     db = event.target.result;
     loadLessons(); // لود درس‌ها بعد از db
 };
 request.onerror = (event) => {
     console.error('خطا در IndexedDB:', event.target.errorCode);
 };

 // تعریف درس و سرفصل‌ها
 const lessons = {
     'زیست دهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت'],
     'زیست یازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت', 'فصل نه'],
     'زیست دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت'],
     'شیمی دهم': ['فصل یک', 'فصل دو', 'فصل سه'],
     'شیمی یازدهم': ['فصل یک', 'فصل دو', 'فصل سه'],
     'شیمی دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
     'فیزیک دهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
     'فیزیک یازدهم': ['فصل یک', 'فصل دو', 'فصل سه'],
     'فیزیک دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
     'زمین شناسی': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت'],
     'ریاضی': ['مجموعه و الگو و دنباله', 'توان های گویا و عبارت جبری', 'معادله نامعادله درجه دو', 'تابع', 'مثلثات', 'توابع نمایی و لگاریتمی', 'هندسه', 'حد و پیوستگی', 'مشتق', 'کاربرد مشتق', 'هندسه دوازدهم', 'شمارش بدون شمردن', 'احتمال'],
     'عمومی': [] 
 };

 // تابع لود درس‌ها بعد از db
 function loadLessons() {
     const lessonSelect = document.getElementById('lesson');
     Object.keys(lessons).forEach(lesson => {
         const option = document.createElement('option');
         option.text = lesson;
         lessonSelect.add(option);
     });
 }

 // بروز سرفصل بر اساس درس
 const lessonSelect = document.getElementById('lesson');
 lessonSelect.addEventListener('change', () => {
     const selectedLesson = lessonSelect.value;
     const subsectionSelect = document.getElementById('subsection');
     subsectionSelect.innerHTML = '<option>انتخاب سرفصل</option>';
     if (lessons[selectedLesson]) {
         lessons[selectedLesson].forEach(sub => {
             const option = document.createElement('option');
             option.text = sub;
             subsectionSelect.add(option);
         });
     }
     document.getElementById('generalLesson').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
     document.getElementById('generalSub').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
 });

 // تابع ذخیره داده (با IndexedDB محلی)
 function saveData() {
     const lesson = document.getElementById('lesson').value;
     const subsection = document.getElementById('subsection').value;
     const activity = document.getElementById('activity').value;
     const testCount = document.getElementById('testCount').value;
     const testTime = document.getElementById('testTime').value;
     const studyHours = document.getElementById('studyHours').value;
     const studyMinutes = document.getElementById('studyMinutes').value;
     const generalLesson = document.getElementById('generalLesson').value;
     const generalSub = document.getElementById('generalSub').value;

     const studyTime = parseInt(studyHours) + parseInt(studyMinutes) / 60;

     const tx = db.transaction("lessons", "readwrite");
     const store = tx.objectStore("lessons");
     store.add({ lesson, subsection, activity, testCount, testTime, studyTime, studyHours, studyMinutes, generalLesson, generalSub, time: new Date().toLocaleString('fa-IR') });
     alert('ثبت شد!');
 }

 // تابع گزارش (با جدول زیبا، از IndexedDB)
 function generateReport() {
     const tx = db.transaction("lessons", "readonly");
     const store = tx.objectStore("lessons");
     const request = store.getAll();
     request.onsuccess = (event) => {
         const data = event.target.result;
         let output = '<table><tr><th>درس</th><th>سرفصل</th><th>فعالیت</th><th>تعداد تست</th><th>مدت تست</th><th>زمان مطالعه</th><th>زمان ثبت</th></tr>';
         data.forEach(item => {
             const studyDisplay = item.studyHours + ':' + item.studyMinutes;
             output += '<tr><td>' + item.lesson + '</td><td>' + item.subsection + '</td><td>' + item.activity + '</td><td>' + item.testCount + '</td><td>' + item.testTime + '</td><td>' + studyDisplay + '</td><td>' + item.time + '</td></tr>';
             if (item.generalLesson) output += '<tr><td colspan="7">درس عمومی: ' + item.generalLesson + ' - مبحث: ' + item.generalSub + '</td></tr>';
         });
         output += '</table>';
         document.getElementById('reportOutput').innerHTML = output;
         aiAdvice(data);
         document.getElementById('reportOutput').innerHTML += '<button onclick="window.print()">پرینت گزارش</button>';
     };
 };

 // تابع AI نصیحت (بروز شده با IndexedDB)
 function aiAdvice(data) {
     let advice = '<p>نصیحت AI: ';
     let totalTime = 0;
     const todayStr = new Date().toLocaleDateString('fa-IR');
     data.forEach(item => {
         if (item.time.startsWith(todayStr)) {
             totalTime += item.studyTime || 0;
         }
     });
     const goal = 8; // ساعت هدف، تغییر بده
     if (totalTime < goal) {
         advice += 'امروز کم مطالعه کردی (' + totalTime.toFixed(2) + ' ساعت از ' + goal + ')—فردا تمرکز بیشتر کن!';
     } else {
         advice += 'عالی بودی امروز (' + totalTime.toFixed(2) + ' ساعت)—ادامه بده!';
     }
     advice += '</p>';
     document.getElementById('reportOutput').innerHTML += advice;
 };
};

 // تابع export داده‌ها (برای بک‌آپ دائمی)
 function exportData() {
     const tx = db.transaction("lessons", "readonly");
     const store = tx.objectStore("lessons");
     const request = store.getAll();
     request.onsuccess = (event) => {
         const data = event.target.result;
         const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = 'study-backup.json';
         a.click();
     };
 }

 // تابع import داده‌ها (برای بازگردانی بک‌آپ)
 function importData() {
     const file = document.getElementById('importFile').files[0];
     if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
             const data = JSON.parse(e.target.result);
             const tx = db.transaction("lessons", "readwrite");
             const store = tx.objectStore("lessons");
             store.clear(); // پاک کردن قدیمی
             data.forEach(item => {
                 store.add(item);
             });
             alert('بک‌آپ بازگردانی شد!');
         };
         reader.readAsText(file);
     } else {
         alert('فایل انتخاب کن!');
     }
 }

// تابع بروز نمودار زنده (روزانه)
function updateCharts() {
    db.collection('lessons').get().then((querySnapshot) => {
        const dailyStudy = {};
        const dailyTest = {};
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const date = item.time.split(', ')[0];
            dailyStudy[date] = (dailyStudy[date] || 0) + item.studyTime;
            dailyTest[date] = (dailyTest[date] || 0) + parseInt(item.testCount) || 0;
        });
        const dates = Object.keys(dailyStudy).sort();
        const studyValues = dates.map(date => dailyStudy[date]);
        const testValues = dates.map(date => dailyTest[date]);

        const studyCtx = document.getElementById('studyChart').getContext('2d');
        new Chart(studyCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{ label: 'ساعت مطالعه روزانه', data: studyValues, borderColor: '#4caf50' }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const testCtx = document.getElementById('testChart').getContext('2d');
        new Chart(testCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{ label: 'تعداد تست روزانه', data: testValues, borderColor: '#388e3c' }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    });
}
updateCharts(); // اولیه
// بروز با هر ثبت
const originalSaveData = saveData;
saveData = function() {
    originalSaveData();
    updateCharts();
};

// تابع جمع‌بندی هفتگی (جدول و پرینت)
function generateWeeklySummary() {
    db.collection('lessons').get().then((querySnapshot) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyData = [];
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            if (new Date(item.time) >= oneWeekAgo) {
                weeklyData.push(item);
            }
        });
        let output = '<table><tr><th>روز</th><th>مجموع ساعت مطالعه</th><th>مجموع تست</th></tr>';
        const weeklySummary = {};
        weeklyData.forEach(item => {
            const date = item.time.split(', ')[0];
            weeklySummary[date] = weeklySummary[date] || { study: 0, test: 0 };
            weeklySummary[date].study += item.studyTime;
            weeklySummary[date].test += parseInt(item.testCount) || 0;
        });
        Object.keys(weeklySummary).forEach(date => {
            output += '<tr><td>' + date + '</td><td>' + weeklySummary[date].study.toFixed(2) + '</td><td>' + weeklySummary[date].test + '</td></tr>';
        });
        output += '</table>';
        document.getElementById('summaryOutput').innerHTML = output + '<button onclick="window.print()">پرینت جمع‌بندی</button>';
    });
}

// تابع جمع‌بندی ماهانه (مشابه)
function generateMonthlySummary() {
    db.collection('lessons').get().then((querySnapshot) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const monthlyData = [];
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            if (new Date(item.time) >= oneMonthAgo) {
                monthlyData.push(item);
            }
        });
        let output = '<table><tr><th>روز</th><th>مجموع ساعت مطالعه</th><th>مجموع تست</th></tr>';
        const monthlySummary = {};
        monthlyData.forEach(item => {
            const date = item.time.split(', ')[0];
            monthlySummary[date] = monthlySummary[date] || { study: 0, test: 0 };
            monthlySummary[date].study += item.studyTime;
            monthlySummary[date].test += parseInt(item.testCount) || 0;
        });
        Object.keys(monthlySummary).forEach(date => {
            output += '<tr><td>' + date + '</td><td>' + monthlySummary[date].study.toFixed(2) + '</td><td>' + monthlySummary[date].test + '</td></tr>';
        });
        output += '</table>';
        document.getElementById('summaryOutput').innerHTML = output + '<button onclick="window.print()">پرینت جمع‌بندی</button>';
    });
}
// تابع گزارش هفتگی (جدول زیبا)
function generateWeeklyReport() {
    db.collection("lessons").get().then((querySnapshot) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyData = [];
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            if (new Date(item.time) >= oneWeekAgo) {
                weeklyData.push(item);
            }
        });
        let output = '<table><tr><th>روز</th><th>مجموع ساعت مطالعه</th><th>مجموع تست</th></tr>';
        const weeklySummary = {};
        weeklyData.forEach(item => {
            const date = item.time.split(', ')[0];
            weeklySummary[date] = weeklySummary[date] || { study: 0, test: 0 };
            weeklySummary[date].study += item.studyTime;
            weeklySummary[date].test += parseInt(item.testCount) || 0;
        });
        Object.keys(weeklySummary).forEach(date => {
            output += '<tr><td>' + date + '</td><td>' + weeklySummary[date].study.toFixed(2) + '</td><td>' + weeklySummary[date].test + '</td></tr>';
        });
        output += '</table>';
        output += aiAdvice(weeklyData, true);
        document.getElementById('reportOutput').innerHTML = output + '<button onclick="window.print()">پرینت گزارش هفتگی</button>';
    });
};

// بروز aiAdvice برای هفتگی
function aiAdvice(data, isWeekly = false) {
    let advice = '<p>نصیحت AI: ';
    let totalTime = 0;
    data.forEach(item => {
        totalTime += item.studyTime || 0;
    });
    const goal = 8;
    const weeklyGoal = goal * 7;
    if (isWeekly) {
        advice += 'این هفته ' + totalTime.toFixed(2) + ' ساعت مطالعه کردی. اگر کمتر از ' + weeklyGoal + ' بود، سرعتت کند هست—درس‌های ضعیف رو بیشتر مرور کن (حداقل ۳ بار).';
    } else {
        advice += 'امروز ' + totalTime.toFixed(2) + ' ساعت مطالعه کردی. اگر کمتر از ' + goal + ' بود، فردا تمرکز کن—ضعف در درس‌ها دیده می‌شه، ۲-۳ بار مرور کن.';
    }
    advice += '</p>';
    return advice;
};
