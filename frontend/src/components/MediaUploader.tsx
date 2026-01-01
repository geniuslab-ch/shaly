import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { apiService } from '../services/api';

interface UploadedMedia {
    url: string;
    type: 'image' | 'video';
    publicId: string;
    file: File;
}

interface MediaUploaderProps {
    onMediaChange: (media: UploadedMedia[]) => void;
    maxFiles?: number;
    acceptVideo?: boolean;
}

export default function MediaUploader({ onMediaChange, maxFiles = 9, acceptVideo = true }: MediaUploaderProps) {
    const [media, setMedia] = useState<UploadedMedia[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Check max files
        if (media.length + files.length > maxFiles) {
            alert(`Maximum ${maxFiles} fichiers autorisés`);
            return;
        }

        setUploading(true);
        const newMedia: UploadedMedia[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                if (!isImage && !isVideo) {
                    alert(`${file.name}: Type de fichier non supporté`);
                    continue;
                }

                if (isVideo && !acceptVideo) {
                    alert('Vidéos non autorisées pour ce type de post');
                    continue;
                }

                // Validate file size
                const maxSize = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024; // 200MB video, 10MB image
                if (file.size > maxSize) {
                    alert(`${file.name}: Fichier trop volumineux (max ${isVideo ? '200' : '10'}MB)`);
                    continue;
                }

                // Upload to Cloudinary
                const result = await apiService.uploadMedia(file);
                newMedia.push({
                    url: result.url,
                    type: result.type as 'image' | 'video',
                    publicId: result.publicId,
                    file
                });
            }

            const updatedMedia = [...media, ...newMedia];
            setMedia(updatedMedia);
            onMediaChange(updatedMedia);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    }, [media, maxFiles, acceptVideo, onMediaChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleFiles(e.target.files);
    };

    const removeMedia = async (index: number) => {
        const item = media[index];
        try {
            await apiService.deleteMedia(item.publicId);
            const updatedMedia = media.filter((_, i) => i !== index);
            setMedia(updatedMedia);
            onMediaChange(updatedMedia);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                        ? 'border-linkedin-500 bg-linkedin-500/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="media-upload"
                    multiple
                    accept={acceptVideo ? "image/*,video/*" : "image/*"}
                    onChange={handleChange}
                    className="hidden"
                    disabled={uploading || media.length >= maxFiles}
                />

                <label
                    htmlFor="media-upload"
                    className={`cursor-pointer ${uploading || media.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-white mb-2">
                        {uploading ? 'Upload en cours...' : 'Glissez vos fichiers ici'}
                    </p>
                    <p className="text-sm text-gray-400">
                        ou cliquez pour sélectionner ({media.length}/{maxFiles})
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {acceptVideo ? 'Images (10MB max) ou Vidéos (200MB max)' : 'Images uniquement (10MB max)'}
                    </p>
                </label>
            </div>

            {/* Media Preview Grid */}
            {media.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {media.map((item, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden bg-white/5">
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-800">
                                    <Video className="w-8 h-8 text-gray-400" />
                                    <span className="ml-2 text-sm text-gray-400">Vidéo</span>
                                </div>
                            )}

                            {/* Remove button */}
                            <button
                                onClick={() => removeMedia(index)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Supprimer"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            {/* Type badge */}
                            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                                {item.type === 'image' ? (
                                    <ImageIcon className="w-4 h-4 text-white" />
                                ) : (
                                    <Video className="w-4 h-4 text-white" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
