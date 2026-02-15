// ===== CARBON ANALYST PRO | SEEG PESSOAS =====
// Este arquivo implementa as fórmulas da planilha SEEG_Pessoas__V1__18.11.2021.xlsx

// 1) Constantes (extraídas da planilha SEEG Pessoas)
const INCOME_FACTORS = {"Até 350 reais":0.15625,"De 350 a 550 reais":0.390625,"De 550 a 700 reais":0.46875,"De 700 a 900 reais":0.625,"De 900 a 1.100 reais":0.703125,"De 1.100 a 1.350 reais":0.78125,"De 1.350 a 1.650 reais":1.015625,"De 1.650 a 2.200 reais":1.171875,"De 2.200 a 4.450 reais":1.5625,"Mais de 4.450 reais":3.125,"Desconsiderar renda":1};

const STATE_FACTORS = {"bus":{"AC":38.90738618590239,"AL":37.23832785054568,"AM":39.651422342757684,"AP":40.95292136016681,"BA":75.02686734975244,"CE":39.60262643160233,"DF":44.66274425388414,"ES":88.84006437006056,"GO":140.63054603975442,"MA":51.59275234705937,"MG":111.52159091170397,"MS":173.28144066507707,"MT":292.7582370874207,"PA":91.74702885595897,"PB":38.76725603531838,"PE":51.63707228192948,"PI":58.65013543730735,"PR":172.85090543925656,"RJ":46.5931599041435,"RN":45.11323991297024,"RO":161.15694623895124,"RR":50.993096650742835,"RS":115.32951979172672,"SC":130.99620847234803,"SE":49.27171646717289,"SP":92.23721158682616,"TO":236.62477823479975},"commerce":{"AC":0.9773612781794946,"AL":3.7497750274989077,"AM":3.9747300846106493,"AP":0.04174919674901554,"BA":4.598202331887684,"CE":3.727556399676313,"DF":13.117147349929967,"ES":6.759768631215604,"GO":6.629988263052182,"MA":1.2244247346910293,"MG":6.239195816893891,"MS":6.82759093227896,"MT":5.092317329556157,"PA":1.4204011332598292,"PB":2.99392180770497,"PE":4.880526263721302,"PI":1.4792139998480973,"PR":17.640478728595525,"RJ":15.08404457269966,"RN":5.537564760074471,"RO":1.8126230765690954,"RR":0.3361299944494499,"RS":10.591606006274437,"SC":11.372745961691207,"SE":4.815884658340434,"SP":15.082099090626711,"TO":2.2714921270661983},"publicBuildings":{"AC":0.3098539456499132,"AL":1.0332279950791468,"AM":2.1194381170620678,"AP":1.1162933642006068,"BA":1.2604809024618315,"CE":0.5151695248991958,"DF":17.519728635913037,"ES":0.9135838532559878,"GO":0.6370615308678503,"MA":0.229764406788354,"MG":1.4080952149813009,"MS":1.912094907939611,"MT":0.06458093634201485,"PA":0.6803520225120014,"PB":0.48415163612303186,"PE":0.48799089373117216,"PI":7.084651734494555,"PR":1.1952260900458025,"RJ":3.3634182999684414,"RN":0.6818633485371165,"RO":0.41261888708013983,"RR":0.2912098273609542,"RS":8.765474189059667,"SC":1.211460773772799,"SE":1.4823672013304838,"SP":11.218557450726191,"TO":0.10072123479996378},"cement":{"AC":97.3329783766622,"AL":128.19214703576654,"AM":33.09531131792346,"AP":156.56330340024965,"BA":33.94641874517336,"CE":105.53326114883899,"DF":312.0539053526345,"ES":96.35648729551772,"GO":380.2201835638383,"MA":18.163089661793627,"MG":423.49629496521055,"MS":346.0924841457507,"MT":132.08188021699172,"PA":41.852997344387525,"PB":463.799429079027,"PE":15.6249004010374,"PI":97.17748403332304,"PR":274.40384520307646,"RJ":115.21148011347412,"RN":97.1399513549866,"RO":46.461269223490866,"RR":97.09353748812443,"RS":45.198323088333176,"SC":76.34220436959885,"SE":678.0221135482875,"SP":99.1715249475987,"TO":149.69593076888646}};

