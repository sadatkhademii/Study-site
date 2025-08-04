 // محاسبه روزهای مونده تا کنکور (تقریبی خرداد/تیر ۱۴۰۵، از امروز مرداد ۱۴۰۴)
 const konkorDate = new Date('2025-06-01'); // تاریخ تقریبی، اگر دقیق‌تر می‌دونی تغییر بده
 const today = new Date();
 const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
 document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

 // شروع IndexedDB برای ذخیره محلی (نامحدود و دائمی)
 let db;
 const request = indexedDB.open('StudyDB', 1);
 request.onupgradeneeded = (event) => {
     db = event.target.result;
     db.createObjectStore('lessons', { keyPath: 'id', autoIncrement: true });
 };
 request.onsuccess = (event) => {
     db = event.target.result;
 };

 // تابع ذخیره داده تست
 function saveData() {
     const tx = db.transaction('lessons', 'readwrite');
     const store = tx.objectStore('lessons');
     store.add({ lesson: 'تست درس', time: new Date() });
     alert('داده ذخیره شد!');
 }

 // تابع گزارش تست
 function generateReport() {
     const tx = db.transaction('lessons', 'readonly');
     const store = tx.objectStore('lessons');
     const request = store.getAll();
     request.onsuccess = (event) => {
         const data = event.target.result;
         let output = '<p>تعداد ثبت‌ها: ' + data.length + '</p>';
         document.getElementById('reportOutput').innerHTML = output;
     };
 }
