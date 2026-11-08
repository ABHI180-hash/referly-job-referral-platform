import { Request, Response } from 'express';
import { Website } from '../models/Website';
import { ScanResult } from '../models/ScanResult';
import { sendSuccess, sendError } from '../utils/response';

export class LaunchAnalyticsController {
  /**
   * Get telemetry analytics for specific website or user fleet
   */
  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      const { websiteId } = req.query;

      const websiteQuery: any = { userId };
      if (websiteId) {
        websiteQuery._id = websiteId;
      }

      const websites = await Website.find(websiteQuery);
      const totalWebsites = websites.length;
      const goCount = websites.filter((w) => w.launchStatus === 'GO').length;
      const noGoCount = websites.filter((w) => w.launchStatus === 'NO-GO').length;
      const conditionalCount = websites.filter((w) => w.launchStatus === 'CONDITIONAL').length;

      // Average fleet readiness
      const avgReadiness = totalWebsites > 0
        ? Math.round(websites.reduce((acc, w) => acc + w.readinessScore, 0) / totalWebsites)
        : 0;

      // Fetch scan history for trends
      const scanQuery: any = { userId };
      if (websiteId) {
        scanQuery.websiteId = websiteId;
      }

      const recentScans = await ScanResult.find(scanQuery)
        .sort({ createdAt: -1 })
        .limit(10);

      const latestScan = recentScans[0];

      // Breakdown by category
      let categoryBreakdown: Record<string, { total: number; passed: number; scoreSum: number }> = {};
      if (latestScan) {
        latestScan.checks.forEach((c) => {
          if (!categoryBreakdown[c.category]) {
            categoryBreakdown[c.category] = { total: 0, passed: 0, scoreSum: 0 };
          }
          categoryBreakdown[c.category].total += 1;
          if (c.status === 'passed') categoryBreakdown[c.category].passed += 1;
          categoryBreakdown[c.category].scoreSum += c.score;
        });
      }

      const categoryMetrics = Object.entries(categoryBreakdown).map(([category, data]) => ({
        category: category.toUpperCase(),
        score: Math.round(data.scoreSum / data.total),
        passRate: Math.round((data.passed / data.total) * 100),
      }));

      // Timeline trend for charts (chronological)
      const timelineTrends = [...recentScans].reverse().map((scan) => ({
        date: new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        readinessScore: scan.readinessScore,
        durationMs: scan.durationMs,
        passed: scan.passedCount,
        failed: scan.failedCount,
        warnings: scan.warningCount,
      }));

      sendSuccess(res, 200, 'Analytics telemetry retrieved.', {
        overview: {
          totalWebsites,
          avgReadiness,
          goCount,
          noGoCount,
          conditionalCount,
          latestScanDate: latestScan?.createdAt || null,
        },
        categoryMetrics,
        timelineTrends,
        latestScanSummary: latestScan ? {
          readinessScore: latestScan.readinessScore,
          launchStatus: latestScan.launchStatus,
          passedCount: latestScan.passedCount,
          failedCount: latestScan.failedCount,
          warningCount: latestScan.warningCount,
        } : null,
      });
    } catch (err: any) {
      sendError(res, 500, `Failed to compile analytics: ${err.message}`);
    }
  }
}