const WASTE_FACTORS = {"AC":{"eff_dom":0.10503268381456683,"solid":0.3554388928889317,"eff_ind":0.007684239768236888},"AL":{"eff_dom":0.11605830601880471,"solid":0.3354540733880133,"eff_ind":0.0008554673653432941},"AM":{"eff_dom":0.12238922143696962,"solid":0.43832922718421113,"eff_ind":0.010784401957536523},"AP":{"eff_dom":0.11583588635157041,"solid":0.283010791847526,"eff_ind":0.0008560641622454421},"BA":{"eff_dom":0.12551892468155856,"solid":0.2741170212136517,"eff_ind":0.000855506303206925},"CE":{"eff_dom":0.14370661310602034,"solid":0.32109132225984055,"eff_ind":0.0008555555482552821},"DF":{"eff_dom":0.11787509435313875,"solid":0.39270771287991646,"eff_ind":0.04080002175594342},"ES":{"eff_dom":0.11239222126833638,"solid":0.35258432558197406,"eff_ind":0.0008555111791273189},"GO":{"eff_dom":0.13713229626205803,"solid":0.25849551048579195,"eff_ind":0.000855471240122684},"MA":{"eff_dom":0.11800249350511316,"solid":0.2289562627443736,"eff_ind":0.04421653665114716},"MG":{"eff_dom":0.10500174525791293,"solid":0.28263286268922966,"eff_ind":0.009152908165610403},"MS":{"eff_dom":0.11878901153154424,"solid":0.2445467519447741,"eff_ind":0.10949605359652766},"MT":{"eff_dom":0.11887043811017241,"solid":0.23559104895843438,"eff_ind":0.0008555112892477642},"PA":{"eff_dom":0.11822189468275976,"solid":0.2892815358604372,"eff_ind":0.0008555289429742301},"PB":{"eff_dom":0.10783432181212789,"solid":0.29269756779713535,"eff_ind":0.0008556225325879446},"PE":{"eff_dom":0.1067596965639368,"solid":0.3140802239514596,"eff_ind":0.01755380911159915},"PI":{"eff_dom":0.11975979667771285,"solid":0.2988778352372139,"eff_ind":0.10357912848696409},"PR":{"eff_dom":0.12172059069314324,"solid":0.31970620494724616,"eff_ind":0.021045295167718404},"RJ":{"eff_dom":0.11896430819377742,"solid":0.47756694012832823,"eff_ind":0.0008554908058485916},"RN":{"eff_dom":0.1120326400907024,"solid":0.2978915854186075,"eff_ind":0.000855467851090422},"RO":{"eff_dom":0.1089259941763142,"solid":0.30034238771117894,"eff_ind":0.0008552659342514313},"RR":{"eff_dom":0.14346582232926847,"solid":0.514130160244717,"eff_ind":0.21625360496961674},"RS":{"eff_dom":0.1309311512221902,"solid":0.27672645357981845,"eff_ind":0.024152520659889452},"SC":{"eff_dom":0.13114079579186433,"solid":0.26484272807513637,"eff_ind":0.0008555731167481858},"SE":{"eff_dom":0.10909489554077616,"solid":0.3003572460212225,"eff_ind":0.0008557025374386173},"SP":{"eff_dom":0.11486411663272904,"solid":0.27552378099119607,"eff_ind":0.0008555055223377993},"TO":{"eff_dom":0.11178129605446363,"solid":0.291574107393764,"eff_ind":0.0008557626650967089}};

