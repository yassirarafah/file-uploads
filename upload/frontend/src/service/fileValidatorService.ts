interface ValidatorResponse {
    isValid: boolean,
    code: string
    errorMessage: string
}


async function validateFileSize(file: any): Promise<ValidatorResponse | null> {
    const documentFileSizeValidator = (await import('../validators/DocumentFileSizeValidator')).default

  

    const validator = new documentFileSizeValidator(file.size)
    const isValid = validator.validateFileSize()

 

    if(isValid){
        return {
            isValid,
            code: "file-too-large",
            errorMessage: isValid ? '' : validator.getErrorMessage()
        }
    }

    return null;
}



export {
    validateFileSize,

}