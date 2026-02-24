class ApiError extends Error {
    constructor(errorData) {
        super(errorData.message); // Set the error message
        this.data = errorData; // Attach the additional error data to the instance
    }
}

export default ApiError;
