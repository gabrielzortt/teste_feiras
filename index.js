// ===== SISTEMA CIENTÍFICO DE CÁLCULO =====

// Fatores de emissão baseados em IPCC e dados científicos
const EMISSION_FACTORS = {
    TRANSPORT: {
        CAR: {
            electric: 0.0,
            hybrid: 0.08,
            small: 0.12,
            medium: 0.18,
            large: 0.25,
            suv: 0.32
        },
        FUEL: {
            gasoline: 2.31,
            ethanol: 1.51,
            diesel: 2.68,
            cng: 1.88
        },
        FLIGHTS: {
            short: 250,
            long: 800
        },
        PUBLIC: {
            bus: 0.1,
            metro: 0.05,
            train: 0.03
        }
    },

    ENERGY: {
        gridMix: 0.5,
        renewable: 0.05,
        fossil: 0.9
    },

    CONSUMPTION: {
        DIET: {
            vegan: 1.5,
            vegetarian: 1.8,
            pescatarian: 2.2,
            lowMeat: 2.7,
            mediumMeat: 3.5,
            highMeat: 5.0
        },
        GOODS: {
            per1000BRL: 0.5
        }
    }
};

// 1. Navegação Responsiva
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Scroll para header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Ativar link ativo
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// 2. Sistema de Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Atualizar tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// 3. Sistema de Sliders
const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => {
    const valueId = slider.id + 'Value';
    const valueElement = document.getElementById(valueId);

    updateSliderValue(slider, valueElement);

    slider.addEventListener('input', () => {
        updateSliderValue(slider, valueElement);
    });
});

function updateSliderValue(slider, valueElement) {
    let value = parseInt(slider.value);
    let formattedValue = value.toLocaleString('pt-BR');

    if (slider.id === 'carDistance') {
        valueElement.textContent = `${formattedValue} km`;
    } else if (slider.id === 'publicTransport') {
        valueElement.textContent = `${formattedValue} km/semana`;
    } else if (slider.id === 'flightsShort') {
        valueElement.textContent = `${value} voos/ano`;
    } else if (slider.id === 'flightsLong') {
        valueElement.textContent = `${value} voos/ano`;
    } else if (slider.id === 'electricity') {
        valueElement.textContent = `${formattedValue} kWh`;
    } else if (slider.id === 'shopping') {
        valueElement.textContent = `R$ ${formattedValue}`;
    }
}

// 4. Sistema de Cálculo Científico
const calculator = document.getElementById('carbonCalculator');
const resultsPanel = document.getElementById('resultsPanel');
const totalScore = document.getElementById('totalScore');
const scoreCategory = document.getElementById('scoreCategory');
const categoryChart = document.getElementById('categoryChart');
const comparisonChart = document.getElementById('comparisonChart');
const recommendationsList = document.getElementById('recommendationsList');

calculator.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const data = collectFormData();

    // Calcular emissões por categoria
    const transportEmissions = calculateTransportEmissions(data);
    const energyEmissions = calculateEnergyEmissions(data);
    const consumptionEmissions = calculateConsumptionEmissions(data);
    const lifestyleEmissions = calculateLifestyleEmissions(data);

    // Calcular total
    const totalEmissions = transportEmissions + energyEmissions +
        consumptionEmissions + lifestyleEmissions;

    // Ajustar para toneladas com 1 casa decimal
    const finalEmissions = Math.max(0, totalEmissions).toFixed(1);

    // Atualizar UI
    totalScore.textContent = finalEmissions;

    // Definir categoria
    updateScoreCategory(finalEmissions);

    // Atualizar gráficos
    updateCategoryChart(transportEmissions, energyEmissions,
        consumptionEmissions, lifestyleEmissions);
    updateComparisonChart(finalEmissions);

    // Gerar recomendações
    generateRecommendations(data, finalEmissions);

    // Mostrar resultados
    resultsPanel.classList.add('active');

    // Scroll para resultados
    setTimeout(() => {
        resultsPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
});

