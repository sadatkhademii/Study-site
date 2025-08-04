 // محاسبه روزهای مونده تا کنکور (خرداد/تیر ۱۴۰۵ شمسی، معادل ژوئن/جولای ۲۰۲۶ میلادی)
 const konkorDate = new Date('2026-06-28'); // تاریخ تقریبی، اگر دقیق می‌دونی تغییر بده
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
     'عمومی': [] // برای عمومی، input نشان بده
 };

 // پر کردن سلکت درس
 const lessonSelect = document.getElementById('lesson');
 Object.keys(lessons).forEach(lesson => {
     const option = document.createElement('option');
     option.text = lesson;
     lessonSelect.add(option);
 });

 // بروز سرفصل بر اساس درس
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
     // برای عمومی، input نشان بده
     document.getElementById('generalLesson').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
     document.getElementById('generalSub').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
 });
