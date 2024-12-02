import React, { useState } from 'react';
import {
  Alert,
  Button,
  DropEvent,
  FileUpload,
  FileUploadProps,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
  ModalVariant,
  Progress,
  ProgressSize,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { useUserStore } from '../../store/userState';
import Papa from 'papaparse';

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CSVUser {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const ImportUsersModal: React.FC<ImportUsersModalProps> = ({ isOpen, onClose }) => {
  const { createUser, users } = useUserStore();
  const [value, setValue] = useState('');
  const [filename, setFilename] = useState('');
  const [isFileRejected, setIsFileRejected] = useState(false);
  const [parsedUsers, setParsedUsers] = useState<CSVUser[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [skippedUsers, setSkippedUsers] = useState<CSVUser[]>([]);

  const validateUsers = (newUsers: CSVUser[]): string[] => {
    const errors: string[] = [];
    const validUsers: CSVUser[] = [];
    const skipped: CSVUser[] = [];

    const existingUsernames = new Set(users?.map(u => u.username.toLowerCase()) || []);

    newUsers.forEach((user, index) => {
      let hasError = false;

      if (existingUsernames.has(user.username.toLowerCase())) {
        skipped.push(user);
        return;
      }

      if (!user.username || user.username.length < 3) {
        errors.push(`Row ${index + 1}: Username must be at least 3 characters`);
        hasError = true;
      }
      if (!user.name || user.name.length < 2) {
        errors.push(`Row ${index + 1}: Name must be at least 2 characters`);
        hasError = true;
      }
      if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push(`Row ${index + 1}: Invalid email address`);
        hasError = true;
      }
      if (!user.password || user.password.length < 8) {
        errors.push(`Row ${index + 1}: Password must be at least 8 characters`);
        hasError = true;
      }
      if (!['user', 'admin'].includes(user.role)) {
        errors.push(`Row ${index + 1}: Role must be either 'user' or 'admin'`);
        hasError = true;
      }

      if (!hasError) {
        validUsers.push(user);
      }
    });

    setParsedUsers(validUsers);
    setSkippedUsers(skipped);

    return errors;
  };

  const handleFileInputChange = (event: DropEvent, file: File) => {
    setFilename(file.name);
    setSelectedFile(file);
    setIsFileRejected(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      const content = reader.result as string;
      setValue(content);

      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed results:', results);
          const users = results.data as CSVUser[];
          setParsedUsers(users);
          const errors = validateUsers(users);
          setValidationErrors(errors);
        },
        error: (error) => {
          console.error('Parse error:', error);
          setIsFileRejected(true);
        }
      });
    };

    reader.readAsText(file);
  };

  const handleDataChange: FileUploadProps['onDataChange'] = (_, value) => {
    setValue(value);
  };

  const handleClear: FileUploadProps['onClearClick'] = () => {
    setFilename('');
    setValue('');
    setIsFileRejected(false);
    setSelectedFile(null);
    setParsedUsers([]);
    setValidationErrors([]);
  };

  const handleFileRejected = () => {
    setIsFileRejected(true);
    setSelectedFile(null);
    setParsedUsers([]);
    setValidationErrors([]);
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportErrors([]);
    const errors: string[] = [];

    for (let i = 0; i < parsedUsers.length; i++) {
      try {
        await createUser(parsedUsers[i]);
        setImportProgress(((i + 1) / parsedUsers.length) * 100);
      } catch (error) {
        errors.push(`Failed to create user ${parsedUsers[i].username}: ${(error as Error).message}`);
      }
    }

    setImportErrors(errors);
    setIsImporting(false);
    if (errors.length === 0) {
      setTimeout(onClose, 1500);
    }
  };

  const downloadTemplate = () => {
    const template = 'username,name,email,password,role\njohn_doe,John Doe,john@example.com,password123,user\njane_admin,Jane Smith,jane@example.com,password456,admin';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.large}
      title="Import Users"
      aria-label="Import users modal"
      height="80%"
    >
      <ModalHeader
        title="Import Users from CSV"
      />
      <ModalBody>
        <Wizard
          onClose={onClose}
          onSave={handleImport}
          height={620}
          title="Import Users from CSV"
        >
          <WizardStep
            name="Upload CSV"
            id="upload-step"
            footer={{ nextButtonText: 'Validate', isNextDisabled: !selectedFile || isFileRejected }}
          >
            <FileUpload
              id="csv-upload"
              type="text"
              value={value}
              filename={filename}
              filenamePlaceholder="Drag and drop a CSV file or click to upload"
              onFileInputChange={handleFileInputChange}
              onDataChange={handleDataChange}
              onClearClick={handleClear}
              dropzoneProps={{
                accept: { 'text/csv': ['.csv'] },
                maxSize: 5 * 1024 * 1024, // 5MB
                onDropRejected: handleFileRejected
              }}
              validated={isFileRejected ? 'error' : 'default'}
              browseButtonText="Upload CSV"
            />

            {parsedUsers.length > 0 && (
              <Alert
                variant="info"
                isInline
                title={`Found ${parsedUsers.length} users in CSV file`}
                style={{ marginTop: '1rem' }}
              />
            )}

            <Button
              variant="link"
              onClick={downloadTemplate}
              style={{ marginTop: '1rem' }}
            >
              Download CSV Template
            </Button>

            <Alert
              variant="info"
              isInline
              title="CSV Format"
              style={{ marginTop: '1rem' }}
            >
              <p>The CSV file should have the following columns:</p>
              <List>
                <ListItem>username (required)</ListItem>
                <ListItem>name (required)</ListItem>
                <ListItem>email (required)</ListItem>
                <ListItem>password (required)</ListItem>
                <ListItem>role (required, must be &apos;user&apos; or &apos;admin&apos;)</ListItem>
              </List>
            </Alert>
          </WizardStep>

          <WizardStep
            name="Validate"
            id="validate-step"
            footer={{
              nextButtonText: 'Import',
              isNextDisabled: validationErrors.length > 0 || parsedUsers.length === 0
            }}
          >
            {validationErrors.length > 0 ? (
              <Alert
                variant="danger"
                isInline
                title="Validation Errors"
              >
                <List>
                  {validationErrors.map((error, index) => (
                    <ListItem key={index}>{error}</ListItem>
                  ))}
                </List>
              </Alert>
            ) : (
              <>
                <Alert
                  variant="success"
                  isInline
                  title={`Ready to import ${parsedUsers.length} users`}
                />
                {skippedUsers.length > 0 && (
                  <Alert
                    variant="warning"
                    isInline
                    title={`${skippedUsers.length} users will be skipped (usernames already exist)`}
                    style={{ marginTop: '1rem' }}
                  >
                    <List>
                      {skippedUsers.map((user, index) => (
                        <ListItem key={index}>
                          {user.username} ({user.email})
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}
              </>
            )}
          </WizardStep>

          <WizardStep
            name="Import"
            id="import-step"
            footer={{ nextButtonText: 'Finish', isNextDisabled: isImporting }}
          >
            <Progress
              value={importProgress}
              title="Importing users..."
              size={ProgressSize.lg}
            />
            {importErrors.length > 0 && (
              <Alert
                variant="danger"
                isInline
                title="Import Errors"
                style={{ marginTop: '1rem' }}
              >
                <List>
                  {importErrors.map((error, index) => (
                    <ListItem key={index}>{error}</ListItem>
                  ))}
                </List>
              </Alert>
            )}
            {importProgress === 100 && importErrors.length === 0 && (
              <Alert
                variant="success"
                isInline
                title="Import Complete"
                style={{ marginTop: '1rem' }}
              >
                All users have been successfully imported.
              </Alert>
            )}
          </WizardStep>
        </Wizard>
      </ModalBody>
    </Modal>
  );
};
