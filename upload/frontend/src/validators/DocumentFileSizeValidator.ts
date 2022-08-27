class DocumentFileSizeValidator
{
    private fileSizeInBytes: number
    private maxFileSizeInBytes: number = 1073741824

    constructor(fileSize: number) {
        this.fileSizeInBytes = fileSize
    }

    validateFileSize(): boolean {
        return this.fileSizeInBytes >= this.maxFileSizeInBytes
    }

    getErrorMessage(): string {
        return 'Maximum file size accepted is 1GB.'
    }
}

export default DocumentFileSizeValidator