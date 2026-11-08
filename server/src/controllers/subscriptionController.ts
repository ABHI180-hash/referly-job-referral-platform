import { Request, Response, NextFunction } from 'express';
import { Subscription } from '../models/Subscription';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true });
    sendSuccess(res, 200, 'Subscription plans retrieved.', plans);
  } catch (error) {
    next(error);
  }
};

export const getMySubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    let subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      subscription = await Subscription.create({
        user: userId,
        plan: 'free',
        status: 'active',
      });
    }

    const planConfig = await SubscriptionPlan.findOne({ planId: subscription.plan });
    const maxReferrals = planConfig?.limits?.referralsPerMonth ?? (subscription.plan === 'free' ? 2 : 15);

    sendSuccess(res, 200, 'Subscription details retrieved.', {
      subscription,
      planConfig,
      quotaRemaining: Math.max(0, maxReferrals - subscription.referralsUsedThisMonth),
      quotaLimit: maxReferrals,
    });
  } catch (error) {
    next(error);
  }
};

export const upgradePlan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { planId, billingCycle = 'yearly' } = req.body;

    if (!['free', 'pro', 'enterprise'].includes(planId)) {
      sendError(res, 400, "Invalid plan ID. Must be 'free', 'pro', or 'enterprise'.");
      return;
    }

    const planConfig = await SubscriptionPlan.findOne({ planId });
    const amount = billingCycle === 'yearly' ? planConfig?.yearlyPrice : planConfig?.monthlyPrice;

    const subscription = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        plan: planId,
        billingCycle,
        status: 'active',
        amount: amount || 0,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        referralsUsedThisMonth: 0, // Reset counter on upgrade
      },
      { upsert: true, new: true }
    );

    sendSuccess(res, 200, `Successfully upgraded to Referly ${planId.toUpperCase()}!`, subscription);
  } catch (error) {
    next(error);
  }
};
