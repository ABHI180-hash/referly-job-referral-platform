import { Request, Response } from 'express';
import { ScannerService } from '../services/scannerService';
import { Website } from '../models/Website';
import { ScanResult, ICheckItem } from '../models/ScanResult';
import { LaunchNotification } from '../models/LaunchNotification';
import { sendSuccess, sendError } from '../utils/response';

export class LaunchScanController {
  /**
   * Execute live scan on a website
   */
  public static async triggerScan(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      const { websiteId, url } = req.body;

      let targetUrl = url;
      let websiteDoc: any = null;

      if (websiteId) {
        websiteDoc = await Website.findById(websiteId);
        if (websiteDoc) {
          targetUrl = websiteDoc.url;
        }
      }

      if (!targetUrl) {
        sendError(res, 400, 'A target URL or valid website ID is required to execute scan.');
        return;
      }

      // Execute scanning engine with SSRF validation and live HTML / TLS analysis
      const scanPayload = await ScannerService.executeFullScan(targetUrl);

      // Create or update website doc
      if (!websiteDoc) {
        websiteDoc = await Website.findOne({ domain: scanPayload.domain, userId });
        if (!websiteDoc) {
          websiteDoc = await Website.create({
            userId,
            name: scanPayload.meta.title || scanPayload.domain,
            url: scanPayload.url,
            domain: scanPayload.domain,
            category: 'SaaS Platform',
            environment: 'production',
            readinessScore: scanPayload.readinessScore,
            launchStatus: scanPayload.launchStatus,
            totalScans: 1,
            lastScanAt: new Date(),
            sslValid: scanPayload.checks.find((c) => c.checkId === 6)?.status === 'passed',
            responseTimeMs: scanPayload.meta.responseTimeMs,
          });
        }
      }

      // Save ScanResult in database
      const scanResult = await ScanResult.create({
        websiteId: websiteDoc._id,
        userId,
        url: scanPayload.url,
        domain: scanPayload.domain,
        readinessScore: scanPayload.readinessScore,
        launchStatus: scanPayload.launchStatus,
        passedCount: scanPayload.passedCount,
        failedCount: scanPayload.failedCount,
        warningCount: scanPayload.warningCount,
        durationMs: scanPayload.durationMs,
        checks: scanPayload.checks,
      });

      // Update website document with fresh telemetry
      websiteDoc.readinessScore = scanPayload.readinessScore;
      websiteDoc.launchStatus = scanPayload.launchStatus;
      websiteDoc.lastScanAt = new Date();
      websiteDoc.totalScans = (websiteDoc.totalScans || 0) + 1;
      websiteDoc.sslValid = scanPayload.checks.find((c) => c.checkId === 6)?.status === 'passed';
      websiteDoc.responseTimeMs = scanPayload.meta.responseTimeMs;
      await websiteDoc.save();

      // Trigger automatic launch notification if critical failures exist
      if (scanPayload.launchStatus === 'NO-GO') {
        const failedChecks = scanPayload.checks.filter((c) => c.status === 'failed').map((c) => c.name);
        await LaunchNotification.create({
          userId,
          websiteId: websiteDoc._id,
          title: `Launch NO-GO Advisory: ${websiteDoc.name}`,
          message: `Mandatory check(s) failed: ${failedChecks.join(', ')}. Readiness at ${scanPayload.readinessScore}%.`,
          type: 'critical',
        });
      } else if (scanPayload.launchStatus === 'GO') {
        await LaunchNotification.create({
          userId,
          websiteId: websiteDoc._id,
          title: `Launch Pad Cleared (GO): ${websiteDoc.name}`,
          message: `All mandatory launch-readiness gates passed! Readiness score reached ${scanPayload.readinessScore}%.`,
          type: 'success',
        });
      }

      sendSuccess(res, 200, 'Website scan completed successfully.', {
        scanResult,
        website: websiteDoc,
      });
    } catch (err: any) {
      sendError(res, 500, `Scanner execution error: ${err.message}`);
    }
  }

  /**
   * Get latest scan for a website
   */
  public static async getLatestScan(req: Request, res: Response): Promise<void> {
    try {
      const { websiteId } = req.params;
      const latest = await ScanResult.findOne({ websiteId }).sort({ createdAt: -1 });

      if (!latest) {
        sendError(res, 404, 'No scan record found for this website.');
        return;
      }

      sendSuccess(res, 200, 'Latest scan report retrieved.', latest);
    } catch (err: any) {
      sendError(res, 500, `Failed to fetch scan report: ${err.message}`);
    }
  }

  /**
   * Get scan history list
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      const { websiteId, limit = 20 } = req.query;

      const query: any = { userId };
      if (websiteId) {
        query.websiteId = websiteId;
      }

      const scans = await ScanResult.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      sendSuccess(res, 200, 'Scan history retrieved.', scans);
    } catch (err: any) {
      sendError(res, 500, `Error fetching scan history: ${err.message}`);
    }
  }

  /**
   * Manual verification of a check (e.g. Payment Gateway or Backup test)
   */
  public static async manualVerifyCheck(req: Request, res: Response): Promise<void> {
    try {
      const { scanId } = req.params;
      const { checkId, note, status = 'passed' } = req.body;

      const scan = await ScanResult.findById(scanId);
      if (!scan) {
        sendError(res, 404, 'Scan record not found.');
        return;
      }

      const check = scan.checks.find((c) => c.checkId === Number(checkId));
      if (!check) {
        sendError(res, 404, `Check ID #${checkId} not found in scan.`);
        return;
      }

      check.status = status;
      check.isManualVerified = true;
      check.verificationNote = note || 'Verified manually by developer/site administrator.';
      check.score = status === 'passed' ? 100 : status === 'warning' ? 70 : 0;
      check.details = `Manual confirmation: ${check.verificationNote}`;

      // Recalculate score
      const totalScore = scan.checks.reduce((acc, c) => acc + c.score, 0);
      scan.readinessScore = Math.round(totalScore / scan.checks.length);
      scan.passedCount = scan.checks.filter((c) => c.status === 'passed').length;
      scan.failedCount = scan.checks.filter((c) => c.status === 'failed').length;
      scan.warningCount = scan.checks.filter((c) => c.status === 'warning').length;

      const mandatoryChecks = scan.checks.filter((c) => c.isMandatory);
      if (mandatoryChecks.some((c) => c.status === 'failed') || scan.readinessScore < 75) {
        scan.launchStatus = 'NO-GO';
      } else if (scan.warningCount > 0) {
        scan.launchStatus = 'CONDITIONAL';
      } else {
        scan.launchStatus = 'GO';
      }

      await scan.save();

      // Update parent website
      await Website.findByIdAndUpdate(scan.websiteId, {
        readinessScore: scan.readinessScore,
        launchStatus: scan.launchStatus,
      });

      sendSuccess(res, 200, `Check #${checkId} (${check.name}) updated successfully.`, scan);
    } catch (err: any) {
      sendError(res, 500, `Failed to update manual verification: ${err.message}`);
    }
  }

  /**
   * Compare two scan reports
   */
  public static async compareScans(req: Request, res: Response): Promise<void> {
    try {
      const { id1, id2 } = req.query;
      if (!id1 || !id2) {
        sendError(res, 400, 'Two scan IDs (id1, id2) are required for comparison.');
        return;
      }

      const scan1 = await ScanResult.findById(id1);
      const scan2 = await ScanResult.findById(id2);

      if (!scan1 || !scan2) {
        sendError(res, 404, 'One or both scan records not found.');
        return;
      }

      const checkDiffs = scan1.checks.map((c1) => {
        const c2 = scan2.checks.find((c) => c.checkId === c1.checkId);
        return {
          checkId: c1.checkId,
          name: c1.name,
          category: c1.category,
          scan1Status: c1.status,
          scan2Status: c2 ? c2.status : 'not_checked',
          scan1Score: c1.score,
          scan2Score: c2 ? c2.score : 0,
          improved: c2 ? c2.score > c1.score : false,
          regressed: c2 ? c2.score < c1.score : false,
        };
      });

      sendSuccess(res, 200, 'Comparison completed.', {
        scan1: { id: scan1._id, date: scan1.createdAt, score: scan1.readinessScore, status: scan1.launchStatus },
        scan2: { id: scan2._id, date: scan2.createdAt, score: scan2.readinessScore, status: scan2.launchStatus },
        scoreDelta: scan2.readinessScore - scan1.readinessScore,
        checkDiffs,
      });
    } catch (err: any) {
      sendError(res, 500, `Failed to compare scans: ${err.message}`);
    }
  }
}
