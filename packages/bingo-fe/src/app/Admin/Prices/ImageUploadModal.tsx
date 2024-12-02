import React from 'react';
import {
  Button,
  DropEvent,
  FileUpload,
  FileUploadHelperText,
  FileUploadProps,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { usePriceStore } from '../../store/priceState';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceId: number;
  priceName: string;
  onUploadComplete?: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  priceId,
  priceName,
  onUploadComplete
}) => {
  const { uploadPriceImage } = usePriceStore();
  const [value, setValue] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileInputChange = (_: React.ChangeEvent<HTMLInputElement>, file: File) => {
    setFilename(file.name);
    setSelectedFile(file);
    setIsRejected(false);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDataChange: FileUploadProps['onDataChange'] = (_, value) => {
    setValue(value);
  };

  const handleClear: FileUploadProps['onClearClick'] = () => {
    setFilename('');
    setValue('');
    setIsRejected(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileRejected = () => {
    setIsRejected(true);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileReadStarted: FileUploadProps['onReadStarted'] = () => {
    setIsLoading(true);
  };

  const handleFileReadFinished: FileUploadProps['onReadFinished'] = () => {
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      await uploadPriceImage(priceId, selectedFile);
      onUploadComplete?.();
      onClose();
    } catch (error) {
      setIsRejected(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Image for ${priceName}`}
      variant="medium"
      position="top"
    >
      <ModalHeader title={`Upload Image for ${priceName}`} />
      <ModalBody>
        <Form>
          <FormGroup fieldId="image-upload">
            <FileUpload
              id="image-upload"
              type="dataURL"
              value={value}
              filename={filename}
              filenamePlaceholder="Drag and drop an image or upload one"
              onFileInputChange={(event: DropEvent, file: File) => handleFileInputChange(event as React.ChangeEvent<HTMLInputElement>, file)}
              onDataChange={handleDataChange}
              onReadStarted={handleFileReadStarted}
              onReadFinished={handleFileReadFinished}
              onClearClick={handleClear}
              isLoading={isLoading}
              dropzoneProps={{
                accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
                maxSize: 5 * 1024 * 1024, // 5MB
                onDropRejected: handleFileRejected
              }}
              validated={isRejected ? 'error' : 'default'}
              browseButtonText="Upload"
              browseButtonAriaDescribedby="image-upload-helpText"
            >
              <FileUploadHelperText>
                <HelperText isLiveRegion>
                  <HelperTextItem id="image-upload-helpText" variant={isRejected ? 'error' : 'default'}>
                    {isRejected ? (
                      <>
                        <Icon status="danger">
                          <ExclamationCircleIcon />
                        </Icon>
                        Must be an image file (PNG, JPG, GIF) no larger than 5MB
                      </>
                    ) : (
                      'Upload an image (PNG, JPG, GIF, max 5MB)'
                    )}
                  </HelperTextItem>
                </HelperText>
              </FileUploadHelperText>
            </FileUpload>
          </FormGroup>

          {previewUrl && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Preview:</h4>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="upload"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={!selectedFile || isLoading || isRejected}
          isLoading={isLoading}
        >
          Upload Image
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
