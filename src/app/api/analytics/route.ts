import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all'; // Default to all time
    const startDate = period === 'all' ? new Date(0) : new Date();
    if (period !== 'all') {
      startDate.setDate(startDate.getDate() - parseInt(period));
    }

    // Get user's content analytics
    const userContent = await prisma.content.findMany({
      where: {
        authorId: session.user.id,
        ...(period !== 'all' && {
          createdAt: {
            gte: startDate
          }
        })
      },
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        shares: true,
        comments: true,
        createdAt: true,
        published: true,
        tags: true,
        readingTime: true
      }
    });

    // Calculate basic analytics
    const totalViews = userContent.reduce((sum, content) => sum + content.views, 0);
    const totalLikes = userContent.reduce((sum, content) => sum + content.likes, 0);
    const totalShares = userContent.reduce((sum, content) => sum + content.shares, 0);
    const totalComments = userContent.reduce((sum, content) => sum + content.comments, 0);
    const publishedContent = userContent.filter(content => content.published).length;
    const totalContent = userContent.length;

    // Calculate engagement rate
    const totalEngagement = totalLikes + totalShares + totalComments;
    const avgEngagement = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

    // Get content performance over time
    const contentPerformance = await prisma.content.findMany({
      where: {
        authorId: session.user.id,
        ...(period !== 'all' && {
          createdAt: {
            gte: startDate
          }
        })
      },
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        shares: true,
        comments: true,
        createdAt: true,
        tags: true
      },
      orderBy: {
        views: 'desc'
      },
      take: 10
    });

    // Calculate engagement percentage for each content
    const contentWithEngagement = contentPerformance.map(content => {
      const engagement = content.likes + content.shares + content.comments;
      const engagementRate = content.views > 0 ? (engagement / content.views) * 100 : 0;
      return {
        ...content,
        engagement: Math.round(engagementRate * 100) / 100
      };
    });

    // Get daily views for chart (grouped by date)
    const dailyViewsData = await prisma.content.groupBy({
      by: ['createdAt'],
      where: {
        authorId: session.user.id,
        ...(period !== 'all' && {
          createdAt: {
            gte: startDate
          }
        })
      },
      _sum: {
        views: true,
        likes: true,
        shares: true,
        comments: true
      }
    });

    // Process daily views data
    const dailyViews = dailyViewsData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      views: item._sum.views || 0,
      likes: item._sum.likes || 0,
      shares: item._sum.shares || 0,
      comments: item._sum.comments || 0
    }));

    // Calculate growth rate (comparing current period with previous period)
    let growthRate = 0;
    if (period !== 'all') {
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));

      const previousPeriodViews = await prisma.content.aggregate({
        where: {
          authorId: session.user.id,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        },
        _sum: {
          views: true
        }
      });

      const previousViews = previousPeriodViews._sum.views || 0;
      growthRate = previousViews > 0 ? ((totalViews - previousViews) / previousViews) * 100 : 0;
    }

    // Get top performing content
    const topContent = await prisma.content.findMany({
      where: {
        authorId: session.user.id,
        published: true
      },
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        shares: true,
        comments: true,
        createdAt: true,
        tags: true
      },
      orderBy: {
        views: 'desc'
      },
      take: 5
    });

    // Get content by tags
    const contentByTags = await prisma.content.findMany({
      where: {
        authorId: session.user.id
      },
      select: {
        tags: true,
        views: true
      }
    });

    const tagStats = contentByTags.reduce((acc, content) => {
      content.tags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = { count: 0, totalViews: 0 };
        }
        acc[tag].count += 1;
        acc[tag].totalViews += content.views;
      });
      return acc;
    }, {} as Record<string, { count: number; totalViews: number }>);

    const topTags = Object.entries(tagStats)
      .sort(([,a], [,b]) => b.totalViews - a.totalViews)
      .slice(0, 10)
      .map(([tag, stats]) => ({ tag, count: stats.count, totalViews: stats.totalViews }));

    // Generate engagement trends data (weekly)
    const engagementTrends = generateEngagementTrends(dailyViews);

    return NextResponse.json({
      overview: {
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
        avgEngagement: Math.round(avgEngagement * 100) / 100,
        growthRate: Math.round(growthRate * 100) / 100,
        publishedContent,
        totalContent,
        activeUsers: Math.round(totalViews * 0.1) // Estimate active users
      },
      contentPerformance: contentWithEngagement,
      dailyViews,
      topContent,
      topTags,
      engagementTrends
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper function to generate engagement trends
function generateEngagementTrends(dailyViews: any[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const engagementData = days.map((day, index) => {
    const dayViews = dailyViews.filter(view => {
      const date = new Date(view.date);
      return date.getDay() === (index + 1) % 7;
    });
    
    const totalViews = dayViews.reduce((sum, view) => sum + view.views, 0);
    const totalEngagement = dayViews.reduce((sum, view) => 
      sum + view.likes + view.shares + view.comments, 0
    );
    
    return totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
  });

  return {
    labels: days,
    data: engagementData.map(value => Math.round(value * 10) / 10)
  };
}  