import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  lazy?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  placeholder,
  lazy = true,
  quality = 85,
  sizes,
  className = '',
  onLoad,
  onError,
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      {
        rootMargin: '50px 0px', // Load 50px before entering viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, isInView]);

  // Generate optimized image URLs for different screen densities
  const generateSrcSet = useCallback((baseSrc: string) => {
    // If it's already an optimized URL or external URL, return as is
    if (baseSrc.includes('?') || baseSrc.startsWith('http')) {
      return baseSrc;
    }

    const baseUrl = baseSrc.split('.')[0];
    const extension = baseSrc.split('.').pop();

    // Generate WebP versions for better compression
    const webpSrcSet = [
      `${baseUrl}-480.webp 480w`,
      `${baseUrl}-768.webp 768w`,
      `${baseUrl}-1024.webp 1024w`,
      `${baseUrl}-1200.webp 1200w`
    ].join(', ');

    // Fallback to original format
    const fallbackSrcSet = [
      `${baseUrl}-480.${extension} 480w`,
      `${baseUrl}-768.${extension} 768w`,
      `${baseUrl}-1024.${extension} 1024w`,
      `${baseUrl}-1200.${extension} 1200w`
    ].join(', ');

    return { webpSrcSet, fallbackSrcSet };
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    if (onError) onError();
  }, [onError]);

  // Generate default sizes if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const containerStyle: React.CSSProperties = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isLoaded ? 1 : 0
  };

  // Show skeleton while loading
  if (!isInView || (!isLoaded && !hasError)) {
    return (
      <Box ref={imgRef} className={className} sx={containerStyle}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            borderRadius: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.06)'
          }}
        />
      </Box>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <Box
        className={className}
        sx={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        Failed to load image
      </Box>
    );
  }

  const srcSetData = generateSrcSet(src);

  return (
    <Box ref={imgRef} className={className} sx={containerStyle}>
      {/* Show skeleton while image loads */}
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.06)'
          }}
        />
      )}

      {/* Use picture element for WebP support with fallbacks */}
      <picture>
        {typeof srcSetData === 'object' && (
          <>
            <source
              srcSet={srcSetData.webpSrcSet}
              sizes={defaultSizes}
              type="image/webp"
            />
            <source
              srcSet={srcSetData.fallbackSrcSet}
              sizes={defaultSizes}
            />
          </>
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          // Add importance hint for above-the-fold images
          fetchPriority={lazy ? 'low' : 'high'}
        />
      </picture>
    </Box>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;