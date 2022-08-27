interface UploadFileResponse {
    success: boolean,
    message: string
}

class FileService 
{
    private files: Array<File>

    constructor(files: Array<File>) {
        this.files = files
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.')

        if (fileNames.length === 0) {
            return ''
        }

        return fileNames[fileNames.length - 1]
    }

    async uploadFile(): Promise<UploadFileResponse> {
        const uploadResponse = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: this.getFormData()
        })

        const responseJson = await uploadResponse.json()

        console.log(responseJson)

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }

        return {
            success: true,
            message: responseJson.message
        }
    }

    private getFormData(): FormData {
        const formData = new FormData()
        for (const single_file of this.files) {
            formData.append('file', single_file)
        }
        formData.append('UserId', 1);
        return formData
    }
}

export default FileService