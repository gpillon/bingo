import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authState';
import { Spinner } from '@patternfly/react-core';

interface AuthenticatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(src, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to load image');

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src, token]);

  if (loading) {
    return <Spinner size="md" />;
  }

  if (error || !imageSrc) {
    return null; // or a fallback image
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};
