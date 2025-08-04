 // محاسبه روزهای مونده تا کنکور (۷ تیر ۱۴۰۵ شمسی = ۲۰۲۶-۰۶-۲۸ میلادی)
 const konkorDate = new Date('2026-06-28'); // تاریخ دقیق
 const today = new Date();
 const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
 document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

 // شروع IndexedDB برای ذخیره محلی
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

 // تابع ذخیره داده (بروز شده)
 function saveData() {
     const lesson = document.getElementById('lesson').value;
     const subsection = document.getElementById('subsection').value;
     const activity = document.getElementById('activity').value;
     const testCount = document.getElementById('testCount').value;
     const testTime = document.getElementById('testTime').value;
     const studyTime = document.getElementById('studyTime').value;
     const generalLesson = document.getElementById('generalLesson').value;
     const generalSub = document.getElementById('generalSub').value;

     const tx = db.transaction('lessons', 'readwrite');
     const store = tx.objectStore('lessons');
     store.add({ lesson, subsection, activity, testCount, testTime, studyTime, generalLesson, generalSub, time: new Date().toLocaleString('fa-IR') });
     alert('ثبت شد!');
 }

 // تابع گزارش (بروز شده)
 function generateReport() {
     const tx = db.transaction('lessons', 'readonly');
     const store = tx.objectStore('lessons');
     const request = store.getAll();
     request.onsuccess = (event) => {
         const data = event.target.result;
         let output = '<p>تعداد ثبت‌ها: ' + data.length + '</p>';
         data.forEach(item => {
             output += '<p>درس: ' + item.lesson + ' - سرفصل: ' + item.subsection + ' - فعالیت: ' + item.activity + ' - تعداد تست: ' + item.testCount + ' - مدت تست: ' + item.testTime + ' دقیقه - ساعت مطالعه: ' + item.studyTime + ' - زمان: ' + item.time + '</p>';
             if (item.generalLesson) output += '<p>درس عمومی: ' + item.generalLesson + ' - مبحث: ' + item.generalSub + '</p>';
         });
         document.getElementById('reportOutput').innerHTML = output;
     };
 }
