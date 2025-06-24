// --- CONSTANTES DEL MODELO (¡ACTUALIZA ESTO CON LA SALIDA DE TU COLAB!) ---
// Estas constantes son CRÍTICAS y deben ser copiadas EXACTAMENTE de la salida
// de la sección "Información esencial para el frontend (script.js)" de tu Paso 6 en Colab.

// AHORA ESTA LISTA 'FEATURE_COLUMNS_ORDER' ESTÁ AJUSTADA PARA TENER 47 ELEMENTOS,
// LO CUAL DEBE COINCIDIR CON LA CANTIDAD DE CARACTERÍSTICAS QUE ESPERA TU MODELO DE PYTHON.

// Ejemplo: FEATURE_COLUMNS_ORDER (REEMPLAZA ESTO CON TU VALOR REAL DE COLAB, ASEGURANDO QUE TIENE 47 ELEMENTOS)
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
    "Gender_Male", "MaritalStatus_Married", "MaritalStatus_Single" // AHORA SON 47 ELEMENTOS
];

// Ejemplo: SCALER_PARAMS (REEMPLAZA ESTO CON TU VALOR REAL DE COLAB.)
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

// --- RUTA DEL MODELO ---
const MODEL_PATH = './modelo_attrition_web/model.json';
let model; // Global variable to store the TensorFlow.js model

// --- Mapping of HTML IDs to Model Feature Names ---
// This is crucial for correctly mapping form input IDs (often camelCase or lowercase)
// to the exact feature names the model expects (which might be PascalCase or specific_snake_case).
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
    // 'employeeCount': 'EmployeeCount', // Not mapped directly from HTML, handled as constant in JS
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
    // 'standardHours': 'StandardHours', // Not mapped directly from HTML, handled as constant in JS
    'stockOptionLevel': 'StockOptionLevel',
    'trainingTimesLastYear': 'TrainingTimesLastYear',
    'workLifeBalance': 'WorkLifeBalance',
    'yearsInCurrentRole': 'YearsInCurrentRole',
    'yearsSinceLastPromotion': 'YearsSinceLastPromotion',
    'yearsWithCurrManager': 'YearsWithCurrManager',
    'gender': 'Gender',
    'maritalStatus': 'MaritalStatus',
    // 'over18': 'Over18' // Not mapped directly from HTML, handled as constant in JS
};

// --- UI Element IDs (not necessarily direct input IDs) ---
const UI_ELEMENT_IDS = {
    predictBtn: 'predictBtn',
    resultDiv: 'result',
    probabilitySpan: 'probability'
};

// --- MODEL LOADING FUNCTION ---
async function loadModel() {
    try {
        console.log("ℹ️ Cargando el modelo TensorFlow.js desde:", MODEL_PATH);
        model = await tf.loadGraphModel(MODEL_PATH);
        console.log("✅ Modelo cargado correctamente.");
    } catch (error) {
        console.error("❌ ERROR CRÍTICO al cargar el modelo:", error);
        console.error("CAUSA DEL ERROR:", error.message);
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", "Verifica que la carpeta 'modelo_attrition_web' está en la misma ubicación que tu 'index.html' y 'script.js'. Asegúrate que dentro de esa carpeta están 'model.json' y los archivos '.bin'.");
        alert("Error al cargar el modelo. Revisa la consola (F12) para más detalles.");
    }
}

