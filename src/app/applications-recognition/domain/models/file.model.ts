export interface FileRequest {
    fileId: number;
    name: string;
}

export interface FileMetadataRequest {
    name: string;
    type: string; //PDF, DOCX, XLSX, JPG, PNG, MP4, MP3, etc
    extension: string; //pdf, docx, xlsx, jpg, png, mp4, mp3, etc
    path: string;
    observations: string;
    size: number;
    state: boolean; //true: activo, false: inactivo
    createAt: string;
}