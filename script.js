// --- CONSTANTES DEL MODELO (¡ACTUALIZA ESTO CON LA SALIDA DE TU COLAB!) ---
const FEATURE_COLUMNS_ORDER = [
    "Age", "DailyRate", "DistanceFromHome", "Education", "EmployeeCount",
    "EmployeeNumber", "EnvironmentSatisfaction", "HourlyRate", "JobInvolvement",
    "JobLevel", "JobSatisfaction", "MonthlyIncome", "MonthlyRate",
    "NumCompaniesWorked", "PercentSalaryHike", "PerformanceRating",
    "RelationshipSatisfaction", "StandardHours", "StockOptionLevel",
    "TotalWorkingYears", "TrainingTimesLastYear", "WorkLifeBalance",
    "YearsAtCompany", "YearsInCurrentRole", "YearsSinceLastPromotion",
    "YearsWithCurrManager", "BusinessTravel_Travel_Frequently",
    "BusinessTravel_Travel_Rarely", "Department_Research & Development",
    "Department_Sales", "JobRole_Human Resources", "JobRole_Laboratory Technician",
    "JobRole_Manager", "JobRole_Manufacturing Director", "JobRole_Research Director",
    "JobRole_Research Scientist", "JobRole_Sales Executive", "JobRole_Sales Representative",
    "OverTime_Yes", "EducationField_Life Sciences", "EducationField_Marketing",
    "EducationField_Medical", "EducationField_Other", "EducationField_Technical Degree",
    "Gender_Male", "MaritalStatus_Married", "MaritalStatus_Single"
];

const SCALER_PARAMS = {
    'columns': [
        "Age", "DailyRate", "DistanceFromHome", "Education", "EmployeeCount",
        "EmployeeNumber", "EnvironmentSatisfaction", "HourlyRate", "JobInvolvement",
        "JobLevel", "JobSatisfaction", "MonthlyIncome", "MonthlyRate",
        "NumCompaniesWorked", "PercentSalaryHike", "PerformanceRating",
        "RelationshipSatisfaction", "StandardHours", "StockOptionLevel",
        "TotalWorkingYears", "TrainingTimesLastYear", "WorkLifeBalance",
        "YearsAtCompany", "YearsInCurrentRole", "YearsSinceLastPromotion",
        "YearsWithCurrManager"
    ],
    'mean': [
        36.924040404040404, 802.728952020202, 9.192525252525252, 2.912929292929293,
        1.0, 1024.8656565656565, 2.7212121212121213, 65.89191919191919,
        2.7292929292929294, 2.063131313131313, 2.7282828282828284, 6502.931212121212,
        14313.103535353536, 2.693939393939394, 15.20909090909091, 3.1535353535353537,
        2.712121212121212, 1.0, 0.7939393939393939, 11.27979797979798,
        2.7997979797979797, 2.7616161616161617, 7.008080808080808,
        4.229292929292929, 2.1873737373737374, 4.123232323232323
    ],
    'scale': [
        9.135043831828757, 403.4140026362544, 8.106863810134057, 1.0238056256950275,
        0.0, 597.589809939523, 1.0934149666072237, 20.301542478544977,
        0.7115160844783305, 1.0963162744786405, 1.102237750849318,
        4707.95679905953, 7114.708896024108, 2.4925828468779667,
        3.659858525048281, 0.3602167098495046, 1.0811904797042568,
        0.0, 0.8520268480749007, 7.778848356976679, 1.289139884784403,
        0.7077366373801833, 6.1363614271811835, 3.621258672076403,
        3.220165977926129, 3.5670275727931393
    ]
};

const MODEL_PATH = './modelo_attrition_web/model.json';
let model;

async function loadModel() {
    try {
        console.log("Cargando el modelo TensorFlow.js desde:", MODEL_PATH);
        model = await tf.loadGraphModel(MODEL_PATH);
        console.log("Modelo cargado correctamente.");
    } catch (error) {
        console.error("ERROR CRÍTICO al cargar el modelo:", error);
        console.error("CAUSA DEL ERROR:", error.message);
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", "Verifica que la carpeta 'modelo_attrition_web' está en la misma ubicación que tu 'index.html' y 'script.js'. Asegúrate que dentro de esa carpeta están 'model.json' y los archivos '.bin'.");
        alert("Error al cargar el modelo. Revisa la consola (F12) para más detalles.");
    }
}

