import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  useToast,
  Flex,
  Text,
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { validateFileSize } from './service/fileValidatorService'
import FileService from './service/fileService'
import axios from 'axios'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  height:'70px',
  borderRadius: 2,
  borderColor: 'blue',
  color: 'black',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

function StyledDropzone(_props: any) {
  const toast = useToast()

  const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
    const fileService = new FileService(acceptedFiles)

    const res = await fileUploadResponse(fileService)
    console.log(res)

    toast({
      title: res.success ? 'File Uploaded' : 'Upload Failed',
      description: res.message,
      status: res.success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    })
  }, [])

  const fileUploadResponse = async (fileService: { uploadFile: () => any }) => {
    const res = await fileService.uploadFile()
    return res
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({ onDrop })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  )
}

function App() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    const fetchFiles = async () => {
      const result = await axios.get<Array<any>>('http://localhost:5000/files')
      console.log(result)
      setFiles(result.data.files)
    }

    fetchFiles()
  }, [])

  return (
    <div>
      <Flex
        alignItems="center"
        direction="column"
        m="100px auto"
        maxWidth="1200px"
      >
        <Text fontSize="2xl" fontWeight="bold">
          File Uploader
        </Text>
        <StyledDropzone />
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>user</Th>
                <Th>link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.length > 0 &&
                files?.map((file) => (
                  <Tr key={file.Id}>
                    <Td>{file.Id}</Td>
                    <Td>{file.Username}</Td>
                    <Td>
                      <a
                        href={`http://127.0.0.1:5000/${file.Filename}`}
                        download
                      >
                        <p>{file.Filename}</p>
                      </a>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
       
      </Flex>
    </div>
  )
}

export default App
