// Получаем все элементы с классом 'target'
const targets = document.querySelectorAll('.target');

// Переменные для хранения состояния перетаскивания
let isDragging = false;
let isPinned = false;
let currentElement = null;
let offsetX, offsetY;
let originalPosition = {};

// Функция для начала перетаскивания
function startDrag(event) {
    if (isPinned) return; // Если элемент прикреплен, не начинаем перетаскивание

    isDragging = true;
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
    });
    
    target.addEventListener('mouseup', endDrag); // Для мыши
    target.addEventListener('touchend', endDrag); // Завершение перетаскивания при отпускании пальца
    
    target.addEventListener('dblclick', pinElement); // Для мыши и двойного касания на сенсорных экранах
});

// Обработчик нажатия клавиш и касаний для клавиатуры и сенсорного экрана
document.addEventListener('keydown', handleKeydown);
document.addEventListener('touchstart', handleKeydown); // Обработка второго пальца на сенсорном экране