const HTML_ID_TO_FEATURE_NAME_MAP = {
    'age': 'Age',
    'monthlyIncome': 'MonthlyIncome',
    'jobRole': 'JobRole',
    'totalWorkingYears': 'TotalWorkingYears',
    'yearsAtCompany': 'YearsAtCompany',
    'overTime': 'OverTime',
    'businessTravel': 'BusinessTravel',
    'dailyRate': 'DailyRate',
    'distanceFromHome': 'DistanceFromHome',
    'education': 'Education',
    'educationField': 'EducationField',
    'employeeNumber': 'EmployeeNumber',
    'environmentSatisfaction': 'EnvironmentSatisfaction',
    'hourlyRate': 'HourlyRate',
    'jobInvolvement': 'JobInvolvement',
    'jobLevel': 'JobLevel',
    'jobSatisfaction': 'JobSatisfaction',
    'monthlyRate': 'MonthlyRate',
    'numCompaniesWorked': 'NumCompaniesWorked',
    'percentSalaryHike': 'PercentSalaryHike',
    'performanceRating': 'PerformanceRating',
    'relationshipSatisfaction': 'RelationshipSatisfaction',
    'stockOptionLevel': 'StockOptionLevel',
    'trainingTimesLastYear': 'TrainingTimesLastYear',
    'workLifeBalance': 'WorkLifeBalance',
    'yearsInCurrentRole': 'YearsInCurrentRole',
    'yearsSinceLastPromotion': 'YearsSinceLastPromotion',
    'yearsWithCurrManager': 'YearsWithCurrManager',
    'gender': 'Gender',
    'maritalStatus': 'MaritalStatus',
};

const UI_ELEMENT_IDS = {
    predictBtn: 'predictBtn',
    resultDiv: 'result',
    probabilitySpan: 'probability'
};

async function handlePrediction() {
    console.log("Botón '¿Este empleado está en riesgo de irse?' clickeado.");
    if (!model) {
        console.warn("ADVERTENCIA: El modelo aún no ha terminado de cargar. Por favor, espera y vuelve a intentarlo.");
        alert("El modelo aún no está listo. Por favor, espera un momento y vuelve a intentarlo.");
        return;
    }

    try {
        console.log("Recopilando y preprocesando datos del formulario...");
        const formData = getFormData();
        console.log("Datos iniciales del formulario (con casing corregido y defaults):", formData);

        const processedInput = preprocessInput(formData);
        console.log("Datos preprocesados listos para la predicción:", processedInput);

        if (processedInput.length !== FEATURE_COLUMNS_ORDER.length) {
            console.error("ERROR DE CONSISTENCIA: La cantidad de características procesadas NO coincide con la esperada por el modelo.");
            console.error("EXPECTED BY JS (FEATURE_COLUMNS_ORDER):", FEATURE_COLUMNS_ORDER.length, "RECEIVED FROM PREPROCESSING:", processedInput.length);
            console.error("CAUSA DEL ERROR:", "La lógica de preprocesamiento en JS (preprocessInput) no generó el número correcto de columnas según FEATURE_COLUMNS_ORDER.");
            console.error("PARTE MAL:", "Revisa la función `preprocessInput` y las constantes `FEATURE_COLUMNS_ORDER` para asegurarte de que coinciden.");
            alert("Error interno: Los datos no cuadran. Revisa la consola.");
            return;
        }

        const inputTensor = tf.tensor2d([processedInput]);
        console.log("Tensor de entrada de TensorFlow creado.");

        console.log("Realizando predicción con el modelo...");
        const prediction = await model.predict(inputTensor).data();
        const probability = prediction[0] * 100;
        console.log("Predicción realizada con éxito. Probabilidad de rotación:", probability.toFixed(2) + "%");

        displayResult(probability);
        console.log("Resultados mostrados en la interfaz.");

    } catch (error) {
        console.error("ERROR GENERAL al procesar o predecir:", error);
        console.error("CAUSA DEL ERROR:", error.message);
        console.error("PARTE MAL:", "Podría ser en la recopilación de datos (getFormData), el preprocesamiento (preprocessInput), o la llamada final al modelo.");
        alert("Ocurrió un error al realizar la predicción. Revisa la consola para detalles.");
    }
}