// --- PREDICTION HANDLING FUNCTION ---
async function handlePrediction() {
    console.log("ℹ️ Botón '¿Este empleado está en riesgo de irse?' clickeado.");
    if (!model) {
        console.warn("⚠️ ADVERTENCIA: El modelo aún no ha terminado de cargar. Por favor, espera y vuelve a intentarlo.");
        alert("El modelo aún no está listo. Por favor, espera un momento y vuelve a intentarlo.");
        return;
    }

    try {
        console.log("ℹ️ Recopilando y preprocesando datos del formulario...");
        const formData = getFormData();
        console.log("✅ Datos iniciales del formulario (con casing corregido y defaults):", formData);

        // Preprocess the data (One-Hot Encoding and Scaling)
        const processedInput = preprocessInput(formData);
        console.log("✅ Datos preprocesados listos para la predicción:", processedInput);

        // Final check for feature count consistency
        if (processedInput.length !== FEATURE_COLUMNS_ORDER.length) {
            console.error("❌ ERROR DE CONSISTENCIA: La cantidad de características procesadas NO coincide con la esperada por el modelo.");
            console.error("EXPECTED BY JS (FEATURE_COLUMNS_ORDER):", FEATURE_COLUMNS_ORDER.length, "RECEIVED FROM PREPROCESSING:", processedInput.length);
            console.error("CAUSA DEL ERROR:", "La lógica de preprocesamiento en JS (preprocessInput) no generó el número correcto de columnas según FEATURE_COLUMNS_ORDER.");
            console.error("PARTE MAL:", "Revisa la función `preprocessInput` y las constantes `FEATURE_COLUMNS_ORDER` para asegurarte de que coinciden.");
            alert("Error interno: Los datos no cuadran. Revisa la consola.");
            return;
        }

        // Create TensorFlow tensor
        const inputTensor = tf.tensor2d([processedInput]);
        console.log("✅ Tensor de entrada de TensorFlow creado.");

        // Perform the prediction
        console.log("ℹ️ Realizando predicción con el modelo...");
        const prediction = await model.predict(inputTensor).data();
        const probability = prediction[0] * 100; // Convert to percentage
        console.log("✅ Predicción realizada con éxito. Probabilidad de rotación:", probability.toFixed(2) + "%");

        // Display results in the UI
        displayResult(probability);
        console.log("✅ Resultados mostrados en la interfaz.");

    } catch (error) {
        console.error("❌ ERROR GENERAL al procesar o predecir:", error);
        console.error("CAUSA DEL ERROR:", error.message);
        console.error("PARTE MAL:", "Podría ser en la recopilación de datos (getFormData), el preprocesamiento (preprocessInput), o la llamada final al modelo.");
        alert("Ocurrió un error al realizar la predicción. Revisa la consola para detalles.");
    }
}

/**
 * Gets values from the HTML form, mapping them to expected feature names.
 * Also assigns default values for columns not directly present in the form or for constants.
 * @returns {Object} - Object with form data, with correct feature names.
 */
function getFormData() {
    const data = {};

    // 1. Collect data from direct form inputs using the HTML ID to Feature Name map
    for (const htmlId in HTML_ID_TO_FEATURE_NAME_MAP) {
        const featureName = HTML_ID_TO_FEATURE_NAME_MAP[htmlId];
        const element = document.getElementById(htmlId);

        if (element) {
            if (element.type === 'number' || element.type === 'range') {
                data[featureName] = parseFloat(element.value);
            } else if (element.tagName === 'SELECT') {
                data[featureName] = element.value;
            }
            // Radio buttons for 'OverTime' are handled separately below
        } else {
            // This warning is expected if the HTML doesn't have all the fields JS can handle.
            console.warn(`⚠️ Advertencia: Elemento HTML con ID '${htmlId}' (para la característica '${featureName}') no encontrado. Se usará valor por defecto.`);
        }
    }

    // 2. Handle radio buttons specifically (e.g., OverTime)
    const overTimeRadio = document.querySelector('input[name="overTime"]:checked');
    data['OverTime'] = overTimeRadio ? overTimeRadio.value : 'No'; // Default 'No' if nothing is selected

    // 3. Assign default values for ALL features the model expects
    // This ensures 'data' contains an initial value for EVERY expected feature.
    for (const featureName of FEATURE_COLUMNS_ORDER) {
        // If the data was already collected from the form, keep it
        if (data[featureName] !== undefined && data[featureName] !== null && !(typeof data[featureName] === 'number' && isNaN(data[featureName]))) {
            continue; // We already have the form value, move to the next feature
        }

        // If it's a numeric column handled by the scaler
        const scalerColIndex = SCALER_PARAMS.columns.indexOf(featureName);
        if (scalerColIndex !== -1) {
            data[featureName] = SCALER_PARAMS.mean[scalerColIndex]; // Use the mean as default
        }
        // If it's an One-Hot Encoded column (contains '_', and is not in scaler columns)
        else if (featureName.includes('_')) {
            data[featureName] = 0; // Default for One-Hot is 0
        }
        // For other non-scaled, non-OHE columns, assign a predefined value if known
        else {
             // Defaults for columns that are not scaled or OHE but are constants or have a base value
            switch(featureName) {
                case 'EmployeeCount': data[featureName] = 1; break; // Constant column
                case 'StandardHours': data[featureName] = 80; break; // Constant column
                // 'Over18' as 'Y' is often a constant but might be handled as OHE 'Over18_Y'.
                // Since Over18_Y is removed from FEATURE_COLUMNS_ORDER, we don't need to handle Over18 here
                // if it's not a direct input and not part of the model's expected features.
                default:
                    // This indicates a column in FEATURE_COLUMNS_ORDER that was not handled.
                    console.warn(`⚠️ ADVERTENCIA: No se encontró valor ni default específico para '${featureName}'. Asignando 0.`);
                    data[featureName] = 0;
            }
        }
    }

    return data;
}


