const validateNumber = function(value: string, min?: number, max?: number): string {
    if (!value || value.length === 0) {
        return "Can not be empty";
    }

    if (!/^\d+$/.test(value)) {
        return "Must only contain digits";
    }

    const number = Number(value);
    if (isNaN(number)) {
        return "Invalid number";
    }

    if (min && number < min) {
        return "Can not be less than " + min.toString();
    }
    if (max && number > max) {
        return "Can not be greater than " + max.toString();
    }

    return null;
}

export default validateNumber;