function getFormData() {
    const data = {};

    for (const htmlId in HTML_ID_TO_FEATURE_NAME_MAP) {
        const featureName = HTML_ID_TO_FEATURE_NAME_MAP[htmlId];
        const element = document.getElementById(htmlId);

        if (element) {
            if (element.type === 'number' || element.type === 'range') {
                data[featureName] = parseFloat(element.value);
            } else if (element.tagName === 'SELECT') {
                data[featureName] = element.value;
            }
        } else {
            console.warn(`Advertencia: Elemento HTML con ID '${htmlId}' (para la característica '${featureName}') no encontrado. Se usará valor por defecto.`);
        }
    }

    const overTimeRadio = document.querySelector('input[name="overTime"]:checked');
    data['OverTime'] = overTimeRadio ? overTimeRadio.value : 'No';

    for (const featureName of FEATURE_COLUMNS_ORDER) {
        if (data[featureName] !== undefined && data[featureName] !== null && !(typeof data[featureName] === 'number' && isNaN(data[featureName]))) {
            continue;
        }

        const scalerColIndex = SCALER_PARAMS.columns.indexOf(featureName);
        if (scalerColIndex !== -1) {
            data[featureName] = SCALER_PARAMS.mean[scalerColIndex];
        } else if (featureName.includes('_')) {
            data[featureName] = 0;
        } else {
            switch(featureName) {
                case 'EmployeeCount': data[featureName] = 1; break;
                case 'StandardHours': data[featureName] = 80; break;
                default:
                    console.warn(`ADVERTENCIA: No se encontró valor ni default específico para '${featureName}'. Asignando 0.`);
                    data[featureName] = 0;
            }
        }
    }

    return data;
}


function preprocessInput(formData) {
    let featuresMap = new Map();

    for (const colName of FEATURE_COLUMNS_ORDER) {
        featuresMap.set(colName, formData[colName]);
    }

    FEATURE_COLUMNS_ORDER.forEach(col => {
        if (col.startsWith('BusinessTravel_') || col.startsWith('Department_') ||
            col.startsWith('JobRole_') || col.startsWith('OverTime_') ||
            col.startsWith('EducationField_') || col.startsWith('Gender_') ||
            col.startsWith('MaritalStatus_')) {
            featuresMap.set(col, 0);
        }
    });

    if (formData.BusinessTravel === 'Travel_Frequently') {
        featuresMap.set('BusinessTravel_Travel_Frequently', 1);
    } else if (formData.BusinessTravel === 'Travel_Rarely') {
        featuresMap.set('BusinessTravel_Travel_Rarely', 1);
    }

    if (formData.Department === 'Research & Development') {
        featuresMap.set('Department_Research & Development', 1);
    } else if (formData.Department === 'Sales') {
        featuresMap.set('Department_Sales', 1);
    }

    const jobRoleOHEMap = {
        'Human Resources': 'JobRole_Human Resources',
        'Laboratory Technician': 'JobRole_Laboratory Technician',
        'Manager': 'JobRole_Manager',
        'Manufacturing Director': 'JobRole_Manufacturing Director',
        'Research Director': 'JobRole_Research Director',
        'Research Scientist': 'JobRole_Research Scientist',
        'Sales Executive': 'JobRole_Sales Executive',
        'Sales Representative': 'JobRole_Sales Representative',
        'Healthcare Representative': 'JobRole_Healthcare Representative'
    };
    if (formData.JobRole && jobRoleOHEMap[formData.JobRole] && FEATURE_COLUMNS_ORDER.includes(jobRoleOHEMap[formData.JobRole])) {
        featuresMap.set(jobRoleOHEMap[formData.JobRole], 1);
    }

    if (formData.OverTime === 'Yes') {
        featuresMap.set('OverTime_Yes', 1);
    }

    const educationFieldOHEMap = {
        'Life Sciences': 'EducationField_Life Sciences',
        'Medical': 'EducationField_Medical',
        'Marketing': 'EducationField_Marketing',
        'Technical Degree': 'EducationField_Technical Degree',
        'Other': 'EducationField_Other',
        'Human Resources': 'EducationField_Human Resources'
    };
    if (formData.EducationField && educationFieldOHEMap[formData.EducationField] && FEATURE_COLUMNS_ORDER.includes(educationFieldOHEMap[formData.EducationField])) {
        featuresMap.set(educationFieldOHEMap[formData.EducationField], 1);
    }

    if (formData.Gender === 'Male' && FEATURE_COLUMNS_ORDER.includes('Gender_Male')) {
        featuresMap.set('Gender_Male', 1);
    }

    if (formData.MaritalStatus === 'Married' && FEATURE_COLUMNS_ORDER.includes('MaritalStatus_Married')) {
        featuresMap.set('MaritalStatus_Married', 1);
    } else if (formData.MaritalStatus === 'Single' && FEATURE_COLUMNS_ORDER.includes('MaritalStatus_Single')) {
        featuresMap.set('MaritalStatus_Single', 1);
    }

    const numericalColumnsToScale = SCALER_PARAMS.columns;
    const means = SCALER_PARAMS.mean;
    const scales = SCALER_PARAMS.scale;

    for (let i = 0; i < numericalColumnsToScale.length; i++) {
        const colName = numericalColumnsToScale[i];
        let value = featuresMap.get(colName);

        const mean = means[i];
        const scale = scales[i];

        if (typeof value !== 'number' || isNaN(value)) {
            console.error(`ERROR DE DATO: El valor para la columna numérica '${colName}' no es un número: ${value}.`);
            console.error("CAUSA DEL ERROR:", "El dato no fue correctamente parseado o faltó un valor por defecto numérico en getFormData.");
            throw new Error(`Valor no numérico para ${colName}.`);
        }

        if (scale === 0) {
            featuresMap.set(colName, 0);
            console.warn(`Advertencia: La columna numérica '${colName}' tiene escala 0 (constante). Se asignó 0 escalado.`);
        } else {
            featuresMap.set(colName, (value - mean) / scale);
        }
    }

    const finalFeaturesArray = [];
    for (const colName of FEATURE_COLUMNS_ORDER) {
        const value = featuresMap.get(colName);
        if (value === undefined) {
            console.error(`ERROR CRÍTICO DE MAPEO: La columna esperada '${colName}' no se encontró en el mapa de características después del preprocesamiento.`);
            console.error("CAUSA DEL ERROR:", "Falta un mapeo explícito en 'preprocessInput' o un default en 'getFormData', o 'FEATURE_COLUMNS_ORDER' no coincide con tus datos o su orden.");
            throw new Error(`Columna final faltante: ${colName}.`);
        }
        finalFeaturesArray.push(value);
    }

    return finalFeaturesArray;
}


