'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Heart,
  MessageCircle,
  Share2,
  Dumbbell,
  Clock,
  Plus,
  Send,
  Trash2,
  Users,
} from 'lucide-react';

interface Post {
  id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  post_type: string;
  workout_id: string | null;
  workout_duration: number | null;
  workout_sets: number | null;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  parent_id: string | null;
  created_at: string;
}

interface CommunityClientProps {
  locale: string;
}

export function CommunityClient({ locale }: CommunityClientProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const isZh = locale === 'zh';

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/community/posts?limit=20');
      if (response.ok) {
        const data = await response.json() as { posts: Post[] };
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async () => {
    if (!newContent.trim() || posting) return;

    setPosting(true);
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent.trim() }),
      });

      if (response.ok) {
        const data = await response.json() as { post: Post };
        setPosts([data.post, ...posts]);
        setNewContent('');
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch('/api/community/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });

      if (response.ok) {
        const data = await response.json() as { liked: boolean };
        setPosts(
          posts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                is_liked: data.liked,
                likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1,
              };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm(isZh ? '确定要删除这条动态吗？' : 'Delete this post?')) return;

    try {
      const response = await fetch(`/api/community/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/comments?post_id=${postId}`);
      if (response.ok) {
        const data = await response.json() as { comments: Comment[] };
        setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const toggleComments = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInput[postId];
    if (!content?.trim()) return;

    try {
      const response = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: content.trim() }),
      });

      if (response.ok) {
        const data = await response.json() as { comment: Comment };
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setCommentInput((prev) => ({ ...prev, [postId]: '' }));
        setPosts(
          posts.map((p) => {
            if (p.id === postId) {
              return { ...p, comments_count: p.comments_count + 1 };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return isZh ? '刚刚' : 'Just now';
    if (minutes < 60) return isZh ? `${minutes}分钟前` : `${minutes}m ago`;
    if (hours < 24) return isZh ? `${hours}小时前` : `${hours}h ago`;
    if (days < 7) return isZh ? `${days}天前` : `${days}d ago`;
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US');
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-rose-600 via-pink-500 to-purple-500">
        {/* 光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/30 rounded-full blur-2xl" />
        
        <div className="container max-w-2xl relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <Users className="w-5 h-5" />
            <span className="font-medium">{isZh ? "分享健身心得" : "Share Your Journey"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            {isZh ? '健身社区' : 'Fitness Community'}
          </h1>
          
          <p className="text-xl text-white/90 max-w-xl mx-auto">
            {isZh ? '与健身伙伴交流，分享你的进步' : 'Connect with fitness buddies, share your progress'}
          </p>
        </div>
      </section>
      
      {/* 内容区域 */}
      <div className="container py-16 max-w-2xl">

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              {isZh ? '发布动态' : 'Post'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isZh ? '发布新动态' : 'Create Post'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <textarea
                className="w-full min-h-[120px] p-3 border rounded-md bg-background resize-none"
                placeholder={isZh ? '分享你的健身心得...' : 'Share your fitness journey...'}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">{isZh ? '取消' : 'Cancel'}</Button>
                </DialogClose>
                <Button onClick={handlePost} disabled={posting || !newContent.trim()}>
                  {posting ? (isZh ? '发布中...' : 'Posting...') : (isZh ? '发布' : 'Post')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isZh ? '还没有动态' : 'No posts yet'}
            </h3>
            <p className="text-muted-foreground">
              {isZh ? '成为第一个分享健身心得的人吧！' : 'Be the first to share your fitness journey!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-4">
                {/* User Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.user_avatar || ''} />
                      <AvatarFallback>
                        {post.user_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {post.user_name || (isZh ? '用户' : 'User')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(post.created_at)}
                      </div>
                    </div>
                  </div>
                  {post.post_type === 'workout' && (
                    <Badge variant="secondary" className="gap-1">
                      <Dumbbell className="h-3 w-3" />
                      {isZh ? '训练打卡' : 'Workout'}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <p className="mb-3 whitespace-pre-wrap">{post.content}</p>

                {/* Workout Stats */}
                {post.post_type === 'workout' && (post.workout_duration || post.workout_sets) && (
                  <div className="flex gap-4 mb-3 text-sm text-muted-foreground">
                    {post.workout_duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.workout_duration} {isZh ? '分钟' : 'min'}
                      </span>
                    )}
                    {post.workout_sets && (
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {post.workout_sets} {isZh ? '组' : 'sets'}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <button
                    className={`flex items-center gap-1 text-sm ${
                      post.is_liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${post.is_liked ? 'fill-red-500' : ''}`}
                    />
                    {post.likes_count}
                  </button>
                  <button
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.comments_count}
                  </button>
                  <button
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Comments Section */}
                {expandedPost === post.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {/* Comment Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={isZh ? '写评论...' : 'Write a comment...'}
                        value={commentInput[post.id] || ''}
                        onChange={(e) =>
                          setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post.id);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleComment(post.id)}
                        disabled={!commentInput[post.id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Comments List */}
                    {(comments[post.id] || []).map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.user_avatar || ''} />
                          <AvatarFallback className="text-xs">
                            {comment.user_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{comment.user_name}</span>
                            <span className="ml-2 text-muted-foreground">{comment.content}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatTime(comment.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!comments[post.id] || comments[post.id].length === 0) && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        {isZh ? '暂无评论' : 'No comments yet'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}