const EF = {"fuel":{"gasoline":1.62609244969273,"ethanol":0,"diesel":2.33564547092433,"gnv":2.066939424},"flights":{"domestic":106.05364726623189,"international":605.565693173648},"electricity":0.085336150706535,"glp_botijao":38.0151807326087,"piped_gas":2.066939424,"cargo":483.19008318726924,"fuel_production":295.88907826875186,"other_industries":624.9528651315651,"ethanol_blend_ratio":0.272154740079717};
const LAND = {"beef":0.15213,"chicken":0.00064,"pork":0.00521,"milk":0.0017,"eggs":6e-05,"rice":0.00149,"beans":0.00091,"ethanol":0.000471,"pecuaria_other":0.04547380317479956,"agri_other":1.6972110848530524,"tree":-0.0134022222222};
const ABATEMENTS = {"recycling":0.028931349881660285,"composting":0.0041975};

// 2) Helpers
function clampNumber(n, min=0) {
    const x = Number(n);
    if (!Number.isFinite(x)) return min;
    return Math.max(min, x);
}

function safeDiv(n, d) {
    const nn = Number(n);
    const dd = Number(d);
    if (!Number.isFinite(nn) || !Number.isFinite(dd) || dd === 0) return 0;
    return nn / dd;
}

function getIncomeFactor(incomeLabel) {
    return INCOME_FACTORS[incomeLabel] ?? 1;
}

function getStateFactor(bucket, uf) {
    const v = (STATE_FACTORS[bucket] || {})[uf];
    return (typeof v === 'number' && Number.isFinite(v)) ? v : 0;
}

function getWasteFactor(uf) {
    return WASTE_FACTORS[uf] || { eff_dom: 0, solid: 0, eff_ind: 0 };
}

// 3) Navegação responsiva (mantida)
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });
});

// 4) Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const content = document.getElementById(`${tabId}-tab`);
        if (content) content.classList.add('active');
    });
});

// 5) Sistema de cálculo (SEEG)
const calculator = document.getElementById('carbonCalculator');
const resultsPanel = document.getElementById('resultsPanel');
const totalScore = document.getElementById('totalScore');
const scoreCategory = document.getElementById('scoreCategory');
const categoryChart = document.getElementById('categoryChart');
const comparisonChart = document.getElementById('comparisonChart');
const recommendationsList = document.getElementById('recommendationsList');