/**
 * Preprocesses input data by applying One-Hot Encoding and numerical scaling
 * to match the format expected by the TensorFlow.js model.
 * @param {Object} formData - Raw data (with corrected casing and defaults) obtained from the form.
 * @returns {Array<number>} - Array of preprocessed features in the correct order.
 */
function preprocessInput(formData) {
    let featuresMap = new Map(); // Map to build features in order

    // Initialize the map with values from formData (which already includes defaults).
    for (const colName of FEATURE_COLUMNS_ORDER) {
        featuresMap.set(colName, formData[colName]);
    }

    // --- Apply One-Hot Encoding to categorical variables ---
    // Iterate through categorical features from formData and activate corresponding OHE columns.
    // OHE column names must match those in FEATURE_COLUMNS_ORDER.

    // Reset One-Hot Encoded columns for key categories (ensures only one is 1)
    FEATURE_COLUMNS_ORDER.forEach(col => {
        if (col.startsWith('BusinessTravel_') || col.startsWith('Department_') ||
            col.startsWith('JobRole_') || col.startsWith('OverTime_') ||
            col.startsWith('EducationField_') || col.startsWith('Gender_') ||
            col.startsWith('MaritalStatus_')) { // Removed Over18_ from here
            featuresMap.set(col, 0); // Reset OHE to 0 before activating the correct one
        }
    });

    // BusinessTravel
    if (formData.BusinessTravel === 'Travel_Frequently') {
        featuresMap.set('BusinessTravel_Travel_Frequently', 1);
    } else if (formData.BusinessTravel === 'Travel_Rarely') {
        featuresMap.set('BusinessTravel_Travel_Rarely', 1);
    }

    // Department (Adjust based on your exact OHE categories and drop_first from Python)
    if (formData.Department === 'Research & Development') {
        featuresMap.set('Department_Research & Development', 1);
    } else if (formData.Department === 'Sales') {
        featuresMap.set('Department_Sales', 1);
    }

    // JobRole (Each select option that is not "drop_first" will activate its OHE column)
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

    // OverTime
    if (formData.OverTime === 'Yes') {
        featuresMap.set('OverTime_Yes', 1);
    }

    // EducationField (Adjust based on your exact OHE categories and drop_first from Python)
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

    // Gender
    if (formData.Gender === 'Male' && FEATURE_COLUMNS_ORDER.includes('Gender_Male')) {
        featuresMap.set('Gender_Male', 1);
    }

    // MaritalStatus
    if (formData.MaritalStatus === 'Married' && FEATURE_COLUMNS_ORDER.includes('MaritalStatus_Married')) {
        featuresMap.set('MaritalStatus_Married', 1);
    } else if (formData.MaritalStatus === 'Single' && FEATURE_COLUMNS_ORDER.includes('MaritalStatus_Single')) {
        featuresMap.set('MaritalStatus_Single', 1);
    }


    // --- Apply scaling to numerical features ---
    const numericalColumnsToScale = SCALER_PARAMS.columns;
    const means = SCALER_PARAMS.mean;
    const scales = SCALER_PARAMS.scale;

    for (let i = 0; i < numericalColumnsToScale.length; i++) {
        const colName = numericalColumnsToScale[i];
        let value = featuresMap.get(colName); // Get the value from the featuresMap

        const mean = means[i];
        const scale = scales[i];

        if (typeof value !== 'number' || isNaN(value)) {
            console.error(`❌ ERROR DE DATO: El valor para la columna numérica '${colName}' no es un número: ${value}.`);
            console.error("CAUSA DEL ERROR:", "El dato no fue correctamente parseado o faltó un valor por defecto numérico en getFormData.");
            throw new Error(`Valor no numérico para ${colName}.`);
        }

        if (scale === 0) {
            featuresMap.set(colName, 0); // Assign 0 if the column is constant (scale 0)
            console.warn(`⚠️ Advertencia: La columna numérica '${colName}' tiene escala 0 (constante). Se asignó 0 escalado.`);
        } else {
            featuresMap.set(colName, (value - mean) / scale);
        }
    }

    // --- Build the final array in the exact order of FEATURE_COLUMNS_ORDER ---
    const finalFeaturesArray = [];
    for (const colName of FEATURE_COLUMNS_ORDER) {
        const value = featuresMap.get(colName);
        if (value === undefined) {
            console.error(`❌ ERROR CRÍTICO DE MAPEO: La columna esperada '${colName}' no se encontró en el mapa de características después del preprocesamiento.`);
            console.error("CAUSA DEL ERROR:", "Falta un mapeo explícito en 'preprocessInput' o un default en 'getFormData', o 'FEATURE_COLUMNS_ORDER' no coincide con tus datos o su orden.");
            throw new Error(`Columna final faltante: ${colName}.`);
        }
        finalFeaturesArray.push(value);
    }

    return finalFeaturesArray;
}


