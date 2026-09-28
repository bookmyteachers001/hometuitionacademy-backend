const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const replacePlaceholders = (template, variables) => {
    if (!template || typeof template !== 'string') return '';

    // Replace placeholders: {key}
    let result = template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
        if (key in variables) {
            const val = variables[key];
            return val !== undefined && val !== null ? val : '';
        }
        return '';
    });

    // Clean empty brackets and braces
    result = result.replace(/\(\s*\)/g, ' ');
    result = result.replace(/\[\s*\]/g, ' ');
    result = result.replace(/\{\s*\}/g, ' ');

    // Normalize multiple spaces
    result = result.replace(/\s+/g, ' ');

    // Clean extra commas and hyphens
    result = result.replace(/,\s*,/g, ',');
    result = result.replace(/-\s*-/g, '-');
    
    // Clean spaces around punctuation
    result = result.replace(/\s*,\s*/g, ', ');
    result = result.replace(/\s*-\s*/g, ' - ');

    // Clean trailing/leading spaces and punctuation
    result = result.trim();
    result = result.replace(/\s+/g, ' ');

    // Clean spaces before dots/exclamations/questions
    result = result.replace(/\s+([\.!\?])/g, '$1');

    // Clean trailing/leading commas, hyphens
    result = result.replace(/^[,\-\s]+|[,\-\s]+$/g, '');

    return result.trim();
};

module.exports = {
    capitalizeFirstLetter,
    replacePlaceholders
};
