 // محاسبه روزهای مونده تا کنکور (۷ تیر ۱۴۰۵ = ۲۰۲۶-۰۶-۲۸)
 const konkorDate = new Date('2026-06-28');
 const today = new Date();
 const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
 document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

 // نمایش تاریخ و ساعت ایران (شمسی و ساعت)
 function updateDateTime() {
     const now = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
     const parts = now.split(', ');
     document.getElementById('currentDate').innerText = parts[0];
     document.getElementById('currentTime').innerText = parts[1];
 }
 updateDateTime();
 setInterval(updateDateTime, 60000); // بروز هر دقیقه

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
     document.getElementById('generalLesson').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
     document.getElementById('generalSub').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
 });

 // تابع ذخیره داده (بروز با ساعت/دقیقه)
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

     const tx = db.transaction('lessons', 'readwrite');
     const store = tx.objectStore('lessons');
     store.add({ lesson, subsection, activity, testCount, testTime, studyTime, studyHours, studyMinutes, generalLesson, generalSub, time: new Date().toLocaleString('fa-IR') });
     alert('ثبت شد!');
 }

 // تابع گزارش (بروز با جدول زیبا)
 function generateReport() {
     const tx = db.transaction('lessons', 'readonly');
     const store = tx.objectStore('lessons');
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
         aiAdvice();
         document.getElementById('reportOutput').innerHTML += '<button onclick="window.print()">پرینت گزارش</button>';
     };
 };
