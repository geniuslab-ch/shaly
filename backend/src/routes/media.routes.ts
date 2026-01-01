import { Router, Request, Response } from 'express';
import { AuthRequest } from '../types';
import { authenticateToken } from '../middleware/auth';
import cloudinary from '../config/cloudinary';
import multer from 'multer';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB max for videos
    },
    fileFilter: (req, file, cb) => {
        // Accept images and videos only
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and videos are allowed.'));
        }
    }
});

// All routes require authentication
router.use(authenticateToken);

/**
 * POST /api/media/upload
 * Upload image or video to Cloudinary
 */
router.post('/upload', upload.single('file'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.user!.id;
        const file = req.file;
        const isVideo = file.mimetype.startsWith('video/');

        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `shaly/${userId}`,
                    resource_type: isVideo ? 'video' : 'image',
                    transformation: isVideo ? [] : [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto:good' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(file.buffer);
        });

        res.json({
            success: true,
            url: uploadResult.secure_url,
            type: isVideo ? 'video' : 'image',
            width: uploadResult.width,
            height: uploadResult.height,
            publicId: uploadResult.public_id
        });
    } catch (error: any) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ error: 'Failed to upload media' });
    }
});

/**
 * DELETE /api/media/:publicId
 * Delete media from Cloudinary
 */
router.delete('/:publicId', async (req: AuthRequest, res: Response) => {
    try {
        const { publicId } = req.params;
        const userId = req.user!.id;

        // Ensure the publicId belongs to the user
        if (!publicId.startsWith(`shaly/${userId}/`)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await cloudinary.uploader.destroy(publicId);

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting from Cloudinary:', error);
        res.status(500).json({ error: 'Failed to delete media' });
    }
});

export default router;
