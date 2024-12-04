
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let startX, startY;
let shapes = [];


function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        ctx.beginPath();
        if (shape.type === 'circle') {
            ctx.strokeStyle = 'purple';
            ctx.arc(shape.startX, shape.startY, shape.radius, 0, Math.PI * 2,);
        } else if (shape.type === 'rectangle') {
            ctx.strokeStyle = 'purple';
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
            
        }
        ctx.stroke();
    });
}

document.querySelectorAll('input[name="shape"]').forEach(input => {
    input.addEventListener('change', (e) => {
        currentShape = e.target.value;
    });
});

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const currentShape = document.querySelector('input[name="shape"]:checked').value;

    if (currentShape === 'circle') {
        const radius = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);
        drawShapes(); 
        ctx.beginPath();
        ctx.strokeStyle = '#purple';
        ctx.lineWidth = 4;
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentShape === 'rectangle') {
        drawShapes();
        ctx.strokeStyle = '#purple';
        ctx.lineWidth = 4;
        ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    }
});

canvas.addEventListener('mouseup', (e) => {
    drawing = false;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const currentShape = document.querySelector('input[name="shape"]:checked').value;

    if (currentShape === 'circle') {
        const radius = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);
        shapes.push({ type: 'circle', startX, startY, radius });
    } else if (currentShape === 'rectangle') {
        shapes.push({
            type: 'rectangle',
            startX,
            startY,
            width: currentX - startX,
            height: currentY - startY
        });
    }

    drawShapes();
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
});