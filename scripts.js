document.getElementById('add').addEventListener('click', function() {
    const imageDisplay = document.getElementById('imageDisplay');
    const noImageText = document.getElementById('noImageText');
    
    // Пример добавления изображения
    const imageUrl = prompt("Введите URL изображения:");

    if (imageUrl) {
        // Добавляем изображение как фон
        imageDisplay.style.backgroundImage = `url(${imageUrl})`;
        imageDisplay.style.backgroundSize = "cover";
        imageDisplay.style.backgroundPosition = "center";
        
        // Скрываем текст "No image to display"
        noImageText.style.display = "none";
    }
});

document.getElementById('clear').addEventListener('click', function() {
    const imageDisplay = document.getElementById('imageDisplay');
    const noImageText = document.getElementById('noImageText');
    
    // Очищаем изображение
    imageDisplay.style.backgroundImage = "";
    
    // Показываем текст "No image to display"
    noImageText.style.display = "block";
});
