document.addEventListener('DOMContentLoaded', function() {
    // Input alanlarını seç
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calorieForm = document.getElementById('calorieCalculator');
    const resultSection = document.getElementById('resultSection');
    
    // Input kontrolü için fonksiyon
    function validateInput(input, min, max) {
        let value = parseFloat(input.value);
        if (isNaN(value)) return;
        
        if (value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }

    // Input event listeners - değer değiştiğinde kontrol et
    ageInput.addEventListener('change', function() {
        validateInput(this, 1, 120);
    });
    
    weightInput.addEventListener('change', function() {
        validateInput(this, 20, 300);
    });
    
    heightInput.addEventListener('change', function() {
        validateInput(this, 100, 250);
    });
    
    // Form submit olayını dinle
    calorieForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        calculateCalories();
    });
    
    // Kalori hesaplama fonksiyonu
    function calculateCalories() {
        // Form verilerini al
        const age = parseFloat(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activityLevel = document.getElementById('activityLevel').value;

        // Değerlerin geçerliliğini kontrol et
        if (!age || !gender || !weight || !height || !activityLevel) {
            alert('Lütfen tüm alanları doldurunuz.');
            return;
        }

        // BMR (Bazal Metabolizma Hızı) hesaplama - Harris-Benedict formülü
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Aktivite seviyesine göre kalori hesaplama
        let calories;
        switch(activityLevel) {
            case 'sedentary':
                calories = bmr * 1.2;
                break;
            case 'lightlyActive':
                calories = bmr * 1.375;
                break;
            case 'moderatelyActive':
                calories = bmr * 1.55;
                break;
            case 'veryActive':
                calories = bmr * 1.725;
                break;
            default:
                calories = bmr * 1.2;
        }

        // Makrobesin hesaplamaları
        const protein = weight * 2.2; // Günlük protein ihtiyacı (gram)
        const fat = (calories * 0.25) / 9; // Günlük yağ ihtiyacı (gram)
        const carbs = (calories - ((protein * 4) + (fat * 9))) / 4; // Günlük karbonhidrat ihtiyacı (gram)

        // Sonuçları göster
        document.getElementById('caloriesResult').textContent = Math.round(calories);
        document.getElementById('proteinResult').textContent = Math.round(protein);
        document.getElementById('carbsResult').textContent = Math.round(carbs);
        document.getElementById('fatResult').textContent = Math.round(fat);

        // Sonuç bölümünü görünür yap
        resultSection.style.display = 'block';

        // Sayfayı sonuçlara doğru kaydır
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // Önerileri göster
        showRecommendations(calories, protein, carbs, fat, weight, height);
    }

    // Navbar scroll efekti
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Sayfa geçiş animasyonu
    const loader = document.querySelector(".loader-wrapper");
    
    if (loader) {
        setTimeout(function() {
            loader.classList.add("fade-out");
            setTimeout(function() {
                loader.style.display = "none";
            }, 300);
        }, 1000);
    }

    // Navbar link tıklama olayları
    document.querySelectorAll('.navbar-nav a, .navbar-brand').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) {
                e.preventDefault();
                
                if (loader) {
                    loader.style.display = "flex";
                    loader.classList.remove("fade-out");
                }
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
});

function showRecommendations(calories, protein, carbs, fat, weight, height) {
    const bmi = weight / ((height/100) * (height/100));
    let programRecommendation = '';
    let nutritionRecommendation = '';
    let supplementRecommendation = '';

    // Program önerisi
    if (bmi > 25) {
        programRecommendation = `
            <p>Kilo verme odaklı programımızı öneriyoruz:</p>
            <ul>
                <li>HIIT Antrenmanları</li>
                <li>Kardiyo Egzersizleri</li>
                <li>Temel Kuvvet Antrenmanı</li>
            </ul>
            <div class="mt-3">
                <a href="ProgramlarDetay.html" class="btn btn-sm btn-success">Program Detayı</a>
            </div>
        `;
    } else if (bmi < 18.5) {
        programRecommendation = `
            <p>Kilo alma ve kas kazanma programımızı öneriyoruz:</p>
            <ul>
                <li>Kuvvet Antrenmanı</li>
                <li>Hipertrofi Antrenmanı</li>
                <li>Beslenme Programı</li>
            </ul>
            <div class="mt-3">
                <a href="ProgramlarDetay.html" class="btn btn-sm btn-success">Program Detayı</a>
            </div>
        `;
    } else {
        programRecommendation = `
            <p>Genel fitness programımızı öneriyoruz:</p>
            <ul>
                <li>Karma Antrenman Programı</li>
                <li>Fonksiyonel Fitness</li>
                <li>Mobilite Çalışmaları</li>
            </ul>
            <div class="mt-3">
                <a href="ProgramlarDetay.html" class="btn btn-sm btn-success">Program Detayı</a>
            </div>
        `;
    }

    // Beslenme önerisi
    nutritionRecommendation = `
        <p>Günlük ${Math.round(calories)} kalori için beslenme önerileri:</p>
        <ul>
            <li><strong>${Math.round(protein)}g protein</strong> (${Math.round(protein * 4)} kcal)</li>
            <li><strong>${Math.round(carbs)}g karbonhidrat</strong> (${Math.round(carbs * 4)} kcal)</li>
            <li><strong>${Math.round(fat)}g yağ</strong> (${Math.round(fat * 9)} kcal)</li>
        </ul>
        <div class="mt-3">
            <a href="Beslenme.html" class="btn btn-sm btn-success">Beslenme Rehberi</a>
        </div>
    `;

    // Supplement önerisi
    supplementRecommendation = `
        <p>Önerilen temel supplementler:</p>
        <ul>
            <li><strong>Whey Protein</strong> (günde ${Math.round(protein/4)}g)</li>
            <li><strong>Multivitamin</strong></li>
            <li><strong>Omega-3</strong></li>
        </ul>
        <div class="alert alert-info mt-3 mb-0" role="alert">
            <i class="fas fa-info-circle mr-2"></i>
            <small>Supplement kullanımı için doktorunuza danışınız.</small>
        </div>
    `;

    // Önerileri DOM'a ekle
    document.getElementById('programRecommendation').innerHTML = programRecommendation;
    document.getElementById('nutritionRecommendation').innerHTML = nutritionRecommendation;
    document.getElementById('supplementRecommendation').innerHTML = supplementRecommendation;
}