// Получаем все элементы с классом 'target'
const targets = document.querySelectorAll('.target');

// Переменные для хранения состояния перетаскивания
let isDragging = false; // Флаг для отслеживания перетаскивания
let isPinned = false; // Флаг для отслеживания режима "следующий за пальцем"
let currentElement = null; // Текущий элемент
let offsetX, offsetY; // Смещения
let originalPosition = {}; // Исходные позиции

// Функция для начала перетаскивания
function startDrag(event) {
    if (isPinned) return; // Если элемент прикреплен, не начинаем перетаскивание

    isDragging = true;

    // Проверяем, был ли клик на элементе или вне его
    
        currentElement = event.target;

        // Сохраняем начальную позицию
        originalPosition = {
            top: currentElement.offsetTop,
            left: currentElement.offsetLeft
        };

        // Вычисляем смещение курсора относительно элемента
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        offsetX = clientX - currentElement.getBoundingClientRect().left;
        offsetY = clientY - currentElement.getBoundingClientRect().top;
    

    // Добавляем обработчики движения мыши и касания
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag); // Для сенсорных экранов
}

// Функция для перетаскивания элемента
function drag(event) {
    if (!isDragging) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // Перемещаем элемент
    currentElement.style.left = `${clientX - offsetX}px`;
    currentElement.style.top = `${clientY - offsetY}px`;
}

// Функция для завершения перетаскивания
function endDrag() {
    isDragging = false;
}

// Функция для прикрепления элемента к мыши или пальцу
function pinElement(event) {
    if (isPinned) {
        // Если элемент уже прикреплен, отменяем прикрепление
        isPinned = false;
        currentElement.style.backgroundColor = 'red'; // Возвращаем цвет
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag); // Удаляем обработчик touchmove
        return;
    }

    isPinned = true;
    currentElement = event.target;
    currentElement.style.backgroundColor = 'blue'; // Меняем цвет на синий

    // Добавляем обработчик движения мыши для режима "следующий за пальцем"
    document.addEventListener('mousemove', pinDrag);
}

// Функция для перемещения прикрепленного элемента
function pinDrag(event) {
    if (!isPinned) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // Перемещаем элемент за курсором или пальцем
    currentElement.style.left = `${clientX - offsetX}px`;
    currentElement.style.top = `${clientY - offsetY}px`;
}

// Функция для обработки двойного касания и перехода в режим следования
function handleDoubleTouch(event) {
    if (event.touches.length === 2) {  // Проверяем, что два пальца на экране
        isPinned = true;  // Включаем режим следования

        const clientX = event.touches[0].clientX;  // Получаем координаты первого касания
        const clientY = event.touches[0].clientY;

        // Телепортируем элемент к месту касания (например, к первому элементу)
        currentElement = targets[0];  // Здесь можно выбрать любой элемент или добавить логику выбора
        currentElement.style.left = `${clientX}px`;
        currentElement.style.top = `${clientY}px`;

        originalPosition.top = clientY;  // Сохраняем новую позицию как исходную
        originalPosition.left = clientX;
        
        offsetX = 0;  // Обнуляем смещения, так как мы телепортировались
        offsetY = 0;

        document.addEventListener('touchmove', pinDrag);  // Добавляем обработчик перемещения для режима следования
    }
}

// Функция для обработки нажатия клавиши Esc или второго пальца
function handleKeydown(event) {
    if (event.key === 'Escape' || (event.touches && event.touches.length > 1)) {
        isDragging = false;
        isPinned = false;

        // Возвращаем элемент на исходную позицию
        currentElement.style.top = `${originalPosition.top}px`;
        currentElement.style.left = `${originalPosition.left}px`;
        currentElement.style.backgroundColor = 'red'; // Возвращаем цвет

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag); // Удаляем обработчик touchmove
    }
}

// Добавляем обработчики событий для каждого элемента
targets.forEach(target => {
    target.addEventListener('mousedown', startDrag); // Для мыши
    target.addEventListener('touchstart', (event) => {
        startDrag(event); // Начинаем перетаскивание при касании
        event.preventDefault(); // Предотвращаем стандартное поведение браузера
        
        handleDoubleTouch(event);  // Обрабатываем двойное касание при каждом touchstart 
    });

    target.addEventListener('mouseup', endDrag); // Для мыши
    target.addEventListener('touchend', endDrag); // Завершение перетаскивания при отпускании пальца
    
});

// Обработчик нажатия клавиш и касаний для клавиатуры и сенсорного экрана
document.addEventListener('keydown', handleKeydown);
document.addEventListener('touchstart', handleKeydown); // Обработка второго пальца на сенсорном экране