/**
 * Displays the prediction result in the UI.
 * @param {number} probability - Attrition probability in percentage.
 */
function displayResult(probability) {
    const resultDiv = document.getElementById(UI_ELEMENT_IDS.resultDiv);
    const probabilitySpan = document.getElementById(UI_ELEMENT_IDS.probabilitySpan);

    if (!resultDiv || !probabilitySpan) {
        console.error("❌ ERROR HTML: Elementos para mostrar el resultado no encontrados.");
        console.error("CAUSA DEL ERROR:", "IDs de los elementos HTML para el resultado no coinciden o no existen.");
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", `Asegúrate de que tu 'index.html' tiene elementos con los IDs: '${UI_ELEMENT_IDS.resultDiv}' y '${UI_ELEMENT_IDS.probabilitySpan}'.`);
        alert("Error al mostrar resultados. Revisa la consola.");
        return;
    }

    probabilitySpan.textContent = probability.toFixed(2) + '%';
    if (probability >= 50) { // Threshold of 50% for high/low risk
        resultDiv.textContent = 'Riesgo ALTO de rotación';
        resultDiv.style.color = 'red';
        console.log("ℹ️ Resultado: Riesgo ALTO de rotación.");
    } else {
        resultDiv.textContent = 'Probabilidad BAJA de salida';
        resultDiv.style.color = 'green';
        console.log("ℹ️ Resultado: Probabilidad BAJA de salida.");
    }
}

// --- INITIAL EVENT LISTENER SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    loadModel(); // Load the model as soon as the page is ready

    const predictButton = document.getElementById(UI_ELEMENT_IDS.predictBtn);
    if (predictButton) {
        predictButton.addEventListener('click', handlePrediction);
        console.log("✅ Event listener para el botón de predicción configurado.");
    } else {
        console.error("❌ ERROR HTML: No se encontró el botón de predicción con ID:", UI_ELEMENT_IDS.predictBtn);
        console.error("CAUSA DEL ERROR:", "El ID del botón de predicción en HTML no coincide con el JS.");
        console.error("LO QUE NO CUADRA / POSIBLE FALTA:", "Asegúrate de que tu 'index.html' tiene un botón con el ID correcto.");
    }
});