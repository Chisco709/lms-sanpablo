"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

interface ImageDebugProps {
  courseId: string;
  imageUrl: string;
  title: string;
}

export const ImageDebug = ({ courseId, imageUrl, title }: ImageDebugProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Reset status when imageUrl changes
    setImageStatus('loading');
    setImageLoaded(false);
    
    // Log debug info
    const info = {
      courseId,
      imageUrl,
      title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    setDebugInfo(info);
    console.log('ImageDebug - Course info:', info);
  }, [courseId, imageUrl, title]);

  const handleImageLoad = () => {
    console.log(`ImageDebug ${courseId} - Image loaded successfully:`, imageUrl);
    setImageStatus('success');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error(`ImageDebug ${courseId} - Image failed to load:`, imageUrl);
    setImageStatus('error');
    setImageLoaded(false);
  };

  const refreshImage = () => {
    setImageStatus('loading');
    setImageLoaded(false);
    // Force re-render by updating timestamp
    setDebugInfo(prev => ({ ...prev, timestamp: new Date().toISOString() }));
  };

  const getImageSrc = () => {
    if (!imageUrl || imageUrl.trim() === '') {
      return '/logo-sanpablo.jpg';
    }
    return imageUrl;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Image Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">ID: {courseId}</p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={imageStatus === 'success' ? 'default' : imageStatus === 'error' ? 'destructive' : 'secondary'}
            className="flex items-center gap-1"
          >
            {imageStatus === 'success' && <CheckCircle className="h-3 w-3" />}
            {imageStatus === 'error' && <AlertCircle className="h-3 w-3" />}
            {imageStatus === 'loading' && <RefreshCw className="h-3 w-3 animate-spin" />}
            {imageStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Image Display */}
        <div className="relative aspect-video overflow-hidden rounded-lg border">
          <Image
            src={getImageSrc()}
            alt={`Debug: ${title}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-50'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            unoptimized={getImageSrc().startsWith('http')}
          />
          
          {/* Loading overlay */}
          {imageStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <RefreshCw className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* URL Info */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Image URL:</p>
          <p className="text-xs text-muted-foreground break-all">
            {imageUrl || 'NULL/EMPTY'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshImage}
            className="flex-1"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => console.log('Debug info:', debugInfo)}
          >
            Log Info
          </Button>
        </div>

        {/* Debug Info */}
        <details className="text-xs">
          <summary className="cursor-pointer font-medium">Debug Info</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}; 