function collectFormData() {
    return {
        carType: document.getElementById('carType').value,
        carDistance: parseInt(document.getElementById('carDistance').value),
        fuelType: document.getElementById('fuelType').value,
        publicTransport: parseInt(document.getElementById('publicTransport').value),
        flightsShort: parseInt(document.getElementById('flightsShort').value),
        flightsLong: parseInt(document.getElementById('flightsLong').value),

        electricity: parseInt(document.getElementById('electricity').value),
        energySource: document.getElementById('energySource').value,
        heating: document.getElementById('heating').value,
        appliances: document.getElementById('appliances').value,
        lighting: document.getElementById('lighting').value,
        solar: document.getElementById('solar').value,

        diet: document.getElementById('diet').value,
        foodWaste: document.getElementById('foodWaste').value,
        foodOrigin: document.getElementById('foodOrigin').value,
        shopping: parseInt(document.getElementById('shopping').value),
        electronics: document.getElementById('electronics').value,
        clothing: document.getElementById('clothing').value,

        houseSize: document.getElementById('houseSize').value,
        houseType: document.getElementById('houseType').value,
        residents: parseInt(document.getElementById('residents').value),
        recycling: parseInt(document.getElementById('recycling').value),
        waterSaving: document.getElementById('waterSaving').value,
        garden: document.getElementById('garden').value
    };
}

function calculateTransportEmissions(data) {
    let emissions = 0;

    // Emissões do carro (baseado em consumo médio 15 km/L)
    const fuelConsumption = data.carDistance / 15;
    const fuelFactor = EMISSION_FACTORS.TRANSPORT.FUEL[data.fuelType] || 2.31;
    emissions += fuelConsumption * fuelFactor;

    // Voos
    emissions += data.flightsShort * EMISSION_FACTORS.TRANSPORT.FLIGHTS.short;
    emissions += data.flightsLong * EMISSION_FACTORS.TRANSPORT.FLIGHTS.long;

    // Transporte público (assumindo ônibus)
    emissions += data.publicTransport * 52 * EMISSION_FACTORS.TRANSPORT.PUBLIC.bus;

    return emissions / 1000;
}

function calculateEnergyEmissions(data) {
    let emissions = 0;

    const sourceFactors = {
        'renewable': EMISSION_FACTORS.ENERGY.renewable,
        'mixed': EMISSION_FACTORS.ENERGY.gridMix,
        'fossil': EMISSION_FACTORS.ENERGY.fossil
    };

    const annualElectricity = data.electricity * 12;
    emissions += annualElectricity * sourceFactors[data.energySource];

    // Ajustes
    if (data.heating === 'inefficient') emissions += 0.5;
    if (data.heating === 'efficient') emissions -= 0.2;

    if (data.appliances === 'inefficient') emissions += 0.3;
    if (data.appliances === 'efficient') emissions -= 0.2;

    if (data.lighting === 'incandescent') emissions += 0.2;
    if (data.lighting === 'led') emissions -= 0.1;

    if (data.solar === 'yes') emissions *= 0.7;

    return emissions / 1000;
}

function calculateConsumptionEmissions(data) {
    let emissions = 0;

    const dietFactors = {
        'vegan': 1.5,
        'vegetarian': 1.8,
        'pescatarian': 2.2,
        'low-meat': 2.7,
        'medium-meat': 3.5,
        'high-meat': 5.0
    };
    emissions += dietFactors[data.diet] || 2.7;

    const wasteFactors = {
        'none': 0.9,
        'low': 1,
        'medium': 1.2,
        'high': 1.4
    };
    emissions *= wasteFactors[data.foodWaste] || 1;

    const originFactors = {
        'local': 0.8,
        'mixed': 1,
        'imported': 1.3
    };
    emissions *= originFactors[data.foodOrigin] || 1;

    const annualShopping = data.shopping * 12;
    emissions += (annualShopping / 1000) * 0.5;

    const electronicFactors = {
        'rare': 0.2,
        'occasional': 0.5,
        'frequent': 1,
        'always': 1.5
    };
    emissions += electronicFactors[data.electronics] || 0.5;

    const clothingFactors = {
        'minimal': 0.3,
        'moderate': 0.7,
        'high': 1.2,
        'excessive': 2.0
    };
    emissions += clothingFactors[data.clothing] || 0.7;

    return emissions;
}

