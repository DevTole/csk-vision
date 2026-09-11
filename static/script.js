const signIcons = {
    wave: "hand-left-outline",
    approved: "thumbs-up-outline",
    peace: "happy-outline",
    initialising: "hourglass-outline"
};

const INITIALISING_TEXT = "Initialising...";

function getConfidencePercent(confidence) {
    if (confidence === null || confidence === undefined || confidence === "") {
        return 0;
    }

    const confidenceText = String(confidence).trim();
    const hasPercentSign = confidenceText.endsWith("%");
    const numericConfidence = Number.parseFloat(confidenceText.replace("%", ""));

    if (!Number.isFinite(numericConfidence)) {
        return 0;
    }

    const percentage = !hasPercentSign && numericConfidence >= 0 && numericConfidence <= 1
        ? numericConfidence * 100
        : numericConfidence;

    return Math.min(100, Math.max(0, percentage));
}

function isInitialising(sign) {
    const normalizedSign = String(sign || "").trim().toLowerCase();
    return !normalizedSign || normalizedSign.includes("initialis") || normalizedSign.includes("initializ");
}

function getIconForSign(sign) {
    const normalizedSign = String(sign || "").trim().toLowerCase();

    if (normalizedSign.includes("wave")) {
        return signIcons.wave;
    }

    if (normalizedSign.includes("approved")) {
        return signIcons.approved;
    }

    if (normalizedSign.includes("peace")) {
        return signIcons.peace;
    }

    if (isInitialising(sign)) {
        return signIcons.initialising;
    }

    return "help-circle-outline";
}

function updatePrediction(sign, confidence) {
    const signOutput = document.getElementById("sign-output");
    const confidenceOutput = document.getElementById("confidence-output");
    const predictionCaption = document.getElementById("pred-cap");
    const predictionIcon = document.querySelector("#predicted-icon ion-icon");
    const progressValue = document.querySelector("#progress .progress-value");
    const confidenceSection = document.querySelector(".confidence");

    if (!signOutput || !confidenceOutput || !predictionCaption || !predictionIcon || !progressValue || !confidenceSection) {
        return;
    }

    const initialising = isInitialising(sign);
    const displayedSign = initialising ? INITIALISING_TEXT : String(sign).trim();
    const displayedConfidence = initialising ? "0%" : (confidence || "0%");
    const confidencePercent = initialising ? 0 : getConfidencePercent(confidence);

    signOutput.textContent = displayedSign;
    confidenceOutput.textContent = displayedConfidence;
    predictionCaption.textContent = initialising ? "" : "I THINK THIS IS";
    confidenceSection.hidden = initialising;
    progressValue.style.width = `${confidencePercent}%`;

    const iconName = getIconForSign(sign);

    if (predictionIcon.getAttribute("name") !== iconName) {
        predictionIcon.setAttribute("name", iconName);
    }
}

async function fetchSign() {
    try {
        const response = await fetch("/get_sign");
        
        if (response && response.ok) {
            const data = await response.json();
            updatePrediction(data.sign, data.confidence);
        } else {
            console.error("Error fetching sign:", response ? response.status : "No response");
        }
    } catch (error) {
        console.error("Error fetching sign:", error);
    }
}

fetchSign();
setInterval(fetchSign, 500);
