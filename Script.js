 // محاسبه روزهای مونده تا کنکور (خرداد/تیر ۱۴۰۵ شمسی، معادل ژوئن/جولای ۲۰۲۶ میلادی)
 const konkorDate = new Date('2026-06-01'); // تاریخ تقریبی، اگر دقیق می‌دونی تغییر بده
 const today = new Date();
 const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
 document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

 // شروع IndexedDB
 let db;
 const request = indexedDB.open('StudyDB', 1);
 request.onupgradeneeded = (event) => {
     db = event.target.result;
     db.createObjectStore('lessons', { keyPath: 'id', autoIncrement: true });
 };
 request.onsuccess = (event) => {
     db = event.target.result;
 };

 // تابع ذخیره داده (حالا با درس انتخابی)
 function saveData() {
     const lesson = document.getElementById('lesson').value;
     const tx = db.transaction('lessons', 'readwrite');
     const store = tx.objectStore('lessons');
     store.add({ lesson: lesson, time: new Date().toLocaleString('fa-IR') });
     alert('درس ذخیره شد!');
 }

 // تابع گزارش
 function generateReport() {
     const tx = db.transaction('lessons', 'readonly');
     const store = tx.objectStore('lessons');
     const request = store.getAll();
     request.onsuccess = (event) => {
         const data = event.target.result;
         let output = '<p>تعداد ثبت‌ها: ' + data.length + '</p>';
         data.forEach(item => {
             output += '<p>' + item.lesson + ' در ' + item.time + '</p>';
         });
         document.getElementById('reportOutput').innerHTML = output;
     };
 }
