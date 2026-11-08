import mongoose from 'mongoose';
import { User } from '../models/User';
import { SeekerProfile } from '../models/SeekerProfile';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { ReferralRequest } from '../models/ReferralRequest';
import { Application } from '../models/Application';
import { SavedJob } from '../models/SavedJob';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Subscription } from '../models/Subscription';

export const seedDatabase = async (): Promise<void> => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('[Seeder] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seeder] Initializing database with seed data...');

    // 1. Subscription Plans
    await SubscriptionPlan.create([
      {
        planId: 'free',
        name: 'Free',
        tagline: 'Ideal for casual job discovery and exploring networking opportunities.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        popular: false,
        ctaText: 'Get Started Free',
        limits: {
          referralsPerMonth: 2,
          applicationTracking: 'Basic (Up to 10 active)',
          profileBadge: false,
          priorityMatching: false,
        },
        features: [
          'Search & browse all verified job openings',
          'Basic career profile with resume upload',
          'Up to 2 referral requests per month',
          'Basic application status tracking',
          'Standard community support',
        ],
      },
      {
        planId: 'pro',
        name: 'Pro',
        tagline: 'Designed for ambitious professionals who want fast-tracked referrals and priority visibility.',
        monthlyPrice: 999,
        yearlyPrice: 799,
        popular: true,
        ctaText: 'Upgrade to Pro',
        limits: {
          referralsPerMonth: 15,
          applicationTracking: 'Advanced & Unlimited',
          profileBadge: true,
          priorityMatching: true,
        },
        features: [
          'Up to 15 verified referral requests per month',
          'Priority referrer inbox placement',
          'Verified "Referly Pro" profile badge',
          'Detailed company salary and hiring insights',
          'Unlimited application pipeline tracking',
          'Direct in-app messaging with referrers',
          'Priority email and chat support',
        ],
      },
      {
        planId: 'enterprise',
        name: 'Enterprise',
        tagline: 'Tailored for teams, talent agencies, and high-volume candidates seeking white-glove support.',
        monthlyPrice: 3499,
        yearlyPrice: 2999,
        popular: false,
        ctaText: 'Contact Enterprise',
        limits: {
          referralsPerMonth: 999,
          applicationTracking: 'Custom Analytics & Export',
          profileBadge: true,
          priorityMatching: true,
        },
        features: [
          'Unlimited employee referral requests',
          'Dedicated talent advocate & resume audit',
          '1-on-1 mock technical / behavioral interview',
          'Team & recruiter management seats',
          'Advanced recruitment metrics and CSV data exports',
          'Custom SLA with 24/7 priority support',
        ],
      },
    ]);

    // 2. Users
    const admin = await User.create({
      name: 'Vikramaditya Rao',
      email: 'admin@referly.io',
      password: 'Password123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      isEmailVerified: true,
    });

    await User.create({
      name: 'Referly Administrator',
      email: 'admin@referly.com',
      password: 'Password123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      isEmailVerified: true,
    });

    const seeker = await User.create({
      name: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      password: 'Password123!',
      role: 'seeker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      isEmailVerified: true,
    });

    await User.create({
      name: 'Referly Candidate',
      email: 'seeker@referly.com',
      password: 'Password123!',
      role: 'seeker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      isEmailVerified: true,
    });

    const referrer = await User.create({
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@figma.com',
      password: 'Password123!',
      role: 'referrer',
      avatar: 'https://images.openai.com/static-rsc-4/wcZQrGOHLRSZgfrY-OeL9LO4FjHdwwHG2RiiD_RfHK6ac7W75Dk7o2jtF_OypMx__EWQfyU0cXslOXysxxsfYcagw7KjkIbgnKNjNCHvnJgKNWDI99RhgP3CaRiQ80twTJoExYsheVnJKkK9wr1-4PaXyXD6BVL7JKvKzKu0-EE?purpose=inline',
      status: 'active',
      isEmailVerified: true,
    });

    const referrer2 = await User.create({
      name: 'Ethan Parker',
      email: 'ethan.parker@vercel.com',
      password: 'Password123!',
      role: 'referrer',
      avatar: 'https://images.openai.com/static-rsc-4/UQCDet-eM0wWVSuvKNC0QVYveM_rIWGcuWrF0afgLIRf9uEBSgkCiVhY1sdF_1gyfetpN-LAU51_rOS83NBKJUhzRJz0-Op9rLeTofDU9WIGm_Cg6l-vNgJxMGv_uDgD6icYwsAUDxMz8zEB5oVkadfW7z06ierDIvTvvfB5efc?purpose=inline',
      status: 'active',
      isEmailVerified: true,
    });

    const referrer3 = await User.create({
      name: 'Olivia Bennett',
      email: 'olivia.bennett@linear.app',
      password: 'Password123!',
      role: 'referrer',
      avatar: 'https://images.openai.com/static-rsc-4/LrjTbrOtWAKF0CbMMwIXwRsa0kxQXA8_QB_Bd9gn0faOtatUB79V8BMh_BYCp4HwnAUODKXPDL6ssls67FJO_bLoHsKKBzJwLchz4wgPZQwQfZOaZVFYmeKXKnHYNBB9e4gHLSDOl391mK9i48KcOQl7BOi4yXAvttVxjGp6Ht4?purpose=inline',
      status: 'active',
      isEmailVerified: true,
    });

    const referrer4 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@stripe.com',
      password: 'Password123!',
      role: 'referrer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      isEmailVerified: true,
    });

    await User.create({
      name: 'Referly Referrer',
      email: 'referrer@referly.com',
      password: 'Password123!',
      role: 'referrer',
      avatar: 'https://images.openai.com/static-rsc-4/wcZQrGOHLRSZgfrY-OeL9LO4FjHdwwHG2RiiD_RfHK6ac7W75Dk7o2jtF_OypMx__EWQfyU0cXslOXysxxsfYcagw7KjkIbgnKNjNCHvnJgKNWDI99RhgP3CaRiQ80twTJoExYsheVnJKkK9wr1-4PaXyXD6BVL7JKvKzKu0-EE?purpose=inline',
      status: 'active',
      isEmailVerified: true,
    });

    // 3. Profiles
    await SeekerProfile.create({
      user: seeker._id,
      headline: 'Senior Frontend Engineer | React, TypeScript, Next.js',
      bio: 'Product-focused frontend engineer with 5+ years of experience crafting high-performance design systems and SaaS interfaces.',
      location: 'Bengaluru, India',
      education: 'B.Tech in Computer Science, NIT Karnataka (2019)',
      experienceYears: 5,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'GraphQL', 'Node.js'],
      linkedinUrl: 'https://linkedin.com/in/arjun-mehta-dev',
      githubUrl: 'https://github.com/arjunmehta',
      resumeName: 'Arjun_Mehta_Senior_Frontend_2026.pdf',
      resumeUrl: 'https://storage.referly.io/resumes/arjun_mehta.pdf',
      profileCompletion: 85,
    });

    await ReferrerProfile.create([
      {
        user: referrer._id,
        company: 'Figma',
        position: 'Senior Product Designer',
        department: 'Design Systems',
        experienceYears: 8,
        skills: ['Design Systems', 'Figma', 'User Research', 'UI/UX', 'Prototyping'],
        bio: 'Passionate about bridging designers and developers. Happy to review portfolios and refer talented product designers.',
        availability: 'Available',
        totalReferrals: 27,
        successRate: 92,
        linkedinUrl: 'https://linkedin.com/in/sarahmitchell-design',
        featured: true,
      },
      {
        user: referrer2._id,
        company: 'Vercel',
        position: 'Senior Frontend Engineer',
        department: 'Cloud Platform',
        experienceYears: 10,
        skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'Engineering Leadership'],
        bio: 'Leading frontend engineering teams. Actively looking to refer talented frontend, full-stack, and developer candidates.',
        availability: 'Available',
        totalReferrals: 38,
        successRate: 91,
        linkedinUrl: 'https://linkedin.com/in/ethanparker-tech',
        featured: true,
      },
      {
        user: referrer3._id,
        company: 'Linear',
        position: 'Principal Software Engineer',
        department: 'Core Architecture',
        experienceYears: 7,
        skills: ['React', 'TypeScript', 'Web Performance', 'System Design', 'JavaScript'],
        bio: 'Obsessed with software craftsmanship, keyboard shortcuts, and snappy UI. Happy to review portfolios and refer promising engineers.',
        availability: 'Available',
        totalReferrals: 19,
        successRate: 89,
        linkedinUrl: 'https://linkedin.com/in/oliviabennett-eng',
        featured: true,
      },
      {
        user: referrer4._id,
        company: 'Stripe',
        position: 'Staff Software Engineer',
        department: 'Core Infrastructure',
        experienceYears: 8,
        skills: ['System Design', 'Go', 'Distributed Systems', 'Kafka', 'Payments'],
        bio: '8+ years scaling financial infrastructure. Happy to refer senior engineers with strong distributed systems fundamentals.',
        availability: 'Available',
        totalReferrals: 42,
        successRate: 85,
        linkedinUrl: 'https://linkedin.com/in/priyasharma-tech',
        featured: true,
      },
    ]);

    // 4. Subscriptions
    await Subscription.create({
      user: seeker._id,
      plan: 'pro',
      status: 'active',
      billingCycle: 'yearly',
      amount: 799,
      referralsUsedThisMonth: 2,
    });

    // 5. Companies
    const companies = await Company.create([
      {
        name: 'Stripe',
        logo: '/logos/stripe.svg',
        industry: 'Financial Technology / Payments',
        location: 'Bengaluru, Dublin, San Francisco',
        employeeCount: '7,000+ employees',
        openPositions: 34,
        description: 'Financial infrastructure platform for businesses worldwide to accept payments and manage revenue.',
        website: 'https://stripe.com',
        featured: true,
      },
      {
        name: 'Vercel',
        logo: '/logos/vercel.svg',
        industry: 'Cloud Infrastructure & Developer Tools',
        location: 'Remote, Global',
        employeeCount: '800+ employees',
        openPositions: 18,
        description: 'Frontend cloud platform powering the modern web and empowering teams to build and deploy faster.',
        website: 'https://vercel.com',
        featured: true,
      },
      {
        name: 'Linear',
        logo: '/logos/linear.svg',
        industry: 'Productivity & Issue Tracking',
        location: 'Remote, Global',
        employeeCount: '120+ employees',
        openPositions: 9,
        description: 'Purpose-built tool for planning and building products with speed and precision.',
        website: 'https://linear.app',
        featured: true,
      },
      {
        name: 'Figma',
        logo: '/logos/figma.svg',
        industry: 'Design Software & Collaboration',
        location: 'San Francisco, London, Tokyo',
        employeeCount: '1,500+ employees',
        openPositions: 22,
        description: 'Collaborative interface design tool that connects teams from ideation to production.',
        website: 'https://figma.com',
        featured: true,
      },
      {
        name: 'Razorpay',
        logo: '/logos/razorpay.svg',
        industry: 'FinTech & Neo-banking',
        location: 'Bengaluru, India',
        employeeCount: '3,200+ employees',
        openPositions: 42,
        description: 'Full-stack financial services platform enabling payments, banking, and business finance.',
        website: 'https://razorpay.com',
        featured: true,
      },
      {
        name: 'CRED',
        logo: '/logos/cred.svg',
        industry: 'Consumer FinTech',
        location: 'Bengaluru, India',
        employeeCount: '1,100+ employees',
        openPositions: 15,
        description: 'Members-only club that rewards creditworthy individuals with exclusive financial perks.',
        website: 'https://cred.club',
        featured: false,
      },
      {
        name: 'Atlassian',
        logo: '/logos/atlassian.svg',
        industry: 'Enterprise Software & Team Collaboration',
        location: 'Bengaluru, Sydney, Remote',
        employeeCount: '11,000+ employees',
        openPositions: 28,
        description: 'Provider of collaboration and productivity software including Jira, Confluence, and Trello.',
        website: 'https://atlassian.com',
        featured: false,
      },
      {
        name: 'Swiggy',
        logo: '/logos/swiggy.svg',
        industry: 'Quick Commerce & On-demand Logistics',
        location: 'Bengaluru, Gurugram, India',
        employeeCount: '5,500+ employees',
        openPositions: 37,
        description: 'Leading consumer tech and hyper-local on-demand convenience ecosystem in India.',
        website: 'https://swiggy.com',
        featured: false,
      },
    ]);

    // 6. Jobs
    const jobs = await Job.create([
      {
        title: 'Senior Frontend Engineer (Design Systems)',
        company: 'Stripe',
        companyLogo: '/logos/stripe.svg',
        location: 'Bengaluru, India',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        experienceRange: '4 - 7 years',
        salary: '₹38L – ₹52L / yr',
        minSalary: 3800000,
        maxSalary: 5200000,
        department: 'Core Frontend Infrastructure',
        description: 'Stripe is looking for a Senior Frontend Engineer to champion our unified design systems and dashboard performance across millions of businesses globally.',
        responsibilities: [
          'Design, maintain, and evolve component libraries used by hundreds of Stripe product engineers.',
          'Ensure web accessibility (WCAG 2.1 AA compliance) and cross-browser consistency.',
          'Benchmark and optimize rendering performance and Core Web Vitals.',
        ],
        skills: ['React', 'TypeScript', 'Design Systems', 'CSS Architecture', 'Accessibility'],
        benefits: ['Generous equity (RSUs)', 'Medical insurance', 'Flexible home office setup allowance'],
        aboutCompany: 'Stripe powers payments for millions of businesses worldwide.',
        postedBy: referrer._id,
        featured: true,
        referrerCount: 14,
      },
      {
        title: 'Staff Full Stack Developer',
        company: 'Vercel',
        companyLogo: '/logos/vercel.svg',
        location: 'Remote (India / APAC)',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Lead / Staff',
        experienceRange: '7 - 10 years',
        salary: '₹55L – ₹75L / yr',
        minSalary: 5500000,
        maxSalary: 7500000,
        department: 'Vercel Platform & AI SDK',
        description: 'Help build the next generation of serverless developer platforms powering Next.js applications.',
        responsibilities: [
          'Architect and scale multi-region serverless infrastructure.',
          'Develop real-time streaming interfaces for Vercel AI SDK users.',
        ],
        skills: ['TypeScript', 'Node.js', 'Next.js', 'Go', 'Distributed Systems', 'PostgreSQL'],
        benefits: ['100% remote-first culture', 'Healthcare & mental wellness', 'Annual team retreats'],
        aboutCompany: 'Vercel provides developer platforms for the modern frontend web.',
        postedBy: referrer2._id,
        featured: true,
        referrerCount: 8,
      },
      {
        title: 'Product Engineer (Workflow & Automation)',
        company: 'Linear',
        companyLogo: '/logos/linear.svg',
        location: 'Remote (Worldwide)',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        experienceRange: '3 - 6 years',
        salary: '₹40L – ₹58L / yr',
        minSalary: 4000000,
        maxSalary: 5800000,
        department: 'Product Engineering',
        description: 'Linear is seeking a Product Engineer who obsesses over keyboard shortcuts and sub-50ms interaction latency.',
        responsibilities: [
          'Ship polished user interfaces with 60fps local sync architecture.',
          'Write features utilizing WebSockets and conflict resolution.',
        ],
        skills: ['TypeScript', 'React', 'Local-first Architecture', 'GraphQL', 'Tailwind CSS'],
        benefits: ['Competitive salary + early equity', 'Quarterly company offsites', 'Hardware setup provided'],
        aboutCompany: 'Linear is the issue tracking tool built for high-velocity teams.',
        postedBy: referrer3._id,
        featured: true,
        referrerCount: 6,
      },
    ]);

    // 7. Referral Requests
    const refReq1 = await ReferralRequest.create({
      seeker: seeker._id,
      referrer: referrer._id,
      job: jobs[0]._id,
      note: 'Hi Priya, I have been building design systems for 4+ years and closely track Stripe UI standards. Would be honored to get referred for the Bengaluru position!',
      resumeUrl: 'https://storage.referly.io/resumes/arjun_mehta.pdf',
      resumeName: 'Arjun_Mehta_Senior_Frontend_2026.pdf',
      status: 'Accepted',
      referrerResponse: 'Forwarded Arjun’s portfolio directly to hiring manager.',
      statusHistory: [
        { status: 'Pending', changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { status: 'Accepted', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      ],
    });

    // 8. Applications
    await Application.create([
      {
        seeker: seeker._id,
        job: jobs[0]._id,
        referralRequest: refReq1._id,
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Interview',
        notes: 'Referred by Priya Sharma (Staff Engineer).',
        feedback: 'Technical interview scheduled with hiring manager on Nov 10, 2026.',
        statusHistory: [
          { status: 'Applied', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Shortlisted', changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          { status: 'Interview', changedAt: new Date() },
        ],
      },
    ]);

    // 9. Saved Jobs
    await SavedJob.create([
      { user: seeker._id, job: jobs[0]._id },
      { user: seeker._id, job: jobs[1]._id },
    ]);

    // 10. Conversation & Messages
    const conv = await Conversation.create({
      participants: [seeker._id, referrer._id],
      relatedJob: jobs[0]._id,
      lastMessage: 'I reviewed your resume and internal profile; submitted the referral to the hiring manager!',
      lastMessageAt: new Date(),
    });

    await Message.create([
      {
        conversation: conv._id,
        sender: seeker._id,
        content: 'Hi Priya! Thanks for connecting on Referly. I noticed the Senior Frontend role on your team and would love to be considered.',
        isRead: true,
      },
      {
        conversation: conv._id,
        sender: referrer._id,
        content: 'Hello Arjun! Your background in design systems and accessibility caught my eye. Do you have a live demo or GitHub link to your component system?',
        isRead: true,
      },
      {
        conversation: conv._id,
        sender: seeker._id,
        content: 'Yes, absolutely! It is attached in my Referly profile, and you can also check github.com/arjunmehta/core-ds.',
        isRead: true,
      },
      {
        conversation: conv._id,
        sender: referrer._id,
        content: 'I reviewed your resume and internal profile; submitted the referral to the hiring manager! You should receive the official confirmation email shortly.',
        isRead: true,
      },
    ]);

    // 11. Notifications
    await Notification.create([
      {
        recipient: seeker._id,
        category: 'referral',
        title: 'Referral Request Accepted',
        message: 'Priya Sharma accepted your referral request for Stripe - Senior Frontend Engineer.',
        isRead: false,
        actionUrl: '/dashboard/referral-requests',
      },
      {
        recipient: seeker._id,
        category: 'application',
        title: 'Interview Stage Updated',
        message: 'Stripe updated your application status to "Interview Scheduled".',
        isRead: false,
        actionUrl: '/dashboard/applications',
      },
      {
        recipient: seeker._id,
        category: 'message',
        title: 'New Message Received',
        message: 'Priya Sharma sent you a message regarding your Stripe application.',
        isRead: true,
        actionUrl: '/dashboard/messages',
      },
    ]);

    console.log('[Seeder] Database successfully seeded with verified demo dataset!');
  } catch (error: any) {
    console.error('[Seeder] Seed failed:', error.message);
  }
};