function calculateLifestyleEmissions(data) {
    let emissions = 0;

    const sizeFactors = {
        'small': 1,
        'medium': 1.5,
        'large': 2.5,
        'xlarge': 3.5
    };
    emissions += sizeFactors[data.houseSize] || 1.5;

    const typeFactors = {
        'efficient': 0.8,
        'standard': 1,
        'inefficient': 1.3
    };
    emissions *= typeFactors[data.houseType] || 1;

    emissions /= data.residents || 3;

    const recyclingFactor = 1 - (data.recycling / 200);
    emissions *= recyclingFactor;

    if (data.waterSaving === 'high') emissions *= 0.95;
    if (data.waterSaving === 'low') emissions *= 1.05;

    if (data.garden === 'large') emissions -= 0.3;

    return Math.max(emissions, 0);
}

function updateScoreCategory(emissions) {
    let category = '';
    let className = '';

    if (emissions < 2) {
        category = 'Baixa Emissão';
        className = 'category-low';
    } else if (emissions < 4) {
        category = 'Média Baixa';
        className = 'category-medium';
    } else if (emissions < 7) {
        category = 'Média Alta';
        className = 'category-high';
    } else if (emissions < 10) {
        category = 'Alta Emissão';
        className = 'category-high';
    } else {
        category = 'Muito Alta';
        className = 'category-critical';
    }

    scoreCategory.textContent = category;
    scoreCategory.className = `score-category ${className}`;
}

// 5. Gráficos Científicos
function updateCategoryChart(transport, energy, consumption, lifestyle) {
    categoryChart.innerHTML = '';

    const categories = [
        { name: 'Transporte', value: transport, color: '#43A047' },
        { name: 'Energia', value: energy, color: '#FF7043' },
        { name: 'Consumo', value: consumption, color: '#5C6BC0' },
        { name: 'Estilo de Vida', value: lifestyle, color: '#8E24AA' }
    ];

    const maxValue = Math.max(...categories.map(c => c.value), 1);
    const chartHeight = 200;

    categories.forEach(category => {
        if (category.value <= 0) return;

        const barHeight = (category.value / maxValue) * chartHeight;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = barHeight + 'px';
        bar.style.background = category.color;

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = category.value.toFixed(1) + 't';
        bar.appendChild(value);

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = category.name;
        bar.appendChild(label);

        categoryChart.appendChild(bar);
    });
}

function updateComparisonChart(userEmissions) {
    comparisonChart.innerHTML = '';

    const comparisons = [
        { name: 'Sua Pegada', value: parseFloat(userEmissions), color: '#009688' },
        { name: 'Meta Sustentável', value: 2.0, color: '#4CAF50' },
        { name: 'Média Brasil', value: 2.7, color: '#FF9800' },
        { name: 'Média Global', value: 4.8, color: '#FF7043' },
        { name: 'Média EUA', value: 16.0, color: '#F44336' }
    ];

    const maxValue = Math.max(...comparisons.map(c => c.value), 1);
    const chartHeight = 200;

    comparisons.forEach(comp => {
        const barHeight = (comp.value / maxValue) * chartHeight;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = barHeight + 'px';
        bar.style.background = comp.color;

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = comp.value.toFixed(1) + 't';
        bar.appendChild(value);

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = comp.name;
        bar.appendChild(label);

        comparisonChart.appendChild(bar);
    });
}