function displayResult(probability) {
    const resultDiv = document.getElementById(UI_ELEMENT_IDS.resultDiv);
    const probabilitySpan = document.getElementById(UI_ELEMENT_IDS.probabilitySpan);

    if (!resultDiv || !probabilitySpan) {
        console.error("ERROR HTML: Elementos para mostrar el resultado no encontrados.");
        console.error("CAUSA DEL ERROR:", "IDs de los elementos HTML para el resultado no coinciden o no existen.");
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", `Asegúrate de que tu 'index.html' tiene elementos con los IDs: '${UI_ELEMENT_IDS.resultDiv}' y '${UI_ELEMENT_IDS.probabilitySpan}'.`);
        alert("Error al mostrar resultados. Revisa la consola.");
        return;
    }

    probabilitySpan.textContent = probability.toFixed(2) + '%';
    if (probability >= 50) {
        resultDiv.textContent = 'Riesgo ALTO de rotación';
        resultDiv.style.color = 'red';
        console.log("Resultado: Riesgo ALTO de rotación.");
    } else {
        resultDiv.textContent = 'Probabilidad BAJA de salida';
        resultDiv.style.color = 'green';
        console.log("Resultado: Probabilidad BAJA de salida.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadModel();

    const predictButton = document.getElementById(UI_ELEMENT_IDS.predictBtn);
    if (predictButton) {
        predictButton.addEventListener('click', handlePrediction);
        console.log("Event listener para el botón de predicción configurado.");
    } else {
        console.error("ERROR HTML: No se encontró el botón de predicción con ID:", UI_ELEMENT_IDS.predictBtn);
        console.error("CAUSA DEL ERROR:", "El ID del botón de predicción en HTML no coincide con el JS.");
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", "Asegúrate de que tu 'index.html' tiene un botón con el ID correcto.");
    }
});
