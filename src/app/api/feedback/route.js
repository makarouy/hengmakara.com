import { db } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectSlug = searchParams.get('projectSlug');
    const type = searchParams.get('type'); // 'comments', 'ratings', 'reactions', 'views'

    const feedback = await db.getFeedback();

    if (!projectSlug) {
      return Response.json(feedback);
    }

    if (type === 'comments') {
      const comments = feedback.comments.filter(c => c.projectSlug === projectSlug && !c.deleted);
      return Response.json(comments);
    }

    if (type === 'ratings') {
      const ratings = feedback.ratings.filter(r => r.projectSlug === projectSlug);
      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;
      return Response.json({ ratings, average: avgRating, count: ratings.length });
    }

    if (type === 'reactions') {
      const reactions = feedback.reactions.filter(r => r.projectSlug === projectSlug);
      const grouped = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {});
      return Response.json(grouped);
    }

    if (type === 'views') {
      const views = feedback.views.filter(v => v.projectSlug === projectSlug);
      return Response.json({ count: views.length, views });
    }

    return Response.json({ error: 'Invalid type requested' }, { status: 400 });
  } catch (error) {
    console.error('API Error: Error fetching feedback:', error);
    return Response.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, projectSlug, data } = body;

    if (!projectSlug) {
      return Response.json({ error: 'projectSlug required' }, { status: 400 });
    }

    let feedback = await db.getFeedback();
    
    // Initialize if keys missing
    if (!feedback.comments) feedback = { comments: [], ratings: [], reactions: [], views: [], ...feedback };

    if (action === 'addComment') {
      if (!data.name || !data.email || !data.text) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }
      
       // Email validation
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(data.email)) {
         return Response.json({ error: 'Invalid email' }, { status: 400 });
       }

      const comment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectSlug,
        ...data,
        date: new Date().toISOString(),
        status: 'pending' // Moderation support
      };

      feedback.comments.push(comment);
    } else if (action === 'addRating') {
       if (!data.rating || data.rating < 1 || data.rating > 5) {
           return Response.json({ error: 'Invalid rating' }, { status: 400 });
       }
      feedback.ratings.push({
        projectSlug,
        rating: data.rating,
        date: new Date().toISOString(),
        ip: 'anonymous'
      });
    } else if (action === 'addReaction') {
        if (!data.emoji) {
            return Response.json({ error: 'Emoji required' }, { status: 400 });
        }
      feedback.reactions.push({
        projectSlug,
        emoji: data.emoji,
        date: new Date().toISOString()
      });
    } else if (action === 'addView') {
      feedback.views.push({
        projectSlug,
        date: new Date().toISOString()
      });
    } else {
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.updateFeedback(feedback);
    return Response.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
