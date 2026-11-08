import { Request, Response } from 'express';
import { Website, IWebsite, EnvironmentType } from '../models/Website';
import { ScanResult } from '../models/ScanResult';
import { sendSuccess, sendError } from '../utils/response';

export class LaunchWebsiteController {
  // Get all websites for authenticated user or demo default
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      let websites = await Website.find({ userId }).sort({ isStarred: -1, updatedAt: -1 });

      // If user has no websites, create starter seed websites
      if (websites.length === 0) {
        const defaultSites = [
          {
            userId,
            name: 'LaunchPilot Production App',
            url: 'https://launchpilot.dev',
            domain: 'launchpilot.dev',
            category: 'Developer Tools',
            environment: 'production' as EnvironmentType,
            readinessScore: 92,
            launchStatus: 'GO',
            lastScanAt: new Date(),
            totalScans: 4,
            isStarred: true,
            sslValid: true,
            responseTimeMs: 240,
          },
          {
            userId,
            name: 'Acme SaaS Cloud Platform',
            url: 'https://acme-cloud.io',
            domain: 'acme-cloud.io',
            category: 'SaaS Platform',
            environment: 'staging' as EnvironmentType,
            readinessScore: 68,
            launchStatus: 'NO-GO',
            lastScanAt: new Date(Date.now() - 3600000 * 5),
            totalScans: 2,
            isStarred: false,
            sslValid: true,
            responseTimeMs: 820,
          },
          {
            userId,
            name: 'Apex Commerce Storefront',
            url: 'https://apexcommerce.store',
            domain: 'apexcommerce.store',
            category: 'E-commerce',
            environment: 'production' as EnvironmentType,
            readinessScore: 78,
            launchStatus: 'CONDITIONAL',
            lastScanAt: new Date(Date.now() - 3600000 * 24),
            totalScans: 6,
            isStarred: false,
            sslValid: true,
            responseTimeMs: 1420,
          },
        ];

        await Website.create(defaultSites);
        websites = await Website.find({ userId }).sort({ isStarred: -1, updatedAt: -1 });
      }

      sendSuccess(res, 200, 'Websites retrieved successfully.', websites);
    } catch (err: any) {
      sendError(res, 500, `Failed to retrieve websites: ${err.message}`);
    }
  }

  // Get single website with scan history
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const website = await Website.findById(id);
      if (!website) {
        sendError(res, 404, 'Website not found');
        return;
      }

      const recentScans = await ScanResult.find({ websiteId: id }).sort({ createdAt: -1 }).limit(10);
      sendSuccess(res, 200, 'Website retrieved.', { website, recentScans });
    } catch (err: any) {
      sendError(res, 500, `Error fetching website: ${err.message}`);
    }
  }

  // Create new website
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      const { name, url, category, environment } = req.body;

      if (!name || !url) {
        sendError(res, 400, 'Name and valid URL are required');
        return;
      }

      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const parsed = new URL(formattedUrl);
      const domain = parsed.hostname;

      const website = await Website.create({
        userId,
        name: name.trim(),
        url: formattedUrl,
        domain,
        category: category || 'SaaS',
        environment: environment || 'production',
        readinessScore: 0,
        launchStatus: 'NOT_SCANNED',
        totalScans: 0,
      });

      sendSuccess(res, 201, 'Website added to Launch Control Center.', website);
    } catch (err: any) {
      sendError(res, 500, `Failed to create website: ${err.message}`);
    }
  }

  // Update website details
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, category, environment, isStarred } = req.body;

      const website = await Website.findByIdAndUpdate(
        id,
        {
          ...(name && { name: name.trim() }),
          ...(category && { category }),
          ...(environment && { environment }),
          ...(isStarred !== undefined && { isStarred }),
        },
        { new: true }
      );

      if (!website) {
        sendError(res, 404, 'Website not found');
        return;
      }

      sendSuccess(res, 200, 'Website updated successfully.', website);
    } catch (err: any) {
      sendError(res, 500, `Failed to update website: ${err.message}`);
    }
  }

  // Delete website and associated scan records
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Website.findByIdAndDelete(id);
      await ScanResult.deleteMany({ websiteId: id });
      sendSuccess(res, 200, 'Website and scan history deleted.');
    } catch (err: any) {
      sendError(res, 500, `Failed to delete website: ${err.message}`);
    }
  }
}
