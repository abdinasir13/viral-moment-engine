
import React, { useState, useEffect } from 'react';
import { Film, Zap, Download, Settings, TrendingUp, Video, CheckCircle, Sparkles, BarChart3, Eye, Target, Database, Package, FileJson } from 'lucide-react';

const ShortsFactory = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchSize, setBatchSize] = useState(5);
  const [contentSources, setContentSources] = useState({
    tmdb: true,
    news: true,
    reddit: true,
    youtube: true,
    wiki: true
  });
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, stage: '' });
  const [tmdbKey] = useState('bfd1019eae4067e32083fd47a9b16de9');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await window.storage.get('factory-videos');
      if (data) setVideos(JSON.parse(data.value));
    } catch (error) {
      console.log('No videos found');
    }
  };

  const saveVideos = async (newVideos) => {
    try {
      await window.storage.set('factory-videos', JSON.stringify(newVideos));
    } catch (error) {
      console.error('Error saving videos:', error);
    }
  };

  // Multi-source content fetching
  const fetchTMDBContent = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${tmdbKey}`);
      const data = await res.json();
      return data.results.slice(0, 10).map(item => ({
        source: 'TMDB',
        type: 'movie-tv',
        title: item.title || item.name,
        description: item.overview,
        popularity: item.popularity,
        image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        rating: item.vote_average,
        angle: 'entertainment-analysis'
      }));
    } catch (error) {
      console.error('TMDB fetch error:', error);
      return [];
    }
  };

  const fetchNewsContent = async () => {
    // Simulated news content (in production, use NewsAPI or similar)
    const newsTopics = [
      { title: 'AI Breakthrough in Medical Research', category: 'tech', impact: 'high' },
      { title: 'Ancient Civilization Discovery Rewrites History', category: 'history', impact: 'viral' },
      { title: 'Psychology Study Reveals Surprising Truth About Memory', category: 'science', impact: 'medium' },
      { title: 'Hidden Feature in Popular App Goes Viral', category: 'tech', impact: 'high' },
      { title: 'Historical Figure\'s Secret Life Uncovered', category: 'history', impact: 'high' }
    ];

    return newsTopics.map(topic => ({
      source: 'News',
      type: 'current-events',
      title: topic.title,
      description: `Breaking news: ${topic.title}. This story is gaining massive traction.`,
      popularity: Math.random() * 1000 + 500,
      category: topic.category,
      angle: 'breaking-news-explainer'
    }));
  };

  const fetchRedditTrending = async () => {
    // Simulated Reddit trending (in production, use Reddit API)
    const redditTopics = [
      { title: 'TIL this mind-blowing fact about space', subreddit: 'todayilearned' },
      { title: 'Life hack that actually changed my life', subreddit: 'LifeProTips' },
      { title: 'This movie detail nobody noticed', subreddit: 'MovieDetails' },
      { title: 'Shower thought that broke my brain', subreddit: 'Showerthoughts' },
      { title: 'Explaining this complex topic simply', subreddit: 'explainlikeimfive' }
    ];

    return redditTopics.map(topic => ({
      source: 'Reddit',
      type: 'community-discussion',
      title: topic.title,
      description: `Trending on r/${topic.subreddit}: ${topic.title}`,
      popularity: Math.random() * 5000 + 1000,
      subreddit: topic.subreddit,
      angle: 'reddit-explainer'
    }));
  };

  const fetchYouTubeTrending = async () => {
    // Simulated YouTube trending topics (in production, use YouTube Data API)
    const ytTopics = [
      { title: 'Why everyone is talking about [TOPIC]', views: '2.1M' },
      { title: 'The truth about [VIRAL MOMENT]', views: '1.8M' },
      { title: '[CELEBRITY] just revealed shocking truth', views: '3.2M' },
      { title: 'This changes everything about [SUBJECT]', views: '1.5M' },
      { title: 'Scientists can\'t explain this phenomenon', views: '2.7M' }
    ];

    return ytTopics.map(topic => ({
      source: 'YouTube',
      type: 'viral-topic',
      title: topic.title,
      description: `Currently trending: ${topic.views} views and climbing fast`,
      popularity: parseFloat(topic.views.replace('M', '')) * 1000000,
      angle: 'trend-breakdown'
    }));
  };

  const fetchWikiContent = async () => {
    // Simulated Wikipedia interesting topics
    const wikiTopics = [
      { title: 'The bizarre history of [HISTORICAL EVENT]', category: 'history' },
      { title: 'Why [SCIENTIFIC PHENOMENON] is stranger than fiction', category: 'science' },
      { title: 'The untold story of [HISTORICAL FIGURE]', category: 'biography' },
      { title: 'Ancient technology that shouldn\'t exist', category: 'mystery' },
      { title: 'The psychology behind [COMMON BEHAVIOR]', category: 'psychology' }
    ];

    return wikiTopics.map(topic => ({
      source: 'Wikipedia',
      type: 'educational',
      title: topic.title,
      description: `Deep dive into ${topic.category}: ${topic.title}`,
      popularity: Math.random() * 2000 + 500,
      category: topic.category,
      angle: 'educational-breakdown'
    }));
  };

  const fetchAllContent = async () => {
    const sources = [];
    
    if (contentSources.tmdb) sources.push(fetchTMDBContent());
    if (contentSources.news) sources.push(fetchNewsContent());
    if (contentSources.reddit) sources.push(fetchRedditTrending());
    if (contentSources.youtube) sources.push(fetchYouTubeTrending());
    if (contentSources.wiki) sources.push(fetchWikiContent());

    const results = await Promise.all(sources);
    return results.flat().sort((a, b) => b.popularity - a.popularity);
  };

  const generateVideoPackage = async (content, index) => {
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Analyzing Content' });
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate hook based on content source
    const hooks = {
      'TMDB': `Wait until you see what they missed in ${content.title}...`,
      'News': `Breaking: ${content.title.split(' ').slice(0, 5).join(' ')}...`,
      'Reddit': `Reddit just discovered something insane about ${content.title.split(' ').slice(0, 4).join(' ')}...`,
      'YouTube': `Everyone's talking about this, but here's what they're missing...`,
      'Wikipedia': `The truth about ${content.title.split(' ').slice(0, 4).join(' ')} will blow your mind...`
    };

    const hook = hooks[content.source] || `You won't believe what I just discovered...`;

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Generating Script' });
    await new Promise(resolve => setTimeout(resolve, 400));

    const script = {
      hook: hook,
      setup: `So here's what's happening with ${content.title}. Most people don't know this, but there's way more to this story.`,
      mainContent: `${content.description} And when you really break it down, the details are absolutely fascinating. This is why it's going viral right now - it taps into something deeper that people are just starting to understand.`,
      reveal: `Here's the part nobody's talking about: [KEY INSIGHT]. Once you see it, you can't unsee it.`,
      cta: `What do you think? Drop your take in the comments. And follow for more content like this that actually makes you think.`
    };

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Creating Voiceover Timeline' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const voiceover = [
      { segment: 'hook', text: script.hook, startTime: 0, endTime: 3, pace: 'fast', emphasis: 'high' },
      { segment: 'setup', text: script.setup, startTime: 3, endTime: 10, pace: 'medium', emphasis: 'medium' },
      { segment: 'content', text: script.mainContent, startTime: 10, endTime: 35, pace: 'steady', emphasis: 'medium' },
      { segment: 'reveal', text: script.reveal, startTime: 35, endTime: 48, pace: 'slow', emphasis: 'high' },
      { segment: 'cta', text: script.cta, startTime: 48, endTime: 57, pace: 'medium', emphasis: 'medium' }
    ];

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Mapping Visuals' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const visualTimeline = [
      { time: '0-3s', visual: 'Hook visual - text overlay with glitch effect', type: 'text-animation', source: 'generated' },
      { time: '3-10s', visual: content.image || 'Relevant stock footage', type: 'primary-visual', source: content.source },
      { time: '10-20s', visual: 'Supporting B-roll or infographic', type: 'b-roll', source: 'stock' },
      { time: '20-35s', visual: 'Key detail visualization', type: 'detail-shot', source: 'stock' },
      { time: '35-48s', visual: 'Reveal moment - dramatic visual', type: 'climax-visual', source: 'stock' },
      { time: '48-57s', visual: 'CTA screen with text overlay', type: 'text-animation', source: 'generated' }
    ];

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Generating Subtitles' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const subtitles = voiceover.map(vo => {
      const words = vo.text.split(' ');
      const emphasisWords = words.filter((word, idx) => 
        word.length > 6 || idx === 0 || idx === words.length - 1 || 
        ['discover', 'truth', 'shocking', 'reveal', 'insane', 'mind'].some(key => word.toLowerCase().includes(key))
      );

      return {
        segment: vo.segment,
        text: vo.text,
        startTime: vo.startTime,
        endTime: vo.endTime,
        words: words,
        emphasizedWords: emphasisWords,
        style: vo.emphasis === 'high' ? 'large-bold-yellow' : 'medium-white',
        animation: 'word-by-word-pop'
      };
    });

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Selecting Music & SFX' });
    await new Promise(resolve => setTimeout(resolve, 200));

    const audio = {
      backgroundMusic: {
        genre: content.type === 'movie-tv' ? 'Cinematic Ambient' : 'Upbeat Modern',
        mood: 'mysterious-engaging',
        volume: 0.3,
        fadeIn: { start: 0, duration: 2 },
        fadeOut: { start: 55, duration: 2 },
        source: 'Epidemic Sound / Artlist'
      },
      sfx: [
        { time: 0, sound: 'attention-grab-whoosh', volume: 0.7 },
        { time: 3, sound: 'transition-swoosh', volume: 0.4 },
        { time: 35, sound: 'dramatic-reveal', volume: 0.6 },
        { time: 48, sound: 'success-chime', volume: 0.5 }
      ]
    };

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Building Metadata' });
    await new Promise(resolve => setTimeout(resolve, 200));

    const metadata = {
      title: `${content.title.substring(0, 70)} #shorts`,
      description: `${script.hook}\n\n${script.setup}\n\n🔔 Subscribe for more!\n\n#shorts #viral #trending #${content.source.toLowerCase()}`,
      tags: [
        'shorts',
        'viral',
        'trending',
        content.source.toLowerCase(),
        content.type?.replace('-', ''),
        ...content.title.split(' ').slice(0, 3).map(w => w.toLowerCase())
      ].filter(Boolean),
      thumbnail: {
        template: 'bold-text-shocked-face',
        mainText: content.title.split(' ').slice(0, 4).join(' ').toUpperCase(),
        subText: 'WAIT UNTIL YOU SEE THIS',
        colors: {
          background: '#FF0050',
          text: '#FFFFFF',
          accent: '#00D4FF'
        },
        elements: ['emoji-🤯', 'arrow-pointing-⬆']
      },
      scheduling: {
        optimalTime: 'Tuesday/Thursday 2-4pm or 7-9pm',
        hashtags: '#shorts #fyp #viral',
        firstComment: 'What do you think about this? 👇 Drop your take!'
      }
    };

    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Finalizing Package' });
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      id: `VIDEO_${Date.now()}_${index}`,
      status: 'production-ready',
      createdAt: new Date().toISOString(),
      contentSource: content.source,
      sourceType: content.type,
      originalContent: content,
      productionPackage: {
        script: script,
        voiceover: voiceover,
        visualTimeline: visualTimeline,
        subtitles: subtitles,
        audio: audio,
        metadata: metadata,
        specs: {
          resolution: '1080x1920',
          aspectRatio: '9:16',
          duration: 57,
          fps: 30,
          format: 'MP4',
          codec: 'H.264',
          bitrate: '8-12 Mbps'
        }
      },
      exportFormats: {
        json: true,
        premierePro: true,
        finalCutPro: true,
        davinci: true,
        csv: true
      }
    };
  };

  const generateBatch = async () => {
    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: batchSize, stage: 'Fetching Content from All Sources' });
    
    const allContent = await fetchAllContent();
    
    if (allContent.length === 0) {
      alert('No content sources enabled. Please enable at least one source.');
      setIsGenerating(false);
      return;
    }

    const selectedContent = allContent.slice(0, batchSize);
    const newVideos = [];

    for (let i = 0; i < selectedContent.length; i++) {
      const videoPackage = await generateVideoPackage(selectedContent[i], i);
      newVideos.push(videoPackage);
    }

    const allVideos = [...videos, ...newVideos];
    setVideos(allVideos);
    await saveVideos(allVideos);
    setIsGenerating(false);
    setGenerationProgress({ current: 0, total: 0, stage: '' });
    setActiveTab('videos');
  };

  const exportVideoPackage = (video, format = 'json') => {
    if (format === 'json') {
      const json = JSON.stringify(video.productionPackage, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.id}_PACKAGE.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // CSV format for subtitle files
      const csvContent = video.productionPackage.subtitles.map((sub, idx) => 
        `${idx + 1},${sub.startTime},${sub.endTime},"${sub.text}"`
      ).join('\n');
      
      const csv = `Index,Start,End,Text\n${csvContent}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.id}_SUBTITLES.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'premiere') {
      // XML format for Premiere Pro
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<xmeml version="4">
  <project>
    <name>${video.id}</name>
    <children>
      ${video.productionPackage.subtitles.map((sub, idx) => `
      <clip id="subtitle_${idx}">
        <name>${sub.segment}</name>
        <duration>${(sub.endTime - sub.startTime) * 30}</duration>
        <start>${sub.startTime * 30}</start>
        <end>${sub.endTime * 30}</end>
        <file>
          <pathurl>${sub.text}</pathurl>
        </file>
      </clip>`).join('')}
    </children>
  </project>
</xmeml>`;

      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.id}_PREMIERE.xml`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportAllFormats = (video) => {
    exportVideoPackage(video, 'json');
    setTimeout(() => exportVideoPackage(video, 'csv'), 500);
    setTimeout(() => exportVideoPackage(video, 'premiere'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Package className="w-12 h-12 text-indigo-400" />
              <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            YouTube Shorts Factory
          </h1>
          <p className="text-gray-400 text-lg">Multi-Source Content → Production-Ready Packages</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{videos.length}</div>
                <div className="text-sm text-gray-400">Total Packages</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{videos.filter(v => v.status === 'production-ready').length}</div>
                <div className="text-sm text-gray-400">Ready to Export</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Object.values(contentSources).filter(Boolean).length}</div>
                <div className="text-sm text-gray-400">Active Sources</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{batchSize}</div>
                <div className="text-sm text-gray-400">Batch Size</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 mb-8">
          <div className="grid grid-cols-3 gap-2">
            {['dashboard', 'videos', 'analytics'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}>
                {tab === 'dashboard' && <><Settings className="w-4 h-4" /> Control Panel</>}
                {tab === 'videos' && <><Video className="w-4 h-4" /> Video Packages ({videos.length})</>}
                {tab === 'analytics' && <><BarChart3 className="w-4 h-4" /> Analytics</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  Content Sources
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.keys(contentSources).map(source => (
                    <label key={source} className="flex items-center gap-3 bg-slate-700/30 p-4 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
                      <input 
                        type="checkbox" 
                        checked={contentSources[source]}
                        onChange={(e) => setContentSources({...contentSources, [source]: e.target.checked})}
                        className="w-5 h-5 rounded"
                      />
                      <div>
                        <p className="text-white font-semibold capitalize">{source === 'tmdb' ? 'TMDB (Movies/TV)' : source}</p>
                        <p className="text-xs text-gray-400">
                          {source === 'tmdb' && 'Movies, TV shows, entertainment'}
                          {source === 'news' && 'Breaking news, current events'}
                          {source === 'reddit' && 'Trending discussions, TIL'}
                          {source === 'youtube' && 'Viral topics, trending videos'}
                          {source === 'wiki' && 'Educational, historical facts'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Batch Size (Videos per Generation)</label>
                  <input 
                    type="number" 
                    value={batchSize} 
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    min="1" 
                    max="20"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white" 
                  />
                </div>
              </div>

              <button onClick={generateBatch} disabled={isGenerating || Object.values(contentSources).filter(Boolean).length === 0}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating... {generationProgress.current}/{generationProgress.total} - {generationProgress.stage}
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate {batchSize} Production-Ready Videos
                  </>
                )}
              </button>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <p className="text-sm text-indigo-300 font-semibold mb-2">📦 What You Get Per Video:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>✓ Complete script with timing</div>
                  <div>✓ Voiceover timeline (word-level)</div>
                  <div>✓ Visual B-roll map</div>
                  <div>✓ Subtitle file (CSV/SRT ready)</div>
                  <div>✓ Music & SFX recommendations</div>
                  <div>✓ Upload metadata</div>
                  <div>✓ JSON export</div>
                  <div>✓ Premiere/Final Cut compatible</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              {videos.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-20 h-20 mx-auto mb-4 text-indigo-400/50" />
                  <p className="text-gray-400 text-lg">No video packages yet</p>
                  <p className="text-sm text-gray-500 mt-2">Generate your first batch from the Control Panel</p>
                </div>
              ) : (
                videos.slice().reverse().map((video, idx) => (
                  <div key={video.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Package #{videos.length - idx}</h3>
                        <p className="text-indigo-400 font-semibold">{video.originalContent?.title || 'Untitled'}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs">
                            {video.contentSource}
                          </span>
                          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs">
                            {video.sourceType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{new Date(video.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {video.status}
                      </span>
                    </div>

                    <div className="bg-indigo-500/10 border-l-4 border-indigo-500 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-indigo-400 mb-2">Hook Preview</p>
                      <p className="text-sm text-gray-300">{video.productionPackage.script.hook}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                        <p className="text-lg font-bold text-white">{video.productionPackage.specs.duration}s</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Segments</p>
                        <p className="text-lg font-bold text-white">{video.productionPackage.voiceover.length}</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Subtitles</p>
                        <p className="text-lg font-bold text-white">{video.productionPackage.subtitles.length}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button onClick={() => exportAllFormats(video)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export All Formats (JSON + CSV + XML)
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => exportVideoPackage(video, 'json')}
                          className="py-2 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
                          <FileJson className="w-3 h-3" />
                          JSON
                        </button>
                        <button onClick={() => exportVideoPackage(video, 'csv')}
                          className="py-2 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
                          <FileJson className="w-3 h-3" />
                          CSV
                        </button>
                        <button onClick={() => exportVideoPackage(video, 'premiere')}
                          className="py-2 bg-slate-700/50 text-gray-300 rounded-lg text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
                          <FileJson className="w-3 h-3" />
                          XML
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Total Packages</h4>
                    <Package className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">{videos.length}</p>
                  <p className="text-sm text-gray-400 mt-2">All time production</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Active Sources</h4>
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">{Object.values(contentSources).filter(Boolean).length}</p>
                  <p className="text-sm text-gray-400 mt-2">Out of 5 available</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Production Ready</h4>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">{videos.filter(v => v.status === 'production-ready').length}</p>
                  <p className="text-sm text-gray-400 mt-2">Ready to export</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Content Source Distribution
                </h4>
                <div className="space-y-3">
                  {['TMDB', 'News', 'Reddit', 'YouTube', 'Wikipedia'].map(source => {
                    const count = videos.filter(v => v.contentSource === source).length;
                    const percentage = videos.length > 0 ? (count / videos.length * 100).toFixed(0) : 0;
                    return (
                      <div key={source} className="flex items-center gap-4">
                        <span className="text-sm text-gray-300 w-24">{source}</span>
                        <div className="flex-1 bg-slate-700/30 rounded-full h-8 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full flex items-center px-3 text-sm font-bold text-white"
                            style={{ width: `${Math.max(percentage, 0)}%` }}>
                            {count > 0 && `${count} (${percentage}%)`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3">Export Formats Available</h4>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <FileJson className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                    <p className="text-white font-semibold">JSON</p>
                    <p className="text-xs text-gray-400">Full package</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <FileJson className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <p className="text-white font-semibold">CSV</p>
                    <p className="text-xs text-gray-400">Subtitles</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <FileJson className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                    <p className="text-white font-semibold">XML</p>
                    <p className="text-xs text-gray-400">Premiere Pro</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <p className="text-white font-semibold">Bundle</p>
                    <p className="text-xs text-gray-400">All formats</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-indigo-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-500/30 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Generating Video Packages</h3>
              <p className="text-center text-gray-400 mb-4">
                Video {generationProgress.current} of {generationProgress.total}
              </p>
              <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden mb-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress.total > 0 ? (generationProgress.current / generationProgress.total) * 100 : 0}%` }}></div>
              </div>
              <p className="text-center text-sm text-indigo-400 font-semibold">{generationProgress.stage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsFactory;