// 6. Recomendações Científicas
function generateRecommendations(data, emissions) {
    recommendationsList.innerHTML = '';

    const recommendations = [];

    // Transporte
    if (data.carDistance > 20000) {
        recommendations.push({
            icon: '🚗',
            title: 'Reduzir Quilometragem',
            description: 'Considere home office, transporte público ou caronas para reduzir 30% das emissões do carro.',
            impact: 'Redução de 0.5-1.0t/ano',
            priority: 'Alta'
        });
    }

    if (data.carType !== 'electric' && data.carType !== 'hybrid') {
        recommendations.push({
            icon: '⚡',
            title: 'Transição para Veículo Elétrico',
            description: 'Um veículo elétrico pode reduzir suas emissões de transporte em até 70%.',
            impact: 'Redução de 1.0-2.0t/ano',
            priority: 'Média'
        });
    }

    // Energia
    if (data.energySource !== 'renewable') {
        recommendations.push({
            icon: '☀️',
            title: 'Energia Renovável',
            description: 'Mude para um fornecedor de energia renovável ou instale painéis solares.',
            impact: 'Redução de 0.8-1.5t/ano',
            priority: 'Alta'
        });
    }

    if (data.appliances !== 'efficient') {
        recommendations.push({
            icon: '💡',
            title: 'Eletrodomésticos Eficientes',
            description: 'Substitua eletrodomésticos antigos por modelos com classificação A+++.',
            impact: 'Redução de 0.3-0.8t/ano',
            priority: 'Média'
        });
    }

    // Consumo
    if (data.diet === 'high-meat' || data.diet === 'medium-meat') {
        recommendations.push({
            icon: '🥦',
            title: 'Dieta com Menos Carne',
            description: 'Reduza o consumo de carne vermelha para 1-2 vezes por semana.',
            impact: 'Redução de 0.5-1.2t/ano',
            priority: 'Alta'
        });
    }

    if (data.foodWaste === 'medium' || data.foodWaste === 'high') {
        recommendations.push({
            icon: '♻️',
            title: 'Reduzir Desperdício',
            description: 'Planeje compras, armazene corretamente e aproveite sobras.',
            impact: 'Redução de 0.2-0.5t/ano',
            priority: 'Média'
        });
    }

    // Estilo de Vida
    if (data.recycling < 75) {
        recommendations.push({
            icon: '♻️',
            title: 'Aumentar Reciclagem',
            description: 'Separe resíduos recicláveis e encaminhe para coleta seletiva.',
            impact: 'Redução de 0.1-0.3t/ano',
            priority: 'Baixa'
        });
    }

    // Mostrar até 6 recomendações
    const recsToShow = recommendations.slice(0, 6);

    recsToShow.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';

        const priorityColors = {
            'Alta': '#F44336',
            'Média': '#FF9800',
            'Baixa': '#4CAF50'
        };

        card.innerHTML = `
                    <div class="rec-icon">${rec.icon}</div>
                    <h4>${rec.title}</h4>
                    <p style="font-size: 0.875rem;">${rec.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
                        <span class="rec-impact" style="background: ${priorityColors[rec.priority]}; font-size: 0.75rem;">${rec.impact}</span>
                        <span style="font-size: 0.75rem; color: ${priorityColors[rec.priority]}; font-weight: 600;">
                            Prioridade ${rec.priority}
                        </span>
                    </div>
                `;

        recommendationsList.appendChild(card);
    });
}

// 7. Funções Auxiliares
function resetCalculator() {
    if (confirm('Deseja iniciar uma nova análise? Todos os dados atuais serão perdidos.')) {
        calculator.reset();
        resultsPanel.classList.remove('active');

        // Resetar sliders
        sliders.forEach(slider => {
            const valueId = slider.id + 'Value';
            const valueElement = document.getElementById(valueId);
            updateSliderValue(slider, valueElement);
        });

        // Scroll para topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 8. Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gráficos vazios
    updateCategoryChart(0, 0, 0, 0);
    updateComparisonChart(0);

    // Verificar se há hash na URL
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    // Prevenir envio do formulário com Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.type !== 'submit' && e.target.type !== 'textarea') {
            e.preventDefault();
        }
    });
});

// 9. Acessibilidade
document.addEventListener('keydown', (e) => {
    // Fechar menu com ESC
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    // Navegação por teclado nos tabs
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(activeTab);
            let nextIndex;

            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }

            tabs[nextIndex].click();
            tabs[nextIndex].focus();
        }
    }
});