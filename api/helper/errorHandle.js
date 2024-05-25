const uniqueMessage = (error) => {
    let output;
    try {
        // Enhanced regex to capture both field name and value
        const regex = /index: (.+?)_\d+ dup key: { (.+?): "(.+?)" }/;
        const match = error.message.match(regex);

        if (match) {
            const fieldName = match[2];
            const fieldDisplayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            output = `${fieldDisplayName} unique field already exists`;
        } else {
            output = 'Unique field already exists';
        }
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * Get the error message from error object
 */
export const errorHandler = (error) => {
    let message = '';

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = 'Something went wrong';
        }
    } else if (error.errors) {
        for (let errorName in error.errors) {
            if (error.errors[errorName].message) message = error.errors[errorName].message;
        }
    } else {
        message = error.message || 'Unknown error occurred';
    }

    return message;
};


export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};