if (calculator) {
    calculator.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = collectFormData();

        const energyIndustry = calculateEnergyIndustry(data); // tCO2e/ano
        const landUse = calculateLandUse(data);               // tCO2e/ano
        const waste = calculateWaste(data);                   // tCO2e/ano

        const total = energyIndustry + landUse + waste;
        const finalEmissions = Math.max(0, total);
        const finalText = finalEmissions.toFixed(3);

        if (totalScore) totalScore.textContent = finalText;
        updateScoreCategory(finalEmissions);

        updateCategoryChart(energyIndustry, landUse, waste);
        updateComparisonChart(finalEmissions);
        generateRecommendations({...data, energyIndustry, landUse, waste}, finalEmissions);

        if (resultsPanel) resultsPanel.classList.add('active');
        setTimeout(() => {
            if (resultsPanel) resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

function collectFormData() {
    return {
        state: document.getElementById('state')?.value || 'SP',
        income: document.getElementById('income')?.value || 'Desconsiderar renda',

        vehicleOccupancy: clampNumber(document.getElementById('vehicleOccupancy')?.value, 1),
        gasoline: clampNumber(document.getElementById('gasoline')?.value, 0),
        ethanol: clampNumber(document.getElementById('ethanol')?.value, 0),
        diesel: clampNumber(document.getElementById('diesel')?.value, 0),
        gnv: clampNumber(document.getElementById('gnv')?.value, 0),
        flightsDomestic: clampNumber(document.getElementById('flightsDomestic')?.value, 0),
        flightsInternational: clampNumber(document.getElementById('flightsInternational')?.value, 0),

        residents: clampNumber(document.getElementById('residents')?.value, 1),
        electricity: clampNumber(document.getElementById('electricity')?.value, 0),
        gasCylinderMonths: clampNumber(document.getElementById('gasCylinderMonths')?.value, 0),
        pipedGas: clampNumber(document.getElementById('pipedGas')?.value, 0),

        beef: clampNumber(document.getElementById('beef')?.value, 0),
        chicken: clampNumber(document.getElementById('chicken')?.value, 0),
        pork: clampNumber(document.getElementById('pork')?.value, 0),
        milk: clampNumber(document.getElementById('milk')?.value, 0),
        eggs: clampNumber(document.getElementById('eggs')?.value, 0),
        rice: clampNumber(document.getElementById('rice')?.value, 0),
        beans: clampNumber(document.getElementById('beans')?.value, 0),
        trees: clampNumber(document.getElementById('trees')?.value, 0),

        recycling: document.getElementById('recycling')?.value || 'Sim',
        composting: document.getElementById('composting')?.value || 'Sim'
    };
}

// ====== 5.1 ENERGIA E INDÚSTRIA (itens 1.1 a 1.7) ======
function calculateEnergyIndustry(data) {
    const uf = data.state;
    const incomeFactor = getIncomeFactor(data.income);

    // 1.1 Transporte de passageiros (tCO2e/ano)
    const occ = data.vehicleOccupancy;

    const fuel_kg =
        (12 * safeDiv(1, occ) * data.gasoline * EF.fuel.gasoline) +
        (12 * safeDiv(1, occ) * data.ethanol * EF.fuel.ethanol) +
        (12 * safeDiv(1, occ) * data.diesel * EF.fuel.diesel) +
        (12 * safeDiv(1, occ) * data.gnv * EF.fuel.gnv);

    const flights_kg =
        (data.flightsDomestic * EF.flights.domestic) +
        (data.flightsInternational * EF.flights.international);

    const bus_kg = getStateFactor('bus', uf);

    const transportPassengers_t = (fuel_kg + flights_kg + bus_kg) / 1000;

    // 1.2 Transporte de cargas
    const transportCargo_t = (EF.cargo * incomeFactor) / 1000;

    // 1.3 Residencial (eletricidade + GLP + gás encanado), por morador
    const res = data.residents;
    const elec_kg = 12 * safeDiv(1, res) * data.electricity * EF.electricity;

    // GLP: (12 / meses_por_botijao) * fator_kg/botijao
    const glp_kg = (data.gasCylinderMonths > 0)
        ? (safeDiv(1, res) * (12 / data.gasCylinderMonths) * EF.glp_botijao)
        : 0;

    const piped_kg = 12 * safeDiv(1, res) * data.pipedGas * EF.piped_gas;
    const residential_t = (elec_kg + glp_kg + piped_kg) / 1000;

    // 1.4 Prédios públicos e comerciais
    const commerce_kg = getStateFactor('commerce', uf) * incomeFactor;
    const public_kg = getStateFactor('publicBuildings', uf);
    const publicCommercial_t = (commerce_kg + public_kg) / 1000;

    // 1.5 Produção de combustíveis
    const fuelProduction_t = (EF.fuel_production * incomeFactor) / 1000;

    // 1.6 Cimento (por UF)
    const cement_kg = getStateFactor('cement', uf) * incomeFactor;
    const cement_t = cement_kg / 1000;

    // 1.7 Outras indústrias
    const otherIndustries_t = (EF.other_industries * incomeFactor) / 1000;

    return (
        transportPassengers_t +
        transportCargo_t +
        residential_t +
        publicCommercial_t +
        fuelProduction_t +
        cement_t +
        otherIndustries_t
    );
}

// ====== 5.2 USO DA TERRA (itens 2.1 a 2.8) ======
function calculateLandUse(data) {
    const incomeFactor = getIncomeFactor(data.income);

    const beef = data.beef * 52 * LAND.beef;
    const chicken = data.chicken * 52 * LAND.chicken;
    const pork = data.pork * 52 * LAND.pork;
    const milk = data.milk * 52 * LAND.milk;
    const eggs = data.eggs * 52 * LAND.eggs;

    // 1 colher de sopa = 25g; converter para kg/dia e anualizar
    const rice = ((data.rice * 25) / 1000) * 365 * LAND.rice;
    const beans = ((data.beans * 25) / 1000) * 365 * LAND.beans;

    const pecuariaOther = incomeFactor * LAND.pecuaria_other;

    // Emissões de agricultura + etanol (inclui etanol misturado na gasolina C)
    const ethanolLitersPerYear = (data.ethanol + (EF.ethanol_blend_ratio * data.gasoline)) * 12;
    const ethanolEmissions = ethanolLitersPerYear * LAND.ethanol;

    const agriOther = (incomeFactor * LAND.agri_other) + ethanolEmissions;

    // Remoção por árvores (negativo)
    const trees = data.trees * LAND.tree;

    return (
        beef + chicken + pork + milk + eggs +
        rice + beans +
        pecuariaOther + agriOther +
        trees
    );
}

// ====== 5.3 RESÍDUOS (itens 3.1 a 3.3.3, replicando a planilha) ======
function calculateWaste(data) {
    const uf = data.state;
    const incomeFactor = getIncomeFactor(data.income);
    const wf = getWasteFactor(uf);

    // 3.1 e 3.2
    const effDom = wf.eff_dom * incomeFactor;
    const effInd = wf.eff_ind * incomeFactor;

    // 3.3.3 (sem reduções)
    const solidNoReductions = wf.solid * incomeFactor;

    // Abatimentos (a planilha aplica via renda também)
    const abatRecycling = ABATEMENTS.recycling * incomeFactor;
    const abatComposting = ABATEMENTS.composting * incomeFactor;

    // 3.3 (com reduções)
    const rec = (data.recycling === 'Sim');
    const comp = (data.composting === 'Sim');

    let solidWithReductions = solidNoReductions;
    if (rec && comp) solidWithReductions = solidNoReductions - abatRecycling - abatComposting;
    else if (rec && !comp) solidWithReductions = solidNoReductions - abatRecycling;
    else if (!rec && comp) solidWithReductions = solidNoReductions - abatComposting;

    // ATENÇÃO: a planilha soma B71:B76 (inclui também abatimentos e o valor sem reduções).
    // Para bater exatamente com o Excel, reproduzimos o mesmo total.
    const totalWaste = effDom + effInd + solidWithReductions + abatRecycling + abatComposting + solidNoReductions;

    return totalWaste;
}

// 6) Classificação do resultado (mantida; faixas genéricas)
function updateScoreCategory(emissions) {
    if (!scoreCategory) return;

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

// 7) Gráficos
function updateCategoryChart(energyIndustry, landUse, waste) {
    if (!categoryChart) return;
    categoryChart.innerHTML = '';

    const categories = [
        { name: 'Energia & Indústria', value: energyIndustry },
        { name: 'Uso da Terra', value: landUse },
        { name: 'Resíduos', value: waste }
    ];

    const maxValue = Math.max(...categories.map(c => c.value), 0.0001);
    const chartHeight = 200;

    categories.forEach(category => {
        const barHeight = (category.value / maxValue) * chartHeight;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = Math.max(20, barHeight) + 'px';

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = category.value.toFixed(3) + 't';
        bar.appendChild(value);

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = category.name;
        bar.appendChild(label);

        categoryChart.appendChild(bar);
    });
}

function updateComparisonChart(userEmissions) {
    if (!comparisonChart) return;
    comparisonChart.innerHTML = '';

    // Referências ilustrativas (não SEEG)
    const comparisons = [
        { name: 'Sua Pegada', value: Number(userEmissions) },
        { name: 'Meta 1,5°C (≈2t)', value: 2.0 },
        { name: 'Média Brasil (ref.)', value: 2.7 },
        { name: 'Média Global (ref.)', value: 4.8 },
    ];

    const maxValue = Math.max(...comparisons.map(c => c.value), 0.0001);
    const chartHeight = 200;

    comparisons.forEach(comp => {
        const barHeight = (comp.value / maxValue) * chartHeight;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = Math.max(20, barHeight) + 'px';

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = comp.value.toFixed(2) + 't';
        bar.appendChild(value);

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = comp.name;
        bar.appendChild(label);

        comparisonChart.appendChild(bar);
    });
}

// 8) Recomendações (simples e coerentes com entradas SEEG)
function generateRecommendations(data, totalEmissions) {
    if (!recommendationsList) return;
    recommendationsList.innerHTML = '';

    const recs = [];

    // Transporte: combustível e voos
    const fuelTotal = data.gasoline + data.diesel + data.gnv + data.ethanol;
    if (fuelTotal > 0) {
        recs.push({
            icon: '🚗',
            title: 'Reduzir consumo de combustível',
            description: 'Avalie caronas, transporte coletivo e manutenção do veículo (pneus calibrados, revisões).',
            impact: 'Redução depende do consumo informado',
            priority: 'Alta'
        });
    }

    if (data.flightsDomestic + data.flightsInternational > 0) {
        recs.push({
            icon: '✈️',
            title: 'Otimizar viagens aéreas',
            description: 'Agrupe viagens e, quando possível, substitua por alternativas de menor emissão.',
            impact: 'Redução alta por voo evitado',
            priority: 'Média'
        });
    }

    // Energia
    if (data.electricity > 0) {
        recs.push({
            icon: '⚡',
            title: 'Eficiência no uso de eletricidade',
            description: 'Reduza consumo com LEDs, modo economia, e atenção a ar-condicionado/geladeira.',
            impact: 'Redução proporcional ao kWh/mês',
            priority: 'Média'
        });
    }

    // Alimentação
    if (data.beef > 0) {
        recs.push({
            icon: '🥩',
            title: 'Reduzir carne bovina',
            description: 'A carne bovina é um dos maiores fatores de emissão no uso da terra.',
            impact: 'Redução significativa por kg/semana evitado',
            priority: 'Alta'
        });
    }

    // Resíduos
    if (data.recycling !== 'Sim') {
        recs.push({
            icon: '♻️',
            title: 'Implementar reciclagem de papel',
            description: 'Separar e destinar corretamente papel e recicláveis reduz emissões no modelo.',
            impact: 'Abatimento per capita (SEEG)',
            priority: 'Média'
        });
    }

    if (data.composting !== 'Sim') {
        recs.push({
            icon: '🌿',
            title: 'Começar a compostar orgânicos',
            description: 'Compostagem reduz emissões associadas a resíduos orgânicos.',
            impact: 'Abatimento per capita (SEEG)',
            priority: 'Média'
        });
    }

    // Árvores
    if (data.trees === 0) {
        recs.push({
            icon: '🌳',
            title: 'Plantio de árvores (com manutenção)',
            description: 'No modelo, árvores plantadas geram remoção anual média por árvore.',
            impact: 'Pequena a moderada (acumulativa)',
            priority: 'Baixa'
        });
    }

    // Render
    const limited = recs.slice(0, 8);
    if (limited.length === 0) {
        recommendationsList.innerHTML = '<div class="recommendation-card"><div class="rec-icon">✅</div><h4>Sem recomendações automáticas</h4><p>Preencha mais campos para recomendações específicas.</p></div>';
        return;
    }

    limited.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="rec-icon">${r.icon}</div>
            <h4>${r.title}</h4>
            <p>${r.description}</p>
            <p><strong>Impacto:</strong> ${r.impact}</p>
            <p><strong>Prioridade:</strong> ${r.priority}</p>
        `;
        recommendationsList.appendChild(card);
    });
}

// 9) Reset
function resetCalculator() {
    if (calculator) calculator.reset();
    if (resultsPanel) resultsPanel.classList.remove('active');
    if (totalScore) totalScore.textContent = '0.000';
    if (scoreCategory) {
        scoreCategory.textContent = '-';
        scoreCategory.className = 'score-category';
    }
    if (categoryChart) categoryChart.innerHTML = '';
    if (comparisonChart) comparisonChart.innerHTML = '';
    if (recommendationsList) recommendationsList.innerHTML = '';
}
