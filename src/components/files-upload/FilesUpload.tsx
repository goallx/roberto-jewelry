import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';
import { UploadedImagesResponse } from '@/app/api/uploads/images/manager';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


interface FilesUploadProps {
    onUpload: (images: any[]) => void,
    alreadyUploaded?: Array<UploadedImagesResponse>
    onSelectImageDeletion?: (imageName: string) => void
    onError: (err: string) => void
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const FilesUpload: React.FC<FilesUploadProps> = ({ onUpload, alreadyUploaded, onSelectImageDeletion, onError }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);


    useEffect(() => {
        if (alreadyUploaded?.length) {
            const initialFileList: UploadFile[] = alreadyUploaded.map((image, index) => ({
                uid: `-existing-${index}`,
                name: image.fileName,
                status: "done" as UploadFileStatus,
                url: image.imgUrl,
            }));
            setFileList(initialFileList)
        }
    }, [alreadyUploaded])



    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        onUpload(newFileList.map(file => file && file.originFileObj))
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
            <Upload
                onRemove={(e) => {
                    if (fileList && fileList.length === 1) {
                        onError("There should be at least 1 image")
                        return false;
                    }
                    onSelectImageDeletion && onSelectImageDeletion(e.name);
                }}
                beforeUpload={() => false}
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*"
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
        </>
    );
};

export default FilesUpload;