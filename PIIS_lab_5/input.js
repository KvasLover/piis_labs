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
    //if (isPinned) return; // Если элемент прикреплен, не начинаем перетаскивание

    isDragging = true;
    currentElement = event.target;

    // Сохраняем начальную позицию
    originalPosition = {
        top: currentElement.offsetTop,
        left: currentElement.offsetLeft
    };

    // Вычисляем смещение курсора относительно элемента
    offsetX = event.clientX - currentElement.getBoundingClientRect().left;
    offsetY = event.clientY - currentElement.getBoundingClientRect().top;

    // Добавляем обработчик движения мыши
    document.addEventListener('mousemove', drag);
}

// Функция для перетаскивания элемента
function drag(event) {
    if (!isDragging) return;

    // Перемещаем элемент
    currentElement.style.left = `${event.clientX - offsetX}px`;
    currentElement.style.top = `${event.clientY - offsetY}px`;
}

// Функция для завершения перетаскивания
function endDrag() {
    isDragging = false;
}

// Функция для прикрепления элемента к мыши
function pinElement(event) {
    if (isPinned) {
        // Если элемент уже прикреплен, отменяем прикрепление
        isPinned = false;
        currentElement.style.backgroundColor = 'red'; // Возвращаем цвет
        document.removeEventListener('mousemove', drag);
        return;
    }

    isPinned = true;
    currentElement = event.target;
    currentElement.style.backgroundColor = 'blue'; // Меняем цвет на синий

    // Добавляем обработчик движения мыши
    document.addEventListener('mousemove', pinDrag);
}

// Функция для перемещения прикрепленного элемента
function pinDrag(event) {
    if (!isPinned) return;

    // Перемещаем элемент за курсором
    currentElement.style.left = `${event.clientX - offsetX}px`;
    currentElement.style.top = `${event.clientY - offsetY}px`;
}

// Функция для обработки нажатия клавиши Esc
function handleKeydown(event) {
    if (event.key === 'Escape') {
        isDragging = false;
        isPinned = false;

        // Возвращаем элемент на исходную позицию
        currentElement.style.top = `${originalPosition.top}px`;
        currentElement.style.left = `${originalPosition.left}px`;
        currentElement.style.backgroundColor = 'red'; // Возвращаем цвет
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mousemove', pinDrag);
    }
}

// Добавляем обработчики событий для каждого элемента
targets.forEach(target => {
    target.addEventListener('mousedown', startDrag);
    target.addEventListener('dblclick', pinElement);
});

// Обработчик нажатия клавиш
document.addEventListener('keydown', handleKeydown);

// Обработчик отпускания мыши для завершения перетаскивания
document.addEventListener('mouseup', endDrag);
