import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyChFCfXM_yTnynYMRJF_F_mUMOH84Aax6I",
    authDomain: "unogramapp.firebaseapp.com",
    databaseURL: "https://unogramapp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "unogramapp",
    storageBucket: "unogramapp.appspot.com",
    messagingSenderId: "283870456952",
    appId: "1:283870456952:web:a1e0a4e978371524f6118d",
    measurementId: "G-S5YS8XYWWD"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let imageList = [];
let currentImageIndex = 0;
let recentImages = [];  // Массив для хранения последних 4 изображений
let currentImageUrl = ''; // Для хранения URL текущего изображения

// Функция для отображения изображения
function showImage(imagePath) {
    const imageDisplay = document.getElementById('imageDisplay');
    const noImageText = document.getElementById('noImageText');
    
    // Проверяем, есть ли путь изображения
    if (imagePath) {
        const imageRef = ref(storage, imagePath);
        getDownloadURL(imageRef).then(url => {
            imageDisplay.style.backgroundImage = `url(${url})`;
            noImageText.style.display = 'none';  // Скрыть текст
            currentImageUrl = url; // Сохраняем URL текущего изображения

            // Обновляем массив последних 4 изображений
            recentImages.push(imagePath);
            if (recentImages.length > 4) {
                recentImages.shift();  // Удаляем самое старое изображение, если больше 4
            }
        }).catch(error => {
            console.error('Ошибка загрузки изображения:', error);
            noImageText.style.display = 'block';  // Показываем текст, если ошибка
        });
    } else {
        imageDisplay.style.backgroundImage = '';
        noImageText.style.display = 'block';  // Показываем текст, если нет изображения
    }
}

// Открытие изображения в модальном окне
document.getElementById('fullscreen').addEventListener('click', () => {
    if (currentImageUrl) {
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modalImage');
        modal.style.display = 'block';
        modalImage.src = currentImageUrl;
    }
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Выбор и загрузка изображения
document.getElementById('add').addEventListener('click', () => {
    const imageDisplay = document.getElementById('imageDisplay');
    const noImageText = document.getElementById('noImageText');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, 'images/' + file.name);
            try {
                await uploadBytes(storageRef, file);
                console.log('Файл успешно загружен.');
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        }
    };
    input.click();
});

// Обновление изображения с проверкой на последние 4 изображения
document.getElementById('refresh').addEventListener('click', () => {
    const storageRef = ref(storage, 'images');
    listAll(storageRef).then(result => {
        imageList = result.items.map(item => item.fullPath);
        if (imageList.length > 0) {
            let newImageIndex;

            // Ищем новое изображение, которое не было в последних 4
            do {
                newImageIndex = Math.floor(Math.random() * imageList.length);
            } while (recentImages.includes(imageList[newImageIndex]) && imageList.length > 4);

            currentImageIndex = newImageIndex;
            showImage(imageList[currentImageIndex]);
        } else {
            console.log('Нет изображений в хранилище.');
            showImage(null);  // Показываем текст "No image to display"
        }
    }).catch(error => {
        console.error('Ошибка получения списка файлов:', error);
        showImage(null);  // Показываем текст "No image to display" в случае ошибки
    });
});

// Очистка экрана
document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('imageDisplay').style.backgroundImage = '';
    document.getElementById('noImageText').style.display = 'block';  // Показываем текст
});

// Показ следующего изображения
document.getElementById('next').addEventListener('click', () => {
    if (imageList.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % imageList.length;
        showImage(imageList[currentImageIndex]);
    }
});

// Показ предыдущего изображения
document.getElementById('back').addEventListener('click', () => {
    if (imageList.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
        showImage(imageList[currentImageIndex]);
    }
});
